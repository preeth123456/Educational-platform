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

def add_missing_migration():
    """Add the missing courses.0002_remove_course_is_published_remove_course_status migration"""
    with connection.cursor() as cursor:
        # Check if the specific migration exists
        cursor.execute(
            "SELECT COUNT(*) FROM django_migrations WHERE app = 'courses' AND name = '0002_remove_course_is_published_remove_course_status'"
        )
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Get the next available ID
            cursor.execute("SELECT MAX(id) FROM django_migrations")
            max_id = cursor.fetchone()[0] or 0
            next_id = max_id + 1
            
            # Insert the missing migration record
            cursor.execute(
                "INSERT INTO django_migrations (id, app, name, applied) VALUES (%s, %s, %s, NOW())",
                [next_id, 'courses', '0002_remove_course_is_published_remove_course_status']
            )
            print(f"Added missing migration record with ID {next_id}")
            return True
        else:
            print("Migration record already exists")
            return False

if __name__ == "__main__":
    try:
        added = add_missing_migration()
        if added:
            print("Migration history fixed successfully!")
            print("You can now run 'python manage.py migrate' to apply remaining migrations.")
        else:
            print("No changes needed.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()