import sys
import os
import json
import pymysql
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

class TenantConfigHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save-tenant-config':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                tenant_id = data.get('tenant_id')
                configs = data.get('configs', [])
                
                if not tenant_id:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'message': 'tenant_id required'}).encode())
                    return
                
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
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {
                    'success': True,
                    'message': f'Saved {len(saved_configs)} configurations',
                    'saved': saved_configs
                }
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8002), TenantConfigHandler)
    print("Tenant config server running on http://localhost:8002")
    server.serve_forever()