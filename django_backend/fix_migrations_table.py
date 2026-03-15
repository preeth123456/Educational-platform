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

def fix_migrations_table():
    """Fix the django_migrations table"""
    with connection.cursor() as cursor:
        # Find entries with id = 0
        cursor.execute("SELECT id, app, name FROM django_migrations WHERE id = 0")
        zero_entries = cursor.fetchall()
        
        if zero_entries:
            print(f"Found {len(zero_entries)} entries with id = 0:")
            for entry in zero_entries:
                print(f"  {entry}")
            
            # Get max id
            cursor.execute("SELECT MAX(id) FROM django_migrations WHERE id > 0")
            max_id = cursor.fetchone()[0] or 0
            next_id = max_id + 1
            
            # Update each zero entry
            for entry in zero_entries:
                cursor.execute(
                    "UPDATE django_migrations SET id = %s WHERE id = 0 AND app = %s AND name = %s LIMIT 1",
                    [next_id, entry[1], entry[2]]
                )
                print(f"Updated {entry[1]}.{entry[2]} from id=0 to id={next_id}")
                next_id += 1
        
        # Now add primary key and auto-increment
        try:
            cursor.execute("ALTER TABLE django_migrations ADD PRIMARY KEY (id)")
            print("Added primary key to django_migrations")
        except Exception as e:
            print(f"Primary key error: {e}")
        
        try:
            cursor.execute("ALTER TABLE django_migrations MODIFY id bigint AUTO_INCREMENT")
            cursor.execute(f"ALTER TABLE django_migrations AUTO_INCREMENT = {next_id}")
            print(f"Set AUTO_INCREMENT starting from {next_id}")
        except Exception as e:
            print(f"Auto-increment error: {e}")

if __name__ == "__main__":
    fix_migrations_table()
    print("Django migrations table fix completed!")