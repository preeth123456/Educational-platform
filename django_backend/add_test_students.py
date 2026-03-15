import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from auth_app.models import Student

def add_test_students():
    # Create test students if they don't exist
    test_students = [
        {'name': 'Alice Johnson', 'email': 'alice@example.com', 'password': 'password123'},
        {'name': 'Bob Smith', 'email': 'bob@example.com', 'password': 'password123'},
        {'name': 'Charlie Brown', 'email': 'charlie@example.com', 'password': 'password123'},
        {'name': 'Diana Prince', 'email': 'diana@example.com', 'password': 'password123'},
        {'name': 'Eve Wilson', 'email': 'eve@example.com', 'password': 'password123'},
    ]
    
    for student_data in test_students:
        student, created = Student.objects.get_or_create(
            email=student_data['email'],
            defaults={
                'name': student_data['name'],
                'password': student_data['password']
            }
        )
        if created:
            print(f"Created student: {student.name}")
        else:
            print(f"Student already exists: {student.name}")

if __name__ == "__main__":
    add_test_students()
    print("Test students added successfully!")