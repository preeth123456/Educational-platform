from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0006_educator_approval_status_educator_government_id_file'),
    ]

    operations = [
        # Add encrypted fields to students table
        migrations.AddField(
            model_name='student',
            name='mobile_self_encrypted',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='student',
            name='address_encrypted',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='student',
            name='parent_phone_encrypted',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='student',
            name='encryption_key_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        
        # Add encrypted fields to educators table
        migrations.AddField(
            model_name='educator',
            name='mobile_encrypted',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='educator',
            name='email_encrypted',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='educator',
            name='encryption_key_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        
        # Create encryption_keys table
        migrations.CreateModel(
            name='EncryptionKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key_hash', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('rotated_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'encryption_keys',
            },
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='encryptionkey',
            index=models.Index(fields=['is_active'], name='idx_encryption_keys_active'),
        ),
        migrations.AddIndex(
            model_name='student',
            index=models.Index(fields=['encryption_key_id'], name='idx_students_encrypted'),
        ),
        migrations.AddIndex(
            model_name='educator',
            index=models.Index(fields=['encryption_key_id'], name='idx_educators_encrypted'),
        ),
    ]
