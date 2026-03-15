#!/usr/bin/env python
import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

# Setup Django
django.setup()

from django.db import connection

def update_enrollment_status():
    cursor = connection.cursor()
    try:
        # Update enrollment status for course 5 to completed
        cursor.execute("UPDATE student_enrollments SET status = 'completed' WHERE student_id = 11 AND course_id = 5")

        print("Updated enrollment status for course 5")

        # Check the result
        cursor.execute("SELECT student_id, course_id, status FROM student_enrollments WHERE student_id = 11")
        results = cursor.fetchall()
        print("Current enrollment statuses:")
        for row in results:
            print(f"  Student: {row[0]}, Course: {row[1]}, Status: {row[2]}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()

if __name__ == "__main__":
    update_enrollment_status()