"""
Secure Delivery Service for Eduyata Developer Kit
--------------------------------------------------
Handles:
1. Email Bundle: Sends base64-encoded zip (Gmail blocks raw zip with JS content)
2. Manual Download: Template bundle without API key (placeholder)
"""

import io
import base64
from django.core.mail import EmailMessage
from django.conf import settings
from public_api.models import APIKey


class SecureDeliveryService:
    """
    Handles the generation and delivery of Developer Kit bundles.
    
    Two modes:
    1. Email Bundle: API key pre-filled, base64-encoded (Gmail security bypass)
    2. Manual Download: No API key (placeholder), direct zip
    """

    @staticmethod
    def send_bundle(recipient_email, api_key_id, admin_user):
        """
        Generates and emails Developer Kit with API key pre-filled.
        
        Note: Gmail blocks zip files with JavaScript content. We encode the zip
        as base64 text to bypass content scanning. Developer decodes it.
        
        Args:
            recipient_email: Developer's email address
            api_key_id: ID of the APIKey to include
            admin_user: The admin sending the bundle
            
        Returns:
            dict with status and recipient
        """
        try:
            # 1. Fetch API Key
            api_key = APIKey.objects.get(id=api_key_id)
            
            # 2. Generate Secure Download Link (Feature 9 Update)
            from ..utils import TokenGenerator
            token = TokenGenerator.make_token(api_key.id)
            
            # Construct absolute URL
            # Note: In production this should come from settings.SITE_URL
            download_url = f"http://localhost:8001/api/v1/public/download-kit/{token}/"
            
            # 3. Send Email with Link
            email_subject = "Download Your Eduyata Developer Kit"
            email_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Hello,</h2>
                    <p>Your Eduyata Developer Kit is ready.</p>
                    <p>Click the link below to download your personalized SDK bundle:</p>
                    
                    <p>
                        <a href="{download_url}" style="font-size: 16px; font-weight: bold; color: #f97316;">
                            EDUYATA_DEVELOPER_TOOLKIT
                        </a>
                    </p>
                    
                    <p><em>(Link expires in 24 hours)</em></p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    
                    <h3>YOUR API KEY PERMISSIONS</h3>
                    <p><strong>Endpoints:</strong> {api_key.allowed_endpoints or 'All endpoints'}</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    
                    <p style="color: #666; font-size: 12px;">Need help? Contact your Eduyata administrator.</p>
                </body>
            </html>
            """
            
            email = EmailMessage(
                email_subject,
                email_body,
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
            )
            email.content_subtype = "html"  # Main content is now text/html
            
            # No attachments needed!
            email.send(fail_silently=False)
            
            return {
                "status": "success",
                "recipient": recipient_email,
                "message": f"Download link sent to {recipient_email}"
            }

        except APIKey.DoesNotExist:
            return {
                "status": "error",
                "message": f"API Key with ID {api_key_id} not found"
            }
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"EMAIL ERROR: {str(e)}")
            print(f"TRACEBACK: {error_details}")
            return {
                "status": "error",
                "message": str(e),
                "details": error_details
            }

    @staticmethod
    def generate_raw_bundle(admin_user):
        """
        Generates the Developer Kit without API key (manual download).
        Developer must paste their own key into config.js.
        
        Returns:
            dict with status and zip_bytes
        """
        from .developer_kit_generator import generate_developer_kit_bundle
        # No API key = all endpoints shown, placeholder in config
        return generate_developer_kit_bundle(api_key=None, allowed_endpoints=None)
