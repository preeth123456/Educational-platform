#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

# Setup Django
django.setup()

from django.db import connection

def fix_migration_dependency():
    """Fix the migration dependency issue by adding the missing merge migration record."""
    try:
        with connection.cursor() as cursor:
            # Check if the migration record already exists
            cursor.execute(
                "SELECT COUNT(*) FROM django_migrations WHERE app = %s AND name = %s",
                ['auth_app', '0011_merge_20260120_1810']
            )
            exists = cursor.fetchone()[0]
            
            if exists == 0:
                # Insert the missing migration record without specifying ID (let auto-increment handle it)
                cursor.execute(
                    "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, %s)",
                    ['auth_app', '0011_merge_20260120_1810', '2026-01-21 12:00:00']
                )
                print("✓ Added missing migration record: auth_app.0011_merge_20260120_1810")
            else:
                print("Migration record already exists")
                
        print("Migration dependency issue fixed!")
        
    except Exception as e:
        print(f"Error fixing migration dependency: {e}")
        return False
    
    return True

if __name__ == "__main__":
    fix_migration_dependency()