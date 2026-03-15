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

def check_admin_statistics():
    """Check the exact statistics as calculated in admin views"""
    
    all_teachers = Educator.objects.all()
    
    # This is the exact logic from admin_auth/views.py get_teachers function
    pending_teachers = all_teachers.filter(is_active=False, document_status__in=['Pending', '']).count()
    approved_teachers = all_teachers.filter(is_active=True).count()
    verified_pending = all_teachers.filter(is_active=False, document_status='Verified').count()
    rejected_teachers = all_teachers.filter(document_status='Rejected').count()
    
    print("=== ADMIN STATISTICS (as calculated in views.py) ===")
    print(f"pending_teachers (Verify Teachers card): {pending_teachers}")
    print(f"verified_pending (Pending Approvals card): {verified_pending}")
    print(f"approved_teachers: {approved_teachers}")
    print(f"rejected_teachers: {rejected_teachers}")
    print(f"total_teachers: {all_teachers.count()}")
    
    print("\n=== DETAILED BREAKDOWN ===")
    
    # Show which teachers fall into each category
    pending_list = all_teachers.filter(is_active=False, document_status__in=['Pending', ''])
    print(f"\nVERIFY TEACHERS ({pending_list.count()} teachers):")
    for teacher in pending_list:
        print(f"  - {teacher.name} (ID: {teacher.teacher_id}) - Status: '{teacher.document_status}' - Active: {teacher.is_active}")
    
    verified_list = all_teachers.filter(is_active=False, document_status='Verified')
    print(f"\nPENDING APPROVALS ({verified_list.count()} teachers):")
    for teacher in verified_list:
        print(f"  - {teacher.name} (ID: {teacher.teacher_id}) - Status: '{teacher.document_status}' - Active: {teacher.is_active}")

if __name__ == "__main__":
    try:
        check_admin_statistics()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()