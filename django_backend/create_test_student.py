import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

import pymysql

# Create test student with plain text password
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

# Check if test student exists
cursor.execute("SELECT id FROM students WHERE student_id = 'TEST001'")
if cursor.fetchone():
    print("Test student already exists")
else:
    # Insert test student
    cursor.execute("""
        INSERT INTO students (student_id, name, mobile_self, class, board, password_hash, profile_completed, created_at, updated_at)
        VALUES ('TEST001', 'Test Student', '1234567890', '10', 'CBSE', 'test123', 1, NOW(), NOW())
    """)
    conn.commit()
    print("Test student created:")
    print("Student ID: TEST001")
    print("Password: test123")

conn.close()