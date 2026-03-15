from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from teacher_local_api import get_teacher_documents_local, get_all_teachers_local
from teacher_file_upload import teacher_register_with_files
from test_view import test_endpoint
from user_preferences_views import get_user_preferences, update_user_preferences
from fix_features import fix_feature_assignments
from feature_flags_views import (
    get_feature_flags, create_feature_flag, toggle_feature_flag,
    get_students, assign_feature_to_users, get_feature_usage, check_feature_flag, log_feature_usage
)

def simple_test(request):
    if request.method == "POST":
        try:
            import pymysql
            import random
            
            # Get form data
            name = request.POST.get('name', '')
            email = request.POST.get('email', '')
            mobile = request.POST.get('mobile', '')
            password = request.POST.get('password', '')
            
            if not all([name, email, mobile, password]):
                return JsonResponse({"error": "Missing fields"}, status=400)
            
            # Database connection
            conn = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            
            cursor = conn.cursor()
            
            # Check if email exists
            cursor.execute("SELECT COUNT(*) FROM educators WHERE email = %s", (email,))
            if cursor.fetchone()[0] > 0:
                conn.close()
                return JsonResponse({"error": "Email already exists"}, status=400)
            
            # Insert teacher
            teacher_id = f"TCH{random.randint(100000, 999999)}"
            cursor.execute(
                "INSERT INTO educators (teacher_id, name, email, mobile, password_hash, profile_completed) VALUES (%s, %s, %s, %s, %s, %s)",
                (teacher_id, name, email, mobile, password, 1)
            )
            conn.commit()
            conn.close()
            
            return JsonResponse({
                "message": "Teacher registered successfully",
                "data": {
                    "role": "teacher",
                    "teacher_id": teacher_id,
                    "name": name,
                    "email": email,
                    "profile_completed": True
                }
            }, status=201)
            
        except Exception as e:
            return JsonResponse({"error": f"Registration failed: {str(e)}"}, status=500)
    
    return JsonResponse({"message": "GET request works"}, status=200)

urlpatterns = [
    path('api/audit/', include('auth_app.enhanced_audit_urls')),
    path('', include('webhook_system.urls')),  # Feature 3: Webhook Framework
    path('', include('public_api.urls')),  # Feature 1: Public API Framework
    path('', include('integration_marketplace.urls')),  # Feature 4: Integration Marketplace
    path('admin/', admin.site.urls),
    path('api/courses/', include('courses.urls')),
    path('api/teacher/courses/', include('courses.teacher_urls')),
    path('api/auth/', include('auth_app.urls')),
    path('api/security/', include('auth_app.security_urls')),
    path('api/auth/social/', include('social_auth.urls')),  # SSO routes
    path('api/admin/', include('admin_auth.urls')),
    path('api/admin/data-retention/', include('admin_auth.data_retention_urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/collaboration/', include('collaboration.urls')),
    path('api/classrooms/', include('virtual_classrooms.urls')),
    path('api/notifications/', include('notifications.urls')),  # Notification Service
    path('api/session/', include('session_management.urls')),  # Session & Device Management
    path('', include('public_api.urls')),  # Feature 1: Public API Framework
    path('', include('webhook_system.urls')),  # Feature 3: Webhook Framework
    path('api/admin/config/', include('platform_config.urls')),  # Feature 13: Platform Configuration APIs
    path('api/compliance/', include('compliance.urls')),
    # path('api/incidents/', include('incident_response.urls')),
    # path('api/breach/', include('breach_notification.urls')),
    path('api/teacher/register-files/', teacher_register_with_files),
    path('api/teacher/documents-local/<str:teacher_id>/', get_teacher_documents_local),
    path('api/admin/teachers/local/', get_all_teachers_local),
    path('api/incidents/', include('incident_response.urls')),
    path('api/breach/', include('breach_notification.urls')),
    path('api/monitoring/', include('system_monitoring.urls')),  # System Health Monitoring (sample data)
    path('', include('third_party_connectors.urls')),  # Feature 5: Third-Party Connectors
    path('', include('pricing.urls')),  # Product Catalog & Pricing Plans
    
    # Test endpoint
    path('api/test/', test_endpoint, name='test_endpoint'),
    
    # Fix feature assignments
    path('api/fix-features/', fix_feature_assignments, name='fix_feature_assignments'),
    
    # User Preferences API
    path('api/auth/get_user_preferences/', get_user_preferences, name='get_user_preferences'),
    path('api/auth/update_user_preferences/', update_user_preferences, name='update_user_preferences'),
    
    # Feature Flags API endpoints
    path('api/feature-flags/', get_feature_flags, name='get_feature_flags'),
    path('api/feature-flags/create/', create_feature_flag, name='create_feature_flag'),
    path('api/feature-flags/toggle/', toggle_feature_flag, name='toggle_feature_flag'),
    path('api/feature-flags/students/', get_students, name='get_students'),
    path('api/feature-flags/assign/', assign_feature_to_users, name='assign_feature_to_users'),
    path('api/feature-flags/usage/', get_feature_usage, name='get_feature_usage'),
    path('api/feature-flags/check/', check_feature_flag, name='check_feature_flag'),
    path('api/feature-flags/log-usage/', log_feature_usage, name='log_feature_usage'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)