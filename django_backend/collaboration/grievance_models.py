from django.db import models
from django.utils import timezone
from auth_app.models import Student, Educator
from admin_auth.models import Admin

class GrievanceCase(models.Model):
    GRIEVANCE_TYPES = [
        ('academic', 'Academic Issue'),
        ('harassment', 'Harassment'),
        ('discrimination', 'Discrimination'),
        ('unfair_treatment', 'Unfair Treatment'),
        ('technical', 'Technical Issue'),
        ('billing', 'Billing Dispute'),
        ('other', 'Other')
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical')
    ]
    
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('registered', 'Registered'),
        ('under_investigation', 'Under Investigation'),
        ('pending_resolution', 'Pending Resolution'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
        ('escalated', 'Escalated')
    ]

    case_id = models.CharField(max_length=20, unique=True)
    complainant_id = models.IntegerField()
    complainant_type = models.CharField(max_length=10)  # student, teacher
    respondent_id = models.IntegerField(null=True, blank=True)
    respondent_type = models.CharField(max_length=10, null=True, blank=True)
    
    grievance_type = models.CharField(max_length=20, choices=GRIEVANCE_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    incident_date = models.DateTimeField(null=True, blank=True)
    
    assigned_investigator = models.IntegerField(null=True, blank=True)
    investigation_notes = models.TextField(blank=True)
    resolution_summary = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    registered_at = models.DateTimeField(null=True, blank=True)
    investigation_started_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'grievance_cases'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.case_id:
            import random
            self.case_id = f"GRV{timezone.now().year}{random.randint(10000, 99999)}"
        super().save(*args, **kwargs)

class GrievanceEvidence(models.Model):
    case = models.ForeignKey(GrievanceCase, on_delete=models.CASCADE, related_name='evidence')
    file_path = models.CharField(max_length=500)
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    uploaded_by = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'grievance_evidence'

class GrievanceTimeline(models.Model):
    case = models.ForeignKey(GrievanceCase, on_delete=models.CASCADE, related_name='timeline')
    action = models.CharField(max_length=100)
    description = models.TextField()
    performed_by = models.IntegerField()
    performed_by_type = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'grievance_timeline'
        ordering = ['timestamp']

class GrievanceNotification(models.Model):
    case = models.ForeignKey(GrievanceCase, on_delete=models.CASCADE, related_name='notifications')
    recipient_id = models.IntegerField()
    recipient_type = models.CharField(max_length=10)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'grievance_notifications'