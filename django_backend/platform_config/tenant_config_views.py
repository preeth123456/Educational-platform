from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from .models import Tenant, TenantConfig
from .views import admin_required


@csrf_exempt
@require_http_methods(["POST"])
@admin_required
def bulk_create_tenant_configs(request, tenant_id):
    """POST /api/admin/config/tenants/{tenant_id}/configs/bulk/ - Bulk create tenant configs"""
    try:
        tenant = Tenant.objects.get(tenant_id=tenant_id)
        data = json.loads(request.body)
        
        if 'configs' not in data or not isinstance(data['configs'], list):
            return JsonResponse({
                'success': False,
                'message': 'configs array is required'
            }, status=400)
        
        created = []
        updated = []
        errors = []
        
        for config_data in data['configs']:
            try:
                if 'key' not in config_data or 'value' not in config_data:
                    errors.append({'error': 'key and value are required', 'data': config_data})
                    continue
                
                existing = TenantConfig.objects.filter(
                    tenant=tenant,
                    key=config_data['key']
                ).first()
                
                if existing:
                    existing.value = config_data['value']
                    existing.value_type = config_data.get('value_type', 'string')
                    existing.category = config_data.get('category', 'appearance')
                    existing.updated_by = request.admin_id
                    existing.updated_by_name = request.admin_name
                    existing.save()
                    updated.append(config_data['key'])
                else:
                    TenantConfig.objects.create(
                        tenant=tenant,
                        key=config_data['key'],
                        value=config_data['value'],
                        value_type=config_data.get('value_type', 'string'),
                        category=config_data.get('category', 'appearance'),
                        description=config_data.get('description', ''),
                        updated_by=request.admin_id,
                        updated_by_name=request.admin_name
                    )
                    created.append(config_data['key'])
                    
            except Exception as e:
                errors.append({'error': str(e), 'data': config_data})
        
        return JsonResponse({
            'success': True,
            'message': f'Processed {len(created + updated)} configurations',
            'created': created,
            'updated': updated,
            'errors': errors
        })
        
    except Tenant.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Tenant not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)