from django.db import models


class Notification(models.Model):
    """
    Unified notification model for both Students and Teachers/Educators.
    """
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]
    
    NOTIFICATION_TYPE_CHOICES = [
        ('assessment', 'Assessment'),
        ('course_update', 'Course Update'),
        ('badge', 'Badge/Achievement'),
        ('message', 'Message'),
        ('announcement', 'Announcement'),
        ('reminder', 'Reminder'),
    ]
    
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    # Who receives the notification
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    
    # Notification content
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES, default='message')
    title = models.CharField(max_length=255)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Status
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user_type', 'user_id']),
            models.Index(fields=['is_read']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user_type}:{self.user_id}"
    
    def mark_as_read(self):
        """Mark this notification as read."""
        self.is_read = True
        self.save(update_fields=['is_read'])
    
    @classmethod
    def get_unread_count(cls, user_id, user_type):
        """Get count of unread notifications for a user."""
        return cls.objects.filter(
            user_id=user_id,
            user_type=user_type,
            is_read=False
        ).count()
    
    @classmethod
    def get_for_user(cls, user_id, user_type, limit=50):
        """Get notifications for a specific user."""
        return cls.objects.filter(
            user_id=user_id,
            user_type=user_type
        )[:limit]
