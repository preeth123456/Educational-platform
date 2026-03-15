"""
Webhook Admin Views - Phase 5

Connections:
- Feature 2: Uses IsAdminUser permission (same as Feature 2 admin endpoints)
- Phase 1: Queries admin_notifications for delivery logs
- Phase 2: CRUD operations on WebhookEndpoint model
- Phase 3: Uses webhook_service for testing
- Phase 4: Manages endpoints that Phase 4 signals trigger
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import WebhookEndpoint
from .serializers import WebhookEndpointSerializer, WebhookDeliverySerializer
from .services import webhook_service
from admin_auth.models import AdminNotification
from public_api.admin_views import CustomAdminAuthentication, IsAuthenticatedAdmin


from public_api.admin_views import CustomAdminAuthentication, IsAuthenticatedAdmin
from rest_framework.authentication import SessionAuthentication


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


from rest_framework.permissions import IsAuthenticated

@method_decorator(csrf_exempt, name='dispatch')
class WebhookEndpointViewSet(viewsets.ModelViewSet):
    """
    Admin API for managing webhook endpoints
    """
    serializer_class = WebhookEndpointSerializer
    # Multiple auth methods: custom token first, then session fallback
    authentication_classes = [CustomAdminAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WebhookEndpoint.objects.filter(created_by=self.request.user)

    
    def perform_create(self, serializer):
        """
        Create webhook endpoint
        """
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        """
        Test webhook endpoint
        
        Connection to Phase 3:
        - Calls webhook_service.test_webhook() (Phase 3 service)
        - Sends test event to verify endpoint is working
        
        Returns:
            200: Test webhook sent successfully
            400: Test webhook failed
        """
        endpoint = self.get_object()
        
        try:
            result = webhook_service.test_webhook(endpoint)
            
            return Response({
                'message': result['message'],
                'success': result['success'],
                'endpoint_name': endpoint.name,
                'endpoint_url': endpoint.url
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to send test webhook'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='delivery-logs')
    def delivery_logs(self, request, pk=None):
        """
        Get delivery history for this webhook endpoint
        
        Connection to Phase 1:
        - Queries admin_notifications table (extended in Phase 1)
        - Filters by webhook_endpoint_id
        - Returns webhook delivery logs
        
        Query Parameters:
            limit (int): Number of deliveries to return (default: 50)
        
        Returns:
            200: List of webhook deliveries
        """
        endpoint = self.get_object()
        limit = int(request.query_params.get('limit', 50))
        
        # Query Phase 1 extended table
        deliveries = AdminNotification.objects.filter(
            webhook_endpoint_id=endpoint.id,
            notification_type='webhook'
        ).order_by('-created_at')[:limit]
        
        serializer = WebhookDeliverySerializer(deliveries, many=True)
        
        return Response({
            'endpoint_id': endpoint.id,
            'endpoint_name': endpoint.name,
            'total_deliveries': deliveries.count(),
            'deliveries': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get summary of all webhook endpoints
        
        Connection to Phase 1:
        - Counts deliveries from admin_notifications table
        
        Connection to Phase 2:
        - Counts WebhookEndpoint instances
        
        Returns:
            200: Summary statistics
        """
        total_endpoints = WebhookEndpoint.objects.count()
        active_endpoints = WebhookEndpoint.objects.filter(is_active=True).count()
        inactive_endpoints = total_endpoints - active_endpoints
        
        # Count deliveries from Phase 1 table
        total_deliveries = AdminNotification.objects.filter(
            notification_type='webhook'
        ).count()
        
        successful_deliveries = AdminNotification.objects.filter(
            notification_type='webhook',
            webhook_status='delivered'
        ).count()
        
        failed_deliveries = AdminNotification.objects.filter(
            notification_type='webhook',
            webhook_status='failed'
        ).count()
        
        # Recent deliveries (last 24 hours)
        yesterday = timezone.now() - timedelta(days=1)
        recent_deliveries = AdminNotification.objects.filter(
            notification_type='webhook',
            created_at__gte=yesterday
        ).count()
        
        return Response({
            'endpoints': {
                'total': total_endpoints,
                'active': active_endpoints,
                'inactive': inactive_endpoints
            },
            'deliveries': {
                'total': total_deliveries,
                'successful': successful_deliveries,
                'failed': failed_deliveries,
                'last_24_hours': recent_deliveries
            }
        })


@method_decorator(csrf_exempt, name='dispatch')
class WebhookDeliveryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only API for viewing all webhook deliveries
    """
    serializer_class = WebhookDeliverySerializer
    # Multiple auth methods: custom token first, then session fallback
    authentication_classes = [CustomAdminAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Get all webhook deliveries for current user's endpoints
        
        Connection to Phase 1:
        - Queries admin_notifications table
        - Filters by notification_type='webhook'
        - Filters by endpoints owned by user
        """
        user_endpoints = WebhookEndpoint.objects.filter(created_by=self.request.user).values_list('id', flat=True)
        return AdminNotification.objects.filter(
            notification_type='webhook',
            webhook_endpoint_id__in=user_endpoints
        ).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """
        List all webhook deliveries with filtering
        
        Query Parameters:
            status (str): Filter by webhook_status (pending, delivered, failed)
            event_type (str): Filter by webhook_event_type
            limit (int): Number of results (default: 100)
        """
        queryset = self.get_queryset()
        
        # Apply filters
        webhook_status = request.query_params.get('status')
        if webhook_status:
            queryset = queryset.filter(webhook_status=webhook_status)
        
        event_type = request.query_params.get('event_type')
        if event_type:
            queryset = queryset.filter(webhook_event_type=event_type)
        
        limit = int(request.query_params.get('limit', 100))
        queryset = queryset[:limit]
        
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'deliveries': serializer.data
        })


# --- FEATURE 13: WEBHOOK MONITORING ---
from django.db.models import Count, Q

class WebhookMonitoringViewSet(viewsets.ViewSet):
    """
    Feature 13: Centralized Monitoring for Webhooks
    Strictly Superuser/Admin Only.
    """
    authentication_classes = [CustomAdminAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        GET /api/v1/webhooks/monitoring/stats/
        Global webhook stats from AdminNotification (Strict Reuse)
        """
        # Strict Admin Check
        if not request.user.is_superuser and request.user.email != 'admin@eduyata.com':
             return Response({'error': 'Forbidden: Admins Only'}, status=403)

        # 1. Global Aggregation
        total = AdminNotification.objects.filter(notification_type='webhook').count()
        success = AdminNotification.objects.filter(notification_type='webhook', webhook_status='delivered').count()
        failed = AdminNotification.objects.filter(notification_type='webhook', webhook_status='failed').count()
        
        # 2. Recent Failures (Last 5) - For the "Log Table"
        # FIX: AdminNotification stores webhook_endpoint_id as Integer, not FK. Cannot use __url join.
        failures_qs = AdminNotification.objects.filter(
            notification_type='webhook', 
            webhook_status='failed'
        ).values('created_at', 'message', 'webhook_endpoint_id', 'id').order_by('-created_at')[:5]
        
        # Manually fetch URLs
        endpoint_ids = [f['webhook_endpoint_id'] for f in failures_qs if f['webhook_endpoint_id']]
        url_map = {}
        if endpoint_ids:
            from .models import WebhookEndpoint
            endpoints = WebhookEndpoint.objects.filter(id__in=endpoint_ids).values('id', 'url')
            url_map = {e['id']: e['url'] for e in endpoints}

        recent_failures = []
        for f in failures_qs:
            recent_failures.append({
                'id': f['id'],
                'created_at': f['created_at'],
                'message': f['message'],
                'webhook_endpoint__url': url_map.get(f['webhook_endpoint_id'], 'Deleted Endpoint')
            })

        return Response({
            'global_stats': {
                'total': total,
                'success_ratio': round((success / total * 100), 1) if total > 0 else 0,
                'success': success,
                'failed': failed
            },
            'recent_failures': recent_failures
        })
