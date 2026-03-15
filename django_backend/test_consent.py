#!/usr/bin/env python3
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

def test_consent_api():
    """Test the consent API functionality"""
    try:
        # Test 1: Import models
        from auth_app.models import StudentConsent, ConsentHistory, Student
        print("✓ Models imported successfully")
        
        # Test 2: Check if student exists
        try:
            student = Student.objects.get(id=11)
            print(f"✓ Student found: {student.name}")
        except Student.DoesNotExist:
            print("✗ Student with ID 11 not found")
            return
        
        # Test 3: Test consent creation
        consent, created = StudentConsent.objects.get_or_create(
            student_id=11,
            consent_type='data_collection',
            defaults={'is_granted': False}
        )
        print(f"✓ Consent record: {'created' if created else 'exists'}")
        
        # Test 4: Test API view
        from auth_app.consent_views import consent_status
        from django.test import RequestFactory
        
        factory = RequestFactory()
        request = factory.get('/api/auth/consent_status/?student_id=11')
        
        response = consent_status(request)
        print(f"✓ API response status: {response.status_code}")
        print(f"✓ API response data: {response.data}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_consent_api()