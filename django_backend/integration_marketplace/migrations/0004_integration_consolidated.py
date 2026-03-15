from django.db import migrations, models

class Migration(migrations.Migration):
    """
    Feature 10: Vault Service - Encryption & Secret Management
    - Ensures config field stores encrypted configuration data
    - Allows flexible status values for vault operations
    """

    dependencies = [
        ('integration_marketplace', '0003_rename_integration_install_8d17ec_idx_integration_install_f61e24_idx_and_more'),
    ]

    operations = [
        # Feature 10 (Vault): Allow flexible status values for vault operations
        migrations.AlterField(
            model_name='integration',
            name='status',
            field=models.CharField(max_length=20, default='inactive', help_text="Status (active, inactive, error, configuring)"),
        ),
        # Feature 10 (Vault): Ensure config can store encrypted configuration data
        migrations.AlterField(
            model_name='integration',
            name='config',
            field=models.JSONField(default=dict, help_text="Encrypted configuration data"),
        ),
    ]
