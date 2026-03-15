from django.db import models
from django.utils import timezone

class SystemMetric(models.Model):
    METRIC_TYPES = [
        ('cpu_usage', 'CPU Usage'),
        ('memory_usage', 'Memory Usage'),
        ('disk_usage', 'Disk Usage'),
        ('network_io', 'Network I/O'),
        ('database_connections', 'Database Connections'),
        ('response_time', 'Response Time'),
        ('error_rate', 'Error Rate'),
        ('uptime', 'System Uptime')
    ]
    
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES)
    value = models.FloatField()
    unit = models.CharField(max_length=20, default='%')
    timestamp = models.DateTimeField(default=timezone.now)
    server_name = models.CharField(max_length=100, default='main')
    
    class Meta:
        db_table = 'system_metrics'
        indexes = [
            models.Index(fields=['metric_type', 'timestamp'], name='system_metr_metric__ef2754_idx'),
            models.Index(fields=['timestamp'], name='system_metr_timesta_206ca6_idx'),
        ]

# Removed SystemAlert, SystemLog, and HealthCheck models
# These tables were deleted from database and will show sample data only