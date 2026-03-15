#!/usr/bin/env python
"""
Fix datetime fields that are stored as strings in the database
"""
import os
import sys
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from platform_config.models import Product, Tenant
from django.utils import timezone
from django.utils.dateparse import parse_datetime
import traceback

def fix_product_datetimes():
    """Fix datetime fields in Product model"""
    print("Fixing Product datetime fields...")
    
    try:
        products = Product.objects.all()
        print(f"Found {products.count()} products")
        
        for product in products:
            updated = False
            
            # Check created_at
            if isinstance(product.created_at, str):
                print(f"  Fixing created_at for {product.product_id}: {product.created_at}")
                parsed_dt = parse_datetime(product.created_at)
                if parsed_dt:
                    product.created_at = parsed_dt
                    updated = True
                else:
                    # Fallback to current time
                    product.created_at = timezone.now()
                    updated = True
            
            # Check updated_at
            if isinstance(product.updated_at, str):
                print(f"  Fixing updated_at for {product.product_id}: {product.updated_at}")
                parsed_dt = parse_datetime(product.updated_at)
                if parsed_dt:
                    product.updated_at = parsed_dt
                    updated = True
                else:
                    # Fallback to current time
                    product.updated_at = timezone.now()
                    updated = True
            
            if updated:
                product.save()
                print(f"  Updated {product.product_id}")
        
        print("Product datetime fields fixed!")
        
    except Exception as e:
        print(f"Error fixing product datetimes: {e}")
        traceback.print_exc()

def fix_tenant_datetimes():
    """Fix datetime fields in Tenant model"""
    print("Fixing Tenant datetime fields...")
    
    try:
        tenants = Tenant.objects.all()
        print(f"Found {tenants.count()} tenants")
        
        for tenant in tenants:
            updated = False
            
            # Check created_at
            if isinstance(tenant.created_at, str):
                print(f"  Fixing created_at for {tenant.tenant_id}: {tenant.created_at}")
                parsed_dt = parse_datetime(tenant.created_at)
                if parsed_dt:
                    tenant.created_at = parsed_dt
                    updated = True
                else:
                    tenant.created_at = timezone.now()
                    updated = True
            
            # Check updated_at
            if isinstance(tenant.updated_at, str):
                print(f"  Fixing updated_at for {tenant.tenant_id}: {tenant.updated_at}")
                parsed_dt = parse_datetime(tenant.updated_at)
                if parsed_dt:
                    tenant.updated_at = parsed_dt
                    updated = True
                else:
                    tenant.updated_at = timezone.now()
                    updated = True
            
            if updated:
                tenant.save()
                print(f"  Updated {tenant.tenant_id}")
        
        print("Tenant datetime fields fixed!")
        
    except Exception as e:
        print(f"Error fixing tenant datetimes: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    print("Starting datetime field fixes...")
    fix_product_datetimes()
    fix_tenant_datetimes()
    print("All datetime fields fixed!")