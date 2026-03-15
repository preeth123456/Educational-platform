from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from public_api.admin_views import CustomAdminAuthentication
from .models import Integration
from third_party_connectors.models import SyncJobNotification

class IntegrationMonitoringViewSet(viewsets.ViewSet):
    """
    Feature 13: Centralized Monitoring for Integrations
    Strict Rule: Reuse existing log tables (SyncJobNotification)
    """
    authentication_classes = [CustomAdminAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def health(self, request):
        """
        GET /api/v1/integrations/monitoring/health/
        Returns health status of all integrations based on last sync job.
        """
        # Strict Admin Check
        if not request.user.is_superuser and request.user.email != 'admin@eduyata.com':
             return Response({'error': 'Forbidden'}, status=403)

        integrations = Integration.objects.all()
        data = []

        for integ in integrations:
            # Get last sync job from existing notification table
            # "Reuse existing infrastructure"
            last_job = SyncJobNotification.objects.filter(
                teacher_id=str(integ.id),
                notification_type='sync_job'
            ).order_by('-created_at').first()
            
            data.append({
                'id': integ.id,
                'name': integ.name,
                'status': integ.status, # active/inactive from Integration model
                'last_sync': {
                    'status': last_job.status if last_job else 'never_run',
                    'time': last_job.created_at if last_job else None,
                    'records': last_job.processed_records if last_job else 0,
                    'duration': last_job.duration_seconds if last_job else 0,
                    'message': last_job.message if last_job else ''
                }
            })

        return Response(data)
