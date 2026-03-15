from django.urls import path
from . import views

urlpatterns = [
    path('get_courses/', views.get_courses, name='get_courses'),
    path('admin/get_all_courses/', views.get_all_courses_admin, name='get_all_courses_admin'),
    path('add_course/', views.add_course, name='add_course'),
    path('enroll_course/', views.enroll_course, name='enroll_course'),
    path('my_courses/', views.my_courses, name='my_courses'),
    path('get_categories/', views.get_categories, name='get_categories'),
    path('dashboard_stats/', views.get_dashboard_stats, name='get_dashboard_stats'),
    path('update_enrollment_status/', views.update_enrollment_status, name='update_enrollment_status'),
    path('recent_activity/', views.recent_activity, name='recent_activity'),
    path('add_activity/', views.add_activity, name='add_activity'),
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('mark_notification_read/', views.mark_notification_read, name='mark_notification_read'),
    path('mark_all_notifications_read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
    path('admin_announcement/', views.send_admin_announcement, name='send_admin_announcement'),
    path('admin_announcements/', views.get_admin_announcements, name='get_admin_announcements'),
    path('admin_dashboard_metrics/', views.get_admin_dashboard_metrics, name='get_admin_dashboard_metrics'),
    path('teacher_lms_data/<str:teacher_id>/', views.get_teacher_lms_data, name='get_teacher_lms_data'),
    path('admin/approve/', views.approve_course, name='approve_course'),

    # New endpoints for progress tracking and quiz system
    path('update_progress/', views.update_progress, name='update_progress'),
    path('get_progress/', views.get_progress, name='get_progress'),
    path('save_video_progress/', views.save_video_progress, name='save_video_progress'),
    path('get_video_progress/', views.get_video_progress, name='get_video_progress'),
    path('save_quiz_result/', views.save_quiz_result, name='save_quiz_result'),
    path('get_student_quiz_stats/', views.get_student_quiz_stats, name='get_student_quiz_stats'),
    path('lesson-contents/create/', views.create_lesson_content, name='create_lesson_content'),
    path('lesson-contents/<int:content_id>/update/', views.update_lesson_content, name='update_lesson_content'),
    path('lesson-contents/', views.get_lesson_contents, name='get_lesson_contents'),
    path('get_teacher_courses/', views.get_teacher_courses, name='get_teacher_courses'),
    path('check_database/', views.check_database, name='check_database'),
    path('add_chapter/', views.add_chapter, name='add_chapter'),
    path('get_chapters/', views.get_chapters, name='get_chapters'),
    path('update_chapter/<int:chapter_id>/', views.update_chapter, name='update_chapter'),
    path('add_lesson/', views.add_lesson, name='add_lesson'),
    path('get_lessons/', views.get_lessons, name='get_lessons'),
    path('update_lesson/<int:lesson_id>/', views.update_lesson, name='update_lesson'),
    
    # Student Learning System APIs
    path('course/<str:course_id>/details/', views.get_course_details, name='get_course_details'),
    path('course/<str:course_id>/structure/', views.get_course_structure, name='get_course_structure'),
    path('course/<str:course_id>/enrollment/<int:student_id>/', views.check_enrollment, name='check_enrollment'),
    path('add_sample_video_content/', views.add_sample_video_content, name='add_sample_video_content'),
    path('all_students_usage/', views.all_students_usage, name='all_students_usage'),
]