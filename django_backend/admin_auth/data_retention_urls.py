from django.urls import path
from auth_app import data_retention_views

urlpatterns = [
    # Admin Data Retention URLs
    path('deletion_requests/', data_retention_views.get_deletion_requests, name='admin_deletion_requests'),
    path('process_deletion/', data_retention_views.process_deletion, name='admin_process_deletion'),
]