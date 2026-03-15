from django.db import connection
from django.utils import timezone
import json
import logging
from .forensic_audit import ForensicAuditLogger

logger = logging.getLogger(__name__)

class AuditLogger:
    @staticmethod
    def log_activity(user_id, user_type, action, resource_type, resource_id=None, 
                    details=None, ip_address=None, user_agent=None):
        """Log user activity to audit_logs table (legacy method)"""
        try:
            # Log to legacy table for backward compatibility
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO audit_logs 
                    (user_id, user_type, action, resource_type, resource_id, details, ip_address, user_agent, timestamp)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    user_id, user_type, action, resource_type, resource_id,
                    json.dumps(details or {}), ip_address, user_agent, timezone.now()
                ])
            
            # Also log to enhanced forensic system
            ForensicAuditLogger.log_comprehensive_activity(
                actor_id=user_id,
                actor_type=user_type,
                action=action,
                target_type=resource_type,
                target_id=str(resource_id) if resource_id else None,
                metadata=details,
                ip_address=ip_address,
                user_agent=user_agent
            )
            
        except Exception as e:
            logger.error(f"Failed to log audit activity: {e}")

    @staticmethod
    def log_security_event(event_type, severity, description, user_id=None, 
                          metadata=None, ip_address=None):
        """Log security event to security_events table"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO security_events 
                    (event_type, severity, user_id, description, metadata, ip_address, timestamp)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, [
                    event_type, severity, user_id, description,
                    json.dumps(metadata or {}), ip_address, timezone.now()
                ])
        except Exception as e:
            logger.error(f"Failed to log security event: {e}")

    @staticmethod
    def get_user_activity(user_id, limit=50, offset=0):
        """Get user activity history"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT action, resource_type, resource_id, details, timestamp
                    FROM audit_logs 
                    WHERE user_id = %s 
                    ORDER BY timestamp DESC 
                    LIMIT %s OFFSET %s
                """, [user_id, limit, offset])
                
                columns = [col[0] for col in cursor.description]
                return [dict(zip(columns, row)) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Failed to get user activity: {e}")
            return []

    @staticmethod
    def get_security_events(user_id=None, resolved=None, limit=50, offset=0):
        """Get security events"""
        try:
            with connection.cursor() as cursor:
                query = "SELECT * FROM security_events WHERE 1=1"
                params = []
                
                if user_id:
                    query += " AND user_id = %s"
                    params.append(user_id)
                
                if resolved is not None:
                    query += " AND resolved = %s"
                    params.append(resolved)
                
                query += " ORDER BY timestamp DESC LIMIT %s OFFSET %s"
                params.extend([limit, offset])
                
                cursor.execute(query, params)
                columns = [col[0] for col in cursor.description]
                return [dict(zip(columns, row)) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Failed to get security events: {e}")
            return []

# Activity tracking decorators and helpers
def track_activity(action, resource_type):
    """Decorator to track user activities"""
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            result = func(request, *args, **kwargs)
            
            # Extract user info from request
            user_id = getattr(request, 'user_id', None)
            user_type = getattr(request, 'user_type', 'unknown')
            
            if user_id:
                AuditLogger.log_activity(
                    user_id=user_id,
                    user_type=user_type,
                    action=action,
                    resource_type=resource_type,
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
            
            return result
        return wrapper
    return decorator

def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def detect_suspicious_activity(user_id, action, ip_address):
    """Detect suspicious activities and log security events"""
    try:
        with connection.cursor() as cursor:
            # Check for multiple failed logins
            if action == 'login_failed':
                cursor.execute("""
                    SELECT COUNT(*) FROM audit_logs 
                    WHERE user_id = %s AND action = 'login_failed' 
                    AND timestamp > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
                """, [user_id])
                
                failed_attempts = cursor.fetchone()[0]
                if failed_attempts >= 5:
                    AuditLogger.log_security_event(
                        event_type='multiple_failed_logins',
                        severity='high',
                        description=f'User {user_id} has {failed_attempts} failed login attempts in 15 minutes',
                        user_id=user_id,
                        ip_address=ip_address
                    )
            
            # Check for unusual IP access
            cursor.execute("""
                SELECT DISTINCT ip_address FROM audit_logs 
                WHERE user_id = %s AND timestamp > DATE_SUB(NOW(), INTERVAL 7 DAY)
            """, [user_id])
            
            recent_ips = [row[0] for row in cursor.fetchall()]
            if ip_address not in recent_ips and len(recent_ips) > 0:
                AuditLogger.log_security_event(
                    event_type='unusual_ip_access',
                    severity='medium',
                    description=f'User {user_id} accessed from new IP: {ip_address}',
                    user_id=user_id,
                    ip_address=ip_address
                )
                
    except Exception as e:
        logger.error(f"Failed to detect suspicious activity: {e}")