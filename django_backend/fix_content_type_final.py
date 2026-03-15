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

def fix_content_type_table():
    """Fix the django_content_type table structure"""
    with connection.cursor() as cursor:
        try:
            # Check if id is already primary key
            cursor.execute("SHOW KEYS FROM django_content_type WHERE Key_name = 'PRIMARY'")
            primary_keys = cursor.fetchall()
            
            if not primary_keys:
                print("Adding primary key to django_content_type.id")
                cursor.execute("ALTER TABLE django_content_type ADD PRIMARY KEY (id)")
            
            # Now add auto-increment
            cursor.execute("ALTER TABLE django_content_type MODIFY id int AUTO_INCREMENT")
            print("Added AUTO_INCREMENT to django_content_type.id")
            
            # Set auto-increment start value
            cursor.execute("SELECT MAX(id) FROM django_content_type")
            max_id = cursor.fetchone()[0] or 0
            next_id = max_id + 1
            
            cursor.execute(f"ALTER TABLE django_content_type AUTO_INCREMENT = {next_id}")
            print(f"Set AUTO_INCREMENT start value to {next_id}")
            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    fix_content_type_table()
    print("Content type table fix completed!")