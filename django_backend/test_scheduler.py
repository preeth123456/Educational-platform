import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

# Test the scheduler
import backup_scheduler
import json
from datetime import datetime, timedelta

# Create test settings
test_time = (datetime.now() + timedelta(minutes=1)).strftime('%H:%M')
test_settings = {
    'daily_enabled': True,
    'daily_time': test_time,
    'weekly_enabled': False,
    'retention_days': 30,
    'retention_months': 12
}

# Save test settings
with open('backup_settings.json', 'w') as f:
    json.dump(test_settings, f, indent=2)

print(f"Test settings created - backup scheduled for {test_time}")
print("Current time:", datetime.now().strftime('%H:%M:%S'))

# Setup scheduler
backup_scheduler.setup_scheduler()

# Wait and check
import time
print("Waiting for scheduled backup...")
for i in range(120):  # Wait 2 minutes
    backup_scheduler.schedule.run_pending()
    time.sleep(1)
    if i % 10 == 0:
        print(f"Waiting... {datetime.now().strftime('%H:%M:%S')}")