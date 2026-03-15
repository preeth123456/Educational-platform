"""
Integration Views - Phase 5

Connections:
- Phase 2: Uses Integration model
- Phase 4: Uses IntegrationService
- Feature 2: Uses IsAdminUser permission (same pattern)
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Integration
from .serializers import IntegrationSerializer, IntegrationCreateSerializer, IntegrationSecretsUpdateSerializer
from .services import integration_service
from admin_auth.models import AdminNotification
from public_api.admin_views import CustomAdminAuthentication, IsAuthenticatedAdmin
import logging

logger = logging.getLogger(__name__)


from public_api.admin_views import CustomAdminAuthentication, IsAuthenticatedAdmin
from rest_framework.authentication import SessionAuthentication


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.permissions import IsAuthenticated

@method_decorator(csrf_exempt, name='dispatch')
class IntegrationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing integrations
    """
    
    serializer_class = IntegrationSerializer
    # Multiple auth methods: custom token first, then session fallback
    authentication_classes = [CustomAdminAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Get integrations for current user
        """
        return Integration.objects.filter(installed_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """
        List available integration types
        
        GET /api/v1/integrations/available/
        
        Connection to Phase 4: Uses integration_service.get_available_integrations()
        """
        print(f"DEBUG VIEWS: /available hit. User: {request.user}, Auth: {request.auth}")
        available = integration_service.get_available_integrations()
        return Response(available)
    
    def create(self, request):
        """
        Install integration
        
        POST /api/v1/integrations/
        """
        serializer = IntegrationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # Install integration using Phase 4 service
            instance = integration_service.install_integration(
                integration_type=serializer.validated_data['integration_type'],
                user=request.user,
                configuration=serializer.validated_data['configuration']
            )
            
            # Return created integration
            output_serializer = IntegrationSerializer(instance)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Failed to install integration: {str(e)}")
            return Response(
                {'error': f'Failed to install integration: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, pk=None):
        """
        Uninstall integration
        
        DELETE /api/v1/integrations/{id}/
        """
        try:
            # Uninstall using Phase 4 service
            success = integration_service.uninstall_integration(
                instance_id=pk,
                user=request.user
            )
            
            if success:
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {'error': 'Integration not found or unauthorized'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Failed to uninstall integration: {str(e)}")
            return Response(
                {'error': f'Failed to uninstall integration: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        """
        Test integration connection
        
        POST /api/v1/integrations/{id}/test/
        """
        try:
            # Test using Phase 4 service
            result = integration_service.test_integration(
                instance_id=pk,
                user=request.user
            )
            
            return Response(result)
            
        except Exception as e:
            logger.error(f"Failed to test integration: {str(e)}")
            return Response(
                {'error': f'Failed to test integration: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def sync(self, request, pk=None):
        """
        Trigger manual sync (Batch Data Sync)
        
        POST /api/v1/integrations/{id}/sync/
        """
        try:
            result = integration_service.run_sync_job(
                integration_id=pk,
                user=request.user,
                job_type='manual_full_sync'
            )
            return Response(result)
        except Exception as e:
            logger.error(f"Sync trigger failed: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['put'])
    def secrets(self, request, pk=None):
        """
        Update integration secrets (Feature 10)
        
        PUT /api/v1/integrations/{id}/secrets/
        """
        instance = self.get_object()
        serializer = IntegrationSecretsUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            instance.update_secrets(
                new_config=serializer.validated_data['secrets'],
                user=request.user,
                request=request
            )
            return Response({'status': 'secrets updated'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def audit(self, request, pk=None):
        """
        Get audit logs for an integration (Feature 10)
        
        GET /api/v1/integrations/{id}/audit/
        """
        instance = self.get_object()
        # Filter admin notifications for this integration
        logs = AdminNotification.objects.filter(
            notification_type='vault_audit',
            teacher_id=str(instance.id)
        ).order_by('-created_at')[:50]
        
        data = [{
            'id': log.id,
            'action': log.webhook_event_type,
            'message': log.message,
            'performed_by': log.teacher_name,
            'details': log.webhook_event_data,
            'timestamp': log.created_at
        } for log in logs]
        
        return Response(data)

    @action(detail=False, methods=['get'], url_path='vault/audit')
    def vault_audit_logs(self, request):
        """
        Get global vault audit logs (Feature 10)
        
        GET /api/v1/integrations/vault/audit/
        """
        # Filter all vault audit logs
        logs = AdminNotification.objects.filter(
            notification_type='vault_audit'
        ).order_by('-created_at')[:100]
        
        data = [{
            'id': log.id,
            'action': log.webhook_event_type,
            'message': log.message,
            'performed_by': log.teacher_name,
            'details': log.webhook_event_data,
            'timestamp': log.created_at
        } for log in logs]
        
        return Response(data)

    @action(detail=False, methods=['post'], url_path='vault/rotate-keys')
    def rotate_keys(self, request):
        """
        Rotate vault encryption keys (Feature 10)
        
        POST /api/v1/integrations/vault/rotate-keys/
        """
        try:
            success = integration_service.rotate_vault_keys(request.user)
            return Response({'status': 'keys rotated' if success else 'failed'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path='vault/health')
    def vault_health(self, request):
        """
        Get vault health status (Feature 10)
        
        GET /api/v1/integrations/vault/health/
        """
        health = integration_service.get_vault_health()
        return Response(health)
