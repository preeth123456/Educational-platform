from django.db import models
from django.utils import timezone
from auth_app.models import Student
from .grievance_models import GrievanceCase, GrievanceEvidence, GrievanceTimeline, GrievanceNotification

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    teacher_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'projects'

    def __str__(self):
        return self.title

class ProjectGroup(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='groups')
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_groups'

    def __str__(self):
        return f"{self.project.title} - {self.name}"

class ProjectGroupMember(models.Model):
    group = models.ForeignKey(ProjectGroup, on_delete=models.CASCADE, related_name='members')
    student_id = models.IntegerField()
    student_name = models.CharField(max_length=100)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_group_members'
        unique_together = ['group', 'student_id']

    def __str__(self):
        return f"{self.student_name} in {self.group.name}"

class ProjectDocument(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='project_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_documents'

    def __str__(self):
        return self.title

class ProjectSubmission(models.Model):
    group = models.ForeignKey(ProjectGroup, on_delete=models.CASCADE, related_name='submissions')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='project_submissions/', null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)

    class Meta:
        db_table = 'project_submissions'

    def __str__(self):
        return f"{self.group.name} - {self.title}"

class CollaborationGroup(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(Student, related_name='collaboration_groups')
    subject = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'collaboration_groups'

class Discussion(models.Model):
    group = models.ForeignKey(CollaborationGroup, on_delete=models.CASCADE, related_name='discussions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(Student, on_delete=models.CASCADE)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'discussions'

class DiscussionPost(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(Student, on_delete=models.CASCADE)
    content = models.TextField()
    parent_post = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    likes = models.ManyToManyField(Student, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'discussion_posts'

class SharedDocument(models.Model):
    group = models.ForeignKey(CollaborationGroup, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    uploaded_by = models.ForeignKey(Student, on_delete=models.CASCADE)
    file_type = models.CharField(max_length=50)
    file_size = models.IntegerField()
    downloads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'shared_documents'

class ChatMessage(models.Model):
    group = models.ForeignKey(CollaborationGroup, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(Student, on_delete=models.CASCADE)
    message = models.TextField()
    message_type = models.CharField(max_length=20, default='text')  # text, file, image
    file_url = models.CharField(max_length=500, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_messages'

class CollaborationPoints(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.ForeignKey(CollaborationGroup, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    activity_type = models.CharField(max_length=50)  # post, share, help, etc.
    description = models.CharField(max_length=255)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'collaboration_points'

# Support Ticketing Models
class SupportTicket(models.Model):
    ticket_id = models.CharField(max_length=20, unique=True)
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=10)  # student, teacher
    category = models.CharField(max_length=20)  # technical, course, payment, account, general
    priority = models.CharField(max_length=10, default='medium')  # low, medium, high, critical
    status = models.CharField(max_length=20, default='open')  # open, in_progress, resolved, escalated
    subject = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to_admin = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'support_tickets'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.ticket_id:
            import random
            self.ticket_id = f"TKT{timezone.now().year}{random.randint(10000, 99999)}"
        super().save(*args, **kwargs)

class TicketResponse(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='responses')
    responder_id = models.IntegerField()
    responder_type = models.CharField(max_length=10)  # student, teacher, admin
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ticket_responses'
        ordering = ['created_at']

class TicketAttachment(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='attachments')
    file_path = models.CharField(max_length=500)
    file_name = models.CharField(max_length=255)
    uploaded_by = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ticket_attachments'