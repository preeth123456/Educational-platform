"""
Script to add missing encryption fields to students table
This fixes the "(1054, Unknown column 'mobile_self_encrypted' in 'field list')" error
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

import django
django.setup()

from django.db import connection

def add_encryption_columns():
    """Add missing encryption columns to students table"""
    
    columns_to_add = [
        ("mobile_self_encrypted", "TEXT"),
        ("address_encrypted", "TEXT"),
        ("parent_phone_encrypted", "TEXT"),
        ("encryption_key_id", "INT")
    ]
    
    try:
        with connection.cursor() as cursor:
            # Check which columns already exist
            cursor.execute("DESCRIBE students")
            existing_columns = [row[0] for row in cursor.fetchall()]
            print(f"Existing columns in students table: {len(existing_columns)}")
            
            added_count = 0
            for col_name, col_type in columns_to_add:
                if col_name not in existing_columns:
                    try:
                        sql = f"ALTER TABLE students ADD COLUMN {col_name} {col_type}"
                        print(f"Adding column: {col_name}...")
                        cursor.execute(sql)
                        added_count += 1
                        print(f"✓ Added {col_name}")
                    except Exception as e:
                        if "Duplicate column" in str(e):
                            print(f"⏭ {col_name} already exists")
                        else:
                            print(f"✗ Error adding {col_name}: {e}")
                else:
                    print(f"⏭ {col_name} already exists")
            
            print(f"\n✅ Added {added_count} new columns to students table")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Adding missing encryption columns to students table...")
    print("=" * 50)
    add_encryption_columns()
    print("\n🎉 Done! Try signing up again.")
