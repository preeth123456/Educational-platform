from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pymysql
from datetime import datetime

@csrf_exempt
def save_tenant_config_simple(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tenant_id = data.get('tenant_id', 'x-org')
            configs = data.get('configs', [])
            
            conn = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            cursor = conn.cursor()
            
            saved = []
            for config in configs:
                key = config.get('key')
                value = config.get('value')
                if key and value:
                    now = datetime.now()
                    cursor.execute("""
                        UPDATE tenant_configs 
                        SET value = %s, updated_at = %s 
                        WHERE tenant_id = %s AND `key` = %s
                    """, (value, now, tenant_id, key))
                    saved.append(f"{key}={value}")
            
            conn.commit()
            conn.close()
            
            return JsonResponse({
                'success': True,
                'message': f'Saved {len(saved)} configs',
                'saved': saved
            })
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'POST required'})