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

def check_migrations():
    """Check all migration records in detail"""
    with connection.cursor() as cursor:
        # Get all courses migrations
        cursor.execute("SELECT id, app, name FROM django_migrations WHERE app = 'courses' ORDER BY name")
        courses_migrations = cursor.fetchall()
        print("Courses migrations in database:")
        for migration in courses_migrations:
            print(f"  ID: {migration[0]}, App: {migration[1]}, Name: {migration[2]}")
        
        # Check specifically for the migration we need
        cursor.execute(
            "SELECT COUNT(*) FROM django_migrations WHERE app = 'courses' AND name = '0002_remove_course_is_published_remove_course_status'"
        )
        count = cursor.fetchone()[0]
        print(f"\nCount of '0002_remove_course_is_published_remove_course_status': {count}")
        
        # Check auth_app migrations
        cursor.execute("SELECT id, app, name FROM django_migrations WHERE app = 'auth_app' ORDER BY name")
        auth_migrations = cursor.fetchall()
        print("\nAuth_app migrations in database:")
        for migration in auth_migrations:
            print(f"  ID: {migration[0]}, App: {migration[1]}, Name: {migration[2]}")

if __name__ == "__main__":
    try:
        check_migrations()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()