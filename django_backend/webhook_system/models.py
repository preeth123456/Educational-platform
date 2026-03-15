from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from admin_auth.models import AdminNotification

class WebhookEndpoint(models.Model):
    """
    Webhook endpoint configuration
    
    Connections:
    - Feature 1: Uses same User model as APIKey
    - Feature 2: Can optionally link to APIKey (future enhancement)
    - Phase 1: Maps to webhook_endpoints table created in database
    """
    name = models.CharField(max_length=200, help_text="Webhook endpoint name")
    url = models.TextField(help_text="Webhook URL to send events to")
    event_types = models.CharField(
        max_length=500, 
        blank=True,
        help_text="Comma-separated event types (empty = all events)"
    )
    is_active = models.BooleanField(default=True, help_text="Enable/disable webhook")
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        db_column='created_by',
        help_text="User who created this webhook"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    secret_key = models.CharField(
        max_length=64,
        blank=True,
        help_text="Secret key for HMAC signature verification"
    )
    
    class Meta:
        db_table = 'webhook_endpoints'
        verbose_name = 'Webhook Endpoint'
        verbose_name_plural = 'Webhook Endpoints'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.url[:50]}"
    
    def save(self, *args, **kwargs):
        if not self.id:
            # Manual ID generation for tables without AUTO_INCREMENT
            max_id = WebhookEndpoint.objects.aggregate(models.Max('id'))['id__max']
            self.id = (max_id or 0) + 1
        
        # Generate secret key if not exists
        if not self.secret_key:
            import secrets
            self.secret_key = secrets.token_hex(32)
        
        super().save(*args, **kwargs)

    def subscribes_to(self, event_type):
        """
        Check if this endpoint subscribes to a specific event type
        
        Args:
            event_type (str): Event type to check (e.g., 'student.enrolled')
        
        Returns:
            bool: True if subscribed, False otherwise
        """
        if not self.event_types:
            return True  # Subscribe to all events
        return event_type in self.event_types.split(',')

@receiver(pre_delete, sender=WebhookEndpoint)
def cleanup_webhook_logs(sender, instance, **kwargs):
    """
    Universally clean up delivery logs when a webhook is deleted (Best/Feature 1)
    """
    AdminNotification.objects.filter(
        webhook_endpoint_id=instance.id,
        notification_type='webhook'
    ).delete()
