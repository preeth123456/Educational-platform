#!/usr/bin/env python
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

def test_model_access():
    try:
        # Test auth models
        from django.contrib.auth.models import User
        user_count = User.objects.count()
        print(f"[OK] Users table accessible: {user_count} users")
        
        # Test auth_app models
        from auth_app.models import Student, Educator
        student_count = Student.objects.count()
        educator_count = Educator.objects.count()
        print(f"[OK] Students table accessible: {student_count} students")
        print(f"[OK] Educators table accessible: {educator_count} educators")
        
        # Test courses models
        from courses.models import Course
        course_count = Course.objects.count()
        print(f"[OK] Courses table accessible: {course_count} courses")
        
        # Test virtual_classrooms models
        from virtual_classrooms.models import VirtualClassroom
        classroom_count = VirtualClassroom.objects.count()
        print(f"[OK] Virtual classrooms table accessible: {classroom_count} classrooms")
        
        # Test webhook_system models
        from webhook_system.models import WebhookEndpoint
        webhook_count = WebhookEndpoint.objects.count()
        print(f"[OK] Webhook endpoints table accessible: {webhook_count} endpoints")
        
        # Test public_api models
        from public_api.models import APIKey
        api_key_count = APIKey.objects.count()
        print(f"[OK] API keys table accessible: {api_key_count} API keys")
        
        print("\n[SUCCESS] All tables are accessible through Django models!")
        
    except Exception as e:
        print(f"[ERROR] Error accessing models: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_model_access()