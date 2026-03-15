from django.db import models
from django.contrib.auth.models import User
import secrets


class APIKey(models.Model):
    """API Key model for external system authentication"""
    key_value = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Feature 2 fields (already in database)
    rate_limit_per_hour = models.IntegerField(default=1000)
    last_used_at = models.DateTimeField(null=True, blank=True)
    request_count = models.IntegerField(default=0)
    allowed_ips = models.TextField(blank=True)
    
    # Feature 5 fields (OAuth support for universal authentication)
    oauth_provider = models.CharField(max_length=50, null=True, blank=True, help_text="OAuth provider (google, microsoft, etc)")
    oauth_client_id = models.CharField(max_length=255, null=True, blank=True, help_text="OAuth client ID")
    oauth_redirect_uri = models.CharField(max_length=500, null=True, blank=True, help_text="OAuth redirect URI")
    oauth_scopes = models.TextField(null=True, blank=True, help_text="OAuth scopes (comma-separated)")
    
    # Feature 9.1: Endpoint Permissions (comma-separated: students,courses,teachers,classrooms)
    # If empty/null, ALL endpoints are accessible
    allowed_endpoints = models.TextField(
        null=True, 
        blank=True, 
        default='students,courses,teachers,classrooms',
        help_text="Comma-separated list of allowed endpoints (students,courses,teachers,classrooms)"
    )
    
    class Meta:
        db_table = 'api_keys'
        verbose_name = 'API Key'
        verbose_name_plural = 'API Keys'
        ordering = ['-created_at']  # Most recent first
    
    def __str__(self):
        return f"{self.name} - {self.key_value[:20]}..."
    
    def save(self, *args, **kwargs):
        if not self.id:
            # Manual ID generation for tables without AUTO_INCREMENT
            max_id = APIKey.objects.aggregate(models.Max('id'))['id__max']
            self.id = (max_id or 0) + 1
            
        if not self.key_value:
            self.key_value = f"EDU_{secrets.token_urlsafe(32)}"
        super().save(*args, **kwargs)
    
    def is_ip_allowed(self, ip_address):
        """Feature 2: Check if IP address is whitelisted"""
        if not self.allowed_ips:
            return True
        allowed = [ip.strip() for ip in self.allowed_ips.split(',')]
        return ip_address in allowed
    
    def check_rate_limit(self):
        """Feature 2: Check rate limit using student_activities table"""
        from django.utils import timezone
        from auth_app.models import StudentActivity
        
        current_hour = timezone.now().replace(minute=0, second=0, microsecond=0)
        
        # Count requests in current hour
        hour_requests = StudentActivity.objects.filter(
            student_id=self.user.id,
            activity_type='api_rate_limit',
            action=str(self.id),
            created_at__gte=current_hour
        ).count()
        
        if hour_requests >= self.rate_limit_per_hour:
            return False
        
        # Log this request
        StudentActivity.objects.create(
            student_id=self.user.id,
            activity_type='api_rate_limit',
            action=str(self.id),
            subject=current_hour.isoformat(),
            course_name=str(hour_requests + 1)
        )
        
        # Update usage stats
        self.last_used_at = timezone.now()
        self.request_count += 1
        self.save(update_fields=['last_used_at', 'request_count'])
        
        return True
