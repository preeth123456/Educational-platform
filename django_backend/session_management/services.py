import hashlib
import secrets
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from .models import UserDevice, UserSession, SessionEvent, SessionPolicy

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def generate_device_id(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    ip = get_client_ip(request)
    accept_language = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
    
    device_string = f"{user_agent}{ip}{accept_language}"
    return hashlib.sha256(device_string.encode()).hexdigest()

def parse_user_agent(user_agent):
    browser = "Unknown"
    os = "Unknown"
    device_type = "desktop"
    
    if "Mobile" in user_agent or "Android" in user_agent:
        device_type = "mobile"
    elif "Tablet" in user_agent or "iPad" in user_agent:
        device_type = "tablet"
    
    if "Chrome" in user_agent:
        browser = "Chrome"
    elif "Firefox" in user_agent:
        browser = "Firefox"
    elif "Safari" in user_agent:
        browser = "Safari"
    elif "Edge" in user_agent:
        browser = "Edge"
    
    if "Windows" in user_agent:
        os = "Windows"
    elif "Mac" in user_agent:
        os = "macOS"
    elif "Linux" in user_agent:
        os = "Linux"
    elif "Android" in user_agent:
        os = "Android"
    elif "iOS" in user_agent:
        os = "iOS"
    
    return browser, os, device_type

class SessionManager:
    @staticmethod
    def create_session(user_id, user_type, request):
        with transaction.atomic():
            # Get or create device
            device_id = generate_device_id(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            ip_address = get_client_ip(request)
            browser, os, device_type = parse_user_agent(user_agent)
            
            device, created = UserDevice.objects.get_or_create(
                device_id=device_id,
                defaults={
                    'user_id': user_id,
                    'user_type': user_type,
                    'device_name': f"{browser} on {os}",
                    'device_type': device_type,
                    'browser': browser,
                    'os': os,
                    'ip_address': ip_address,
                }
            )
            
            if not created:
                device.last_used = timezone.now()
                device.ip_address = ip_address
                device.save()
            
            # Check session limits
            policy = SessionPolicy.objects.first()
            if not policy:
                policy = SessionPolicy.objects.create(policy_name='default')
            
            # Remove expired sessions
            UserSession.objects.filter(
                user_id=user_id,
                user_type=user_type,
                expires_at__lt=timezone.now()
            ).update(is_active=False)
            
            # Check active session limit
            active_sessions = UserSession.objects.filter(
                user_id=user_id,
                user_type=user_type,
                is_active=True
            ).count()
            
            if active_sessions >= policy.max_concurrent_sessions:
                # Deactivate oldest session
                oldest_session = UserSession.objects.filter(
                    user_id=user_id,
                    user_type=user_type,
                    is_active=True
                ).order_by('last_activity').first()
                
                if oldest_session:
                    oldest_session.is_active = False
                    oldest_session.save()
                    
                    SessionEvent.objects.create(
                        session=oldest_session,
                        user_id=user_id,
                        user_type=user_type,
                        event_type='revoked',
                        ip_address=ip_address,
                        device_id=device_id,
                        details={'reason': 'session_limit_exceeded'}
                    )
            
            # Create new session
            session_token = secrets.token_urlsafe(32)
            expires_at = timezone.now() + timedelta(minutes=policy.session_timeout_minutes)
            
            session = UserSession.objects.create(
                session_token=session_token,
                user_id=user_id,
                user_type=user_type,
                device=device,
                ip_address=ip_address,
                user_agent=user_agent,
                expires_at=expires_at
            )
            
            # Log login event
            SessionEvent.objects.create(
                session=session,
                user_id=user_id,
                user_type=user_type,
                event_type='login',
                ip_address=ip_address,
                device_id=device_id,
                details={'new_device': created}
            )
            
            return session, device, created
    
    @staticmethod
    def validate_session(session_token):
        try:
            session = UserSession.objects.select_related('device').get(
                session_token=session_token,
                is_active=True
            )
            
            if session.is_expired():
                session.is_active = False
                session.save()
                
                SessionEvent.objects.create(
                    session=session,
                    user_id=session.user_id,
                    user_type=session.user_type,
                    event_type='timeout',
                    device_id=session.device.device_id
                )
                return None
            
            # Update last activity
            session.last_activity = timezone.now()
            session.save()
            
            return session
        except UserSession.DoesNotExist:
            return None
    
    @staticmethod
    def revoke_session(session_token, reason='manual'):
        try:
            session = UserSession.objects.get(session_token=session_token)
            session.is_active = False
            session.save()
            
            SessionEvent.objects.create(
                session=session,
                user_id=session.user_id,
                user_type=session.user_type,
                event_type='revoked',
                device_id=session.device.device_id,
                details={'reason': reason}
            )
            return True
        except UserSession.DoesNotExist:
            return False
    
    @staticmethod
    def get_user_sessions(user_id, user_type):
        return UserSession.objects.filter(
            user_id=user_id,
            user_type=user_type,
            is_active=True
        ).select_related('device').order_by('-last_activity')
    
    @staticmethod
    def cleanup_expired_sessions():
        expired_sessions = UserSession.objects.filter(
            is_active=True,
            expires_at__lt=timezone.now()
        )
        
        for session in expired_sessions:
            SessionEvent.objects.create(
                session=session,
                user_id=session.user_id,
                user_type=session.user_type,
                event_type='timeout',
                device_id=session.device.device_id
            )
        
        expired_sessions.update(is_active=False)