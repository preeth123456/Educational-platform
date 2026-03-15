from django.db import models
from django.utils import timezone
import json

class UserContext(models.Model):
    CONTEXT_TYPES = [
        ('organization', 'Organization'),
        ('role', 'Role'),
        ('product', 'Product'),
        ('course', 'Course'),
    ]
    
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10)  # student, teacher, admin
    context_type = models.CharField(max_length=20, choices=CONTEXT_TYPES)
    context_id = models.CharField(max_length=50)
    context_name = models.CharField(max_length=255)
    permissions = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_contexts'
        unique_together = ['user_id', 'user_type', 'context_type', 'context_id']

class ActiveUserContext(models.Model):
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10)
    current_context = models.ForeignKey(UserContext, on_delete=models.CASCADE)
    session_token = models.CharField(max_length=255, blank=True)
    switched_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'active_user_contexts'
        unique_together = ['user_id', 'user_type']

class ContextSwitchLog(models.Model):
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10)
    from_context_id = models.CharField(max_length=50, blank=True)
    to_context_id = models.CharField(max_length=50)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    success = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'context_switch_logs'