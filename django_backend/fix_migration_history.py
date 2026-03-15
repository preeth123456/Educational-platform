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

def fix_migration_history():
    """Fix the inconsistent migration history by marking courses.0002 as applied"""
    with connection.cursor() as cursor:
        # Check if the migration record exists
        cursor.execute(
            "SELECT COUNT(*) FROM django_migrations WHERE app = 'courses' AND name = '0002_remove_course_is_published_remove_course_status'"
        )
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Insert the missing migration record
            cursor.execute(
                "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, NOW())",
                ['courses', '0002_remove_course_is_published_remove_course_status']
            )
            print("✓ Added missing migration record for courses.0002_remove_course_is_published_remove_course_status")
        else:
            print("Migration record already exists")
        
        # Verify the fix
        cursor.execute("SELECT app, name FROM django_migrations WHERE app IN ('courses', 'auth_app') ORDER BY app, name")
        migrations = cursor.fetchall()
        print("\nCurrent migration records:")
        for app, name in migrations:
            print(f"  {app}.{name}")

if __name__ == "__main__":
    try:
        fix_migration_history()
        print("\n✓ Migration history fixed successfully!")
        print("You can now run 'python manage.py migrate' to apply remaining migrations.")
    except Exception as e:
        print(f"Error: {e}")