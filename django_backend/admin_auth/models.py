from django.db import models
from django.utils import timezone

class AdminNotification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='teacher_registration')
    teacher_id = models.CharField(max_length=20, blank=True, null=True)
    teacher_name = models.CharField(max_length=255, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Feature 3: Webhook Delivery Fields
    webhook_endpoint_id = models.IntegerField(null=True, blank=True)
    webhook_event_type = models.CharField(max_length=100, null=True, blank=True)
    webhook_event_data = models.JSONField(null=True, blank=True) 
    webhook_status = models.CharField(
        max_length=20, 
        choices=[('pending', 'Pending'), ('delivered', 'Delivered'), ('failed', 'Failed')],
        null=True, blank=True
    )
    webhook_response_code = models.IntegerField(null=True, blank=True)
    webhook_retry_count = models.IntegerField(default=0)
    webhook_delivered_at = models.DateTimeField(null=True, blank=True)
    
    # Feature 13: Monitoring & Analytics
    job_metadata = models.JSONField(null=True, blank=True, help_text="Background job execution metadata")
    
    class Meta:
        db_table = 'admin_notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['notification_type', 'webhook_status'], name='idx_admin_notify_type_status'),
            models.Index(fields=['created_at'], name='idx_admin_notify_created'),
        ]
    
    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            # Manual ID generation for tables without AUTO_INCREMENT
            max_id = AdminNotification.objects.aggregate(models.Max('id'))['id__max']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)

class TeacherEmailLog(models.Model):
    id = models.AutoField(primary_key=True)
    teacher_id = models.IntegerField()
    email_subject = models.CharField(max_length=255)
    email_body = models.TextField()
    sent_status = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'teacher_email_logs'
        managed = False

class Admin(models.Model):
    ROLE_CHOICES = [
        ('Teacher Admin', 'Teacher Admin'),
        ('Course Admin', 'Course Admin'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    assigned_area = models.CharField(max_length=500, null=True, blank=True)
    joined_date = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admins'
        managed = True
    
    def __str__(self):
        return f"{self.name} ({self.email})"

class AdminEmailLog(models.Model):
    id = models.AutoField(primary_key=True)
    admin_id = models.IntegerField()
    email_subject = models.CharField(max_length=255)
    email_body = models.TextField()
    sent_status = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'admin_email_logs'
        managed = False

class Student(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    id = models.AutoField(primary_key=True)
    student_id = models.CharField(max_length=20)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    mobile_self = models.CharField(max_length=15, null=True, blank=True)
    class_name = models.CharField(max_length=255, null=True, blank=True, db_column='class')
    board = models.CharField(max_length=255, null=True, blank=True)
    profile_picture = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    password_hash = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    parent_name = models.CharField(max_length=255, null=True, blank=True)
    parent_phone = models.CharField(max_length=15, null=True, blank=True)
    interests = models.TextField(null=True, blank=True)
    profile_completed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'students'
        managed = False
    
    def __str__(self):
        return f"{self.name} ({self.student_id})"

class BackupHistory(models.Model):
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    id = models.AutoField(primary_key=True)
    filename = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='success')
    created_by = models.CharField(max_length=100)

    class Meta:
        db_table = 'backup_history'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.filename} ({self.status})"
