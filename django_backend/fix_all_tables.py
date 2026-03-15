#!/usr/bin/env python
import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def fix_all_auto_increment_tables():
    """Fix auto-increment issues in all Django system tables"""
    tables_to_fix = [
        'django_migrations',
        'django_content_type',
        'auth_permission',
        'auth_group',
        'auth_user',
        'django_admin_log'
    ]
    
    with connection.cursor() as cursor:
        for table in tables_to_fix:
            try:
                print(f"\nFixing table: {table}")
                
                # Check if table exists
                cursor.execute(f"SHOW TABLES LIKE '{table}'")
                if not cursor.fetchone():
                    print(f"  Table {table} does not exist, skipping")
                    continue
                
                # Check current structure
                cursor.execute(f"DESCRIBE {table}")
                columns = cursor.fetchall()
                id_column = next((col for col in columns if col[0] == 'id'), None)
                
                if not id_column:
                    print(f"  No id column in {table}, skipping")
                    continue
                
                print(f"  Current id column: {id_column}")
                
                # Check if primary key exists
                cursor.execute(f"SHOW KEYS FROM {table} WHERE Key_name = 'PRIMARY'")
                has_primary = bool(cursor.fetchall())
                
                if not has_primary:
                    print(f"  Adding primary key to {table}")
                    cursor.execute(f"ALTER TABLE {table} ADD PRIMARY KEY (id)")
                
                # Add auto-increment
                if 'auto_increment' not in id_column[5].lower():
                    print(f"  Adding AUTO_INCREMENT to {table}")
                    cursor.execute(f"ALTER TABLE {table} MODIFY id int AUTO_INCREMENT")
                    
                    # Set auto-increment start value
                    cursor.execute(f"SELECT MAX(id) FROM {table}")
                    max_id = cursor.fetchone()[0] or 0
                    next_id = max_id + 1
                    cursor.execute(f"ALTER TABLE {table} AUTO_INCREMENT = {next_id}")
                    print(f"  Set AUTO_INCREMENT to start from {next_id}")
                else:
                    print(f"  {table} already has AUTO_INCREMENT")
                    
            except Exception as e:
                print(f"  Error fixing {table}: {e}")

if __name__ == "__main__":
    fix_all_auto_increment_tables()
    print("\nAll table fixes completed!")