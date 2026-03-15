from django.db import models
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password, check_password
import json
from .encryption import EncryptionManager
from .lockout_models import AccountLockout, LoginHistory, BlockedEntity, FraudEvent, FraudScore

# =======================
# STUDENT MODEL
# =======================
class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, blank=True, null=True)
    mobile_self = models.CharField(max_length=15, unique=True)
    class_level = models.CharField(max_length=255, db_column='class')
    board = models.CharField(max_length=255)
    profile_picture = models.TextField(blank=True)
    password_hash = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    parent_name = models.CharField(max_length=255, blank=True)
    parent_phone = models.CharField(max_length=15, blank=True)
    interests = models.TextField(blank=True)
    profile_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Encrypted fields
    mobile_self_encrypted = models.TextField(blank=True, null=True)
    address_encrypted = models.TextField(blank=True, null=True)
    parent_phone_encrypted = models.TextField(blank=True, null=True)
    encryption_key_id = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'students'

    @property
    def phone(self):
        return self.get_mobile_self()

    @property
    def password(self):
        return self.password_hash
    
    def encrypt_sensitive_data(self):
        """Encrypt sensitive PII fields"""
        if self.mobile_self and not self.mobile_self_encrypted:
            self.mobile_self_encrypted = EncryptionManager.encrypt(self.mobile_self)
        if self.address and not self.address_encrypted:
            self.address_encrypted = EncryptionManager.encrypt(self.address)
        if self.parent_phone and not self.parent_phone_encrypted:
            self.parent_phone_encrypted = EncryptionManager.encrypt(self.parent_phone)
    
    def get_mobile_self(self):
        """Get decrypted mobile number"""
        if self.mobile_self_encrypted:
            return EncryptionManager.decrypt(self.mobile_self_encrypted) or self.mobile_self
        return self.mobile_self
    
    def get_address(self):
        """Get decrypted address"""
        if self.address_encrypted:
            return EncryptionManager.decrypt(self.address_encrypted) or self.address
        return self.address
    
    def get_parent_phone(self):
        """Get decrypted parent phone"""
        if self.parent_phone_encrypted:
            return EncryptionManager.decrypt(self.parent_phone_encrypted) or self.parent_phone
        return self.parent_phone
    
    @property
    def is_data_encrypted(self):
        """Check if sensitive data is encrypted"""
        return bool(self.mobile_self_encrypted or self.address_encrypted or self.parent_phone_encrypted)

    def check_profile_completion(self):
        required_fields = [
            self.name, self.gender, self.mobile_self, self.class_level,
            self.board, self.date_of_birth, self.address, self.parent_name,
            self.parent_phone
        ]
        was_incomplete = not self.profile_completed
        if all(field for field in required_fields):
            self.profile_completed = True
            self.save()

            if was_incomplete:
                from django.db import connection
                try:
                    with connection.cursor() as cursor:
                        cursor.execute(
                            """
                            UPDATE student_notifications
                            SET is_read = %s
                            WHERE student_id = %s AND message LIKE %s AND is_read = %s
                            """,
                            [True, self.id, "%Complete your profile%", False]
                        )
                        cursor.execute(
                            """
                            INSERT INTO student_notifications (student_id, message, is_read, created_at)
                            VALUES (%s, %s, %s, NOW())
                            """,
                            [self.id, "You have completed your profile and you are good to go!", False]
                        )
                except Exception as e:
                    print(f"Failed to update/create notifications: {e}")

        return self.profile_completed


# =======================
# EDUCATOR MODEL
# =======================
class Educator(models.Model):
    teacher_id = models.CharField(max_length=20, unique=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15, unique=True)
    password_hash = models.CharField(max_length=255)
    subject = models.CharField(max_length=100, blank=True, null=True)
    qualification = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    highest_qualification = models.CharField(max_length=255, blank=True)
    experience_years = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    boards = models.JSONField(default=list)
    subject_classes = models.JSONField(default=dict)
    languages_known = models.JSONField(default=list)
    teaching_experience_institutes = models.JSONField(default=list)
    cv_file = models.CharField(max_length=500, blank=True)
    achievements_file = models.CharField(max_length=500, blank=True)
    experience_proof_file = models.CharField(max_length=500, blank=True)
    government_id_file = models.CharField(max_length=500, blank=True, default='')
    profile_picture = models.CharField(max_length=500, blank=True)
    degree_certificate = models.CharField(max_length=500, blank=True)
    degree_certificate_file = models.CharField(max_length=500, blank=True)
    profile_completed = models.BooleanField(default=True)
    is_active = models.BooleanField(default=False)
    approval_status = models.CharField(max_length=20, default='pending')
    document_status = models.CharField(max_length=20, default='Pending Verification')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Encrypted fields
    mobile_encrypted = models.TextField(blank=True, null=True)
    email_encrypted = models.TextField(blank=True, null=True)
    encryption_key_id = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'educators'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        from django.utils import timezone
        
        # Encrypt sensitive data before saving
        self.encrypt_sensitive_data()
        
        # Save once to ensure we have an ID
        is_new = self.pk is None
        super().save(*args, **kwargs)

        # Generate teacher ID only for new objects
        if is_new:
            year = self.created_at.year if hasattr(self, "created_at") else timezone.now().year
            seq = f"{self.pk:05d}"
            self.teacher_id = f"TCH{year}{seq}"
            super().save(update_fields=['teacher_id'])

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)

    def get_subjects(self):
        return list(self.subject_classes.keys()) if self.subject_classes else []

    def get_classes_for_subject(self, subject):
        return self.subject_classes.get(subject, []) if self.subject_classes else []

    def get_all_classes(self):
        if not self.subject_classes:
            return []
        all_classes = set()
        for classes in self.subject_classes.values():
            all_classes.update(classes)
        return sorted(list(all_classes), key=int) if all_classes else []
    
    def encrypt_sensitive_data(self):
        """Encrypt sensitive PII fields"""
        if self.mobile and not self.mobile_encrypted:
            self.mobile_encrypted = EncryptionManager.encrypt(self.mobile)
            # Clear plain text after encryption
            self.mobile = "[ENCRYPTED]"
        if self.email and not self.email_encrypted:
            self.email_encrypted = EncryptionManager.encrypt(self.email)
            # Clear plain text after encryption  
            self.email = f"encrypted_{self.pk or 'new'}@encrypted.local"
    
    def get_mobile(self):
        """Get decrypted mobile number"""
        if self.mobile_encrypted:
            return EncryptionManager.decrypt(self.mobile_encrypted) or self.mobile
        return self.mobile
    
    def get_email(self):
        """Get decrypted email"""
        if self.email_encrypted:
            return EncryptionManager.decrypt(self.email_encrypted) or self.email
        return self.email
    
    @property
    def is_data_encrypted(self):
        """Check if sensitive data is encrypted"""
        return bool(self.mobile_encrypted or self.email_encrypted)


class Teacher(Educator):
    class Meta:
        proxy = True
        verbose_name = "Teacher"
        verbose_name_plural = "Teachers"


# =======================
# ENROLLMENT MODEL
# =======================
class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='active')

    class Meta:
        db_table = 'student_enrollments'


# =======================
# STUDENT ACTIVITY MODEL (For Feature 2 Rate Limiting)
# =======================
class StudentActivity(models.Model):
    """Track student activities including API rate limiting"""
    student_id = models.IntegerField()
    activity_type = models.CharField(max_length=20)
    action = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    course_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'student_activities'
        verbose_name = 'Student Activity'
        verbose_name_plural = 'Student Activities'

    def save(self, *args, **kwargs):
        if not self.id:
            # Manual ID generation for tables without AUTO_INCREMENT
            max_id = StudentActivity.objects.aggregate(models.Max('id'))['id__max']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)

class EncryptionKey(models.Model):
    """Track encryption keys for rotation"""
    key_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    rotated_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'encryption_keys'


# =======================
# CONSENT MANAGEMENT MODELS
# =======================
class StudentConsent(models.Model):
    """Track student consent preferences"""
    CONSENT_TYPES = [
        ('data_collection', 'Data Collection'),
        ('progress_sharing', 'Progress Sharing'),
        ('achievement_visibility', 'Achievement Visibility'),
        ('parent_notifications', 'Parent Notifications'),
        ('marketing_communications', 'Marketing Communications'),
    ]
    
    consent_type = models.CharField(max_length=50, choices=CONSENT_TYPES)
    is_granted = models.BooleanField(default=False)
    granted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_consent'


class ConsentHistory(models.Model):
    """Track consent change history"""
    ACTION_CHOICES = [
        ('granted', 'Granted'),
        ('revoked', 'Revoked'),
        ('updated', 'Updated'),
    ]
    
    consent_type = models.CharField(max_length=50)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        db_table = 'consent_history'


# =======================
# DATA RETENTION MODELS
# =======================
class DataRetentionPolicy(models.Model):
    """Data retention policies for different data types"""
    data_type = models.CharField(max_length=50)
    retention_days = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'data_retention_policies'


class DeletionRequest(models.Model):
    """Track account deletion requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    student_id = models.IntegerField()  # Direct student ID reference
    requested_at = models.DateTimeField(auto_now_add=True)
    scheduled_deletion_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True)
    processed_by = models.IntegerField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'deletion_requests'

    def save(self, *args, **kwargs):
        from django.utils import timezone
        from datetime import timedelta
        if not self.scheduled_deletion_at:
            self.scheduled_deletion_at = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)


class AnonymizedData(models.Model):
    """Store anonymized data for analytics"""
    original_student_id = models.IntegerField()
    anonymized_id = models.CharField(max_length=50, unique=True)
    data_snapshot = models.JSONField()
    anonymized_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'anonymized_data'

    def save(self, *args, **kwargs):
        import uuid
        if not self.anonymized_id:
            self.anonymized_id = f"anon_{uuid.uuid4().hex[:12]}"
        super().save(*args, **kwargs)


class DataExport(models.Model):
    """Track data export requests"""
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    student_id = models.IntegerField()  # Direct student ID reference
    export_format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='pdf')
    file_path = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'data_exports'

    def save(self, *args, **kwargs):
        from django.utils import timezone
        from datetime import timedelta
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)
