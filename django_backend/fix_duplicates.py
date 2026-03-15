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

def fix_duplicate_ids():
    """Fix duplicate id entries in django_content_type table"""
    with connection.cursor() as cursor:
        # Find all entries with id = 0
        cursor.execute("SELECT id, app_label, model FROM django_content_type WHERE id = 0")
        zero_entries = cursor.fetchall()
        
        if zero_entries:
            print(f"Found {len(zero_entries)} entries with id = 0:")
            for entry in zero_entries:
                print(f"  {entry}")
            
            # Get the current max id
            cursor.execute("SELECT MAX(id) FROM django_content_type WHERE id > 0")
            max_id = cursor.fetchone()[0] or 0
            next_id = max_id + 1
            
            # Update each zero entry with a new unique id
            for entry in zero_entries:
                cursor.execute(
                    "UPDATE django_content_type SET id = %s WHERE id = 0 AND app_label = %s AND model = %s LIMIT 1",
                    [next_id, entry[1], entry[2]]
                )
                print(f"Updated {entry[1]}.{entry[2]} from id=0 to id={next_id}")
                next_id += 1
            
            # Now add primary key and auto-increment
            try:
                cursor.execute("ALTER TABLE django_content_type ADD PRIMARY KEY (id)")
                print("Added primary key to django_content_type.id")
            except Exception as e:
                print(f"Primary key already exists or error: {e}")
            
            try:
                cursor.execute("ALTER TABLE django_content_type MODIFY id int AUTO_INCREMENT")
                cursor.execute(f"ALTER TABLE django_content_type AUTO_INCREMENT = {next_id}")
                print(f"Set AUTO_INCREMENT starting from {next_id}")
            except Exception as e:
                print(f"Auto-increment error: {e}")
        else:
            print("No duplicate entries found")

if __name__ == "__main__":
    fix_duplicate_ids()
    print("Duplicate ID fix completed!")