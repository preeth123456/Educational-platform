#!/usr/bin/env python3
"""
Consent Management Database Setup Script
Run this script to create the consent tracking tables and initialize default settings.
"""

import os
import sys
import django
from django.db import connection
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

def run_sql_file(filename):
    """Execute SQL commands from a file"""
    sql_file_path = os.path.join(os.path.dirname(__file__), filename)
    
    if not os.path.exists(sql_file_path):
        print(f"Error: SQL file {filename} not found")
        return False
    
    try:
        with open(sql_file_path, 'r') as file:
            sql_content = file.read()
        
        # Split SQL commands by semicolon and execute each
        sql_commands = [cmd.strip() for cmd in sql_content.split(';') if cmd.strip()]
        
        with connection.cursor() as cursor:
            for command in sql_commands:
                if command:
                    print(f"Executing: {command[:50]}...")
                    cursor.execute(command)
        
        print(f"Successfully executed {filename}")
        return True
        
    except Exception as e:
        print(f"Error executing {filename}: {str(e)}")
        return False

def create_django_migrations():
    """Create Django migrations for the new models"""
    try:
        from django.core.management import execute_from_command_line
        
        print("Creating Django migrations...")
        execute_from_command_line(['manage.py', 'makemigrations', 'auth_app'])
        
        print("Applying Django migrations...")
        execute_from_command_line(['manage.py', 'migrate', 'auth_app'])
        
        print("Django migrations completed successfully")
        return True
        
    except Exception as e:
        print(f"Error with Django migrations: {str(e)}")
        return False

def verify_setup():
    """Verify that the consent management system is properly set up"""
    try:
        from auth_app.models import StudentConsent, ConsentHistory
        
        # Test model imports
        print("Models imported successfully")
        
        # Check table existence
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES LIKE 'student_consent'")
            if cursor.fetchone():
                print("student_consent table exists")
            else:
                print("student_consent table not found")
                return False
            
            cursor.execute("SHOW TABLES LIKE 'consent_history'")
            if cursor.fetchone():
                print("consent_history table exists")
            else:
                print("consent_history table not found")
                return False
            
            # Check data
            cursor.execute("SELECT COUNT(*) FROM student_consent")
            consent_count = cursor.fetchone()[0]
            print(f"Found {consent_count} consent records")
            
            cursor.execute("SELECT COUNT(*) FROM consent_history")
            history_count = cursor.fetchone()[0]
            print(f"Found {history_count} history records")
        
        return True
        
    except Exception as e:
        print(f"Verification failed: {str(e)}")
        return False

def main():
    """Main setup function"""
    print("Starting Consent Management System Setup...")
    print("=" * 50)
    
    # Step 1: Create Django migrations
    print("\nStep 1: Creating Django migrations...")
    if not create_django_migrations():
        print("Failed to create Django migrations. Continuing with SQL setup...")
    
    # Step 2: Run SQL setup script
    print("\nStep 2: Setting up database tables...")
    if not run_sql_file('create_consent_tables.sql'):
        print("Database setup failed!")
        return False
    
    # Step 3: Verify setup
    print("\nStep 3: Verifying setup...")
    if not verify_setup():
        print("Setup verification failed!")
        return False
    
    print("\n" + "=" * 50)
    print("Consent Management System setup completed successfully!")
    print("\nNext steps:")
    print("1. Restart your Django server")
    print("2. Test the privacy dashboard in Settings")
    print("3. Check the consent APIs at /api/auth/consent_status/")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)