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
    """Fix the django_content_type table to have auto-increment on id field"""
    with connection.cursor() as cursor:
        try:
            # Check current table structure
            cursor.execute("DESCRIBE django_content_type")
            columns = cursor.fetchall()
            print("Current django_content_type structure:")
            for col in columns:
                print(f"  {col}")
            
            # Fix the auto-increment issue
            cursor.execute("ALTER TABLE django_content_type MODIFY id int AUTO_INCREMENT")
            print("\nFixed: Added AUTO_INCREMENT to django_content_type.id")
            
            # Get the current max ID and set auto-increment value
            cursor.execute("SELECT MAX(id) FROM django_content_type")
            max_id = cursor.fetchone()[0] or 0
            next_id = max_id + 1
            
            cursor.execute(f"ALTER TABLE django_content_type AUTO_INCREMENT = {next_id}")
            print(f"Set AUTO_INCREMENT start value to {next_id}")
            
        except Exception as e:
            print(f"Error fixing table: {e}")

if __name__ == "__main__":
    fix_content_type_table()
    print("Table fix completed!")