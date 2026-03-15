import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection
from datetime import datetime

with connection.cursor() as cursor:
    cursor.execute(
        "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, %s)",
        ['auth_app', '0011_merge_20260120_1810', datetime.now()]
    )
print("Fixed migration dependency")