#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def check_missing_tables():
    expected_tables = [
        'api_keys',
        'webhook_endpoints',
        'public_api_apikey',
        'webhook_system_webhookendpoint'
    ]
    
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        existing_tables = [table[0] for table in cursor.fetchall()]
        
        print("Checking for expected tables:")
        for table in expected_tables:
            if table in existing_tables:
                print(f"  [OK] {table} - EXISTS")
            else:
                print(f"  [MISSING] {table} - NOT FOUND")
        
        # Check for similar tables
        print("\nSimilar tables found:")
        for table in existing_tables:
            if any(keyword in table.lower() for keyword in ['api', 'webhook', 'public']):
                print(f"  - {table}")

if __name__ == "__main__":
    check_missing_tables()