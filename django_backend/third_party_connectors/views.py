import secrets
import base64
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication
from .models import OAuthIntegration, SyncJobNotification, OAuthAPIKey
from public_api.admin_views import CustomAdminAuthentication, IsAuthenticatedAdmin

logger = logging.getLogger(__name__)

# Feature 5: Connectors & Sync
@method_decorator(csrf_exempt, name='dispatch')
class ConnectorViewSet(viewsets.ViewSet):
    """
    ViewSet for interactions with Third-Party Connectors.
    Uses Custom Admin Authentication to ensure compatibility with Admin Auth System.
    """
    authentication_classes = [CustomAdminAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def authorize(self, request):
        """Initiate OAuth flow"""
        provider = request.data.get('provider')
        
        # Checking if we have an app for this provider
        app = OAuthAPIKey.objects.filter(oauth_provider=provider, is_active=True).first()
        if not app:
             return Response({'error': f'No OAuth app configured for {provider}. Please add configuration first.'}, status=400)
        
        # Generate state (should be random and stored)
        import secrets
        state = secrets.token_hex(16)
        
        from urllib.parse import urlencode
        
        params = {
            'client_id': app.oauth_client_id,
            'redirect_uri': app.oauth_redirect_uri,
            'scope': app.oauth_scopes,
            'response_type': 'code',
            'state': state
        }
        
        url = ""
        # 10 Providers Support
        if provider == 'google':
             params['access_type'] = 'offline'
             params['prompt'] = 'consent'
             url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
        elif provider == 'microsoft':
             params['response_mode'] = 'query'
             url = f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?{urlencode(params)}"
        elif provider == 'canvas':
             # Canvas URL is typically instance-specific (e.g., https://canvas.instructure.com or school domain)
             # For generic cloud canvas:
             url = f"https://canvas.instructure.com/login/oauth2/auth?{urlencode(params)}"
        elif provider == 'zoom':
             url = f"https://zoom.us/oauth/authorize?{urlencode(params)}"
        elif provider == 'slack':
             url = f"https://slack.com/oauth/v2/authorize?{urlencode(params)}"
        elif provider == 'salesforce':
             url = f"https://login.salesforce.com/services/oauth2/authorize?{urlencode(params)}"
        elif provider == 'hubspot':
             url = f"https://app.hubspot.com/oauth/authorize?{urlencode(params)}"
        elif provider == 'dropbox':
             url = f"https://www.dropbox.com/oauth2/authorize?{urlencode(params)}"
        elif provider == 'github':
             url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
        elif provider == 'notion':
             url = f"https://api.notion.com/v1/oauth/authorize?{urlencode(params)}"
        else:
             return Response({'error': 'Unknown provider'}, status=400)
             
        return Response({'auth_url': url, 'state': state})

    @action(detail=False, methods=['post'])
    def callback(self, request):
        """Handle OAuth callback and exchange code for tokens"""
        provider = request.data.get('provider')
        code = request.data.get('code')
        state = request.data.get('state') # In production, verify state against session
        
        if not all([provider, code]):
            return Response({'error': 'Provider and Code are required'}, status=400)
            
        app = OAuthAPIKey.objects.filter(oauth_provider=provider, is_active=True).first()
        if not app:
            return Response({'error': 'OAuth configuration not found'}, status=400)
        
        # REAL OAuth Token Exchange - Exchange code for actual tokens
        import requests
        from integration_marketplace.encryption import EncryptionService
        
        # Get client credentials (decrypt secret)
        client_id = app.oauth_client_id
        client_secret = EncryptionService.decrypt_value(app.allowed_ips)  # Secret stored in allowed_ips
        redirect_uri = app.oauth_redirect_uri
        
        # Token endpoints per provider
        token_endpoints = {
            'google': 'https://oauth2.googleapis.com/token',
            'microsoft': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            'canvas': 'https://canvas.instructure.com/login/oauth2/token',  # Can be customized
            'zoom': 'https://zoom.us/oauth/token',
            'slack': 'https://slack.com/api/oauth.v2.access',
            'salesforce': 'https://login.salesforce.com/services/oauth2/token',
            'hubspot': 'https://api.hubapi.com/oauth/v1/token',
            'dropbox': 'https://api.dropbox.com/oauth2/token',
            'github': 'https://github.com/login/oauth/access_token',
            'notion': 'https://api.notion.com/v1/oauth/token',
        }
        
        token_url = token_endpoints.get(provider)
        if not token_url:
            return Response({'error': f'Token endpoint not configured for {provider}'}, status=400)
        
        # Prepare token exchange request
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': client_id,
            'client_secret': client_secret
        }
        
        # Special headers for specific providers
        headers = {'Accept': 'application/json'}
        if provider == 'github':
            headers['Accept'] = 'application/json'  # GitHub requires this
        elif provider == 'notion':
            headers['Authorization'] = f'Basic {base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()}'
            token_data = {'grant_type': 'authorization_code', 'code': code, 'redirect_uri': redirect_uri}
        
        try:
            # Make REAL API call to exchange code for tokens
            response = requests.post(token_url, data=token_data, headers=headers, timeout=10)
            
            if response.status_code != 200:
                logger.error(f"Token exchange failed for {provider}: {response.status_code} - {response.text[:200]}")
                return Response({
                    'error': 'OAuth token exchange failed',
                    'details': response.text[:200]
                }, status=400)
            
            token_response = response.json()
            
            # Extract tokens (field names vary by provider)
            access_token = token_response.get('access_token')
            refresh_token = token_response.get('refresh_token')
            expires_in = token_response.get('expires_in', 3600)
            scopes = token_response.get('scope', app.oauth_scopes)
            
            if not access_token:
                return Response({'error': 'No access_token in provider response'}, status=400)
            
            logger.info(f"Successfully exchanged OAuth code for {provider} access token")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"OAuth token exchange request failed for {provider}: {str(e)}")
            return Response({'error': f'Token exchange request failed: {str(e)}'}, status=500)
        except Exception as e:
            logger.error(f"Unexpected error during token exchange for {provider}: {str(e)}")
            return Response({'error': f'Unexpected error: {str(e)}'}, status=500)
        
        # Save tokens in OAuthIntegration (existing integrations table)
        from integration_marketplace.models import Integration
        integration_record, created = OAuthIntegration.objects.get_or_create(
            integration_type=provider,
            installed_by=request.user,
            defaults={'name': f"{provider.title()} Connection", 'status': 'active'}
        )
        
        # Use our proxy model helper to save tokens securely
        integration_record.set_oauth_tokens(
            access_token=access_token,
            refresh_token=refresh_token,
            scopes=scopes,
            expires_in=expires_in
        )
        
        # Update status to active
        integration_record.status = 'active'
        integration_record.save()
        
        # SYNC BACK TO MARKETPLACE (Feature 4 Compatibility)
        # Find any records in the base Integration table and activate them
        Integration.objects.filter(
            integration_type=provider, 
            installed_by=request.user
        ).update(status='active')
        
        return Response({
            'status': 'connected',
            'provider': provider,
            'integration_id': integration_record.id
        })

@method_decorator(csrf_exempt, name='dispatch')
class SyncJobViewSet(viewsets.ReadOnlyModelViewSet):
    """ReadOnly ViewSet for Sync Jobs"""
    serializer_class = None # ReadOnlyModelViewSet doesn't strictly need it if list is manually implemented but good practice. Using manual list below.
    # serializer_class is NOT set in original code, it relies on manually constructing response in list/retrieve.
    authentication_classes = [CustomAdminAuthentication]
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        # Admin/Superuser should see ALL jobs or filter by user?
        # For this dashboard, if admin, show all (or context aware).
        # Assuming current user flow is correct, but adding superuser check.
        if request.user.is_superuser or request.user.email == 'admin@eduyata.com':
             queryset = SyncJobNotification.objects.filter(notification_type='sync_job').order_by('-created_at')
        else:
            # Get integrations for THIS user
            from integration_marketplace.models import Integration
            user_integration_ids = Integration.objects.filter(
                installed_by=request.user
            ).values_list('id', flat=True)
            
            # Filter jobs for these integrations
            queryset = SyncJobNotification.objects.filter(
                notification_type='sync_job',
                teacher_id__in=[str(pid) for pid in user_integration_ids]
            ).order_by('-created_at')

        # Allow filtering by specific integration_id from query params
        integration_id = request.query_params.get('integration_id')
        if integration_id:
             queryset = queryset.filter(teacher_id=str(integration_id))

        data = []
        for job in queryset[:50]: # Limit to 50
            data.append({
                'id': job.id,
                'job_type': job.job_type.replace('_', ' ').title(),
                'status': job.status,
                'progress': job.progress_percentage,
                'processed_records': job.processed_records,
                'total_records': job.total_records,
                'duration': job.duration_seconds,
                'created_at': job.created_at,
                'message': job.message
            })
        return Response(data)
    
    def retrieve(self, request, pk=None):
        try:
            job = self.queryset.get(pk=pk)
            return Response({
                'id': job.id,
                'job_type': job.job_type,
                'status': job.status,
                'progress': job.progress_percentage,
                'processed': job.processed_records,
                'total': job.total_records,
                'details': job.job_metadata
            })
        except SyncJobNotification.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class ConnectorConfigViewSet(viewsets.ViewSet):
    """
    ViewSet for Dynamic Connector Configuration (Add/Remove OAuth Apps).
    Admins can add Client ID/Secret from Frontend.
    """
    authentication_classes = [CustomAdminAuthentication]
    permission_classes = [IsAuthenticatedAdmin]

    def list(self, request):
        """Get status of configured connectors"""
        # We don't return secrets, just existence and public IDs
        # FIX: Filter to ensure we only get actual OAuth apps, not generic API keys
        # We now return ALL apps (active or inactive) so frontend can show "Invalid" state
        apps = OAuthAPIKey.objects.filter(oauth_provider__isnull=False).exclude(oauth_provider='')
        data = []
        for app in apps:
            # Map OAuthAPIKey to Integration to get the REAL status
            # OAuthAPIKey.is_active is just "is this config enabled?"
            # Integration.status is "is this installed/validated?"
            from integration_marketplace.models import Integration
            integration = Integration.objects.filter(integration_type=app.oauth_provider, installed_by=request.user).first()
            
            real_status = 'active' if integration and integration.status == 'active' else 'inactive'
            
            data.append({
                'id': app.id,
                'integration_type': app.oauth_provider, # Frontend Expects this now
                'provider': app.oauth_provider,         # Keep for legacy compat
                'name': app.name,
                'redirect_uri': app.oauth_redirect_uri,
                'is_active': app.is_active,
                'status': real_status                   # Critical for Dashboard Filtering
            })
        return Response(data)

    def create(self, request):
        """
        Configure a new Connector (OAuth App).
        Expects: provider, client_id, client_secret
        """
        provider = request.data.get('provider')
        client_id = request.data.get('client_id')
        client_secret = request.data.get('client_secret')
        
        if not all([provider, client_id, client_secret]):
            return Response({'error': 'Provider, Client ID, and Client Secret are required.'}, status=400)
            
        # Determine scopes and redirect URI based on provider
        # Use BACKEND redirect URI - OAuth redirects to backend, backend handles token exchange
        base_redirect_uri = "http://localhost:8001/api/auth/social"
        # Pattern: http://localhost:8001/api/auth/social/[provider]/callback/
        redirect_uri = f"{base_redirect_uri}/{provider}/callback/"
        scopes = ""
        
        # 10 Providers Configuration
        if provider == 'google':
            # Comprehensive Educational Scopes (Classroom, Rosters, Coursework, Drive)
            scopes = (
                "https://www.googleapis.com/auth/classroom.courses.readonly "
                "https://www.googleapis.com/auth/classroom.rosters.readonly "
                "https://www.googleapis.com/auth/classroom.coursework.students.readonly "
                "https://www.googleapis.com/auth/drive.readonly "
                "https://www.googleapis.com/auth/userinfo.profile "
                "https://www.googleapis.com/auth/userinfo.email"
            )
        elif provider == 'microsoft':
            scopes = "Team.ReadBasic.All Files.Read.All"
        elif provider == 'canvas':
            scopes = "url:GET|/api/v1/courses url:GET|/api/v1/users/:user_id/profile"
        elif provider == 'zoom':
            scopes = "meeting:read:admin recording:read:admin"
        elif provider == 'slack':
            scopes = "channels:read groups:read"
        elif provider == 'salesforce':
            scopes = "api full refresh_token"
        elif provider == 'hubspot':
            scopes = "crm.objects.contacts.read"
        elif provider == 'dropbox':
            scopes = "files.metadata.read"
        elif provider == 'github':
            scopes = "repo read:user"
        elif provider == 'notion':
            scopes = "" # Notion doesn't always use scopes param in the same way, controlled by integration settings
        else:
             return Response({'error': 'Unsupported provider type'}, status=400)

        # Create or Update
        app, created = OAuthAPIKey.objects.update_or_create(
            oauth_provider=provider,
            defaults={
                'name': f"{provider.title()} Connector App",
                'key_value': f"APP_{provider.upper()}_{secrets.token_hex(4)}", 
                'oauth_client_id': client_id,
                'oauth_redirect_uri': redirect_uri,
                'oauth_scopes': scopes,
                'is_active': True,
                'user_id': request.user.id 
            }
        )
        
        # Securely encrypt secret and store in the TextField (allowed_ips)
        from integration_marketplace.encryption import EncryptionService
        encrypted_secret = EncryptionService.encrypt_value(client_secret)
        app.allowed_ips = encrypted_secret
        app.save()

        return Response({'status': 'configured', 'provider': provider})

    def destroy(self, request, pk=None):
        """Remove a configuration"""
        try:
            # We use pk as ID or provider name? Let's assume ID.
            app = OAuthAPIKey.objects.get(pk=pk)
            app.delete()
            return Response(status=204)
        except OAuthAPIKey.DoesNotExist:
             return Response({'error': 'Not found'}, status=404)
