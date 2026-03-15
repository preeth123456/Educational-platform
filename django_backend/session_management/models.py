from django.db import models
from django.utils import timezone
from datetime import timedelta
import json

class SessionPolicy(models.Model):
    policy_name = models.CharField(max_length=100)
    max_concurrent_sessions = models.IntegerField(default=3)
    session_timeout_minutes = models.IntegerField(default=1440)  # 24 hours
    max_devices_per_user = models.IntegerField(default=5)
    require_device_approval = models.BooleanField(default=False)
    auto_logout_inactive = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'session_policies'

class UserDevice(models.Model):
    USER_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    device_id = models.CharField(max_length=255, unique=True)
    device_name = models.CharField(max_length=255, blank=True)
    device_type = models.CharField(max_length=50, blank=True)  # mobile, desktop, tablet
    browser = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    is_trusted = models.BooleanField(default=False)
    last_used = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_devices'
        indexes = [
            models.Index(fields=['user_id', 'user_type']),
            models.Index(fields=['device_id']),
        ]

class UserSession(models.Model):
    USER_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    session_token = models.CharField(max_length=255, unique=True)
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    device = models.ForeignKey(UserDevice, on_delete=models.CASCADE, to_field='device_id')
    current_context_id = models.IntegerField(blank=True, null=True)  # Current active context
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    last_activity = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_sessions'
        indexes = [
            models.Index(fields=['session_token']),
            models.Index(fields=['user_id', 'user_type']),
            models.Index(fields=['is_active', 'expires_at']),
        ]

    def is_expired(self):
        return timezone.now() > self.expires_at

    def extend_session(self, minutes=None):
        policy = SessionPolicy.objects.first()
        timeout = minutes or policy.session_timeout_minutes
        self.expires_at = timezone.now() + timedelta(minutes=timeout)
        self.save()

class SessionEvent(models.Model):
    EVENT_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('timeout', 'Timeout'),
        ('revoked', 'Revoked'),
        ('device_change', 'Device Change'),
    ]
    
    USER_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    session = models.ForeignKey(UserSession, on_delete=models.SET_NULL, null=True, blank=True)
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    device_id = models.CharField(max_length=255, blank=True)
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'session_events'
        indexes = [
            models.Index(fields=['user_id', 'user_type']),
            models.Index(fields=['event_type']),
        ]