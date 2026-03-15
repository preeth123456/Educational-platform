from django.db import models
from django.utils import timezone
from datetime import timedelta

class AccountLockout(models.Model):
    """Track account lockouts for brute force protection"""
    USER_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    username = models.CharField(max_length=255)  # email or student_id
    failed_attempts = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    lockout_until = models.DateTimeField(null=True, blank=True)
    last_failed_ip = models.GenericIPAddressField(null=True, blank=True)
    last_failed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'account_lockout'
        unique_together = ['user_id', 'user_type']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['is_locked']),
            models.Index(fields=['lockout_until']),
        ]
    
    def is_currently_locked(self):
        """Check if account is currently locked"""
        if not self.is_locked:
            return False
        if self.lockout_until and timezone.now() > self.lockout_until:
            # Auto-unlock expired lockouts
            self.unlock()
            return False
        return True
    
    def lock_account(self, duration_minutes=10):
        """Lock the account for specified duration"""
        self.is_locked = True
        self.lockout_until = timezone.now() + timedelta(minutes=duration_minutes)
        self.save()
    
    def unlock(self):
        """Unlock the account and reset failed attempts"""
        self.is_locked = False
        self.failed_attempts = 0
        self.lockout_until = None
        self.save()
    
    def increment_failed_attempts(self, ip_address=None):
        """Increment failed attempts and lock if threshold reached"""
        self.failed_attempts += 1
        self.last_failed_at = timezone.now()
        if ip_address:
            self.last_failed_ip = ip_address
        
        # Get lockout config from platform settings
        try:
            from platform_config.models import PlatformConfig
            max_attempts_config = PlatformConfig.objects.filter(key='max_login_attempts').first()
            lockout_duration_config = PlatformConfig.objects.filter(key='lockout_duration_minutes').first()
            
            max_attempts = int(max_attempts_config.value) if max_attempts_config else 5
            lockout_duration = int(lockout_duration_config.value) if lockout_duration_config else 10
        except:
            max_attempts = 5
            lockout_duration = 10
        
        if self.failed_attempts >= max_attempts:
            self.lock_account(lockout_duration)
        else:
            self.save()
    
    def get_lockout_remaining_seconds(self):
        """Get remaining lockout time in seconds"""
        if not self.is_locked or not self.lockout_until:
            return 0
        remaining = self.lockout_until - timezone.now()
        return max(0, int(remaining.total_seconds()))


class LoginHistory(models.Model):
    """Track all login attempts for security monitoring"""
    USER_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('locked', 'Account Locked'),
    ]
    
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    username = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    failure_reason = models.CharField(max_length=100, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'login_history'
        indexes = [
            models.Index(fields=['user_id', 'timestamp']),
            models.Index(fields=['username', 'timestamp']),
            models.Index(fields=['status']),
            models.Index(fields=['ip_address']),
        ]


class BlockedEntity(models.Model):
    """Track blocked IPs and other entities"""
    ENTITY_TYPES = [
        ('ip', 'IP Address'),
        ('user_agent', 'User Agent'),
        ('email_domain', 'Email Domain'),
    ]
    
    entity_type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    entity_value = models.CharField(max_length=255)
    reason = models.TextField()
    blocked_until = models.DateTimeField(null=True, blank=True)
    is_permanent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()  # Admin user ID
    
    class Meta:
        db_table = 'blocked_entities'
        unique_together = ['entity_type', 'entity_value']
        indexes = [
            models.Index(fields=['entity_type', 'entity_value']),
            models.Index(fields=['blocked_until']),
        ]
    
    def is_currently_blocked(self):
        """Check if entity is currently blocked"""
        if self.is_permanent:
            return True
        if self.blocked_until and timezone.now() > self.blocked_until:
            return False
        return True


class FraudEvent(models.Model):
    """Track potential fraud events"""
    EVENT_TYPES = [
        ('multiple_failed_logins', 'Multiple Failed Logins'),
        ('suspicious_ip', 'Suspicious IP Address'),
        ('rapid_requests', 'Rapid API Requests'),
        ('account_enumeration', 'Account Enumeration'),
        ('credential_stuffing', 'Credential Stuffing'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    user_id = models.IntegerField(null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    details = models.JSONField(default=dict)
    resolved = models.BooleanField(default=False)
    resolved_by = models.IntegerField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'fraud_events'
        indexes = [
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['severity', 'resolved']),
            models.Index(fields=['ip_address']),
        ]


class FraudScore(models.Model):
    """Track fraud scores for users and IPs"""
    ENTITY_TYPES = [
        ('user', 'User'),
        ('ip', 'IP Address'),
    ]
    
    entity_type = models.CharField(max_length=10, choices=ENTITY_TYPES)
    entity_id = models.CharField(max_length=255)  # user_id or IP address
    score = models.IntegerField(default=0)  # 0-100 fraud score
    last_updated = models.DateTimeField(auto_now=True)
    factors = models.JSONField(default=dict)  # Contributing factors
    
    class Meta:
        db_table = 'fraud_scores'
        unique_together = ['entity_type', 'entity_id']
        indexes = [
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['score']),
        ]