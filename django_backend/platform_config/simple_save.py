from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pymysql

@csrf_exempt
def simple_save_config(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        tenant_id = data.get('tenant_id')
        configs = data.get('configs', [])
        
        conn = pymysql.connect(host='localhost', port=3306, user='root', password='', database='eduyata_db')
        cursor = conn.cursor()
        
        for config in configs:
            key = config.get('key')
            value = config.get('value')
            
            if key and value:
                cursor.execute("""
                    INSERT INTO tenant_configs (tenant_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
                    VALUES (%s, %s, %s, 'string', 'general', '', 0, 'Admin', NOW(), NOW())
                    ON DUPLICATE KEY UPDATE value = %s, updated_at = NOW()
                """, (tenant_id, key, value, value))
        
        conn.commit()
        conn.close()
        
        return JsonResponse({'success': True, 'message': f'Saved {len(configs)} configs'})
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)