#!/usr/bin/env python
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def check_database_tables():
    with connection.cursor() as cursor:
        # Get all tables
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        
        print(f"Found {len(tables)} tables in database:")
        for table in sorted(tables):
            print(f"  - {table}")
        
        # Check django_migrations specifically
        if 'django_migrations' in tables:
            cursor.execute("SELECT app, name FROM django_migrations ORDER BY app, name")
            migrations = cursor.fetchall()
            print(f"\nFound {len(migrations)} migration records:")
            for app, name in migrations:
                print(f"  - {app}.{name}")
        else:
            print("\n❌ django_migrations table not found!")

if __name__ == "__main__":
    check_database_tables()