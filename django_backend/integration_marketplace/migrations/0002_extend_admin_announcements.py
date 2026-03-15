# Generated manually for Feature 4 Phase 1

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('integration_marketplace', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            # Forward SQL
            sql="""
                ALTER TABLE admin_announcements
                ADD COLUMN IF NOT EXISTS integration_id INT(11) DEFAULT NULL AFTER created_at;
                
                ALTER TABLE admin_announcements
                ADD KEY IF NOT EXISTS idx_integration (integration_id);
            """,
            # Reverse SQL
            reverse_sql="""
                ALTER TABLE admin_announcements
                DROP INDEX IF EXISTS idx_integration;
                
                ALTER TABLE admin_announcements
                DROP COLUMN IF EXISTS integration_id;
            """
        ),
    ]
