from django.urls import path
from notifications import views

urlpatterns = [
    # Get notifications for a user
    path('', views.get_notifications, name='get_notifications'),
    
    # Mark single notification as read
    path('<int:notification_id>/read/', views.mark_as_read, name='mark_as_read'),
    
    # Mark all notifications as read
    path('read-all/', views.mark_all_read, name='mark_all_read'),
    
    # Create a notification (admin/system use)
    path('create/', views.create_notification, name='create_notification'),
]
