# Generated manually for Feature 5: Connectors (Integration Types)

from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Feature 5: Integration Connectors
    - Changes integration_type from ENUM to VARCHAR for future-proofing
    """

    dependencies = [
        ('integration_marketplace', '0004_integration_consolidated'),
    ]

    operations = [
        # Feature 5: Allow ANY integration type (zoom, slack, google, microsoft, etc.)
        migrations.AlterField(
            model_name='integration',
            name='integration_type',
            field=models.CharField(
                max_length=50, 
                help_text="Type of integration (zoom, slack, google, etc)"
            ),
        ),
    ]
