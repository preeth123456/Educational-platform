from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Count
from django.db import connection
import json
import base64
from datetime import datetime
from functools import wraps

from .models import PlatformConfig, ConfigChangeLog, Product, Tenant, ProductConfig, TenantConfig
from .utils import resolve_config, get_all_configs_for_tenant, get_config_hierarchy
import logging

logger = logging.getLogger(__name__)

from .serializers import (
    PlatformConfigSerializer,
    PlatformConfigUpdateSerializer,
    BulkConfigUpdateSerializer,
    ConfigChangeLogSerializer,
    ConfigCategorySerializer,
    ProductSerializer,
    TenantSerializer,
    ProductConfigSerializer,
    TenantConfigSerializer,
    ConfigHierarchySerializer
)


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_admin_from_token(request):
    """Get admin info from Bearer token"""
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, None, None
    
    try:
        token = auth_header.split(' ')[1]
        payload_str = base64.b64decode(token).decode()
        payload = json.loads(payload_str)
        
        # Check expiration
        if datetime.now().timestamp() > payload.get('exp', 0):
            return None, None, None
        
        admin_id = payload.get('admin_id')
        admin_name = payload.get('name', 'Admin')
        admin_role = 'Platform Admin'
        
        return admin_id, admin_name, admin_role
    except:
        return None, None, None


def admin_required(view_func):
    """Decorator to require admin authentication via Bearer token"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        from django.conf import settings
        
        # In DEBUG mode, allow bypass with a simple token or no token
        if settings.DEBUG:
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header:
                # No auth header in DEBUG mode - create a test admin
                request.admin_id = 1  # Use numeric ID
                request.admin_name = 'Debug Admin'
                request.admin_role = 'Platform Admin'
                return view_func(request, *args, **kwargs)
        
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({
                'success': False,
                'message': 'Admin authentication required'
            }, status=401)
        
        try:
            token = auth_header.split(' ')[1]
            payload_str = base64.b64decode(token).decode()
            payload = json.loads(payload_str)
            
            # Check expiration
            exp = payload.get('exp', 0)
            import time
            
            if time.time() > exp:
                if not settings.DEBUG:
                    return JsonResponse({
                        'success': False,
                        'message': 'Token expired'
                    }, status=401)
                # In DEBUG, we allow it to pass
            
            # Attach admin info to request - use same field names as admin_auth
            request.admin_id = payload.get('admin_id')
            request.admin_name = payload.get('name', 'Admin')
            request.admin_role = 'Platform Admin'
            
            return view_func(request, *args, **kwargs)
            
        except Exception as e:
            if settings.DEBUG:
                # In DEBUG mode, create a fallback admin if token parsing fails
                request.admin_id = 1  # Use numeric ID
                request.admin_name = 'Debug Admin'
                request.admin_role = 'Platform Admin'
                return view_func(request, *args, **kwargs)
            
            return JsonResponse({
                'success': False,
                'message': f'Invalid token: {str(e)}'
            }, status=401)
    
    return wrapper


@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def list_configs(request):
    """
    GET /api/admin/config/
    List all platform configurations
    Supports filtering by category
    """
    try:
        category = request.GET.get('category', None)
        search = request.GET.get('search', None)
        
        configs = PlatformConfig.objects.all()
        
        if category:
            configs = configs.filter(category=category)
        
        if search:
            configs = configs.filter(key__icontains=search)
        
        serializer = PlatformConfigSerializer(configs, many=True)
        
        return JsonResponse({
            'success': True,
            'data': serializer.data,
            'count': configs.count()
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def public_configs(request):
    """
    GET /api/admin/config/public/
    Get non-sensitive public configurations (no auth required)
    POST - Save tenant configs
    Safely handles DB type mismatches by using values()
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if data.get('tenant_save'):
                tenant_id = data.get('tenant_id')
                configs = data.get('configs', [])
                
                if not tenant_id:
                    return JsonResponse({'success': False, 'message': 'tenant_id required'}, status=400)
                
                import pymysql
                conn = pymysql.connect(
                    host='localhost',
                    port=3306,
                    user='root',
                    password='',
                    database='eduyata_db'
                )
                cursor = conn.cursor()
                
                saved_configs = []
                for config in configs:
                    key = config.get('key')
                    value = config.get('value')
                    
                    if not key or not value:
                        continue
                        
                    cursor.execute("SELECT id FROM tenant_configs WHERE tenant_id = %s AND `key` = %s", (tenant_id, key))
                    existing = cursor.fetchone()
                    
                    now = datetime.now()
                    
                    if existing:
                        cursor.execute("""
                            UPDATE tenant_configs 
                            SET value = %s, updated_at = %s 
                            WHERE tenant_id = %s AND `key` = %s
                        """, (value, now, tenant_id, key))
                    else:
                        cursor.execute("""
                            INSERT INTO tenant_configs 
                            (tenant_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, (tenant_id, key, value, 'string', 'appearance', '', 0, 'Admin', now, now))
                    
                    saved_configs.append(f"{key}={value}")
                
                conn.commit()
                conn.close()
                
                return JsonResponse({
                    'success': True,
                    'message': f'Saved {len(saved_configs)} tenant configurations',
                    'saved': saved_configs
                })
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
    try:
        # Only return non-sensitive, public-facing configs
        public_keys = [
            'favicon_url', 'site_name', 'logo_url', 'primary_color',
            'secondary_color', 'footer_text', 'support_email',
            'password_min_length', 'timezone'  # For frontend use
        ]
        
        # Use values() to bypass Model instantiation and timezone conversion issues
        configs = PlatformConfig.objects.filter(
            key__in=public_keys,
            is_sensitive=False
        ).values('key', 'value', 'value_type', 'category', 'description')
        
        # Manually format to match Serializer structure expected by frontend
        formatted_data = []
        for config in configs:
            typed_value = config['value'] # Default string
            # Basic type conversion
            if config['value_type'] == 'integer':
                try: typed_value = int(config['value'])
                except: pass
            elif config['value_type'] == 'boolean':
                typed_value = config['value'].lower() in ('true', '1', 'yes')
            elif config['value_type'] == 'json':
                try: typed_value = json.loads(config['value'])
                except: pass
                
            formatted_data.append({
                'key': config['key'],
                'value': config['value'],
                'typed_value': typed_value,
                'display_value': config['value'], # It is public/non-sensitive
                'value_type': config['value_type'],
                'category': config['category'],
                'description': config['description']
            })
        
        return JsonResponse({
            'success': True,
            'data': formatted_data,
            'count': len(formatted_data)
        })
    except Exception as e:
        import traceback
        logger.error(f"Error in public_configs: {str(e)}\n{traceback.format_exc()}")
        return JsonResponse({
            'success': False,
            'message': f"Internal Error: {str(e)}"
        }, status=500)




@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def get_config(request, key):
    """
    GET /api/admin/config/{key}/
    Get a specific configuration by key
    """
    try:
        config = PlatformConfig.objects.get(key=key)
        serializer = PlatformConfigSerializer(config)
        
        return JsonResponse({
            'success': True,
            'data': serializer.data
        })
    except PlatformConfig.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': f'Configuration "{key}" not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@admin_required
def update_config(request, key):
    """
    PUT /api/admin/config/{key}/
    Update a specific configuration value
    """
    try:
        config = PlatformConfig.objects.get(key=key)
        
        if not config.is_editable:
            return JsonResponse({
                'success': False,
                'message': f'Configuration "{key}" is not editable'
            }, status=403)
        
        data = json.loads(request.body)
        old_value = config.value
        
        serializer = PlatformConfigUpdateSerializer(
            data=data,
            context={'config': config}
        )
        
        if not serializer.is_valid():
            return JsonResponse({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=400)
        
        admin_id = request.admin_id
        admin_name = request.admin_name
        admin_role = request.admin_role
        
        # Update configuration
        config.value = serializer.validated_data['value']
        config.updated_by = admin_id
        config.updated_by_name = admin_name or 'Admin'
        config.save()
        
        # Skip audit logging for now since table doesn't exist
        # ConfigChangeLog.objects.create(
        #     config_key=key,
        #     old_value=old_value,
        #     new_value=config.value,
        #     changed_by=admin_id,
        #     changed_by_name=admin_name,
        #     changed_by_role=admin_role,
        #     ip_address=get_client_ip(request),
        #     user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
        # )
        
        result_serializer = PlatformConfigSerializer(config)
        
        return JsonResponse({
            'success': True,
            'message': f'Configuration "{key}" updated successfully',
            'data': result_serializer.data
        })
        
    except PlatformConfig.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': f'Configuration "{key}" not found'
        }, status=404)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON in request body'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def bulk_update_configs(request):
    """
    POST /api/admin/config/bulk/
    Update multiple configurations at once
    """
    try:
        data = json.loads(request.body)
        
        # Handle tenant config save (no admin auth required)
        if data.get('tenant_save'):
            tenant_id = data.get('tenant_id')
            configs = data.get('configs', [])
            
            if not tenant_id:
                return JsonResponse({'success': False, 'message': 'tenant_id required'}, status=400)
            
            import pymysql
            conn = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            cursor = conn.cursor()
            
            saved_configs = []
            for config in configs:
                key = config.get('key')
                value = config.get('value')
                
                if not key or not value:
                    continue
                    
                cursor.execute("SELECT id FROM tenant_configs WHERE tenant_id = %s AND `key` = %s", (tenant_id, key))
                existing = cursor.fetchone()
                
                now = datetime.now()
                
                if existing:
                    cursor.execute("""
                        UPDATE tenant_configs 
                        SET value = %s, updated_at = %s 
                        WHERE tenant_id = %s AND `key` = %s
                    """, (value, now, tenant_id, key))
                else:
                    cursor.execute("""
                        INSERT INTO tenant_configs 
                        (tenant_id, `key`, value, value_type, category, description, is_sensitive, updated_by, updated_by_name, updated_at, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (tenant_id, key, value, 'string', 'appearance', '', 0, None, 'Admin', now, now))
                
                saved_configs.append(f"{key}={value}")
            
            conn.commit()
            conn.close()
            
            return JsonResponse({
                'success': True,
                'message': f'Saved {len(saved_configs)} tenant configurations',
                'saved': saved_configs
            })
        
        # Original bulk update logic (only runs if not tenant_save)
        # Check admin auth for regular bulk updates
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return JsonResponse({'success': False, 'message': 'Admin authentication required'}, status=401)
        
        serializer = BulkConfigUpdateSerializer(data=data)
        
        if not serializer.is_valid():
            return JsonResponse({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=400)
        
        admin_id = 1  # Use numeric ID for bulk updates
        admin_name = 'Admin'
        admin_role = 'Platform Admin'
        client_ip = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        
        updated = []
        errors = []
        
        for config_data in serializer.validated_data['configs']:
            key = config_data['key']
            value = config_data['value']
            
            try:
                config = PlatformConfig.objects.get(key=key)
                
                if not config.is_editable:
                    errors.append({
                        'key': key,
                        'error': 'Configuration is not editable'
                    })
                    continue
                
                old_value = config.value
                config.value = value
                config.updated_by = admin_id
                config.updated_by_name = admin_name
                config.save()
                
                # Log the change
                ConfigChangeLog.objects.create(
                    config_key=key,
                    old_value=old_value,
                    new_value=value,
                    changed_by=admin_id,
                    changed_by_name=admin_name,
                    changed_by_role=admin_role,
                    ip_address=client_ip,
                    user_agent=user_agent
                )
                
                updated.append(key)
                
            except PlatformConfig.DoesNotExist:
                errors.append({
                    'key': key,
                    'error': 'Configuration not found'
                })
        
        return JsonResponse({
            'success': True,
            'message': f'Updated {len(updated)} configurations',
            'updated': updated,
            'errors': errors
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON in request body'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def list_categories(request):
    """
    GET /api/admin/config/categories/
    List all configuration categories with counts
    """
    try:
        category_counts = PlatformConfig.objects.values('category').annotate(
            count=Count('id')
        )
        
        # Map category codes to display names
        category_map = dict(PlatformConfig.CATEGORIES)
        
        categories = [
            {
                'category': item['category'],
                'display_name': category_map.get(item['category'], item['category']),
                'count': item['count']
            }
            for item in category_counts
        ]
        
        return JsonResponse({
            'success': True,
            'data': categories
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def get_change_logs(request):
    """
    GET /api/admin/config/logs/
    Get configuration change history
    """
    try:
        config_key = request.GET.get('key', None)
        limit = int(request.GET.get('limit', 50))
        
        logs = ConfigChangeLog.objects.all()
        
        if config_key:
            logs = logs.filter(config_key=config_key)
        
        logs = logs[:limit]
        serializer = ConfigChangeLogSerializer(logs, many=True)
        
        return JsonResponse({
            'success': True,
            'data': serializer.data,
            'count': len(serializer.data)
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def create_config(request):
    """
    POST /api/admin/config/
    Create a new configuration entry
    """
    try:
        data = json.loads(request.body)
        
        required_fields = ['key', 'value', 'value_type', 'category']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }, status=400)
        
        # Check if key already exists
        if PlatformConfig.objects.filter(key=data['key']).exists():
            return JsonResponse({
                'success': False,
                'message': f'Configuration "{data["key"]}" already exists'
            }, status=400)
        
        admin_id = request.admin_id
        admin_name = request.admin_name or 'Admin'
        
        config = PlatformConfig.objects.create(
            key=data['key'],
            value=data['value'],
            value_type=data['value_type'],
            category=data['category'],
            description=data.get('description', ''),
            is_sensitive=data.get('is_sensitive', False),
            is_editable=data.get('is_editable', True),
            updated_by=admin_id,
            updated_by_name=admin_name
        )
        
        serializer = PlatformConfigSerializer(config)
        
        return JsonResponse({
            'success': True,
            'message': f'Configuration "{data["key"]}" created successfully',
            'data': serializer.data
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON in request body'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@admin_required
def delete_config(request, key):
    """
    DELETE /api/admin/config/{key}/
    Delete a configuration entry
    """
    try:
        config = PlatformConfig.objects.get(key=key)
        
        admin_id = request.admin_id
        admin_name = request.admin_name or 'Admin'
        admin_role = request.admin_role
        
        # Log the deletion
        ConfigChangeLog.objects.create(
            config_key=key,
            old_value=config.value,
            new_value='[DELETED]',
            changed_by=admin_id,
            changed_by_name=admin_name,
            changed_by_role=admin_role,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
        )
        
        config.delete()
        
        return JsonResponse({
            'success': True,
            'message': f'Configuration "{key}" deleted successfully'
        })
        
    except PlatformConfig.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': f'Configuration "{key}" not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


# ============================================================================
# PRODUCT MANAGEMENT VIEWS
# ============================================================================

@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def list_products(request):
    """GET /api/admin/products/ - List all products"""
    try:
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return JsonResponse({
            'success': True,
            'data': serializer.data,
            'count': products.count()
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def create_product(request):
    """POST /api/admin/products/ - Create new product"""
    try:
        data = json.loads(request.body)
        serializer = ProductSerializer(data=data)
        
        if not serializer.is_valid():
            return JsonResponse({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=400)
        
        product = serializer.save()
        return JsonResponse({
            'success': True,
            'message': f'Product "{product.name}" created successfully',
            'data': ProductSerializer(product).data
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def get_product(request, product_id):
    """GET /api/admin/products/{product_id}/ - Get product details"""
    try:
        product = Product.objects.get(product_id=product_id)
        serializer = ProductSerializer(product)
        return JsonResponse({'success': True, 'data': serializer.data})
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@admin_required
def update_product(request, product_id):
    """PUT /api/admin/products/{product_id}/ - Update product"""
    try:
        product = Product.objects.get(product_id=product_id)
        data = json.loads(request.body)
        serializer = ProductSerializer(product, data=data, partial=True)
        
        if not serializer.is_valid():
            return JsonResponse({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=400)
        
        product = serializer.save()
        return JsonResponse({
            'success': True,
            'message': f'Product "{product.name}" updated successfully',
            'data': ProductSerializer(product).data
        })
        
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


# ============================================================================
# TENANT MANAGEMENT VIEWS
# ============================================================================

@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def list_tenants(request):
    """GET /api/admin/tenants/ - List all tenants"""
    try:
        tenants = Tenant.objects.all()
        serializer = TenantSerializer(tenants, many=True)
        return JsonResponse({
            'success': True,
            'data': serializer.data,
            'count': tenants.count()
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def create_tenant(request):
    """POST /api/admin/tenants/ - Create new tenant"""
    try:
        data = json.loads(request.body)
        serializer = TenantSerializer(data=data)
        
        if not serializer.is_valid():
            return JsonResponse({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=400)
        
        tenant = serializer.save()
        return JsonResponse({
            'success': True,
            'message': f'Tenant "{tenant.name}" created successfully',
            'data': TenantSerializer(tenant).data
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def get_tenant(request, tenant_id):
    """GET /api/admin/tenants/{tenant_id}/ - Get tenant details"""
    try:
        tenant = Tenant.objects.get(tenant_id=tenant_id)
        serializer = TenantSerializer(tenant)
        return JsonResponse({'success': True, 'data': serializer.data})
    except Tenant.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Tenant not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@admin_required
def update_tenant(request, tenant_id):
    """PUT /api/admin/tenants/{tenant_id}/ - Update tenant"""
    try:
        tenant = Tenant.objects.get(tenant_id=tenant_id)
        data = json.loads(request.body)
        serializer = TenantSerializer(tenant, data=data, partial=True)
        
        if not serializer.is_valid():
            return JsonResponse({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=400)
        
        tenant = serializer.save()
        return JsonResponse({
            'success': True,
            'message': f'Tenant "{tenant.name}" updated successfully',
            'data': TenantSerializer(tenant).data
        })
        
    except Tenant.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Tenant not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


# ============================================================================
# CONFIGURATION RESOLUTION VIEWS
# ============================================================================

@csrf_exempt
@require_http_methods(["GET"])
def resolve_configuration(request):
    """GET /api/config/resolve/ - Resolve configuration for tenant/product"""
    try:
        tenant_id = request.GET.get('tenant')
        product_id = request.GET.get('product')
        key = request.GET.get('key')
        
        if key:
            value = resolve_config(key, tenant_id, product_id)
            return JsonResponse({'success': True, 'key': key, 'value': value})
        else:
            if not tenant_id:
                return JsonResponse({
                    'success': False,
                    'message': 'tenant parameter is required when key is not specified'
                }, status=400)
            
            configs = get_all_configs_for_tenant(tenant_id, product_id)
            return JsonResponse({'success': True, 'data': configs, 'count': len(configs)})
            
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def get_config_hierarchy_view(request):
    """GET /api/admin/config/hierarchy/ - Get configuration hierarchy for debugging"""
    try:
        key = request.GET.get('key')
        tenant_id = request.GET.get('tenant')
        product_id = request.GET.get('product')
        
        if not key:
            return JsonResponse({
                'success': False,
                'message': 'key parameter is required'
            }, status=400)
        
        hierarchy = get_config_hierarchy(key, tenant_id, product_id)
        serializer = ConfigHierarchySerializer(hierarchy, many=True)
        
        return JsonResponse({
            'success': True,
            'key': key,
            'hierarchy': serializer.data
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def save_tenant_config(request):
    """POST /api/admin/config/tenants/save-configs/ - Save tenant configurations"""
    try:
        data = json.loads(request.body)
        tenant_id = data.get('tenant_id')
        configs = data.get('configs', [])
        
        if not tenant_id:
            return JsonResponse({'success': False, 'message': 'tenant_id required'}, status=400)
        
        import pymysql
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        cursor = conn.cursor()
        
        saved_configs = []
        for config in configs:
            key = config.get('key')
            value = config.get('value')
            
            if not key or not value:
                continue
                
            cursor.execute("SELECT id FROM tenant_configs WHERE tenant_id = %s AND `key` = %s", (tenant_id, key))
            existing = cursor.fetchone()
            
            now = datetime.now()
            
            if existing:
                cursor.execute("""
                    UPDATE tenant_configs 
                    SET value = %s, updated_at = %s 
                    WHERE tenant_id = %s AND `key` = %s
                """, (value, now, tenant_id, key))
            else:
                cursor.execute("""
                    INSERT INTO tenant_configs 
                    (tenant_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (tenant_id, key, value, 'string', 'appearance', '', 0, 'Admin', now, now))
            
            saved_configs.append(f"{key}={value}")
        
        conn.commit()
        conn.close()
        
        return JsonResponse({
            'success': True,
            'message': f'Saved {len(saved_configs)} configurations',
            'saved': saved_configs
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def save_product_config(request):
    """POST /api/admin/config/products/save-configs/ - Save product configurations"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        configs = data.get('configs', [])
        
        if not product_id:
            return JsonResponse({'success': False, 'message': 'product_id required'}, status=400)
        
        import pymysql
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        cursor = conn.cursor()
        
        saved_configs = []
        for config in configs:
            key = config.get('key')
            value = config.get('value')
            
            if not key or not value:
                continue
                
            cursor.execute("SELECT id FROM product_configs WHERE product_id = %s AND `key` = %s", (product_id, key))
            existing = cursor.fetchone()
            
            now = datetime.now()
            
            if existing:
                cursor.execute("""
                    UPDATE product_configs 
                    SET value = %s, updated_at = %s 
                    WHERE product_id = %s AND `key` = %s
                """, (value, now, product_id, key))
            else:
                cursor.execute("""
                    INSERT INTO product_configs 
                    (product_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (product_id, key, value, 'string', 'curriculum', '', 0, 'Admin', now, now))
            
            saved_configs.append(f"{key}={value}")
        
        conn.commit()
        conn.close()
        
        return JsonResponse({
            'success': True,
            'message': f'Saved {len(saved_configs)} product configurations',
            'saved': saved_configs
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)