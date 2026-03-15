import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("DESCRIBE students")
    columns = [row[0] for row in cursor.fetchall()]
    
    print("Checking students table:")
    for field in ['mobile_self_encrypted', 'address_encrypted', 'parent_phone_encrypted', 'encryption_key_id']:
        if field in columns:
            print(f"  OK {field} exists")
        else:
            print(f"  MISSING {field}")
    
    cursor.execute("DESCRIBE educators")
    columns = [row[0] for row in cursor.fetchall()]
    
    print("\nChecking educators table:")
    for field in ['mobile_encrypted', 'email_encrypted', 'encryption_key_id']:
        if field in columns:
            print(f"  OK {field} exists")
        else:
            print(f"  MISSING {field}")
    
    cursor.execute("SHOW TABLES LIKE 'encryption_keys'")
    if cursor.fetchone():
        print("\nOK encryption_keys table exists")
    else:
        print("\nMISSING encryption_keys table")

print("\nVerification complete!")
