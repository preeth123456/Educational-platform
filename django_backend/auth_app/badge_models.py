from django.db import models
from .models import Student
from courses.models import Course
import json

class Badge(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ]
    
    CATEGORY_CHOICES = [
        ('completion', 'Course Completion'),
        ('performance', 'Performance'),
        ('streak', 'Learning Streak'),
        ('skill', 'Skill Mastery'),
        ('participation', 'Participation'),
        ('improvement', 'Improvement')
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='🏆')  # Emoji or icon class
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    points = models.IntegerField(default=10)
    
    # Criteria for earning the badge (JSON format)
    criteria = models.JSONField(default=dict)
    
    # Badge appearance
    color = models.CharField(max_length=7, default='#FFD700')  # Hex color
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'badges'
    
    def __str__(self):
        return f"{self.name} ({self.difficulty})"

class StudentBadge(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    # Context when badge was earned
    context = models.JSONField(default=dict)  # Course, score, etc.
    
    # Progress towards next level (if applicable)
    progress = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'student_badges'
        unique_together = ['student', 'badge']
    
    def __str__(self):
        return f"{self.student.name} - {self.badge.name}"

class BadgeProgress(models.Model):
    """Track student progress towards earning badges"""
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    current_progress = models.JSONField(default=dict)
    progress_percentage = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'badge_progress'
        unique_together = ['student', 'badge']

class SkillEndorsement(models.Model):
    ENDORSER_TYPES = [('teacher', 'Teacher'), ('peer', 'Peer')]
    SKILL_LEVELS = [('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')]
    EVIDENCE_TYPES = [('assignment', 'Assignment'), ('quiz', 'Quiz'), ('project', 'Project'), ('participation', 'Participation')]
    
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    endorser_id = models.IntegerField()
    endorser_type = models.CharField(max_length=10, choices=ENDORSER_TYPES)
    skill_name = models.CharField(max_length=100)
    skill_category = models.CharField(max_length=50)
    level = models.CharField(max_length=15, choices=SKILL_LEVELS, default='beginner')
    evidence_type = models.CharField(max_length=20, choices=EVIDENCE_TYPES, null=True, blank=True)
    evidence_id = models.IntegerField(null=True, blank=True)
    evidence_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    message = models.TextField(blank=True)
    is_ai_suggested = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skill_endorsements'
    
    @property
    def endorser_name(self):
        if self.endorser_type == 'teacher':
            try:
                from .models import Educator
                return Educator.objects.get(id=self.endorser_id).name
            except:
                return "Teacher"
        else:
            try:
                return Student.objects.get(id=self.endorser_id).name
            except:
                return "Peer"
    
    @classmethod
    def get_available_skills(cls):
        return {
            'Programming': ['Python', 'Java', 'JavaScript', 'C++', 'HTML/CSS'],
            'Mathematics': ['Algebra', 'Calculus', 'Statistics', 'Geometry'],
            'Science': ['Physics', 'Chemistry', 'Biology'],
            'Soft Skills': ['Teamwork', 'Leadership', 'Communication', 'Problem Solving'],
            'Languages': ['English', 'Hindi', 'Spanish', 'French']
        }