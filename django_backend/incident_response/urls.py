# INCIDENT DETECTION FILE - URL routing for incident APIs
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SecurityIncidentViewSet, LoginAttemptViewSet, AccountLockViewSet

router = DefaultRouter()
router.register(r'incidents', SecurityIncidentViewSet)
router.register(r'login-attempts', LoginAttemptViewSet)
router.register(r'account-locks', AccountLockViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
