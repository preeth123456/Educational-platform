from django.db import models
from django.contrib.auth.models import User
import json

class AuditLog(models.Model):
    USER_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=50)
    resource_id = models.IntegerField(null=True, blank=True)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        indexes = [
            models.Index(fields=['user_id', 'timestamp']),
            models.Index(fields=['action']),
            models.Index(fields=['resource_type', 'resource_id']),
        ]

class SecurityEvent(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    event_type = models.CharField(max_length=50)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    user_id = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    metadata = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField()
    resolved = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'security_events'
        indexes = [
            models.Index(fields=['severity', 'timestamp']),
            models.Index(fields=['user_id']),
            models.Index(fields=['resolved']),
        ]