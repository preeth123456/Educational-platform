from django.urls import path
from courses.views import add_course
from . import views
from .teacher_lms_views import (
    get_teacher_classes, create_topic, update_topic, delete_topic
)

urlpatterns = [
    path('create/', add_course, name='add_course'),
    path('my-courses/', views.get_teacher_courses, name='get_teacher_courses'),
    
    # Teacher LMS - Classes and Topics
    path('classes/<int:teacher_id>/', get_teacher_classes, name='get_teacher_classes'),
    path('topics/create/', create_topic, name='create_topic'),
    path('topics/<int:topic_id>/update/', update_topic, name='update_topic'),
    path('topics/<int:topic_id>/delete/', delete_topic, name='delete_topic'),
]
