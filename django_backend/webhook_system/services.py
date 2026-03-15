"""
Webhook Delivery Service - Phase 3

Connections:
- Phase 1: Logs deliveries in admin_notifications table (extended in Phase 1)
- Phase 2: Uses WebhookEndpoint model from Phase 2
- Phase 6: Uses configuration from settings.py
- Feature 1: No direct connection (will trigger on Feature 1 events in Phase 4)
- Feature 2: No direct connection (separate functionality)
"""

import requests
import json
import logging
from django.utils import timezone
from django.conf import settings
from .models import WebhookEndpoint
from admin_auth.models import AdminNotification

logger = logging.getLogger(__name__)


class WebhookService:
    """
    Service for delivering webhooks to external endpoints
    
    Features:
    - Sends HTTP POST requests to webhook URLs
    - Logs all deliveries in admin_notifications table (Phase 1 extension)
    - Retries failed deliveries up to 3 times
    - Tracks delivery status and response codes
    - Uses configuration from settings.py (Phase 6)
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': getattr(settings, 'WEBHOOK_USER_AGENT', 'Eduyata-Webhook/1.0')
        })
        self.timeout = getattr(settings, 'WEBHOOK_TIMEOUT', 30)
        self.max_retries = getattr(settings, 'WEBHOOK_MAX_RETRIES', 3)
    
    def trigger_event(self, event_type, event_data):
        """
        Trigger webhook for all active endpoints subscribed to this event
        
        Args:
            event_type (str): Event type (e.g., 'student.enrolled')
            event_data (dict): Event data to send
        
        Returns:
            int: Number of webhooks triggered
        """
        # Get all active endpoints
        endpoints = WebhookEndpoint.objects.filter(is_active=True)
        
        triggered_count = 0
        for endpoint in endpoints:
            # Check if endpoint subscribes to this event
            if endpoint.subscribes_to(event_type):
                self.deliver_webhook(endpoint, event_type, event_data)
                triggered_count += 1
        
        logger.info(f"Triggered {triggered_count} webhooks for event: {event_type}")
        return triggered_count
    
    def deliver_webhook(self, endpoint, event_type, event_data, retry_count=0):
        """
        Deliver webhook to a specific endpoint
        
        Args:
            endpoint (WebhookEndpoint): Endpoint to deliver to
            event_type (str): Event type
            event_data (dict): Event data
            retry_count (int): Current retry attempt (0-2)
        
        Returns:
            bool: True if delivered successfully, False otherwise
        
        Connection to Phase 1:
        - Logs delivery in admin_notifications table (extended with webhook columns)
        """
        # Create delivery log in admin_notifications (Phase 1 extended table)
        delivery = AdminNotification.objects.create(
            title=f"Webhook: {event_type}",
            message=f"Delivery to {endpoint.name}",
            notification_type='webhook',
            is_read=False,
            # Phase 1 webhook columns:
            webhook_endpoint_id=endpoint.id,
            webhook_event_type=event_type,
            webhook_event_data=event_data,
            webhook_status='pending',
            webhook_retry_count=retry_count,
            webhook_response_code=None,
            webhook_delivered_at=None
        )
        
        try:
            # Prepare payload
            payload = {
                'event': event_type,
                'timestamp': timezone.now().isoformat(),
                'data': event_data
            }
            payload_json = json.dumps(payload)
            
            # Generate HMAC signature for security
            import hmac
            import hashlib
            signature = hmac.new(
                endpoint.secret_key.encode(),
                payload_json.encode(),
                hashlib.sha256
            ).hexdigest()
            
            # Add signature to headers
            headers = {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': f'sha256={signature}',
                'X-Webhook-Event': event_type,
                'X-Webhook-Timestamp': payload['timestamp']
            }
            
            # Send webhook
            response = requests.post(
                endpoint.url,
                data=payload_json,
                headers=headers,
                timeout=self.timeout
            )
            
            # Update delivery log with response
            delivery.webhook_response_code = response.status_code
            
            if response.status_code < 400:
                # Success
                delivery.webhook_status = 'delivered'
                delivery.webhook_delivered_at = timezone.now()
                delivery.message = f"Successfully delivered to {endpoint.name}"
                logger.info(f"Webhook delivered: {delivery.id} to {endpoint.url}")
            else:
                # HTTP error
                delivery.webhook_status = 'failed'
                delivery.message = f"HTTP {response.status_code}: {response.text[:200]}"
                logger.warning(f"Webhook failed: {delivery.id} - HTTP {response.status_code}")
            
            delivery.save()
            return response.status_code < 400
            
        except requests.exceptions.Timeout:
            # Timeout error
            delivery.webhook_status = 'failed'
            delivery.message = f"Timeout after {self.timeout} seconds"
            delivery.save()
            logger.error(f"Webhook timeout: {delivery.id}")
            
            # Retry if under max retries
            if retry_count < self.max_retries:
                logger.info(f"Retrying webhook {delivery.id} (attempt {retry_count + 1})")
                return self.deliver_webhook(endpoint, event_type, event_data, retry_count + 1)
            
            return False
            
        except requests.exceptions.RequestException as e:
            # Connection error
            delivery.webhook_status = 'failed'
            delivery.message = f"Connection error: {str(e)[:200]}"
            delivery.save()
            logger.error(f"Webhook connection error: {delivery.id} - {str(e)}")
            
            # Retry if under max retries
            if retry_count < self.max_retries:
                logger.info(f"Retrying webhook {delivery.id} (attempt {retry_count + 1})")
                return self.deliver_webhook(endpoint, event_type, event_data, retry_count + 1)
            
            return False
            
        except Exception as e:
            # Unexpected error
            delivery.webhook_status = 'failed'
            delivery.message = f"Unexpected error: {str(e)[:200]}"
            delivery.save()
            logger.error(f"Webhook unexpected error: {delivery.id} - {str(e)}")
            return False
    
    def test_webhook(self, endpoint):
        """
        Send a test webhook to verify endpoint is working
        
        Args:
            endpoint (WebhookEndpoint): Endpoint to test
        
        Returns:
            dict: Test result with status and message
        """
        test_data = {
            'message': 'Test webhook from Eduyata',
            'endpoint_name': endpoint.name,
            'timestamp': timezone.now().isoformat()
        }
        
        success = self.deliver_webhook(endpoint, 'webhook.test', test_data)
        
        return {
            'success': success,
            'message': 'Test webhook sent successfully' if success else 'Test webhook failed'
        }


# Global webhook service instance
webhook_service = WebhookService()
