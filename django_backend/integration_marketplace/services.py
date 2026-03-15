"""
Integration Service - Phase 4

Connections:
- Phase 2: Uses Integration model
- Phase 3: Uses Unified GenericOAuthIntegration for all 10 providers
- Feature 2: Creates APIKey for each integration
- Feature 3: Creates WebhookEndpoint for each integration
"""

import logging
from typing import Dict, Any, Optional
from django.contrib.auth.models import User
from .models import Integration
from .integrations.generic_oauth import GenericOAuthIntegration
from .vault_service import VaultService
from .encryption import EncryptionService
from public_api.models import APIKey
from webhook_system.models import WebhookEndpoint
from third_party_connectors.models import OAuthAPIKey
from django.utils import timezone
from datetime import timedelta
import requests

logger = logging.getLogger(__name__)


class IntegrationService:
    """
    Service for managing integrations
    
    Features:
    - Install integrations (creates API key + webhook endpoint)
    - Uninstall integrations (cleanup API key + webhook endpoint)
    - Route webhook events to integration handlers
    - Test integration connections
    
    Connections:
    - Feature 2: Creates APIKey for each integration
    - Feature 3: Creates WebhookEndpoint for each integration
    - Phase 2: Uses Integration model
    - Phase 3: Uses integration handlers
    """
    
    # Unified integration handler for ALL 10 OAuth providers
    # All providers now use GenericOAuthIntegration with:
    # - Real credential validation
    # - OAuth token management  
    # - Zoom: Meeting creation + webhooks
    # - Slack: Message sending + webhooks
    # - All others: Full OAuth support
    INTEGRATION_HANDLERS = {
        'google': GenericOAuthIntegration,
        'microsoft': GenericOAuthIntegration,
        'canvas': GenericOAuthIntegration,
        'zoom': GenericOAuthIntegration,  # ← Now unified!
        'slack': GenericOAuthIntegration,  # ← Now unified!
        'salesforce': GenericOAuthIntegration,
        'hubspot': GenericOAuthIntegration,
        'dropbox': GenericOAuthIntegration,
        'github': GenericOAuthIntegration,
        'notion': GenericOAuthIntegration,
    }
    
    def install_integration(
        self, 
        integration_type: str, 
        user: User, 
        configuration: Dict[str, Any]
    ) -> Integration:
        """
        Install an integration
        
        Args:
            integration_type (str): Type of integration ('zoom', 'slack')
            user (User): User installing the integration
            configuration (dict): Integration configuration
        
        Returns:
            Integration: Created integration instance
        
        Connections:
        - Feature 2: Creates APIKey
        - Feature 3: Creates WebhookEndpoint (if webhook_url in config)
        - Phase 2: Creates Integration instance
        """
        # Use VaultService for secure storage (Feature 10)
        try:
            encrypted_config = VaultService.store_secret(
                None, configuration, user, None
            )
            
            # Create integration instance (Phase 2 model)
            instance = Integration.objects.create(
                integration_type=integration_type,
                name=f"{integration_type.title()} Integration",
                config=encrypted_config,
                installed_by=user,
                status='inactive'
            )
        except Exception as e:
            logger.error(f"Failed to store secrets or create integration: {str(e)}")
            raise
        
        try:
            # Check if this is an OAuth provider (Feature 5 compatibility)
            # If so, we also want to create a configuration in the OAuthAPIKey table
            client_id = configuration.get('client_id')
            client_secret = configuration.get('client_secret')
            
            if client_id and client_secret:
                from third_party_connectors.models import OAuthAPIKey
                import secrets
                
                # Use BACKEND redirect URI - OAuth redirects to backend for token exchange
                base_redirect_uri = "http://localhost:8001/api/auth/social"
                # Pattern: http://localhost:8001/api/auth/social/[provider]/callback/
                redirect_uri = f"{base_redirect_uri}/{integration_type}/callback/"
                
                # Determine scopes
                scopes_map = {
                    'google': (
                        "https://www.googleapis.com/auth/classroom.courses.readonly "
                        "https://www.googleapis.com/auth/classroom.rosters.readonly "
                        "https://www.googleapis.com/auth/classroom.coursework.students.readonly "
                        "https://www.googleapis.com/auth/drive.readonly "
                        "https://www.googleapis.com/auth/userinfo.profile "
                        "https://www.googleapis.com/auth/userinfo.email"
                    ),
                    'microsoft': 'Team.ReadBasic.All Files.Read.All',
                    'canvas': 'url:GET|/api/v1/courses url:GET|/api/v1/users/:user_id/profile',
                    'zoom': 'meeting:read:admin recording:read:admin',
                    'slack': 'channels:read groups:read',
                    'salesforce': 'api full refresh_token',
                    'hubspot': 'crm.objects.contacts.read',
                    'dropbox': 'files.metadata.read',
                    'github': 'repo read:user',
                    'notion': ''
                }
                scopes = scopes_map.get(integration_type, '')
                
                # Create/Update OAuth config
                app = OAuthAPIKey.create_oauth_app(
                    provider=integration_type,
                    name=f"Marketplace_{integration_type}",
                    client_id=client_id,
                    client_secret=client_secret,
                    redirect_uri=redirect_uri,
                    scopes=scopes,
                    user=user
                )
                # Set inactive initially until tested
                app.is_active = False 
                app.save()
                logger.info(f"Synchronized OAuth config for {integration_type} (Status: Inactive)")
                
            # Create API key for integration (Feature 2)
            api_key = APIKey.objects.create(
                name=f"{instance.name} - API Key",
                user=user,
                is_active=True
            )
            instance.api_key = api_key
            logger.info(f"Created API key for integration {instance.id}")
            
            # Create webhook endpoint if webhook_url provided (Feature 3)
            webhook_url = configuration.get('webhook_url')
            if webhook_url:
                webhook = WebhookEndpoint.objects.create(
                    name=f"{instance.name} - Webhook",
                    url=webhook_url,
                    created_by=user,
                    is_active=True
                )
                instance.webhook_endpoint = webhook
                logger.info(f"Created webhook endpoint for integration {instance.id}")
            
            # Test connection using handler (Phase 3)
            # Test connection using handler (Phase 3)
            handler_class = self.INTEGRATION_HANDLERS.get(integration_type)
            if handler_class:
                # FIX: Temporarily inject decrypted config for the test
                # The instance has encrypted_config, but we have the raw 'configuration' dict
                # We must ensure the handler sees the RAW config
                original_config = instance.config
                instance.config = configuration # Use raw dict for test BEFORE handler init
                
                handler = handler_class(instance)
                
                # FIX: Unpack tuple (success, message)
                # If we don't unpack, 'success' becomes the whole tuple which is always True
                result = handler.test_connection()
                if isinstance(result, tuple):
                    success, message = result
                else:
                    success = result
                
                # Restore encrypted config
                instance.config = original_config
                
                if success:
                    # User Request: Valid Keys = Active Status (Installed & Ready in Marketplace)
                    # We will handle "Connected" state via a separate flag in the serializer
                    instance.status = 'active'
                    logger.info(f"Integration {instance.id} activated (Keys Validated)")
                    
                    # Activate OAuth app config
                    from third_party_connectors.models import OAuthAPIKey
                    oauth_app = OAuthAPIKey.objects.filter(oauth_provider=integration_type).first()
                    if oauth_app and not oauth_app.is_active:
                        oauth_app.is_active = True
                        oauth_app.save()
                else:
                    instance.status = 'inactive'
                    logger.warning(f"Integration {instance.id} connection test failed - set to inactive")
            
            instance.save()
            return instance
            
        except Exception as e:
            # Cleanup on failure
            logger.error(f"Failed to install integration: {str(e)}")
            instance.delete()
            raise
    
    def check_and_refresh_tokens(self) -> int:
        """
        Check all integrations and refresh OAuth tokens expiring within 7 days
        
        Returns:
            int: Number of tokens refreshed
        """
        integrations = Integration.objects.filter(status='active')
        refreshed_count = 0
        
        for integration in integrations:
            try:
                if self._should_refresh_token(integration):
                    success = self._refresh_integration_token(integration)
                    if success:
                        refreshed_count += 1
                        logger.info(f"Refreshed token for integration {integration.id}")
            except Exception as e:
                logger.error(f"Failed to check/refresh integration {integration.id}: {str(e)}")
        
        return refreshed_count
    
    def _should_refresh_token(self, integration: Integration) -> bool:
        """Check if integration token should be refreshed"""
        config = integration.get_decrypted_config()
        if not config:
            return False
        
        oauth_tokens = config.get('oauth_tokens', {})
        if not oauth_tokens:
            return False
        
        refresh_token = oauth_tokens.get('refresh_token')
        if not refresh_token:
            return False
        
        expires_at = oauth_tokens.get('expires_at')
        if not expires_at:
            return False
        
        try:
            from datetime import datetime
            if isinstance(expires_at, str):
                expiry_time = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
            else:
                expiry_time = expires_at
            
            threshold = timezone.now() + timedelta(days=7)
            return expiry_time <= threshold
        except Exception as e:
            logger.error(f"Error parsing token expiration: {str(e)}")
            return False
    
    def _refresh_integration_token(self, integration: Integration) -> bool:
        """Refresh OAuth token for an integration"""
        TOKEN_ENDPOINTS = {
            'google': 'https://oauth2.googleapis.com/token',
            'microsoft': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            'zoom': 'https://zoom.us/oauth/token',
            'slack': 'https://slack.com/api/oauth.v2.access',
            'salesforce': 'https://login.salesforce.com/services/oauth2/token',
            'hubspot': 'https://api.hubspot.com/oauth/v1/token',
            'dropbox': 'https://api.dropbox.com/oauth2/token',
            'github': 'https://github.com/login/oauth/access_token',
            'canvas': '{instance_url}/login/oauth2/token',
            'notion': 'https://api.notion.com/v1/oauth/token',
        }
        
        try:
            config = integration.get_decrypted_config()
            oauth_tokens = config.get('oauth_tokens', {})
            refresh_token = oauth_tokens.get('refresh_token')
            client_id = config.get('client_id')
            client_secret = config.get('client_secret')
            
            if not (refresh_token and client_id and client_secret):
                return False
            
            token_url = TOKEN_ENDPOINTS.get(integration.integration_type)
            if not token_url:
                return False
            
            if '{instance_url}' in token_url:
                instance_url = config.get('instance_url', config.get('canvas_domain', ''))
                if not instance_url.startswith('http'):
                    instance_url = f'https://{instance_url}'
                token_url = token_url.format(instance_url=instance_url)
            
            data = {
                'grant_type': 'refresh_token',
                'refresh_token': refresh_token,
                'client_id': client_id,
                'client_secret': client_secret
            }
            
            response = requests.post(token_url, data=data, timeout=10)
            
            if response.status_code == 200:
                token_data = response.json()
                new_access_token = token_data.get('access_token')
                new_refresh_token = token_data.get('refresh_token', refresh_token)
                expires_in = token_data.get('expires_in', 3600)
                
                new_expires_at = (timezone.now() + timedelta(seconds=expires_in)).isoformat()
                
                config['oauth_tokens'] = {
                    'access_token': new_access_token,
                    'refresh_token': new_refresh_token,
                    'expires_at': new_expires_at,
                    'scopes': oauth_tokens.get('scopes', '')
                }
                
                integration.update_secrets(config, integration.installed_by)
                logger.info(f"Successfully refreshed token for integration {integration.id}")
                return True
            else:
                logger.error(f"Token refresh failed: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"Error refreshing token: {str(e)}")
            return False
    
    def uninstall_integration(self, instance_id: int, user: User) -> bool:
        """
        Uninstall an integration
        
        Args:
            instance_id (int): Integration instance ID
            user (User): User uninstalling the integration
        
        Returns:
            bool: True if uninstalled successfully
        
        Connections:
        - Feature 2: Deletes APIKey
        - Feature 3: Deletes WebhookEndpoint
        - Phase 2: Deletes Integration instance
        """
        try:
            instance = Integration.objects.get(
                id=instance_id,
                installed_by=user
            )
            
            # Clean up API key (Feature 2)
            if instance.api_key:
                instance.api_key.delete()
                logger.info(f"Deleted API key for integration {instance_id}")
            
            # Clean up webhook endpoint (Feature 3)
            if instance.webhook_endpoint:
                instance.webhook_endpoint.delete()
                logger.info(f"Deleted webhook endpoint for integration {instance_id}")
            
            # Delete integration instance (Phase 2)
            instance.delete()
            logger.info(f"Uninstalled integration {instance_id}")
            
            # Feature 5 Cleanup: Remove OAuth configuration if it exists
            try:
                from third_party_connectors.models import OAuthAPIKey
                OAuthAPIKey.objects.filter(oauth_provider=instance.integration_type, user_id=user.id).delete()
                logger.info(f"Cleaned up OAuth configuration for {instance.integration_type}")
            except Exception as e:
                logger.warning(f"Could not cleanup OAuth config in F5: {str(e)}")
            
            return True
            
        except Integration.DoesNotExist:
            logger.error(f"Integration {instance_id} not found")
            return False
        except Exception as e:
            logger.error(f"Failed to uninstall integration: {str(e)}")
            return False
    
    def handle_webhook_event(
        self, 
        instance_id: int, 
        event_type: str, 
        event_data: Dict[str, Any]
    ) -> bool:
        """
        Route webhook event to integration handler
        
        Args:
            instance_id (int): Integration instance ID
            event_type (str): Event type (e.g., 'student.enrolled')
            event_data (dict): Event data
        
        Returns:
            bool: True if handled successfully
        
        Connections:
        - Phase 2: Gets Integration instance
        - Phase 3: Calls integration handler
        """
        try:
            instance = Integration.objects.get(id=instance_id, status='active')
            
            # Get handler class (Phase 3)
            # Get handler class (Phase 3)
            handler_class = self.INTEGRATION_HANDLERS.get(instance.integration_type)
            if not handler_class:
                logger.warning(f"No handler for integration type: {instance.integration_type}")
                return False
            
            # FIX: Ensure handler has access to DECRYPTED config (for access_tokens, request signing)
            # Webhook handling is a system process, so we use internal decryption
            try:
                decrypted_config = instance.get_decrypted_config()
                if decrypted_config:
                    instance.config = decrypted_config
            except Exception as e:
                logger.warning(f"Webhook handler could not decrypt config (might fail if token needed): {e}")

            # Create handler and process event
            handler = handler_class(instance)
            result = handler.handle_webhook_event(event_type, event_data)
            
            if result:
                logger.info(f"Integration {instance_id} handled event {event_type}")
            else:
                logger.warning(f"Integration {instance_id} failed to handle event {event_type}")
            
            return result
            
        except Integration.DoesNotExist:
            logger.error(f"Integration {instance_id} not found or inactive")
            return False
        except Exception as e:
            logger.error(f"Failed to handle webhook event: {str(e)}")
            return False
    
    def test_integration(self, instance_id: int, user: User) -> Dict[str, Any]:
        """
        Test integration connection
        
        Args:
            instance_id (int): Integration instance ID
            user (User): User testing the integration
        
        Returns:
            dict: Test result with success status and message
        
        Connections:
        - Phase 2: Gets Integration instance
        - Phase 3: Calls integration handler test_connection()
        """
        try:
            instance = Integration.objects.get(
                id=instance_id,
                installed_by=user
            )
            
            # Retrieve secrets securely (Feature 10)
            decrypted_config = VaultService.retrieve_secret(
                instance_id, user, None
            )
            
            # Perform integration-specific test
            handler_class = self.INTEGRATION_HANDLERS.get(instance.integration_type)
            if not handler_class:
                return {
                    'success': False,
                    'message': f'No handler for integration type: {instance.integration_type}'
                }
            
            # Test connection using decrypted config
            # Temporarily Swap config with decrypted one for test BEFORE handler init
            # CRITICAL: Handler.init reads config IMMEDIATELY
            original_config = instance.config
            instance.config = decrypted_config
            
            handler = handler_class(instance)
            
            # Get detailed result from handler
            result = handler.test_connection()
            if isinstance(result, tuple):
                success, message = result
            else:
                # Backwards compatibility if handler returns bool
                success = result
                message = 'Connection test successful' if success else 'Connection test failed'
            
            instance.config = original_config # Swap back
            
            # UPDATE STATUS BASED ON TEST RESULT
            # SYNC OAUTH APP STATUS
            try:
                # Find matching OAuth app for THIS USER
                # If missing but test passed, we have raw credentials in decrypted_config
                # This ensures "Active apps from Marketplace" actually SHOW UP in Connectors
                from third_party_connectors.models import OAuthAPIKey
                app = OAuthAPIKey.objects.filter(
                    oauth_provider=instance.integration_type,
                    user=user
                ).first()
                
                if not app and success and decrypted_config:
                    logger.info(f"Re-creating missing OAuth app config for {instance.integration_type}")
                    # Re-use redirect URI logic
                    base_redirect_uri = "http://localhost:8001/api/auth/social"
                    redirect_uri = f"{base_redirect_uri}/{instance.integration_type}/callback/"
                    
                    app = OAuthAPIKey.create_oauth_app(
                        provider=instance.integration_type,
                        name=f"Marketplace_{instance.integration_type}",
                        client_id=decrypted_config.get('client_id'),
                        client_secret=decrypted_config.get('client_secret'),
                        redirect_uri=redirect_uri,
                        scopes='', # Handled by handler usually
                        user=user
                    )

                if app:
                    app.is_active = success
                    app.save()
            except Exception as e:
                logger.error(f"Failed to sync OAuth app status: {e}")

            if success:
                instance.status = 'active'
                instance.save()
                logger.info(f"Integration {instance_id} activated after successful test")
            else:
                instance.status = 'inactive'  # Consistent with install logic
                instance.save()
                logger.warning(f"Integration {instance_id} set to inactive after failed test")
            
            # Log successful test
            VaultService.audit_secret_access(
                integration_id=instance_id,
                action='integration_tested',
                user=user,
                details=f"Tested {instance.name} integration - {'Success' if success else 'Failed'}"
            )
            
            return {
                'success': success,
                'message': message  # Now returns detailed message from provider
            }
            
        except Integration.DoesNotExist:
            return {
                'success': False,
                'message': 'Integration not found'
            }
        except Exception as e:
            logger.error(f"Failed to test integration: {str(e)}")
            return {
                'success': False,
                'message': f'Test failed: {str(e)}'
            }
    
    # ========== BATCH DATA SYNC EXECUTION ==========
    
    def run_sync_job(self, integration_id: int, user: User, job_type: str = 'full_sync') -> Dict[str, Any]:
        """
        Trigger a batch data sync job
        
        Args:
            integration_id: Integration ID
            user: User initiating sync
            job_type: Type of sync (full_sync, partial_sync)
            
        Returns:
            Dict with job_id and status
        """
        try:
            # 1. Verify access
            instance = Integration.objects.get(id=integration_id, installed_by=user)
            
            if instance.status != 'active':
                raise ValueError("Integration is not active")
                
            # 2. Create Sync Job Record (using Proxy Model)
            from third_party_connectors.models import SyncJobNotification
            
            job = SyncJobNotification.create_sync_job(
                integration_id=instance.id,
                job_type=job_type,
                source_type=instance.integration_type,
                target_type='eduyata_db'
            )
            
            logger.info(f"Created sync job {job.id} for integration {instance.id}")
            
            # 3. Decrypt Config for Handler
            try:
                decrypted_config = instance.get_decrypted_config()
                if decrypted_config:
                    # FIX: Handle case where get_decrypted_config returns string (double JSON dump?)
                    if isinstance(decrypted_config, str):
                        import json
                        try:
                            decrypted_config = json.loads(decrypted_config)
                        except:
                            pass
                            
                    logger.info(f"Decrypted config type: {type(decrypted_config)}")
                    instance.config = decrypted_config
            except Exception as e:
                logger.error(f"Failed to decrypt config for sync: {e}")
                job.update_progress(0, 0, 'failed')
                return {'success': False, 'message': 'Encryption error'}
            
            # 4. Get Handler
            handler_class = self.INTEGRATION_HANDLERS.get(instance.integration_type)
            if not handler_class:
                job.update_progress(0, 0, 'failed')
                return {'success': False, 'message': 'No handler found'}
                
            handler = handler_class(instance)
            
            # 5. Run Sync (Synchronously for now, ideally Async Task)
            # In production, this should be: run_sync_task.delay(job.id)
            try:
                success = handler.sync_data(job.id)
                msg = "Sync completed" if success else "Sync failed"
            except Exception as e:
                logger.error(f"Sync execution error: {e}")
                job.update_progress(0, 0, 'failed')
                success = False
                msg = str(e)
                
            return {
                'success': success,
                'job_id': job.id,
                'message': msg
            }
            
        except Integration.DoesNotExist:
            return {'success': False, 'message': 'Integration not found'}
        except ValueError as e:
            return {'success': False, 'message': str(e)}
        except Exception as e:
            logger.error(f"Run sync job error: {e}")
            return {'success': False, 'message': str(e)}
            
    def get_available_integrations(self) -> list:

        """
        Get list of available integration types (Total 10 synchronized with Feature 5)
        """
        return [
            {
                'type': 'google',
                'name': 'Google Classroom & Workspace',
                'description': 'Sync Classroom courses, grades, Drive files, and Gmail',
                'credential_url': 'https://console.cloud.google.com/apis/credentials',
                'credential_help': 'Create OAuth 2.0 Client ID',
                'config_fields': [
                    {'name': 'client_id', 'label': 'Client ID', 'type': 'text', 'required': True, 'placeholder': '123456789012-abc123.apps.googleusercontent.com'},
                    {'name': 'client_secret', 'label': 'Client Secret', 'type': 'password', 'required': True, 'placeholder': 'GOCSPX-abc123xyz789'},
                ]
            },
            {
                'type': 'microsoft',
                'name': 'Microsoft Teams',
                'description': 'Sync Microsoft Teams assignments and Outlook events',
                'credential_url': 'https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade',
                'credential_help': 'App registrations → New → Web',
                'config_fields': [
                    {'name': 'client_id', 'label': 'Application (client) ID', 'type': 'text', 'required': True, 'placeholder': 'abc12345-1234-1234-1234-123456789abc'},
                    {'name': 'client_secret', 'label': 'Client Secret Value', 'type': 'password', 'required': True, 'placeholder': 'xyz~8Q~abc123...'},
                ]
            },
            {
                'type': 'canvas',
                'name': 'Canvas LMS',
                'description': 'Import courses and student performance from Canvas',
                'credential_url': 'https://canvas.instructure.com/doc/api/file.oauth_endpoints.html',
                'credential_help': 'Admin → Developer Keys → + Developer Key',
                'config_fields': [
                    {'name': 'client_id', 'label': 'Developer Key ID', 'type': 'text', 'required': True, 'placeholder': '10000000000001'},
                    {'name': 'client_secret', 'label': 'Key/Secret', 'type': 'password', 'required': True, 'placeholder': 'abc123xyz456'},
                    {'name': 'canvas_domain', 'label': 'Canvas Domain', 'type': 'text', 'required': False, 'placeholder': 'myschool.instructure.com'},
                ]
            },
            {
                'type': 'zoom',
                'name': 'Zoom',
                'description': 'Auto-create Zoom meetings for virtual classrooms',
                'credential_url': 'https://marketplace.zoom.us/develop/create',
                'credential_help': 'Build App → OAuth',
                'config_fields': [
                    {'name': 'client_id', 'label': 'Client ID', 'type': 'text', 'required': True, 'placeholder': 'abc123xyz456'},
                    {'name': 'client_secret', 'label': 'Client Secret', 'type': 'password', 'required': True, 'placeholder': 'abc123xyz456789'},
                ]
            },
            {
                'type': 'slack',
                'name': 'Slack',
                'description': 'Send notifications and alerts to Slack channels',
                'credential_url': 'https://api.slack.com/apps',
                'credential_help': 'Create App → OAuth & Permissions',
                'config_fields': [
                    {'name': 'client_id', 'label': 'Client ID', 'type': 'text', 'required': True, 'placeholder': '123456789.123456789'},
                    {'name': 'client_secret', 'label': 'Client Secret', 'type': 'password', 'required': True, 'placeholder': 'abc123xyz456'},
                    {'name': 'webhook_url', 'label': 'Webhook URL (Optional)', 'type': 'text', 'required': False, 'placeholder': 'https://hooks.slack.com/services/...'},
                    {'name': 'signing_secret', 'label': 'Signing Secret (Optional)', 'type': 'password', 'required': False, 'placeholder': 'abc123xyz'},
                ]
            },
            {
                'type': 'salesforce',
                'name': 'Salesforce',
                'description': 'Sync CRM data for institutional management',
                'credential_url': 'https://login.salesforce.com/lightning/setup/NavigationMenus/home',
                'credential_help': 'New Connected App',
                'config_fields': [
                    {'name': 'client_id', 'label': 'Consumer Key', 'type': 'text', 'required': True, 'placeholder': '3MVG9...'},
                    {'name': 'client_secret', 'label': 'Consumer Secret', 'type': 'password', 'required': True, 'placeholder': 'ABC123...'},
                    {'name': 'instance_url', 'label': 'Instance URL (Optional)', 'type': 'text', 'required': False, 'placeholder': 'https://mycompany.salesforce.com'},
                ]
            },
            {
                'type': 'hubspot',
                'name': 'HubSpot',
                'description': 'Manage admission marketing and leads',
                'credential_url': 'https://app.hubspot.com/signup-hubspot/developers',
                'credential_help': 'Create App → OAuth',
                'config_fields': [
                    {'name': 'client_id', 'label': 'App ID (Client ID)', 'type': 'text', 'required': True, 'placeholder': 'abc12345-1234-1234-abc123456789'},
                    {'name': 'client_secret', 'label': 'Client Secret', 'type': 'password', 'required': True, 'placeholder': 'abc123xyz-456'},
                ]
            },
            {
                'type': 'dropbox',
                'name': 'Dropbox',
                'description': 'Backup course materials to Dropbox cloud',
                'credential_url': 'https://www.dropbox.com/developers/apps',
                'credential_help': 'Create app → OAuth 2',
                'config_fields': [
                    {'name': 'client_id', 'label': 'App key', 'type': 'text', 'required': True, 'placeholder': 'abc123xyz456'},
                    {'name': 'client_secret', 'label': 'App secret', 'type': 'password', 'required': True, 'placeholder': 'abc123xyz456789'},
                ]
            },
            {
                'type': 'github',
                'name': 'GitHub',
                'description': 'Sync student repos and coding assignments',
                'credential_url': 'https://github.com/settings/developers',
                'credential_help': 'New OAuth App',
                'config_fields': [
                    {'name': 'client_id', 'label': 'Client ID', 'type': 'text', 'required': True, 'placeholder': 'Iv1.abc123xyz456'},
                    {'name': 'client_secret', 'label': 'Client Secret', 'type': 'password', 'required': True, 'placeholder': 'abc123xyz456789'},
                ]
            },
            {
                'type': 'notion',
                'name': 'Notion',
                'description': 'Collaborate using Notion integrated wikis',
                'credential_url': 'https://www.notion.so/my-integrations',
                'credential_help': 'New integration',
                'config_fields': [
                    {'name': 'client_id', 'label': 'OAuth client ID', 'type': 'text', 'required': True, 'placeholder': 'abc123xyz-456'},
                    {'name': 'client_secret', 'label': 'OAuth client secret', 'type': 'password', 'required': True, 'placeholder': 'secret_abc123'},
                ]
            },
        ]

    def rotate_vault_keys(self, user: User) -> bool:
        """Rotate vault encryption keys (Feature 10)"""
        return VaultService.rotate_keys(user)

    def get_vault_health(self) -> Dict[str, Any]:
        """Get vault health status (Feature 10)"""
        return VaultService.get_vault_health()


# Global integration service instance
integration_service = IntegrationService()
