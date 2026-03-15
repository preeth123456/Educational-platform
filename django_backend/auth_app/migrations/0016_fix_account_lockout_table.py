from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0015_merge_20260130_1914'),
    ]

    operations = [
        migrations.RunSQL(
            """
            ALTER TABLE account_lockout 
            ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS lockout_until DATETIME NULL,
            ADD COLUMN IF NOT EXISTS last_failed_ip VARCHAR(45) NULL,
            ADD COLUMN IF NOT EXISTS last_failed_at DATETIME NULL;
            """,
            reverse_sql="""
            ALTER TABLE account_lockout 
            DROP COLUMN IF EXISTS is_locked,
            DROP COLUMN IF EXISTS lockout_until,
            DROP COLUMN IF EXISTS last_failed_ip,
            DROP COLUMN IF EXISTS last_failed_at;
            """
        ),
        migrations.RunSQL(
            """
            ALTER TABLE login_history 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'SUCCESS',
            ADD COLUMN IF NOT EXISTS failure_reason VARCHAR(255) NULL;
            """,
            reverse_sql="""
            ALTER TABLE login_history 
            DROP COLUMN IF EXISTS status,
            DROP COLUMN IF EXISTS failure_reason;
            """
        ),
    ]