from django.urls import path
from . import views, navigation_views

urlpatterns = [
    path('summarize/', views.summarize_content, name='summarize_content'),
    path('explain/', views.explain_topic, name='explain_topic'),
    path('questions/', views.generate_questions, name='generate_questions'),
    path('tips/', views.get_study_tips, name='get_study_tips'),
    path('navigate/', navigation_views.process_navigation_command, name='navigation_command'),
    path('suggestions/', navigation_views.get_personalized_suggestions, name='navigation_suggestions'),
]