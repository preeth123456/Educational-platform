from django.urls import path
from . import views, support_views, grievance_views

urlpatterns = [
    # Project Management URLs
    path('teacher-projects/', views.teacher_projects, name='teacher_projects'),
    path('create-project-group/', views.create_project_group, name='create_project_group'),
    path('project-details/<int:project_id>/', views.project_details, name='project_details'),
    path('upload-project-document/', views.upload_project_document, name='upload_project_document'),
    path('student-projects/', views.student_projects, name='student_projects'),
    path('delete-group/<int:group_id>/', views.delete_group, name='delete_group'),
    path('get-students/', views.get_students, name='get_students'),
    path('student-project-groups-chat/', views.student_project_groups_for_chat, name='student_project_groups_chat'),
    
    # Existing Collaboration URLs
    path('groups/', views.collaboration_groups, name='collaboration_groups'),
    
    # Support Ticket URLs
    path('support/tickets/create/', support_views.create_ticket),
    path('support/tickets/response/', support_views.add_response),
    path('support/tickets/status/', support_views.update_status),
    path('support/tickets/<str:ticket_id>/delete/', support_views.delete_ticket),
    path('support/tickets/<str:ticket_id>/', support_views.get_ticket_details),
    path('support/tickets/', support_views.get_tickets),
    
    # Grievance Management URLs
    path('grievances/submit/', grievance_views.submit_grievance, name='submit_grievance'),
    path('grievances/', grievance_views.get_grievances, name='get_grievances'),
    path('grievances/<str:case_id>/delete/', grievance_views.delete_grievance, name='delete_grievance'),
    path('grievances/<str:case_id>/', grievance_views.get_grievance_details, name='get_grievance_details'),
    path('grievances/status/update/', grievance_views.update_grievance_status, name='update_grievance_status'),
    path('grievances/assign/', grievance_views.assign_investigator, name='assign_investigator'),
    path('grievances/investigate/', grievance_views.update_investigation, name='update_investigation'),
    path('grievances/resolve/', grievance_views.resolve_grievance, name='resolve_grievance'),
    path('grievances/notifications/', grievance_views.get_notifications, name='get_grievance_notifications'),
]