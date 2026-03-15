from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SystemMetric',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('metric_type', models.CharField(choices=[('cpu_usage', 'CPU Usage'), ('memory_usage', 'Memory Usage'), ('disk_usage', 'Disk Usage'), ('network_io', 'Network I/O'), ('database_connections', 'Database Connections'), ('response_time', 'Response Time'), ('error_rate', 'Error Rate'), ('uptime', 'System Uptime')], max_length=50)),
                ('value', models.FloatField()),
                ('unit', models.CharField(default='%', max_length=20)),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('server_name', models.CharField(default='main', max_length=100)),
            ],
            options={
                'db_table': 'system_metrics',
            },
        ),
        migrations.AddIndex(
            model_name='systemmetric',
            index=models.Index(fields=['metric_type', 'timestamp'], name='system_metr_metric__ef2754_idx'),
        ),
        migrations.AddIndex(
            model_name='systemmetric',
            index=models.Index(fields=['timestamp'], name='system_metr_timesta_206ca6_idx'),
        ),
    ]