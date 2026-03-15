# Generated migration for pricing models

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('code', models.CharField(max_length=100, unique=True)),
                ('product_type', models.CharField(choices=[('Subscription', 'Subscription'), ('Add-on', 'Add-on'), ('One-time', 'One-time')], max_length=20)),
                ('audience_role', models.CharField(choices=[('student', 'Student'), ('teacher', 'Teacher'), ('institution', 'Institution')], max_length=20)),
                ('description', models.TextField(blank=True)),
                ('features_json', models.JSONField(default=list)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'pricing_products',
            },
        ),
        migrations.CreateModel(
            name='PricingPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('billing_cycle', models.CharField(choices=[('Monthly', 'Monthly'), ('Quarterly', 'Quarterly'), ('Yearly', 'Yearly'), ('One-time', 'One-time')], max_length=20)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(choices=[('INR', 'INR'), ('USD', 'USD'), ('EUR', 'EUR')], default='INR', max_length=3)),
                ('discount_percent', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('duration_days', models.IntegerField(default=30)),
                ('limits_json', models.JSONField(default=dict)),
                ('is_default', models.BooleanField(default=False)),
                ('is_recommended', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pricing_plans', to='pricing.product')),
            ],
            options={
                'db_table': 'pricing_plans',
            },
        ),
        migrations.CreateModel(
            name='UserSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('user_type', models.CharField(choices=[('student', 'Student'), ('teacher', 'Teacher')], max_length=20)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('status', models.CharField(choices=[('active', 'Active'), ('expired', 'Expired'), ('canceled', 'Canceled')], default='active', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pricing.pricingplan')),
            ],
            options={
                'db_table': 'user_subscriptions',
            },
        ),
    ]