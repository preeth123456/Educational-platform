from django.db import models
from django.utils import timezone

class BreachReport(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('reported', 'Reported'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
    ]
    
    description = models.TextField()
    data_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='reported')
    source_board = models.CharField(max_length=50)
    source_class = models.CharField(max_length=10)
    source_affected_count = models.IntegerField(default=0)
    target_board = models.CharField(max_length=50)
    target_class = models.CharField(max_length=10)
    target_affected_count = models.IntegerField(default=0)
    total_affected = models.IntegerField(default=0)
    reported_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    def save(self, *args, **kwargs):
        self.total_affected = self.source_affected_count + self.target_affected_count
        super().save(*args, **kwargs)

class BreachNotification(models.Model):
    breach_report = models.ForeignKey(BreachReport, on_delete=models.CASCADE)
    recipient_type = models.CharField(max_length=20)
    recipient_email = models.EmailField()
    message_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
