# Generated manually for Feature 3 Phase 1
# Extends admin_notifications table with webhook delivery tracking columns

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webhook_system', '0001_initial'),
        ('admin_auth', '__first__'),  # Depends on admin_auth app
    ]

    operations = [
        migrations.RunSQL(
            # Forward SQL - Add webhook columns to admin_notifications
            sql="""
                ALTER TABLE admin_notifications
                ADD COLUMN IF NOT EXISTS webhook_endpoint_id INT(11) DEFAULT NULL AFTER created_at,
                ADD COLUMN IF NOT EXISTS webhook_event_type VARCHAR(100) DEFAULT NULL AFTER webhook_endpoint_id,
                ADD COLUMN IF NOT EXISTS webhook_event_data JSON DEFAULT NULL AFTER webhook_event_type,
                ADD COLUMN IF NOT EXISTS webhook_status ENUM('pending', 'delivered', 'failed') DEFAULT NULL AFTER webhook_event_data,
                ADD COLUMN IF NOT EXISTS webhook_response_code INT(11) DEFAULT NULL AFTER webhook_status,
                ADD COLUMN IF NOT EXISTS webhook_retry_count INT(11) DEFAULT 0 AFTER webhook_response_code,
                ADD COLUMN IF NOT EXISTS webhook_delivered_at TIMESTAMP NULL DEFAULT NULL AFTER webhook_retry_count;
                
                ALTER TABLE admin_notifications
                ADD KEY IF NOT EXISTS idx_webhook_status (webhook_status),
                ADD KEY IF NOT EXISTS idx_webhook_endpoint (webhook_endpoint_id);
            """,
            # Reverse SQL - Remove webhook columns (for rollback)
            reverse_sql="""
                ALTER TABLE admin_notifications
                DROP INDEX IF EXISTS idx_webhook_status,
                DROP INDEX IF EXISTS idx_webhook_endpoint,
                DROP COLUMN IF EXISTS webhook_endpoint_id,
                DROP COLUMN IF EXISTS webhook_event_type,
                DROP COLUMN IF EXISTS webhook_event_data,
                DROP COLUMN IF EXISTS webhook_status,
                DROP COLUMN IF EXISTS webhook_response_code,
                DROP COLUMN IF EXISTS webhook_retry_count,
                DROP COLUMN IF EXISTS webhook_delivered_at;
            """
        ),
    ]
