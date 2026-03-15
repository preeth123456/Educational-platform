from django.db import models
from .models import Student

class SkillEndorsement(models.Model):
    ENDORSER_TYPES = [
        ('teacher', 'Teacher'),
        ('peer', 'Peer')
    ]
    
    SKILL_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'), 
        ('advanced', 'Advanced')
    ]
    
    EVIDENCE_TYPES = [
        ('assignment', 'Assignment'),
        ('quiz', 'Quiz'),
        ('project', 'Project'),
        ('participation', 'Participation')
    ]
    
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
        indexes = [
            models.Index(fields=['student', 'skill_name']),
            models.Index(fields=['endorser_id', 'endorser_type'])
        ]
    
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
    
    def __str__(self):
        return f"{self.student.name} - {self.skill_name} ({self.level})"