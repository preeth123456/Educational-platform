# Generated migration for support ticketing system

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('collaboration', '0002_project_projectgroup_projectsubmission_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SupportTicket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticket_id', models.CharField(max_length=20, unique=True)),
                ('user_id', models.IntegerField()),
                ('user_type', models.CharField(max_length=10)),
                ('category', models.CharField(max_length=20)),
                ('priority', models.CharField(default='medium', max_length=10)),
                ('status', models.CharField(default='open', max_length=20)),
                ('subject', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('assigned_to_admin', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'support_tickets',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='TicketResponse',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('responder_id', models.IntegerField()),
                ('responder_type', models.CharField(max_length=10)),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='responses', to='collaboration.supportticket')),
            ],
            options={
                'db_table': 'ticket_responses',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='TicketAttachment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_path', models.CharField(max_length=500)),
                ('file_name', models.CharField(max_length=255)),
                ('uploaded_by', models.IntegerField()),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='collaboration.supportticket')),
            ],
            options={
                'db_table': 'ticket_attachments',
            },
        ),
    ]
