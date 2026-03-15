"""
Integration URLs - Phase 5

Connections:
- Phase 5: Routes to IntegrationViewSet
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IntegrationViewSet
from .monitoring_views import IntegrationMonitoringViewSet

router = DefaultRouter()
router.register(r'integrations', IntegrationViewSet, basename='integrations')
router.register(r'integrations/monitoring', IntegrationMonitoringViewSet, basename='integration-monitoring')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]
