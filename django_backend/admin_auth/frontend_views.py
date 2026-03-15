from django.shortcuts import render
from django.http import HttpResponse

def admin_students_page(request):
    """Serve the admin students management page"""
    return render(request, 'admin_students.html')

def test_admin_page(request):
    """Serve the test admin page"""
    return render(request, 'test_admin.html')