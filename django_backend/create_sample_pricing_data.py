#!/usr/bin/env python3
"""
Simple test script to create sample data for pricing module
Run this after setting up the database tables
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Add the Django project to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from pricing.models import Product, PricingPlan, UserSubscription

def create_sample_data():
    print("Creating sample products...")
    
    # Create sample products
    products_data = [
        {
            'name': 'Eduyata Student Basic',
            'code': 'EDU_STU_BASIC',
            'product_type': 'Subscription',
            'audience_role': 'student',
            'description': 'Basic plan for students with essential features',
            'features_json': ['Access to basic courses', 'AI assistance', 'Progress tracking', 'Mobile app access'],
            'is_active': True
        },
        {
            'name': 'Eduyata Student Premium',
            'code': 'EDU_STU_PREMIUM',
            'product_type': 'Subscription',
            'audience_role': 'student',
            'description': 'Premium plan for students with advanced features',
            'features_json': ['Access to all courses', 'Unlimited AI assistance', 'Advanced analytics', 'Priority support', 'Downloadable content'],
            'is_active': True
        },
        {
            'name': 'Eduyata Teacher Pro',
            'code': 'EDU_TCH_PRO',
            'product_type': 'Subscription',
            'audience_role': 'teacher',
            'description': 'Professional plan for teachers',
            'features_json': ['Course creation tools', 'Student management', 'Analytics dashboard', 'Assignment grading', 'Virtual classroom'],
            'is_active': True
        }
    ]
    
    created_products = []
    for product_data in products_data:
        product, created = Product.objects.get_or_create(
            code=product_data['code'],
            defaults=product_data
        )
        if created:
            print(f"Created product: {product.name}")
        else:
            print(f"Product already exists: {product.name}")
        created_products.append(product)
    
    print("Creating sample pricing plans...")
    
    # Create sample pricing plans
    plans_data = [
        {
            'product': created_products[0],  # Basic
            'name': 'Basic Monthly',
            'billing_cycle': 'Monthly',
            'price': 299.00,
            'currency': 'INR',
            'discount_percent': 0,
            'duration_days': 30,
            'limits_json': {
                'max_ai_requests_per_day': 50,
                'max_courses_access': 3,
                'max_mock_tests': 5,
                'downloadable_materials': False
            },
            'is_default': True,
            'is_recommended': False,
            'is_active': True
        },
        {
            'product': created_products[1],  # Premium
            'name': 'Premium Monthly',
            'billing_cycle': 'Monthly',
            'price': 599.00,
            'currency': 'INR',
            'discount_percent': 0,
            'duration_days': 30,
            'limits_json': {
                'max_ai_requests_per_day': 200,
                'max_courses_access': 999,
                'max_mock_tests': 999,
                'downloadable_materials': True
            },
            'is_default': False,
            'is_recommended': True,
            'is_active': True
        },
        {
            'product': created_products[2],  # Teacher
            'name': 'Teacher Pro Monthly',
            'billing_cycle': 'Monthly',
            'price': 999.00,
            'currency': 'INR',
            'discount_percent': 0,
            'duration_days': 30,
            'limits_json': {
                'max_students': 100,
                'max_courses_created': 10,
                'analytics_retention_days': 90,
                'api_calls_per_day': 1000
            },
            'is_default': True,
            'is_recommended': True,
            'is_active': True
        }
    ]
    
    for plan_data in plans_data:
        plan, created = PricingPlan.objects.get_or_create(
            product=plan_data['product'],
            name=plan_data['name'],
            defaults=plan_data
        )
        if created:
            print(f"Created pricing plan: {plan.name}")
        else:
            print(f"Pricing plan already exists: {plan.name}")
    
    print("Sample data creation completed!")
    print(f"Total products: {Product.objects.count()}")
    print(f"Total pricing plans: {PricingPlan.objects.count()}")

if __name__ == '__main__':
    create_sample_data()