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
from django.core.management import execute_from_command_line

def sync_migration_state():
    """Sync the migration state by marking existing migrations as applied"""
    
    # List of migrations that should be marked as applied based on showmigrations output
    migrations_to_fake = [
        ('admin_auth', '0002_adminnotification_delete_admin_delete_adminemaillog_and_more'),
        ('admin_auth', '0003_adminemaillog_backuphistory_student_teacheremaillog_and_more'),
        ('auth_app', '0002_educator_degree_certificate_and_more'),
        ('auth_app', '0003_schedule'),
        ('auth_app', '0004_educator_approval_status'),
        ('auth_app', '0005_add_reminder_tracking'),
        ('collaboration', '0001_initial'),
        ('collaboration', '0002_project_projectgroup_projectsubmission_and_more'),
    ]
    
    with connection.cursor() as cursor:
        # Get the next available ID
        cursor.execute("SELECT MAX(id) FROM django_migrations")
        max_id = cursor.fetchone()[0] or 0
        next_id = max_id + 1
        
        for app, migration_name in migrations_to_fake:
            # Check if migration already exists
            cursor.execute(
                "SELECT COUNT(*) FROM django_migrations WHERE app = %s AND name = %s",
                [app, migration_name]
            )
            count = cursor.fetchone()[0]
            
            if count == 0:
                # Insert the migration record
                cursor.execute(
                    "INSERT INTO django_migrations (id, app, name, applied) VALUES (%s, %s, %s, NOW())",
                    [next_id, app, migration_name]
                )
                print(f"Added migration: {app}.{migration_name} (ID: {next_id})")
                next_id += 1
            else:
                print(f"Migration already exists: {app}.{migration_name}")

if __name__ == "__main__":
    try:
        print("Syncing migration state...")
        sync_migration_state()
        print("\nMigration state synced successfully!")
        print("You can now run 'python manage.py migrate' to apply any remaining migrations.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()