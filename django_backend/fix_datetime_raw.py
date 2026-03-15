#!/usr/bin/env python
"""
Fix datetime fields using raw SQL to avoid Django ORM issues
"""
import pymysql
import traceback
from datetime import datetime

def fix_datetime_fields():
    """Fix datetime fields in products and tenants tables"""
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
        
        # Check current data in products table
        print("\nChecking products table...")
        cursor.execute("SELECT product_id, name, created_at, updated_at FROM products LIMIT 3")
        products = cursor.fetchall()
        for product in products:
            print(f"  {product[0]}: created_at={product[2]} (type: {type(product[2])}), updated_at={product[3]} (type: {type(product[3])})")
        
        # Fix products table
        print("\nFixing products table datetime fields...")
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Update products with proper datetime format
        cursor.execute(f"""
            UPDATE products 
            SET 
                created_at = CASE 
                    WHEN created_at REGEXP '^[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}' THEN created_at
                    ELSE '{now}'
                END,
                updated_at = CASE 
                    WHEN updated_at REGEXP '^[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}' THEN updated_at
                    ELSE '{now}'
                END
        """)
        
        print(f"Updated {cursor.rowcount} products")
        
        # Check current data in tenants table
        print("\nChecking tenants table...")
        cursor.execute("SELECT tenant_id, name, created_at, updated_at FROM tenants LIMIT 3")
        tenants = cursor.fetchall()
        for tenant in tenants:
            print(f"  {tenant[0]}: created_at={tenant[2]} (type: {type(tenant[2])}), updated_at={tenant[3]} (type: {type(tenant[3])})")
        
        # Fix tenants table
        print("\nFixing tenants table datetime fields...")
        cursor.execute(f"""
            UPDATE tenants 
            SET 
                created_at = CASE 
                    WHEN created_at REGEXP '^[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}' THEN created_at
                    ELSE '{now}'
                END,
                updated_at = CASE 
                    WHEN updated_at REGEXP '^[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}' THEN updated_at
                    ELSE '{now}'
                END
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
        
        print("\nDatetime fields fixed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    fix_datetime_fields()