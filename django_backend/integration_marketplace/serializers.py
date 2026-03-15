"""
Integration Serializers - Phase 5

Connections:
- Phase 2: Serializes Integration model
"""

from rest_framework import serializers
from .models import Integration


class IntegrationSerializer(serializers.ModelSerializer):
    """
    Serializer for Integration model
    
    Connections:
    - Phase 2: Serializes Integration model
    """
    
    is_connected = serializers.SerializerMethodField()

    class Meta:
        model = Integration
        fields = [
            'id',
            'integration_type',
            'name',
            'config',
            'status',
            'installed_at',
            'is_connected', # New field for Frontend logic
        ]
        read_only_fields = ['id', 'installed_at']
    
    def get_is_connected(self, obj):
        """
        Check if integration has valid OAuth tokens
        """
        try:
            config = obj.get_decrypted_config()
            if not config: 
                return False
                
            # Handle potential double-decoded JSON
            if isinstance(config, str):
                import json
                try: 
                    config = json.loads(config)
                except: 
                    pass
            
            if not isinstance(config, dict):
                return False
                
            # Check for oauth_tokens dict
            oauth_tokens = config.get('oauth_tokens', {})
            
            # Handle potential double-encoded oauth_tokens
            if isinstance(oauth_tokens, str):
                import json
                import ast
                try:
                    oauth_tokens = json.loads(oauth_tokens)
                except:
                    try: 
                        oauth_tokens = ast.literal_eval(oauth_tokens)
                    except: 
                        return False
                        
            return bool(oauth_tokens.get('access_token'))
            
        except Exception:
            return False

    def to_representation(self, instance):
        """
        Customize representation to hide sensitive config data using model helper
        """
        data = super().to_representation(instance)
        data['config'] = instance.get_masked_config()
        return data


class IntegrationSecretsUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating integration secrets (Feature 10)
    """
    secrets = serializers.JSONField()
    
    def validate_secrets(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Secrets must be a JSON object")
        return value


class IntegrationCreateSerializer(serializers.Serializer):
    """
    Serializer for creating integrations
    
    Connections:
    - Phase 4: Used by install_integration() service method
    """
    integration_type = serializers.ChoiceField(choices=[
        'google', 'microsoft', 'canvas', 'zoom', 'slack', 
        'salesforce', 'hubspot', 'dropbox', 'github', 'notion'
    ])
    configuration = serializers.JSONField()
    
    def validate_configuration(self, value):
        """
        Validate configuration based on integration type
        Supports both OAuth-style (client_id/client_secret) and legacy (api_key/api_secret) formats
        Also validates optional provider-specific fields
        """
        integration_type = self.initial_data.get('integration_type')
        
        # All 10 OAuth providers require client_id + client_secret
        oauth_integrations = ['google', 'microsoft', 'canvas', 'zoom', 'slack', 'salesforce', 
                              'hubspot', 'dropbox', 'github', 'notion']
        
        if integration_type in oauth_integrations:
            # Check for OAuth credentials (client_id/client_secret)
            has_client_id = value.get('client_id')
            has_client_secret = value.get('client_secret')
            
            # Also check for legacy credentials (api_key/api_secret for backwards compatibility)
            has_api_key = value.get('api_key')
            has_api_secret = value.get('api_secret')
            
            # Require at least one set of credentials
            if not ((has_client_id and has_client_secret) or (has_api_key and has_api_secret)):
                raise serializers.ValidationError(
                    f"{integration_type.title()} requires 'client_id' and 'client_secret' "
                    f"(or 'api_key' and 'api_secret' for legacy configurations)"
                )
            
            # OPTIONAL FIELDS VALIDATION
            
            # Canvas: Recommend instance_url or canvas_domain
            if integration_type == 'canvas':
                if not value.get('instance_url') and not value.get('canvas_domain'):
                    # Not required but recommended
                    logger = logging.getLogger(__name__)
                    logger.warning("Canvas: instance_url or canvas_domain not provided, using default 'canvas.instructure.com'")
            
            # Salesforce: Recommend instance_url
            if integration_type == 'salesforce':
                if not value.get('instance_url'):
                    # Not required but recommended
                    logger = logging.getLogger(__name__)
                    logger.warning("Salesforce: instance_url not provided, using default 'https://login.salesforce.com'")
            
            # Slack: Recommend webhook_url and signing_secret for full functionality
            if integration_type == 'slack':
                if not value.get('webhook_url'):
                    logger = logging.getLogger(__name__)
                    logger.warning("Slack: webhook_url not provided, message sending will not work")
                if not value.get('signing_secret'):
                    logger = logging.getLogger(__name__)
                    logger.info("Slack: signing_secret not provided (optional for webhook verification)")
        
        return value
