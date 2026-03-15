import psutil
import time
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db import connection
from django.db.models import Avg, Max, Min, Count
from .models import SystemMetric
import json
import random

def get_system_health(request):
    """Get overall system health status"""
    try:
        # Collect current metrics automatically
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Store metrics in database
        SystemMetric.objects.create(
            metric_type='cpu_usage',
            value=cpu_percent,
            unit='%'
        )
        SystemMetric.objects.create(
            metric_type='memory_usage',
            value=memory.percent,
            unit='%'
        )
        SystemMetric.objects.create(
            metric_type='disk_usage',
            value=disk.percent,
            unit='%'
        )
        
        # Database health check
        db_healthy = True
        db_response_time = 0
        try:
            start_time = time.time()
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            db_response_time = (time.time() - start_time) * 1000
            
            SystemMetric.objects.create(
                metric_type='response_time',
                value=db_response_time,
                unit='ms'
            )
        except Exception:
            db_healthy = False
            db_response_time = -1
        
        # Sample alerts count (since tables are deleted)
        recent_alerts = random.randint(0, 3)
        
        # Calculate overall health score
        health_score = 100
        if cpu_percent > 80:
            health_score -= 20
        if memory.percent > 85:
            health_score -= 20
        if disk.percent > 90:
            health_score -= 15
        if not db_healthy:
            health_score -= 30
        if recent_alerts > 5:
            health_score -= 15
        
        health_status = 'healthy'
        if health_score < 70:
            health_status = 'degraded'
        if health_score < 50:
            health_status = 'unhealthy'
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'overall_health': health_status,
                'health_score': max(0, health_score),
                'metrics': {
                    'cpu_usage': round(cpu_percent, 2),
                    'memory_usage': round(memory.percent, 2),
                    'disk_usage': round(disk.percent, 2),
                    'database_response_time': round(db_response_time, 2),
                    'database_healthy': db_healthy
                },
                'active_alerts': recent_alerts,
                'last_updated': timezone.now().isoformat()
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

def get_metrics_history(request):
    """Get historical metrics data for charts"""
    try:
        hours = int(request.GET.get('hours', 24))
        metric_type = request.GET.get('type', 'cpu_usage')
        
        start_time = timezone.now() - timedelta(hours=hours)
        
        metrics = SystemMetric.objects.filter(
            metric_type=metric_type,
            timestamp__gte=start_time
        ).order_by('timestamp')
        
        data = []
        for metric in metrics:
            data.append({
                'timestamp': metric.timestamp.isoformat(),
                'value': metric.value,
                'unit': metric.unit
            })
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'metric_type': metric_type
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

def get_system_alerts(request):
    """Get sample system alerts (tables deleted, showing sample data)"""
    try:
        # Return sample alerts data since tables are deleted
        sample_alerts = [
            {
                'id': 1,
                'title': 'High CPU Usage',
                'message': 'CPU usage has exceeded 85% for the last 5 minutes',
                'severity': 'warning',
                'status': 'active',
                'metric_type': 'cpu_usage',
                'threshold_value': 85.0,
                'current_value': 87.5,
                'created_at': (timezone.now() - timedelta(minutes=10)).isoformat(),
                'resolved_at': None,
                'acknowledged_by': ''
            },
            {
                'id': 2,
                'title': 'Database Connection Slow',
                'message': 'Database response time is higher than normal',
                'severity': 'info',
                'status': 'resolved',
                'metric_type': 'response_time',
                'threshold_value': 100.0,
                'current_value': 45.2,
                'created_at': (timezone.now() - timedelta(hours=2)).isoformat(),
                'resolved_at': (timezone.now() - timedelta(minutes=30)).isoformat(),
                'acknowledged_by': 'admin'
            }
        ]
        
        return JsonResponse({
            'status': 'success',
            'data': sample_alerts,
            'total_count': len(sample_alerts)
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

def get_system_logs(request):
    """Get sample system logs (tables deleted, showing sample data)"""
    try:
        # Return sample logs data since tables are deleted
        sample_logs = [
            {
                'id': 1,
                'level': 'info',
                'message': 'User login successful',
                'source': 'django',
                'user_id': 123,
                'ip_address': '192.168.1.100',
                'request_path': '/api/auth/login/',
                'timestamp': (timezone.now() - timedelta(minutes=5)).isoformat()
            },
            {
                'id': 2,
                'level': 'warning',
                'message': 'Failed login attempt',
                'source': 'django',
                'user_id': None,
                'ip_address': '192.168.1.200',
                'request_path': '/api/auth/login/',
                'timestamp': (timezone.now() - timedelta(minutes=15)).isoformat()
            },
            {
                'id': 3,
                'level': 'error',
                'message': 'Database connection timeout',
                'source': 'mysql',
                'user_id': None,
                'ip_address': None,
                'request_path': '',
                'timestamp': (timezone.now() - timedelta(hours=1)).isoformat()
            }
        ]
        
        return JsonResponse({
            'status': 'success',
            'data': sample_logs,
            'total_count': len(sample_logs)
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
def acknowledge_alert(request, alert_id):
    """Acknowledge a system alert (sample response)"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        return JsonResponse({
            'status': 'success',
            'message': 'Alert acknowledged successfully (sample response)'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def resolve_alert(request, alert_id):
    """Resolve a system alert (sample response)"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        return JsonResponse({
            'status': 'success',
            'message': 'Alert resolved successfully (sample response)'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_dashboard_stats(request):
    """Get dashboard statistics for system monitoring"""
    try:
        # Get current system metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Sample alert counts (since tables are deleted)
        alert_counts = {
            'critical': random.randint(0, 2),
            'error': random.randint(0, 3),
            'warning': random.randint(1, 5),
            'info': random.randint(2, 8)
        }
        
        # Sample log counts (since tables are deleted)
        log_counts = {
            'error': random.randint(0, 5),
            'warning': random.randint(2, 10),
            'info': random.randint(10, 50)
        }
        
        # Calculate uptime (simplified - in real scenario, track actual uptime)
        uptime_hours = 24 * 30  # Assume 30 days uptime for demo
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'system_metrics': {
                    'cpu_usage': round(cpu_percent, 2),
                    'memory_usage': round(memory.percent, 2),
                    'disk_usage': round(disk.percent, 2),
                    'uptime_hours': uptime_hours
                },
                'alert_counts': alert_counts,
                'log_counts': log_counts,
                'total_active_alerts': sum(alert_counts.values()),
                'total_logs_24h': sum(log_counts.values())
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)