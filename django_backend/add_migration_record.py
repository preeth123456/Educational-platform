import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Insert without specifying id (auto-increment will handle it)
    cursor.execute(
        "INSERT INTO django_migrations (app, name, applied) VALUES ('auth_app', '0011_merge_20260120_1810', '2026-01-21 12:00:00')"
    )
    print("Added missing migration record")