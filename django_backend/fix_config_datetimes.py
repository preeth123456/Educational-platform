#!/usr/bin/env python
"""
Fix datetime fields in all configuration tables
"""
import pymysql
import traceback
from datetime import datetime

def fix_config_datetimes():
    """Fix datetime fields in configuration tables"""
    try:
        # Connect to database
        connection = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = connection.cursor()
        
        print("Connected to database")
        
        # Set proper datetime for all configuration tables
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"Setting datetime to: {now}")
        
        # Fix platform_configs
        print("Updating platform_configs table...")
        cursor.execute(f"""
            UPDATE platform_configs 
            SET 
                created_at = '{now}',
                updated_at = '{now}'
        """)
        print(f"Updated {cursor.rowcount} platform_configs records")
        
        # Fix product_configs
        print("Updating product_configs table...")
        cursor.execute(f"""
            UPDATE product_configs 
            SET 
                created_at = '{now}',
                updated_at = '{now}'
        """)
        print(f"Updated {cursor.rowcount} product_configs records")
        
        # Fix tenant_configs
        print("Updating tenant_configs table...")
        cursor.execute(f"""
            UPDATE tenant_configs 
            SET 
                created_at = '{now}',
                updated_at = '{now}'
        """)
        print(f"Updated {cursor.rowcount} tenant_configs records")
        
        # Commit changes
        connection.commit()
        
        # Verify the fix
        print("\nVerifying platform_configs...")
        cursor.execute("SELECT `key`, created_at, updated_at FROM platform_configs LIMIT 3")
        configs = cursor.fetchall()
        for config in configs:
            print(f"  {config[0]}: created={config[1]}, updated={config[2]}")
        
        cursor.close()
        connection.close()
        
        print("\nConfiguration datetime fields fixed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    fix_config_datetimes()