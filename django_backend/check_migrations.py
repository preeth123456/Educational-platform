"""
Database Migration Verification Script
Run this with: python check_migrations.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def check_tables_exist():
    """Check which tables from faked migration actually exist"""
    print("=" * 80)
    print("CHECKING TABLES FROM FAKED MIGRATION 0011")
    print("=" * 80)
    
    tables_to_check = [
        'anonymized_data',
        'data_retention_policies',
        'deletion_requests',
        'data_exports'
    ]
    
    with connection.cursor() as cursor:
        for table in tables_to_check:
            cursor.execute(f"SHOW TABLES LIKE '{table}'")
            result = cursor.fetchone()
            status = "[EXISTS]" if result else "[MISSING]"
            print(f"{table:30} {status}")
    print()

def check_migration_registered():
    """Check if migration is in django_migrations table"""
    print("=" * 80)
    print("CHECKING DJANGO_MIGRATIONS TABLE")
    print("=" * 80)
    
    with connection.cursor() as cursor:
        # Check auth_app migrations
        cursor.execute("""
            SELECT name, applied 
            FROM django_migrations 
            WHERE app = 'auth_app' 
            ORDER BY id DESC 
            LIMIT 5
        """)
        print("\nLast 5 auth_app migrations:")
        for name, applied in cursor.fetchall():
            print(f"  - {name} (applied: {applied})")
        
        # Check if faked migration is registered
        cursor.execute("""
            SELECT COUNT(*) 
            FROM django_migrations 
            WHERE app = 'auth_app' 
              AND name = '0011_anonymizeddata_dataretentionpolicy_and_more'
        """)
        count = cursor.fetchone()[0]
        print(f"\nFaked migration registered: {'[YES]' if count > 0 else '[NO]'}")
    print()

def check_integration_table_structure():
    """Check Integration table columns for Feature 10 compliance"""
    print("=" * 80)
    print("CHECKING INTEGRATIONS TABLE (Feature 10 - Vault)")
    print("=" * 80)
    
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                COLUMN_NAME,
                COLUMN_TYPE,
                COLUMN_DEFAULT,
                COLUMN_COMMENT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'integrations'
              AND COLUMN_NAME IN ('status', 'config', 'integration_type')
            ORDER BY COLUMN_NAME
        """)
        
        print(f"\n{'Column':<20} {'Type':<20} {'Default':<15} {'Comment':<50}")
        print("-" * 105)
        for row in cursor.fetchall():
            col_name, col_type, col_default, col_comment = row
            col_default = str(col_default) if col_default else 'NULL'
            col_comment = col_comment or ''
            print(f"{col_name:<20} {col_type:<20} {col_default:<15} {col_comment:<50}")
    print()

def check_feature_columns():
    """Check if other feature columns exist (to identify what was applied manually)"""
    print("=" * 80)
    print("CHECKING OTHER FEATURE COLUMNS")
    print("=" * 80)
    
    checks = [
        {
            'name': 'Feature 5 (Connectors) - OAuth in api_keys',
            'table': 'api_keys',
            'columns': ['oauth_provider', 'oauth_client_id', 'oauth_redirect_uri', 'oauth_scopes']
        },
        {
            'name': 'Feature 13 (Monitoring) - admin_notifications',
            'table': 'admin_notifications',
            'columns': ['job_metadata', 'webhook_delivered_at', 'webhook_status']
        }
    ]
    
    with connection.cursor() as cursor:
        for check in checks:
            print(f"\n{check['name']}:")
            for column in check['columns']:
                cursor.execute(f"""
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = '{check['table']}'
                      AND COLUMN_NAME = '{column}'
                """)
                exists = cursor.fetchone()[0] > 0
                status = "[EXISTS]" if exists else "[MISSING]"
                print(f"  {column:30} {status}")
    print()

def generate_fix_sql():
    """Generate SQL to fix missing migration registration"""
    print("=" * 80)
    print("FIX SQL (Run in phpMyAdmin if needed)")
    print("=" * 80)
    
    with connection.cursor() as cursor:
        # Check if faked migration exists
        cursor.execute("""
            SELECT COUNT(*) 
            FROM django_migrations 
            WHERE app = 'auth_app' 
              AND name = '0011_anonymizeddata_dataretentionpolicy_and_more'
        """)
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Check if tables exist
            cursor.execute("SHOW TABLES LIKE 'anonymized_data'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                print("\n[WARNING] Tables exist but migration not registered!")
                print("\nRun this SQL in phpMyAdmin:")
                print("-" * 80)
                print("INSERT INTO django_migrations (app, name, applied)")
                print("VALUES ('auth_app', '0011_anonymizeddata_dataretentionpolicy_and_more', NOW());")
                print("-" * 80)
            else:
                print("\n[OK] Tables don't exist and migration is not registered. All good!")
        else:
            print("\n[OK] Migration already registered properly!")
    print()

if __name__ == '__main__':
    try:
        check_tables_exist()
        check_migration_registered()
        check_integration_table_structure()
        check_feature_columns()
        generate_fix_sql()
        
        print("=" * 80)
        print("VERIFICATION COMPLETE")
        print("=" * 80)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()