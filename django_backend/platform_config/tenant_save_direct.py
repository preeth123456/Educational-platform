from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import pymysql
from datetime import datetime

@csrf_exempt
@require_http_methods(["POST"])
def save_tenant_configs_direct(request):
    """Direct tenant config save without any Django ORM validation"""
    try:
        data = json.loads(request.body)
        tenant_id = data.get('tenant_id')
        configs = data.get('configs', [])
        
        if not tenant_id:
            return JsonResponse({'success': False, 'message': 'tenant_id required'}, status=400)
        
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