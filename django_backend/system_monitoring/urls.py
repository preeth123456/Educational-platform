from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.get_system_health, name='system_health'),
    path('metrics/history/', views.get_metrics_history, name='metrics_history'),
    path('alerts/', views.get_system_alerts, name='system_alerts'),
    path('alerts/<int:alert_id>/acknowledge/', views.acknowledge_alert, name='acknowledge_alert'),
    path('alerts/<int:alert_id>/resolve/', views.resolve_alert, name='resolve_alert'),
    path('logs/', views.get_system_logs, name='system_logs'),
    path('dashboard/stats/', views.get_dashboard_stats, name='dashboard_stats'),
]