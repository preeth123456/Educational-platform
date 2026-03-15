from django.db import models
from django.contrib.auth.models import User
import string
import random

class VirtualClassroom(models.Model):
    classroom_id = models.CharField(max_length=20, unique=True)
    course_id = models.IntegerField()
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='virtual_classrooms')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    classroom_code = models.CharField(max_length=10, unique=True)
    max_students = models.IntegerField(default=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'virtual_classrooms'

    def save(self, *args, **kwargs):
        if not self.classroom_code:
            self.classroom_code = self.generate_classroom_code()
        if not self.classroom_id:
            self.classroom_id = f"VC_{self.course_id}_{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)

    def generate_classroom_code(self):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class ClassroomEnrollment(models.Model):
    classroom = models.ForeignKey(VirtualClassroom, on_delete=models.CASCADE, related_name='enrollments')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='classroom_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    last_accessed = models.DateTimeField(null=True, blank=True)

class ClassroomSession(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('live', 'Live'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    classroom = models.ForeignKey(VirtualClassroom, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    scheduled_date = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)

class ClassroomAnnouncement(models.Model):
    classroom = models.ForeignKey(VirtualClassroom, on_delete=models.CASCADE, related_name='announcements')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_urgent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class ClassroomResource(models.Model):
    RESOURCE_TYPES = [
        ('document', 'Document'),
        ('video', 'Video'),
        ('link', 'Link'),
        ('image', 'Image'),
    ]
    
    classroom = models.ForeignKey(VirtualClassroom, on_delete=models.CASCADE, related_name='resources')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    file_url = models.URLField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)