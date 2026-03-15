
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import APIKey
from .services.secure_delivery import SecureDeliveryService
from .admin_views import CustomAdminAuthentication  # Use same auth as other admin endpoints

class DevToolsViewSet(viewsets.ViewSet):
    """
    Feature 9: Developer Tooling & SDKs
    Handles:
    1. Listing available SDKs
    2. Securely emailing decrypted bundles to partners
    3. Direct download of template bundles
    """
    
    authentication_classes = [CustomAdminAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='delivery/send')
    def send_bundle(self, request):
        """
        Triggers the Secure Delivery Service.
        Payload: { "email": "dev@example.com", "key_id": 123 }
        """
        email = request.data.get('email')
        key_id = request.data.get('key_id')
        
        if not email or not key_id:
            return Response(
                {"error": "Both 'email' and 'key_id' are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call the Service
        result = SecureDeliveryService.send_bundle(email, key_id, request.user)
        
        if result['status'] == 'success':
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='delivery/download')
    def download_raw(self, request):
        """
        Returns the Eduyata Developer Kit bundle (no API key pre-filled).
        Developer must paste their own key into config.js file.
        """
        result = SecureDeliveryService.generate_raw_bundle(request.user)
        
        if result['status'] == 'success':
            response = HttpResponse(result['zip_bytes'], content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="Eduyata_Developer_Kit.zip"'
            return response
        else:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def sdks(self, request):
        """
        List available SDK versions (Mocked for now as file scanning is optional)
        """
        return Response({
            "node": {"version": "2.1.0", "url": "/media/sdks/eduyata-node-2.1.0.zip"}
        })


class PublicDownloadViewSet(viewsets.ViewSet):
    """
    Handles PUBLIC, unauthenticated downloads via signed tokens.
    """
    authentication_classes = [] # Public
    permission_classes = []     # Public

    def get_kit(self, request, token=None):
        """
        Validates token and returns the generated zip.
        URL: /api/v1/public/download-kit/{token}/
        """
        print(f"DEBUG: Public Download Hit with token: {token}")
        from .utils import TokenGenerator
        from .services.secure_delivery import SecureDeliveryService
        
        # 1. Validate Token
        api_key_id = TokenGenerator.validate_token(token)
        
        if not api_key_id:
            return Response(
                {"error": "Invalid or expired download link."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # 2. Extract ID (it comes as a string from signer)
        try:
            # 3. Generate the Bundle directly
            # We re-use the generator logic but need to fetch the key first
            key_obj = APIKey.objects.get(id=api_key_id)
            
            # Generate
            from .services.developer_kit_generator import generate_developer_kit_bundle
            kit_result = generate_developer_kit_bundle(
                api_key=key_obj,
                allowed_endpoints=key_obj.allowed_endpoints
            )
            
            if kit_result['status'] != 'success':
                 return Response({"error": " Generation failed"}, status=500)
                 
            # 4. Return File
            response = HttpResponse(kit_result['zip_bytes'], content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="Eduyata_Developer_Kit.zip"'
            return response
            
        except APIKey.DoesNotExist:
             return Response({"error": "Associated API Key no longer exists."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

