from django.db import models
from django.contrib.auth.models import User
import json

class Product(models.Model):
    PRODUCT_TYPES = [
        ('Subscription', 'Subscription'),
        ('Add-on', 'Add-on'),
        ('One-time', 'One-time'),
    ]
    
    AUDIENCE_ROLES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('institution', 'Institution'),
    ]
    
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    audience_role = models.CharField(max_length=20, choices=AUDIENCE_ROLES)
    description = models.TextField(blank=True)
    features_json = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    class Meta:
        db_table = 'pricing_products'

class PricingPlan(models.Model):
    BILLING_CYCLES = [
        ('Monthly', 'Monthly'),
        ('Quarterly', 'Quarterly'),
        ('Yearly', 'Yearly'),
        ('One-time', 'One-time'),
    ]
    
    CURRENCIES = [
        ('INR', 'INR'),
        ('USD', 'USD'),
        ('EUR', 'EUR'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='pricing_plans')
    name = models.CharField(max_length=255)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCIES, default='INR')
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    duration_days = models.IntegerField(default=30)
    limits_json = models.JSONField(default=dict)
    is_default = models.BooleanField(default=False)
    is_recommended = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.product.name}"
    
    def save(self, *args, **kwargs):
        if self.is_default:
            # Ensure only one default plan per product
            PricingPlan.objects.filter(product=self.product, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)
    
    class Meta:
        db_table = 'pricing_plans'

class UserSubscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('canceled', 'Canceled'),
    ]
    
    USER_TYPES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]
    
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"User {self.user_id} - {self.plan.name}"
    
    class Meta:
        db_table = 'user_subscriptions'