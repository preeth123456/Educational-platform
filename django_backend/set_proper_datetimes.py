#!/usr/bin/env python
"""
Set proper datetime values for products and tenants
"""
import pymysql
import traceback
from datetime import datetime

def set_proper_datetimes():
    """Set proper datetime values for all records"""
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
        
        # Set proper datetime for all products
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"\nSetting datetime to: {now}")
        
        print("Updating products table...")
        cursor.execute(f"""
            UPDATE products 
            SET 
                created_at = '{now}',
                updated_at = '{now}'
        """)
        
        print(f"Updated {cursor.rowcount} products")
        
        print("Updating tenants table...")
        cursor.execute(f"""
            UPDATE tenants 
            SET 
                created_at = '{now}',
                updated_at = '{now}'
        """)
        
        print(f"Updated {cursor.rowcount} tenants")
        
        # Commit changes
        connection.commit()
        
        # Verify the fix
        print("\nVerifying products after fix...")
        cursor.execute("SELECT product_id, name, created_at, updated_at FROM products")
        products = cursor.fetchall()
        for product in products:
            print(f"  {product[0]}: {product[1]} - created: {product[2]}, updated: {product[3]}")
        
        print("\nVerifying tenants after fix...")
        cursor.execute("SELECT tenant_id, name, created_at, updated_at FROM tenants")
        tenants = cursor.fetchall()
        for tenant in tenants:
            print(f"  {tenant[0]}: {tenant[1]} - created: {tenant[2]}, updated: {tenant[3]}")
        
        cursor.close()
        connection.close()
        
        print("\nDatetime fields set successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    set_proper_datetimes()