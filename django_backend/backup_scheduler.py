import schedule
import time
import json
import os
from django.core.management import call_command
from django.conf import settings
import threading
from datetime import datetime

# Global scheduler thread reference
_scheduler_thread = None
_scheduler_running = False
_scheduler_lock = threading.Lock()

def load_backup_settings():
    """Load backup settings from file"""
    try:
        settings_file = os.path.join(os.getcwd(), 'backup_settings.json')
        if os.path.exists(settings_file):
            with open(settings_file, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading settings: {e}")
    return {}

def run_backup():
    """Execute backup command"""
    try:
        print(f"Starting scheduled backup at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        call_command('backup_database', '--created-by=scheduler')
        print(f"Scheduled backup completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    except Exception as e:
        print(f"Backup failed: {e}")

def setup_scheduler():
    """Setup backup schedules based on settings"""
    schedule.clear()  # Clear existing schedules
    
    backup_settings = load_backup_settings()
    
    # Setup daily backup
    if backup_settings.get('daily_enabled', False):
        daily_time = backup_settings.get('daily_time', '18:28')
        schedule.every().day.at(daily_time).do(run_backup)
        print(f"Daily backup scheduled at {daily_time}")
    
    # Setup weekly backup
    if backup_settings.get('weekly_enabled', False):
        weekly_time = backup_settings.get('weekly_time', '18:28')
        weekly_day = backup_settings.get('weekly_day', 'sunday').lower()
        
        day_map = {
            'monday': schedule.every().monday,
            'tuesday': schedule.every().tuesday,
            'wednesday': schedule.every().wednesday,
            'thursday': schedule.every().thursday,
            'friday': schedule.every().friday,
            'saturday': schedule.every().saturday,
            'sunday': schedule.every().sunday
        }
        
        if weekly_day in day_map:
            day_map[weekly_day].at(weekly_time).do(run_backup)
            print(f"Weekly backup scheduled every {weekly_day.title()} at {weekly_time}")

def run_scheduler():
    """Run the scheduler in background"""
    global _scheduler_running
    _scheduler_running = True
    setup_scheduler()
    while _scheduler_running:
        try:
            schedule.run_pending()
            time.sleep(60)  # Check every 60 seconds
        except Exception as e:
            print(f"Scheduler error: {e}")
            time.sleep(60)

def start_backup_scheduler():
    """Start scheduler in background thread"""
    global _scheduler_thread, _scheduler_running
    
    with _scheduler_lock:
        # Stop existing scheduler if running
        if _scheduler_running:
            stop_backup_scheduler()
        
        # Don't start if already running
        if _scheduler_thread and _scheduler_thread.is_alive():
            return
        
        try:
            _scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
            _scheduler_thread.start()
            print("Backup scheduler started successfully")
        except Exception as e:
            print(f"Failed to start scheduler: {e}")

def stop_backup_scheduler():
    """Stop the backup scheduler"""
    global _scheduler_running
    _scheduler_running = False
    schedule.clear()
    print("Backup scheduler stopped")

# Only start scheduler when explicitly called
# Remove auto-start to prevent multiple instances