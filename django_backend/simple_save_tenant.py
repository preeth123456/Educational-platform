from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from platform_config.models import Tenant, TenantConfig
from django.utils import timezone

@csrf_exempt
@require_http_methods(["POST"])
def save_tenant_config_simple(request):
    try:
        data = json.loads(request.body)
        tenant_id = data.get('tenant_id')
        configs = data.get('configs', [])
        
        if not tenant_id:
            return JsonResponse({'success': False, 'message': 'tenant_id required'}, status=400)
        
        # Get tenant
        try:
            tenant = Tenant.objects.get(tenant_id=tenant_id)
        except Tenant.DoesNotExist:
            return JsonResponse({'success': False, 'message': f'Tenant {tenant_id} not found'}, status=404)
        
        saved_configs = []
        for config in configs:
            key = config.get('key')
            value = config.get('value')
            
            if not key or not value:
                continue
            
            # Use update_or_create
            tenant_config, created = TenantConfig.objects.update_or_create(
                tenant=tenant,
                key=key,
                defaults={
                    'value': value,
                    'value_type': 'string',
                    'category': 'appearance' if 'color' in key or 'logo' in key else 'general',
                    'description': f'Custom {key} for {tenant.name}',
                    'is_sensitive': False,
                    'updated_by_name': 'Admin',
                    'updated_at': timezone.now()
                }
            )
            
            saved_configs.append(f"{key}={value}")
        
        return JsonResponse({
            'success': True,
            'message': f'Saved {len(saved_configs)} configurations',
            'saved': saved_configs
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)