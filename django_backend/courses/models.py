from django.db import models

class Chapter(models.Model):
    course_id = models.IntegerField(null=True, blank=True)  # Link to specific course
    title = models.CharField(max_length=255)
    chapter_no = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'chapters'
        unique_together = ['course_id', 'chapter_no']  # Unique within each course
    
    def __str__(self):
        return f"Chapter {self.chapter_no}: {self.title}"

class Lesson(models.Model):
    chapter_id = models.IntegerField()
    course_id = models.IntegerField(null=True, blank=True)  # Link to specific course
    title = models.CharField(max_length=255)
    lesson_no = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lessons'
        unique_together = ['chapter_id', 'lesson_no']
    
    def __str__(self):
        return f"Lesson {self.lesson_no}: {self.title}"

class Course(models.Model):
    course_id = models.CharField(max_length=20)
    title = models.CharField(max_length=255)
    description = models.TextField()
    instructor_id = models.IntegerField()
    category = models.CharField(max_length=100)
    level = models.CharField(max_length=20)
    duration_hours = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail_url = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'

    def __str__(self):
        return self.title

class LessonContent(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('VIDEO', 'Video'),
        ('PDF', 'PDF'),
        ('PPT', 'PowerPoint'),
        ('DOC', 'Document'),
        ('AUDIO', 'Audio'),
    ]
    
    lesson_id = models.BigIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField()
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)
    file_url = models.TextField()
    duration_minutes = models.IntegerField(null=True, blank=True)
    content_order = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'lesson_contents'
        unique_together = ['lesson_id', 'content_order']
        
    def __str__(self):
        return f"{self.title} - {self.content_type}"
