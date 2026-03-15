# Generated migration for public_api app
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='APIKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key_value', models.CharField(max_length=64, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('rate_limit_per_hour', models.IntegerField(default=1000)),
                ('last_used_at', models.DateTimeField(blank=True, null=True)),
                ('request_count', models.IntegerField(default=0)),
                ('allowed_ips', models.TextField(blank=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='api_keys', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'API Key',
                'verbose_name_plural': 'API Keys',
                'db_table': 'api_keys',
            },
        ),
        migrations.RunSQL(
            sql="""
                ALTER TABLE api_keys MODIFY id INT(11) NOT NULL AUTO_INCREMENT;
                -- Safety check for auth_user (ensure PK and AI are set)
                ALTER TABLE auth_user MODIFY id INT(11) NOT NULL AUTO_INCREMENT;
            """,
            reverse_sql=""
        ),
    ]
