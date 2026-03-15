#!/usr/bin/env python3
"""
Quick fix for student login issue
"""

import pymysql
from django.contrib.auth.hashers import make_password

def fix_student_login():
    """Fix student login by ensuring proper password hash"""
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Check if student STU20251807 exists
        cursor.execute("SELECT id, student_id, name, password_hash FROM students WHERE student_id = %s", ('STU20251807',))
        result = cursor.fetchone()
        
        if result:
            user_id, student_id, name, current_hash = result
            print(f"Found student: {name} ({student_id})")
            print(f"Current hash: {current_hash}")
            
            # Update password to a known hash for testing
            new_password = "123456789"  # Test password
            new_hash = make_password(new_password)
            
            cursor.execute("UPDATE students SET password_hash = %s WHERE id = %s", (new_hash, user_id))
            conn.commit()
            
            print(f"✅ Updated password hash for {student_id}")
            print(f"New hash: {new_hash}")
            print(f"Test login with: {student_id} / {new_password}")
            
        else:
            print("❌ Student STU20251807 not found")
            
            # Create test student
            student_id = "STU20251807"
            name = "Test Student"
            mobile = "9876543210"
            class_level = "10"
            board = "CBSE"
            password = "123456789"
            password_hash = make_password(password)
            
            cursor.execute("""
                INSERT INTO students (student_id, name, mobile_self, class, board, password_hash, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
            """, (student_id, name, mobile, class_level, board, password_hash))
            
            conn.commit()
            print(f"✅ Created test student: {student_id} / {password}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_student_login()