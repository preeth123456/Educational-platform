import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db.migrations.recorder import MigrationRecorder
from django.db import connection

recorder = MigrationRecorder(connection)
recorder.record_applied('auth_app', '0011_merge_20260120_1810')
print("Migration record added successfully")