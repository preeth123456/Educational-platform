# Generated manually for Feature 13: Integration Monitoring & Analytics

from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Feature 13: Integration Monitoring & Analytics
    - Adds monitoring fields to admin_notifications for webhook tracking
    - Adds job metadata for background processing
    """

    dependencies = [
        ('admin_auth', '0004_adminnotification_webhook_delivered_at_and_more'),
    ]

    operations = [
        # Feature 13: Add job_metadata for background job tracking
        migrations.AddField(
            model_name='adminnotification',
            name='job_metadata',
            field=models.JSONField(
                null=True, 
                blank=True,
                help_text="Background job execution metadata"
            ),
        ),
    ]
