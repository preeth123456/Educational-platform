from django.urls import path, include
from . import views
from . import admin_dashboard_views
from . import audit_views
from . import frontend_views
from . import backup_settings

urlpatterns = [
    path('login/', views.admin_login, name='admin_login'),
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('logout/', views.admin_logout, name='admin_logout'),
    
    # Frontend pages
    path('students-page/', frontend_views.admin_students_page, name='admin_students_page'),
    path('test/', frontend_views.test_admin_page, name='test_admin_page'),
    
    # Teacher management endpoints
    path('teachers/', views.get_teachers, name='get_teachers'),
    path('teachers/<str:teacher_id>/documents/', views.get_teacher_documents, name='get_teacher_documents'),
    path('teachers/<str:teacher_id>/status/', views.update_teacher_status, name='update_teacher_status'),
    path('verify_documents/<int:teacher_id>/', views.verify_documents, name='verify_documents'),
    path('approve_teacher/<int:teacher_id>/', views.approve_teacher, name='approve_teacher'),
    path('reject_teacher/<int:teacher_id>/', views.reject_teacher, name='reject_teacher'),
    
    # Student management endpoints
    path('students/', views.get_students, name='get_students'),
    path('students/<int:student_id>/', views.get_student_detail, name='get_student_detail'),
    path('students/<int:student_id>/delete/', views.delete_student, name='delete_student'),
    path('export/student-data/', views.export_student_data, name='export_student_data'),
    
    # Admin management endpoints
    path('admins/', views.get_admins, name='get_admins'),
    path('add_admin/', views.add_admin, name='add_admin'),
    
    # Dashboard stats
    path('dashboard-stats/', views.dashboard_stats, name='admin_dashboard_stats'),
    
    # Missing endpoints
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark_notification_read'),
    path('backup/history/', views.get_backup_history, name='get_backup_history'),
    path('backup/stats/', views.get_backup_stats, name='get_backup_stats'),
    path('backup/settings/', backup_settings.get_backup_settings, name='get_backup_settings'),
    path('backup/settings/save/', backup_settings.save_backup_settings, name='save_backup_settings'),
    path('backup/create/', views.create_backup, name='create_backup'),
    path('backup/download/<str:filename>/', views.download_backup, name='download_backup'),
    
    # Audit endpoints
    path('audit_logs/', audit_views.audit_logs, name='audit_logs'),
    path('audit_summary/', audit_views.audit_summary, name='audit_summary'),
    path('resolve_security_event/', audit_views.resolve_security_event, name='resolve_security_event'),
    path('security_events/', audit_views.security_events_admin, name='security_events_admin'),
]