"""
Webhook Serializers - Phase 5

Connections:
- Phase 2: Serializes WebhookEndpoint model
- Phase 1: Serializes webhook delivery logs from admin_notifications
"""

from rest_framework import serializers
from .models import WebhookEndpoint


class WebhookEndpointSerializer(serializers.ModelSerializer):
    """
    Serializer for WebhookEndpoint model (Phase 2)
    
    Used by Admin API to manage webhook endpoints
    """
    created_by_name = serializers.ReadOnlyField(source='created_by.username', default='System')
    
    class Meta:
        model = WebhookEndpoint
        fields = [
            'id',
            'name',
            'url',
            'event_types',
            'is_active',
            'created_by',
            'created_by_name',
            'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_name', 'created_at']
    
    def validate_url(self, value):
        """Validate webhook URL"""
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value


class WebhookDeliverySerializer(serializers.Serializer):
    """
    Serializer for webhook deliveries from admin_notifications table (Phase 1)
    
    Connection to Phase 1:
    - Reads from admin_notifications table (extended in Phase 1)
    - Uses webhook_* columns added in Phase 1
    """
    id = serializers.IntegerField()
    webhook_event_type = serializers.CharField()
    webhook_status = serializers.CharField()
    webhook_response_code = serializers.IntegerField(allow_null=True)
    webhook_retry_count = serializers.IntegerField()
    webhook_delivered_at = serializers.DateTimeField(allow_null=True)
    created_at = serializers.DateTimeField()
    message = serializers.CharField()
