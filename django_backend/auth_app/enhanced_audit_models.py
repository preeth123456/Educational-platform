from django.db import models
import json
import hashlib
from django.utils import timezone

class AuditLogEnhanced(models.Model):
    ACTOR_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
        ('system', 'System'),
    ]
    
    actor_id = models.IntegerField()
    actor_type = models.CharField(max_length=10, choices=ACTOR_TYPES)
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=50)
    target_id = models.CharField(max_length=100, null=True, blank=True)
    before_state = models.JSONField(null=True, blank=True)
    after_state = models.JSONField(null=True, blank=True)
    metadata = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(null=True, blank=True)
    session_id = models.CharField(max_length=255, null=True, blank=True)
    request_id = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    hash_chain = models.CharField(max_length=64, null=True, blank=True)
    
    class Meta:
        db_table = 'audit_logs_enhanced'
        indexes = [
            models.Index(fields=['actor_id', 'timestamp']),
            models.Index(fields=['action']),
            models.Index(fields=['target_type', 'target_id']),
            models.Index(fields=['timestamp']),
        ]

class DataAccessLog(models.Model):
    ACTOR_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
        ('system', 'System'),
    ]
    
    actor_id = models.IntegerField()
    actor_type = models.CharField(max_length=10, choices=ACTOR_TYPES)
    data_type = models.CharField(max_length=50)
    data_subject_id = models.IntegerField(null=True, blank=True)
    access_method = models.CharField(max_length=50)
    purpose = models.CharField(max_length=100)
    legal_basis = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'data_access_logs'
        indexes = [
            models.Index(fields=['actor_id', 'timestamp']),
            models.Index(fields=['data_subject_id']),
            models.Index(fields=['data_type']),
        ]

class AdminActionLog(models.Model):
    RISK_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    admin_id = models.IntegerField()
    action_type = models.CharField(max_length=50)
    target_type = models.CharField(max_length=50, null=True, blank=True)
    target_id = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField()
    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS, default='low')
    approval_required = models.BooleanField(default=False)
    approved_by = models.IntegerField(null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'admin_actions_log'
        indexes = [
            models.Index(fields=['admin_id', 'timestamp']),
            models.Index(fields=['action_type']),
            models.Index(fields=['risk_level']),
        ]

class PolicyChangeLog(models.Model):
    CHANGE_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    ]
    
    changed_by = models.IntegerField()
    policy_type = models.CharField(max_length=50)
    policy_name = models.CharField(max_length=100)
    change_type = models.CharField(max_length=10, choices=CHANGE_TYPES)
    old_value = models.JSONField(null=True, blank=True)
    new_value = models.JSONField(null=True, blank=True)
    reason = models.TextField(null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'policy_changes_log'
        indexes = [
            models.Index(fields=['changed_by', 'timestamp']),
            models.Index(fields=['policy_type']),
        ]

class DataExportLog(models.Model):
    exported_by = models.IntegerField()
    export_type = models.CharField(max_length=50)
    data_types = models.JSONField()
    filters = models.JSONField(null=True, blank=True)
    record_count = models.IntegerField(null=True, blank=True)
    file_hash = models.CharField(max_length=64, null=True, blank=True)
    retention_period = models.IntegerField(null=True, blank=True)
    purpose = models.CharField(max_length=200)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'data_exports_log'
        indexes = [
            models.Index(fields=['exported_by', 'timestamp']),
            models.Index(fields=['export_type']),
        ]

class IncidentResponseLog(models.Model):
    incident_id = models.CharField(max_length=50)
    responder_id = models.IntegerField()
    action_type = models.CharField(max_length=50)
    description = models.TextField()
    evidence = models.JSONField(null=True, blank=True)
    impact_assessment = models.TextField(null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'incident_response_log'
        indexes = [
            models.Index(fields=['incident_id']),
            models.Index(fields=['responder_id', 'timestamp']),
        ]

class AuditIntegrity(models.Model):
    table_name = models.CharField(max_length=50, unique=True)
    record_count = models.BigIntegerField()
    hash_chain_head = models.CharField(max_length=64)
    last_verified = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'audit_integrity'