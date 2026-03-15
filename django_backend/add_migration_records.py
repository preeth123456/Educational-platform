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

def add_missing_migration_records():
    """Add migration records for existing tables"""
    migrations_to_add = [
        ('auth_app', '0006_badge_badgeprogress_skillendorsement_studentbadge_and_more'),
        ('courses', '0003_lessoncontent_lesson_chapter'),
    ]
    
    with connection.cursor() as cursor:
        for app, migration_name in migrations_to_add:
            # Check if migration already exists
            cursor.execute(
                "SELECT COUNT(*) FROM django_migrations WHERE app = %s AND name = %s",
                [app, migration_name]
            )
            count = cursor.fetchone()[0]
            
            if count == 0:
                # Insert the migration record
                cursor.execute(
                    "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, NOW())",
                    [app, migration_name]
                )
                print(f"Added migration: {app}.{migration_name}")
            else:
                print(f"Migration already exists: {app}.{migration_name}")

if __name__ == "__main__":
    add_missing_migration_records()
    print("Migration records added successfully!")