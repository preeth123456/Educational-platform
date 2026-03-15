import pymysql
import sys
import os

# Add Django settings
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

import django
django.setup()

from django.contrib.auth.hashers import make_password

def setup_test_student():
    """Setup test student for login"""
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        student_id = "STU20251807"
        password = "123456789"
        password_hash = make_password(password)
        
        # Check if student exists
        cursor.execute("SELECT id FROM students WHERE student_id = %s", (student_id,))
        if cursor.fetchone():
            # Update existing student
            cursor.execute("""
                UPDATE students 
                SET password_hash = %s, updated_at = NOW()
                WHERE student_id = %s
            """, (password_hash, student_id))
            print(f"✅ Updated password for existing student {student_id}")
        else:
            # Create new student
            cursor.execute("""
                INSERT INTO students (student_id, name, mobile_self, class, board, password_hash, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
            """, (student_id, "Test Student", "9876543210", "10", "CBSE", password_hash))
            print(f"✅ Created new student {student_id}")
        
        conn.commit()
        conn.close()
        
        print(f"Login credentials: {student_id} / {password}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    setup_test_student()