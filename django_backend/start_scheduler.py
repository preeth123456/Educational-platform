import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

import backup_scheduler

# Start the scheduler
backup_scheduler.start_backup_scheduler()
print("Backup scheduler started. Press Ctrl+C to stop.")

try:
    import time
    while True:
        time.sleep(60)
except KeyboardInterrupt:
    backup_scheduler.stop_backup_scheduler()
    print("Scheduler stopped.")