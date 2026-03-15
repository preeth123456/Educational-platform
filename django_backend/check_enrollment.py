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

def check_enrollment():
    cursor = connection.cursor()
    try:
        # Check student enrollments
        cursor.execute("SELECT student_id, course_id, status, progress_percentage FROM student_enrollments WHERE student_id = 11")
        enrollments = cursor.fetchall()

        print("Student Enrollments for student_id=11:")
        for enrollment in enrollments:
            print(f"  Student: {enrollment[0]}, Course: {enrollment[1]}, Status: {enrollment[2]}, Progress: {enrollment[3]}")

        # Check student progress
        cursor.execute("SELECT student_id, course_id, progress, completed FROM student_progress WHERE student_id = 11")
        progress_records = cursor.fetchall()

        print("\nStudent Progress for student_id=11:")
        for progress in progress_records:
            print(f"  Student: {progress[0]}, Course: {progress[1]}, Progress: {progress[2]}, Completed: {progress[3]}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()

if __name__ == "__main__":
    check_enrollment()