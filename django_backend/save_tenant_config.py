#!/usr/bin/env python
import os
import sys
import django
import pymysql
from datetime import datetime

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

def save_tenant_config_direct(tenant_id, key, value, value_type='string', category='appearance'):
    """Save tenant config directly to database"""
    try:
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        cursor = conn.cursor()
        
        # Check if config exists
        cursor.execute("""
            SELECT id FROM tenant_configs 
            WHERE tenant_id = %s AND `key` = %s
        """, (tenant_id, key))
        
        existing = cursor.fetchone()
        now = datetime.now()
        
        if existing:
            # Update existing
            cursor.execute("""
                UPDATE tenant_configs 
                SET value = %s, value_type = %s, category = %s, updated_at = %s
                WHERE tenant_id = %s AND `key` = %s
            """, (value, value_type, category, now, tenant_id, key))
            print(f"Updated {tenant_id}: {key} = {value}")
        else:
            # Insert new
            cursor.execute("""
                INSERT INTO tenant_configs 
                (tenant_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (tenant_id, key, value, value_type, category, '', 0, 'Admin', now, now))
            print(f"Created {tenant_id}: {key} = {value}")
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) >= 4:
        tenant_id = sys.argv[1]
        key = sys.argv[2]
        value = sys.argv[3]
        save_tenant_config_direct(tenant_id, key, value)
    else:
        # Default test with x-org configs
        save_tenant_config_direct('x-org', 'theme_primary_color', '#1e40af', 'string', 'appearance')
        save_tenant_config_direct('x-org', 'school_logo_url', '/logos/school-logo.png', 'string', 'appearance')
        save_tenant_config_direct('x-org', 'site_name', 'School Portal', 'string', 'general')