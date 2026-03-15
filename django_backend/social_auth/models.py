from django.db import models


class SocialAccount(models.Model):
    """Links external OAuth accounts (Google/Microsoft) to internal users"""
    
    PROVIDER_CHOICES = [
        ('google', 'Google'),
        ('microsoft', 'Microsoft'),
    ]
    
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('educator', 'Educator'),
    ]
    
    provider = models.CharField(max_length=30, choices=PROVIDER_CHOICES)
    provider_id = models.CharField(max_length=255)  # External user ID from provider
    email = models.EmailField()
    name = models.CharField(max_length=255, blank=True)
    picture_url = models.URLField(blank=True)
    
    # Link to internal user (one of these will be set)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    student_id = models.IntegerField(null=True, blank=True)  # FK to students table
    educator_id = models.IntegerField(null=True, blank=True)  # FK to educators table
    
    # Tokens (stored securely for potential API access)
    access_token = models.TextField(blank=True)
    refresh_token = models.TextField(blank=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'social_accounts'
        unique_together = [['provider', 'provider_id']]
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['user_type', 'student_id']),
            models.Index(fields=['user_type', 'educator_id']),
        ]
    
    def __str__(self):
        return f"{self.provider} - {self.email}"
    
    def get_linked_user(self):
        """Returns the linked Student or Educator object"""
        if self.user_type == 'student' and self.student_id:
            from auth_app.models import Student
            try:
                return Student.objects.get(id=self.student_id)
            except Student.DoesNotExist:
                return None
        elif self.user_type == 'educator' and self.educator_id:
            from auth_app.models import Educator
            try:
                return Educator.objects.get(id=self.educator_id)
            except Educator.DoesNotExist:
                return None
        return None
