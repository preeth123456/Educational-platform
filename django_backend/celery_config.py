import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

app = Celery('eduyata')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Celery Beat Schedule for periodic tasks
app.conf.beat_schedule = {
    'cleanup-old-data': {
        'task': 'auth_app.tasks.cleanup_old_data',
        'schedule': 86400.0,  # Run daily (24 hours)
    },
    'process-pending-deletions': {
        'task': 'auth_app.tasks.process_pending_deletions',
        'schedule': 3600.0,  # Run hourly
    },
    'cleanup-expired-exports': {
        'task': 'auth_app.tasks.cleanup_expired_exports',
        'schedule': 21600.0,  # Run every 6 hours
    },
}

app.conf.timezone = 'UTC'

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')