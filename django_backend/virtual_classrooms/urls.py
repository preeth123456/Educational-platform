from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_classroom, name='create_classroom'),
    path('teacher/', views.teacher_classrooms, name='teacher_classrooms'),
    path('join/', views.join_classroom, name='join_classroom'),
    path('my-classrooms/', views.student_classrooms, name='student_classrooms'),
    path('<int:classroom_id>/sessions/', views.classroom_sessions, name='classroom_sessions'),
    path('<int:classroom_id>/sessions/create/', views.create_session, name='create_session'),
    path('<int:classroom_id>/announcements/', views.classroom_announcements, name='classroom_announcements'),
    path('<int:classroom_id>/announcements/create/', views.create_announcement, name='create_announcement'),
    path('<int:classroom_id>/resources/', views.classroom_resources, name='classroom_resources'),
    path('<int:classroom_id>/resources/create/', views.create_resource, name='create_resource'),
    path('<int:classroom_id>/conferences/', views.classroom_conferences, name='classroom_conferences'),
    path('<int:classroom_id>/conferences/create/', views.create_conference, name='create_conference'),
    path('conferences/<int:conference_id>/start/', views.start_conference, name='start_conference'),
    path('conferences/<int:conference_id>/join/', views.join_conference, name='join_conference'),
    path('conferences/<int:conference_id>/end/', views.end_conference, name='end_conference'),
]