import psutil
import time
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import connection
from system_monitoring.models import SystemMetric, SystemAlert, SystemLog

class Command(BaseCommand):
    help = 'Collect system metrics and store them in the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--interval',
            type=int,
            default=60,
            help='Collection interval in seconds (default: 60)'
        )
        parser.add_argument(
            '--once',
            action='store_true',
            help='Run once instead of continuously'
        )

    def handle(self, *args, **options):
        interval = options['interval']
        run_once = options['once']
        
        self.stdout.write(
            self.style.SUCCESS(f'Starting system metrics collection (interval: {interval}s)')
        )
        
        if run_once:
            self.collect_metrics()
        else:
            try:
                while True:
                    self.collect_metrics()
                    time.sleep(interval)
            except KeyboardInterrupt:
                self.stdout.write(self.style.SUCCESS('Metrics collection stopped'))

    def collect_metrics(self):
        try:
            # Collect CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            SystemMetric.objects.create(
                metric_type='cpu_usage',
                value=cpu_percent,
                unit='%'
            )
            
            # Collect memory usage
            memory = psutil.virtual_memory()
            SystemMetric.objects.create(
                metric_type='memory_usage',
                value=memory.percent,
                unit='%'
            )
            
            # Collect disk usage
            disk = psutil.disk_usage('/')
            SystemMetric.objects.create(
                metric_type='disk_usage',
                value=disk.percent,
                unit='%'
            )
            
            # Collect database response time
            start_time = time.time()
            try:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 1")
                db_response_time = (time.time() - start_time) * 1000
                SystemMetric.objects.create(
                    metric_type='response_time',
                    value=db_response_time,
                    unit='ms'
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Database health check failed: {e}')
                )
            
            # Check for alerts
            self.check_alerts(cpu_percent, memory.percent, disk.percent)
            
            # Log collection
            SystemLog.objects.create(
                level='info',
                message='System metrics collected successfully',
                source='system_monitoring'
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Metrics collected - CPU: {cpu_percent}%, Memory: {memory.percent}%, Disk: {disk.percent}%'
                )
            )
            
        except Exception as e:
            error_msg = f'Error collecting metrics: {str(e)}'
            self.stdout.write(self.style.ERROR(error_msg))
            
            # Log error
            SystemLog.objects.create(
                level='error',
                message=error_msg,
                source='system_monitoring'
            )

    def check_alerts(self, cpu_percent, memory_percent, disk_percent):
        # Check CPU usage
        if cpu_percent > 90:
            self.create_alert(
                'Critical CPU Usage',
                f'CPU usage is at {cpu_percent}%, exceeding critical threshold of 90%',
                'critical',
                'cpu_usage',
                90,
                cpu_percent
            )
        elif cpu_percent > 80:
            self.create_alert(
                'High CPU Usage',
                f'CPU usage is at {cpu_percent}%, exceeding warning threshold of 80%',
                'warning',
                'cpu_usage',
                80,
                cpu_percent
            )
        
        # Check memory usage
        if memory_percent > 90:
            self.create_alert(
                'Critical Memory Usage',
                f'Memory usage is at {memory_percent}%, exceeding critical threshold of 90%',
                'critical',
                'memory_usage',
                90,
                memory_percent
            )
        elif memory_percent > 80:
            self.create_alert(
                'High Memory Usage',
                f'Memory usage is at {memory_percent}%, exceeding warning threshold of 80%',
                'warning',
                'memory_usage',
                80,
                memory_percent
            )
        
        # Check disk usage
        if disk_percent > 95:
            self.create_alert(
                'Critical Disk Usage',
                f'Disk usage is at {disk_percent}%, exceeding critical threshold of 95%',
                'critical',
                'disk_usage',
                95,
                disk_percent
            )
        elif disk_percent > 85:
            self.create_alert(
                'High Disk Usage',
                f'Disk usage is at {disk_percent}%, exceeding warning threshold of 85%',
                'warning',
                'disk_usage',
                85,
                disk_percent
            )

    def create_alert(self, title, message, severity, metric_type, threshold, current_value):
        # Check if similar alert already exists and is active
        existing_alert = SystemAlert.objects.filter(
            title=title,
            status='active',
            created_at__gte=timezone.now() - timezone.timedelta(minutes=30)
        ).first()
        
        if not existing_alert:
            SystemAlert.objects.create(
                title=title,
                message=message,
                severity=severity,
                metric_type=metric_type,
                threshold_value=threshold,
                current_value=current_value
            )
            
            self.stdout.write(
                self.style.WARNING(f'Alert created: {title}')
            )