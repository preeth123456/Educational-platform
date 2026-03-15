from django.utils import timezone
from django.http import JsonResponse
from .lockout_models import AccountLockout, LoginHistory, BlockedEntity, FraudEvent, FraudScore
from .audit import AuditLogger, get_client_ip
import json

class AccountLockoutService:
    """Service to handle account lockout and brute force protection"""
    
    @staticmethod
    def get_lockout_config():
        """Get lockout configuration from platform config with safe defaults"""
        try:
            from platform_config.models import PlatformConfig
            
            max_attempts_config = PlatformConfig.objects.filter(key='max_login_attempts').first()
            lockout_duration_config = PlatformConfig.objects.filter(key='lockout_duration_minutes').first()
            
            max_attempts = int(max_attempts_config.value) if max_attempts_config else 5
            lockout_duration = int(lockout_duration_config.value) if lockout_duration_config else 10
            
            return max_attempts, lockout_duration
        except Exception as e:
            print(f"Error getting lockout config: {e}")
            return 5, 10  # Safe defaults
    
    @staticmethod
    def check_account_lockout(user_id, user_type, username):
        """Check if account is locked before login attempt"""
        try:
            lockout, created = AccountLockout.objects.get_or_create(
                user_id=user_id,
                user_type=user_type,
                defaults={'username': username}
            )
            
            if lockout.is_currently_locked():
                remaining_seconds = lockout.get_lockout_remaining_seconds()
                return {
                    'is_locked': True,
                    'remaining_seconds': remaining_seconds,
                    'failed_attempts': lockout.failed_attempts
                }
            
            return {
                'is_locked': False,
                'failed_attempts': lockout.failed_attempts
            }
        except Exception as e:
            print(f"Error checking account lockout: {e}")
            return {'is_locked': False, 'failed_attempts': 0}
    
    @staticmethod
    def handle_failed_login(user_id, user_type, username, ip_address, user_agent, reason='invalid_credentials'):
        """Handle failed login attempt"""
        try:
            # Get or create lockout record
            lockout, created = AccountLockout.objects.get_or_create(
                user_id=user_id,
                user_type=user_type,
                defaults={'username': username}
            )
            
            # Increment failed attempts
            lockout.increment_failed_attempts(ip_address)
            
            # Log login history
            LoginHistory.objects.create(
                user_id=user_id,
                user_type=user_type,
                username=username,
                status='failed',
                ip_address=ip_address,
                user_agent=user_agent,
                failure_reason=reason
            )
            
            # Check if account is now locked
            if lockout.is_currently_locked():
                # Log lockout event
                LoginHistory.objects.create(
                    user_id=user_id,
                    user_type=user_type,
                    username=username,
                    status='locked',
                    ip_address=ip_address,
                    user_agent=user_agent,
                    failure_reason='account_locked'
                )
                
                # Create fraud event
                FraudEvent.objects.create(
                    event_type='multiple_failed_logins',
                    severity='high',
                    user_id=user_id,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    details={
                        'username': username,
                        'failed_attempts': lockout.failed_attempts,
                        'user_type': user_type
                    }
                )
                
                return {
                    'success': False,
                    'error_code': 'ACCOUNT_LOCKED',
                    'message': f'Too many failed attempts. Your account is locked for {lockout.get_lockout_remaining_seconds() // 60} minutes.',
                    'lockout_remaining_seconds': lockout.get_lockout_remaining_seconds()
                }
            else:
                max_attempts, _ = AccountLockoutService.get_lockout_config()
                attempts_left = max_attempts - lockout.failed_attempts
                
                return {
                    'success': False,
                    'error_code': 'INVALID_CREDENTIALS',
                    'message': 'Invalid username or password.',
                    'failed_attempts': lockout.failed_attempts,
                    'attempts_left': attempts_left
                }
                
        except Exception as e:
            print(f"Error handling failed login: {e}")
            return {
                'success': False,
                'error_code': 'INVALID_CREDENTIALS',
                'message': 'Invalid username or password.'
            }
    
    @staticmethod
    def handle_successful_login(user_id, user_type, username, ip_address, user_agent):
        """Handle successful login - reset lockout"""
        try:
            # Reset lockout if exists
            try:
                lockout = AccountLockout.objects.get(user_id=user_id, user_type=user_type)
                lockout.unlock()
            except AccountLockout.DoesNotExist:
                pass
            
            # Log successful login
            LoginHistory.objects.create(
                user_id=user_id,
                user_type=user_type,
                username=username,
                status='success',
                ip_address=ip_address,
                user_agent=user_agent
            )
            
        except Exception as e:
            print(f"Error handling successful login: {e}")
    
    @staticmethod
    def check_blocked_entity(ip_address, user_agent=None, email_domain=None):
        """Check if IP, user agent, or email domain is blocked"""
        try:
            # Check IP
            ip_blocked = BlockedEntity.objects.filter(
                entity_type='ip',
                entity_value=ip_address
            ).first()
            
            if ip_blocked and ip_blocked.is_currently_blocked():
                return {
                    'is_blocked': True,
                    'reason': ip_blocked.reason,
                    'entity_type': 'ip'
                }
            
            # Check user agent if provided
            if user_agent:
                ua_blocked = BlockedEntity.objects.filter(
                    entity_type='user_agent',
                    entity_value=user_agent
                ).first()
                
                if ua_blocked and ua_blocked.is_currently_blocked():
                    return {
                        'is_blocked': True,
                        'reason': ua_blocked.reason,
                        'entity_type': 'user_agent'
                    }
            
            # Check email domain if provided
            if email_domain:
                domain_blocked = BlockedEntity.objects.filter(
                    entity_type='email_domain',
                    entity_value=email_domain
                ).first()
                
                if domain_blocked and domain_blocked.is_currently_blocked():
                    return {
                        'is_blocked': True,
                        'reason': domain_blocked.reason,
                        'entity_type': 'email_domain'
                    }
            
            return {'is_blocked': False}
            
        except Exception as e:
            print(f"Error checking blocked entities: {e}")
            return {'is_blocked': False}
    
    @staticmethod
    def get_account_lockouts_for_admin():
        """Get all account lockouts for admin dashboard"""
        try:
            lockouts = AccountLockout.objects.all().order_by('-updated_at')
            
            lockout_data = []
            for lockout in lockouts:
                lockout_data.append({
                    'id': lockout.id,
                    'user_id': lockout.user_id,
                    'user_type': lockout.user_type,
                    'username': lockout.username,
                    'failed_attempts': lockout.failed_attempts,
                    'is_locked': lockout.is_currently_locked(),
                    'lockout_until': lockout.lockout_until.isoformat() if lockout.lockout_until else None,
                    'last_failed_ip': lockout.last_failed_ip,
                    'last_failed_at': lockout.last_failed_at.isoformat() if lockout.last_failed_at else None,
                    'created_at': lockout.created_at.isoformat(),
                    'updated_at': lockout.updated_at.isoformat()
                })
            
            return lockout_data
            
        except Exception as e:
            print(f"Error getting account lockouts: {e}")
            return []
    
    @staticmethod
    def unlock_user_account(user_id, user_type):
        """Unlock a user account (admin action)"""
        try:
            lockout = AccountLockout.objects.get(user_id=user_id, user_type=user_type)
            lockout.unlock()
            
            # Log admin action
            AuditLogger.log_activity(
                user_id=0,  # System/Admin action
                user_type='admin',
                action='unlock_account',
                resource_type='account_lockout',
                resource_id=lockout.id,
                details={
                    'unlocked_user_id': user_id,
                    'unlocked_user_type': user_type,
                    'username': lockout.username
                },
                ip_address='127.0.0.1',
                user_agent='Admin Dashboard'
            )
            
            return {'success': True, 'message': 'Account unlocked successfully'}
            
        except AccountLockout.DoesNotExist:
            return {'success': False, 'message': 'Account lockout record not found'}
        except Exception as e:
            print(f"Error unlocking account: {e}")
            return {'success': False, 'message': 'Failed to unlock account'}