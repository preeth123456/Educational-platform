# Generated manually for Feature 5: Connectors (OAuth Support)

from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Feature 5: Integration Connectors
    - Allows flexible integration types (zoom, slack, google, etc.)
    - Adds OAuth support to API Keys
    """

    dependencies = [
        ('public_api', '0001_initial'),
    ]

    operations = [
        # Feature 5: Add OAuth fields to APIKey for universal authentication
        migrations.AddField(
            model_name='apikey',
            name='oauth_provider',
            field=models.CharField(max_length=50, null=True, blank=True, help_text="OAuth provider (google, microsoft, etc)"),
        ),
        migrations.AddField(
            model_name='apikey',
            name='oauth_client_id',
            field=models.CharField(max_length=255, null=True, blank=True, help_text="OAuth client ID"),
        ),
        migrations.AddField(
            model_name='apikey',
            name='oauth_redirect_uri',
            field=models.CharField(max_length=500, null=True, blank=True, help_text="OAuth redirect URI"),
        ),
        migrations.AddField(
            model_name='apikey',
            name='oauth_scopes',
            field=models.TextField(null=True, blank=True, help_text="OAuth scopes (comma-separated)"),
        ),
    ]
