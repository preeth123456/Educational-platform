# Generated manually to replace problematic migrations
from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):

    dependencies = [
        ('system_monitoring', '0001_initial'),
    ]

    operations = [
        # Update index names to match current state
        migrations.RunSQL(
            "SELECT 1;",  # No-op SQL since indexes should already exist
            reverse_sql="SELECT 1;"
        ),
    ]