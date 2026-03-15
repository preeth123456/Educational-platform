# BREACH NOTIFICATION FILE - This file defines breach notification URL patterns

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BreachReportViewSet, BreachNotificationViewSet, create_breach_report

router = DefaultRouter()
router.register(r'reports', BreachReportViewSet)
router.register(r'notifications', BreachNotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-report/', create_breach_report, name='create_breach_report'),
]
