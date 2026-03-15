from django.urls import path
from . import views, auth_views

urlpatterns = [
    # Authentication with session tracking
    path('auth/student-login/', auth_views.student_login_with_session, name='student_login_with_session'),
    path('auth/teacher-login/', auth_views.teacher_login_with_session, name='teacher_login_with_session'),
    
    
    # Authentication
    path('auth/enhanced-login/', views.enhanced_login, name='enhanced_login'),
    path('auth/logout/', views.logout, name='logout'),
    
    # Session Management
    path('sessions/active/', views.get_active_sessions, name='get_active_sessions'),
    path('sessions/revoke/', views.revoke_session, name='revoke_session'),
    
    # Device Management
    path('devices/list/', views.get_user_devices, name='get_user_devices'),
    path('devices/trust/', views.trust_device, name='trust_device'),
    
    # Admin Endpoints
    path('admin/sessions/all/', views.admin_get_all_sessions, name='admin_get_all_sessions'),
    path('admin/sessions/revoke/', views.admin_revoke_session, name='admin_revoke_session'),
    path('admin/devices/all/', views.admin_get_all_devices, name='admin_get_all_devices'),
    
    # Policies
    path('policies/', views.get_session_policies, name='get_session_policies'),
    path('policies/update/', views.update_session_policies, name='update_session_policies'),
]
