"""
Webhook URLs - Phase 5

Connections:
- Feature 1: Coexists with Feature 1 routes at /api/v1/
- No conflicts with Feature 1 public API routes
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebhookEndpointViewSet, WebhookDeliveryViewSet, WebhookMonitoringViewSet

# Create router for webhook endpoints
webhook_router = DefaultRouter()
webhook_router.register(r'endpoints', WebhookEndpointViewSet, basename='webhook-endpoints')
webhook_router.register(r'deliveries', WebhookDeliveryViewSet, basename='webhook-deliveries')
webhook_router.register(r'monitoring', WebhookMonitoringViewSet, basename='webhook-monitoring')

urlpatterns = [
    path('api/v1/webhooks/', include(webhook_router.urls)),
]
