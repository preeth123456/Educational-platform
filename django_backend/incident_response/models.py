# INCIDENT DETECTION FILE - Core incident response models and database structure
from django.db import models
from django.utils import timezone

class SecurityIncident(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('false_alarm', 'False Alarm'),
    ]
    
    incident_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=20)
    description = models.TextField()
    ip_address = models.GenericIPAddressField()
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.incident_type} - {self.severity}"

class LoginAttempt(models.Model):
    user_id = models.CharField(max_length=50)
    user_type = models.CharField(max_length=20)
    ip_address = models.GenericIPAddressField()
    success = models.BooleanField()
    timestamp = models.DateTimeField(default=timezone.now)

class AccountLock(models.Model):
    user_id = models.CharField(max_length=50)
    user_type = models.CharField(max_length=20)
    locked_at = models.DateTimeField(auto_now_add=True)
    unlock_at = models.DateTimeField()
    reason = models.CharField(max_length=200)
