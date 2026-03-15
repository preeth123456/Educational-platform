#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from auth_app.models import Educator

def get_teacher_lists():
    """Get teachers by status categories"""
    
    # Get all teachers
    all_teachers = Educator.objects.all()
    
    print("=== TEACHER STATUS BREAKDOWN ===\n")
    
    # Verify Teachers (pending status)
    pending_teachers = all_teachers.filter(is_active=False, document_status__in=['Pending', 'Pending Verification', ''])
    print(f"VERIFY TEACHERS (Pending Status): {pending_teachers.count()} teachers")
    print("These are newly registered teachers awaiting initial document verification:")
    for i, teacher in enumerate(pending_teachers, 1):
        print(f"  {i}. {teacher.name} (ID: {teacher.teacher_id}) - Status: {teacher.document_status or 'Pending'}")
    
    print("\n" + "="*60 + "\n")
    
    # Pending Approvals (document_verified status)
    verified_pending = all_teachers.filter(is_active=False, document_status='Verified')
    print(f"PENDING APPROVALS (Document Verified): {verified_pending.count()} teachers")
    print("These teachers have verified documents but await final approval:")
    for i, teacher in enumerate(verified_pending, 1):
        print(f"  {i}. {teacher.name} (ID: {teacher.teacher_id}) - Status: {teacher.document_status}")
    
    print("\n" + "="*60 + "\n")
    
    # Additional categories for completeness
    approved_teachers = all_teachers.filter(is_active=True)
    print(f"APPROVED TEACHERS: {approved_teachers.count()} teachers")
    for i, teacher in enumerate(approved_teachers, 1):
        print(f"  {i}. {teacher.name} (ID: {teacher.teacher_id}) - Active: {teacher.is_active}")
    
    print("\n" + "="*60 + "\n")
    
    rejected_teachers = all_teachers.filter(document_status='Rejected')
    print(f"REJECTED TEACHERS: {rejected_teachers.count()} teachers")
    for i, teacher in enumerate(rejected_teachers, 1):
        print(f"  {i}. {teacher.name} (ID: {teacher.teacher_id}) - Status: {teacher.document_status}")
    
    print("\n" + "="*60 + "\n")
    print(f"TOTAL TEACHERS: {all_teachers.count()}")

if __name__ == "__main__":
    try:
        get_teacher_lists()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()