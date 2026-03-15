from django.urls import path, include
from . import views
from . import preferences_views
from . import teacher_dashboard_views
from . import simple_badge_views
from . import endorsement_views
from . import student_views
from . import data_retention_views
from . import audit_views
from . import realtime_audit_views
from . import context_views
from . import encryption_views
from . import consent_views
from . import lockout_views


urlpatterns = [
    path('enhanced/', include('auth_app.enhanced_audit_urls')),
    path('student_login/', views.student_login, name='student_login'),
    path('student_register/', views.student_register, name='student_register'),
    path('get_student/', views.get_student, name='get_student'),
    path('update_student/', views.update_student, name='update_student'),
    path('get_study_time/', views.get_study_time, name='get_study_time'),
    path('change_password/', views.change_password, name='change_password'),
    path('get_teacher/', views.get_teacher, name='get_teacher'),
    path('update_teacher/', views.update_teacher, name='update_teacher'),
    path('complete_profile/', views.complete_profile, name='complete_profile'),
    path('teacher_register/', views.teacher_register, name='teacher_register'),
    path('teacher-register/', views.teacher_register, name='teacher_register_dash'),
    path('teacher_login/', views.teacher_login, name='teacher_login'),
    path('teacher-login/', views.teacher_login, name='teacher_login_dash'),
    path('admin/teachers/', views.get_teachers_for_admin, name='get_teachers_for_admin'),
    path('admin/teacher-statistics/', views.get_teacher_statistics, name='get_teacher_statistics'),
    path('admin/all-teachers/', views.get_all_teachers_with_details, name='get_all_teachers_with_details'),
    path('teacher_scope/<str:teacher_id>/', views.get_teacher_scope, name='teacher_scope'),
    path('chapters/<str:board>/<str:class_level>/<str:subject>/', views.get_chapters, name='get_chapters'),
    path('lessons/<str:board>/<str:class_level>/<str:subject>/<str:chapter>/', views.get_lessons, name='get_lessons'),
     path('get_user_preferences/', preferences_views.get_user_preferences, name='get_user_preferences'),
    path('update_user_preferences/', preferences_views.update_user_preferences, name='update_user_preferences'),
    path('teacher-dashboard-stats/<str:teacher_id>/', teacher_dashboard_views.get_teacher_dashboard_stats, name='teacher_dashboard_stats'),
    
    # Badge URLs
    path('badges/student/', simple_badge_views.get_student_badges, name='get_student_badges'),
    path('badges/available/', simple_badge_views.get_available_badges, name='get_available_badges'),
    path('badges/check-triggers/', simple_badge_views.check_badge_triggers, name='check_badge_triggers'),
    path('badges/leaderboard/', simple_badge_views.get_badge_leaderboard, name='get_badge_leaderboard'),
    path('badges/initialize/', simple_badge_views.initialize_badges, name='initialize_badges'),
    path('badges/stats/', simple_badge_views.get_badge_stats, name='get_badge_stats'),
    
    # Endorsement URLs
    path('endorsements/create/', endorsement_views.create_endorsement, name='create_endorsement'),
    path('endorsements/student/', endorsement_views.get_student_endorsements, name='get_student_endorsements'),
    path('endorsements/teacher/', endorsement_views.get_teacher_endorsements, name='get_teacher_endorsements'),
    path('endorsements/skills/', endorsement_views.get_available_skills, name='get_available_skills'),
    path('endorsements/stats/', endorsement_views.get_endorsement_stats, name='get_endorsement_stats'),
    
    # Student URLs
    path('students/all/', student_views.get_all_students, name='get_all_students'),
    path('students/dashboard-stats/', student_views.dashboard_stats, name='dashboard_stats'),
    path('students/dashboard-stats', student_views.dashboard_stats, name='dashboard_stats_no_slash'),
    
    # Schedule URLs
    path('get_schedules/', views.get_schedules, name='get_schedules'),
    path('create_schedule/', views.create_schedule, name='create_schedule'),
    
    # Data Retention URLs
    path('export_data/', data_retention_views.export_data, name='export_data'),
    path('download_data/<int:export_id>/', data_retention_views.download_data, name='download_data'),
    path('export_status/<int:export_id>/', data_retention_views.get_export_status, name='export_status'),
    path('request_deletion/', data_retention_views.request_deletion, name='request_deletion'),
    path('cancel_deletion/', data_retention_views.cancel_deletion, name='cancel_deletion'),
    path('deletion_status/', data_retention_views.get_deletion_status, name='deletion_status'),
    path('retention_policies/', data_retention_views.get_retention_policies, name='retention_policies'),
    path('retention_stats/', data_retention_views.get_retention_stats, name='retention_stats'),
    path('export_history/', data_retention_views.get_export_history, name='export_history'),
    path('delete_export/<int:export_id>/', data_retention_views.delete_export_request, name='delete_export'),
    path('admin/all_exports/', data_retention_views.get_all_exports_admin, name='admin_all_exports'),
    path('admin/deletion_requests/', data_retention_views.get_deletion_requests, name='admin_deletion_requests'),
    path('admin/process_deletion/', data_retention_views.process_deletion, name='admin_process_deletion'),
    # Audit URLs
    path('activity_history/', audit_views.activity_history, name='activity_history'),
    path('security_events/', audit_views.security_events, name='security_events'),
    
    # Real-time Audit URLs
    path('realtime_activity_history/', realtime_audit_views.realtime_activity_history, name='realtime_activity_history'),
    path('activity_stats/', realtime_audit_views.get_activity_stats, name='get_activity_stats'),
    
    # Notification URLs
    path('student-notifications/', views.get_student_notifications, name='get_student_notifications'),
    
    # Board and Class URLs
    path('get_boards/', views.get_boards, name='get_boards'),
    path('get_classes/', views.get_classes, name='get_classes'),
    
    # Activity Logging URL
    path('log_activity/', views.log_student_activity, name='log_student_activity'),

    # Context Switching URLs
    path('contexts/available/', context_views.get_available_contexts, name='get_available_contexts'),
    path('contexts/current/', context_views.get_current_context, name='get_current_context'),
    path('contexts/switch/', context_views.switch_context, name='switch_context'),
    path('contexts/initialize/', context_views.initialize_contexts, name='initialize_contexts'),

    # Encryption URLs
    path('rotate_encryption_key/', encryption_views.rotate_encryption_key, name='rotate_encryption_key'),
    path('security_status/', encryption_views.security_status, name='security_status'),
    path('encrypt_existing_data/', encryption_views.encrypt_existing_data, name='encrypt_existing_data'),
    path('user_security_status/', encryption_views.user_security_status, name='user_security_status'),
    
    # Consent Management URLs
    path('consent_status/', consent_views.consent_status, name='consent_status'),
    path('update_consent/', consent_views.update_consent, name='update_consent'),
    path('bulk_consent/', consent_views.bulk_consent, name='bulk_consent'),
    path('consent_history/', consent_views.consent_history, name='consent_history'),
    
    # Account Lockout URLs
    path('lockouts/', lockout_views.get_account_lockouts, name='get_account_lockouts'),
    path('lockouts/unlock/', lockout_views.unlock_account, name='unlock_account'),
    path('lockouts/history/', lockout_views.get_login_history, name='get_login_history'),
    path('lockouts/fraud-events/', lockout_views.get_fraud_events, name='get_fraud_events'),

]