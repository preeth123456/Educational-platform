from django.db import models
from django.contrib.auth.models import User
from public_api.models import APIKey
from webhook_system.models import WebhookEndpoint


class Integration(models.Model):
    """
    Integration instance model
    
    Connections:
    - Feature 1: Uses User model (same as APIKey)
    - Feature 2: Links to APIKey model (api_key_id)
    - Feature 3: Links to WebhookEndpoint model (webhook_endpoint_id)
    - Phase 1: Maps to integrations table created in database
    
    Reuses existing tables:
    - video_conferences (for Zoom meetings)
    - admin_notifications (for Slack messages, extended with integration_id)
    """
    
    INTEGRATION_TYPES = [
        ('google', 'Google Classroom'),
        ('microsoft', 'Microsoft Teams'),
        ('canvas', 'Canvas LMS'),
        ('zoom', 'Zoom'),
        ('slack', 'Slack'),
        ('salesforce', 'Salesforce'),
        ('hubspot', 'HubSpot'),
        ('dropbox', 'Dropbox'),
        ('github', 'GitHub'),
        ('notion', 'Notion'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    integration_type = models.CharField(
        max_length=50, 
        choices=INTEGRATION_TYPES,
        help_text="Type of integration (zoom, slack, google, etc)"
    )
    name = models.CharField(
        max_length=200,
        help_text="Integration name"
    )
    config = models.JSONField(
        default=dict,
        help_text="Integration configuration (API keys, webhook URLs, etc.)"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='inactive',
        help_text="Integration status"
    )
    installed_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        help_text="User who installed this integration",
        db_column='installed_by'
    )
    installed_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Installation timestamp"
    )
    
    # Links to Features 2 & 3
    api_key = models.ForeignKey(
        APIKey, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="API key for this integration (Feature 2)"
    )
    webhook_endpoint = models.ForeignKey(
        WebhookEndpoint, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Webhook endpoint for this integration (Feature 3)"
    )
    
    class Meta:
        db_table = 'integrations'
        verbose_name = 'Integration'
        verbose_name_plural = 'Integrations'
        ordering = ['-installed_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['integration_type']),
            models.Index(fields=['installed_by']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.integration_type})"

    def save(self, *args, **kwargs):
        """Override save to encrypt config if not already encrypted"""
        if not self.id:
            # Manual ID generation for tables without AUTO_INCREMENT
            max_id = Integration.objects.aggregate(models.Max('id'))['id__max']
            self.id = (max_id or 0) + 1
            
        if self.config and not self._is_config_encrypted():
            from .encryption import EncryptionService
            self.config = EncryptionService.encrypt_config(self.config)
            
        super().save(*args, **kwargs)

    def get_decrypted_config(self):
        """Get decrypted configuration"""
        from .encryption import EncryptionService
        if self.config and self._is_config_encrypted():
            return EncryptionService.decrypt_config(self.config)
        return self.config
    
    def _is_config_encrypted(self):
        """Check if config contains any encrypted fields"""
        if not self.config or not isinstance(self.config, dict):
            return False
        return any(isinstance(v, str) and v.startswith('ENCRYPTED:') for v in self.config.values())

    def update_secrets(self, new_config, user, request=None):
        """Update secrets with audit logging"""
        from .vault_service import VaultService
        
        encrypted_config = VaultService.store_secret(
            self.id, new_config, user, request
        )
        self.config = encrypted_config
        self.save()
        return encrypted_config
    
    def get_masked_config(self):
        """Get config with sensitive fields masked for frontend display"""
        config = self.get_decrypted_config()
        if not config or not isinstance(config, dict):
            return config
            
        from .encryption import EncryptionService
        masked_config = config.copy()
        
        for key in config.keys():
            if EncryptionService._is_sensitive_field(key):
                masked_config[key] = '********'
        
        return masked_config
