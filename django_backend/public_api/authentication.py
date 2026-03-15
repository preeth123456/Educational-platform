from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed, Throttled
from .models import APIKey


class APIKeyAuthentication(BaseAuthentication):
    """
    Feature 1 + Feature 2: API Key authentication with rate limiting and IP whitelisting
    Expects X-API-Key header with valid API key
    """
    
    def authenticate(self, request):
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            return None
        
        try:
            # Feature 1: Validate API key
            key = APIKey.objects.get(key_value=api_key, is_active=True)
            
            # Feature 2: Check IP whitelist
            ip_address = self.get_client_ip(request)
            print(f"[API_AUTH] Key: {api_key[:10]}... | IP: {ip_address}")
            
            if not key.is_ip_allowed(ip_address):
                print(f"[API_AUTH] FAILED: IP {ip_address} not whitelisted for key {key.name}")
                raise AuthenticationFailed('IP address not allowed')
            
            # Feature 2: Check rate limit
            if not key.check_rate_limit():
                print(f"[API_AUTH] FAILED: Rate limit exceeded for key {key.name}")
                raise Throttled(detail='Rate limit exceeded. Please try again later.')
            
            return (key.user, key)
            
        except APIKey.DoesNotExist:
            print(f"[API_AUTH] FAILED: Invalid or inactive API key {api_key[:10]}...")
            raise AuthenticationFailed('Invalid or inactive API key')
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
