"""
Database setup script for Product & Tenant Configuration Management
Feature 2: Product & Tenant Configuration Management
"""

import os
import sys
import django
from pathlib import Path

# Add the Django project to the path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from platform_config.models import Product, Tenant, ProductConfig, TenantConfig, PlatformConfig


def create_sample_data():
    """Create sample products and tenants with configurations"""
    
    print("Creating sample products...")
    
    # Create Products
    products_data = [
        {
            'product_id': 'cbse-standard',
            'name': 'CBSE Standard',
            'description': 'Standard CBSE curriculum for all classes',
            'board_type': 'CBSE'
        },
        {
            'product_id': 'icse-premium',
            'name': 'ICSE Premium',
            'description': 'Premium ICSE curriculum with advanced features',
            'board_type': 'ICSE'
        },
        {
            'product_id': 'state-basic',
            'name': 'State Board Basic',
            'description': 'Basic state board curriculum',
            'board_type': 'STATE'
        }
    ]
    
    for product_data in products_data:
        product, created = Product.objects.get_or_create(
            product_id=product_data['product_id'],
            defaults=product_data
        )
        if created:
            print(f"✓ Created product: {product.name}")
        else:
            print(f"- Product already exists: {product.name}")
    
    print("\nCreating sample tenants...")
    
    # Create Tenants
    tenants_data = [
        {
            'tenant_id': 'dps-delhi',
            'name': 'Delhi Public School',
            'domain': 'dps.eduyata.com',
            'contact_email': 'admin@dps.edu',
            'subscription_type': 'premium'
        },
        {
            'tenant_id': 'st-marys',
            'name': "St. Mary's Convent",
            'domain': 'stmarys.eduyata.com',
            'contact_email': 'admin@stmarys.edu',
            'subscription_type': 'standard'
        },
        {
            'tenant_id': 'kendriya-001',
            'name': 'Kendriya Vidyalaya No.1',
            'domain': 'kv001.eduyata.com',
            'contact_email': 'admin@kv001.edu',
            'subscription_type': 'basic'
        }
    ]
    
    for tenant_data in tenants_data:
        tenant, created = Tenant.objects.get_or_create(
            tenant_id=tenant_data['tenant_id'],
            defaults=tenant_data
        )
        if created:
            print(f"✓ Created tenant: {tenant.name}")
        else:
            print(f"- Tenant already exists: {tenant.name}")
    
    print("\nCreating sample product configurations...")
    
    # Create Product Configurations
    cbse_product = Product.objects.get(product_id='cbse-standard')
    icse_product = Product.objects.get(product_id='icse-premium')
    
    product_configs = [
        # CBSE Product Configs
        {
            'product': cbse_product,
            'key': 'theme_primary_color',
            'value': '#28a745',
            'value_type': 'string',
            'category': 'appearance',
            'description': 'CBSE brand green color'
        },
        {
            'product': cbse_product,
            'key': 'grading_system',
            'value': '["A+", "A", "B+", "B", "C+", "C", "D", "F"]',
            'value_type': 'json',
            'category': 'grading',
            'description': 'CBSE grading system'
        },
        # ICSE Product Configs
        {
            'product': icse_product,
            'key': 'theme_primary_color',
            'value': '#007bff',
            'value_type': 'string',
            'category': 'appearance',
            'description': 'ICSE brand blue color'
        },
        {
            'product': icse_product,
            'key': 'grading_system',
            'value': '["Distinction", "Merit", "Credit", "Pass", "Fail"]',
            'value_type': 'json',
            'category': 'grading',
            'description': 'ICSE grading system'
        }
    ]
    
    for config_data in product_configs:
        config, created = ProductConfig.objects.get_or_create(
            product=config_data['product'],
            key=config_data['key'],
            defaults=config_data
        )
        if created:
            print(f"✓ Created product config: {config.product.name}/{config.key}")
        else:
            print(f"- Product config already exists: {config.product.name}/{config.key}")
    
    print("\nCreating sample tenant configurations...")
    
    # Create Tenant Configurations
    dps_tenant = Tenant.objects.get(tenant_id='dps-delhi')
    stmarys_tenant = Tenant.objects.get(tenant_id='st-marys')
    
    tenant_configs = [
        # DPS Tenant Configs (overrides)
        {
            'tenant': dps_tenant,
            'key': 'theme_primary_color',
            'value': '#dc3545',
            'value_type': 'string',
            'category': 'appearance',
            'description': 'DPS school red color'
        },
        {
            'tenant': dps_tenant,
            'key': 'school_logo_url',
            'value': '/logos/dps-logo.png',
            'value_type': 'string',
            'category': 'appearance',
            'description': 'DPS school logo'
        },
        {
            'tenant': dps_tenant,
            'key': 'enable_advanced_analytics',
            'value': 'true',
            'value_type': 'boolean',
            'category': 'features',
            'description': 'Enable advanced analytics for premium subscribers'
        },
        # St. Mary's Tenant Configs
        {
            'tenant': stmarys_tenant,
            'key': 'theme_primary_color',
            'value': '#17a2b8',
            'value_type': 'string',
            'category': 'appearance',
            'description': 'St. Marys school cyan color'
        },
        {
            'tenant': stmarys_tenant,
            'key': 'school_logo_url',
            'value': '/logos/stmarys-logo.png',
            'value_type': 'string',
            'category': 'appearance',
            'description': 'St. Marys school logo'
        },
        {
            'tenant': stmarys_tenant,
            'key': 'grading_system',
            'value': '["Excellent", "Very Good", "Good", "Satisfactory", "Needs Improvement"]',
            'value_type': 'json',
            'category': 'grading',
            'description': 'St. Marys custom grading system'
        }
    ]
    
    for config_data in tenant_configs:
        config, created = TenantConfig.objects.get_or_create(
            tenant=config_data['tenant'],
            key=config_data['key'],
            defaults=config_data
        )
        if created:
            print(f"✓ Created tenant config: {config.tenant.name}/{config.key}")
        else:
            print(f"- Tenant config already exists: {config.tenant.name}/{config.key}")
    
    print("\nCreating default platform configurations...")
    
    # Create some default platform configs if they don't exist
    default_configs = [
        {
            'key': 'theme_primary_color',
            'value': '#007bff',
            'value_type': 'string',
            'category': 'appearance',
            'description': 'Default platform primary color'
        },
        {
            'key': 'site_name',
            'value': 'Eduyata',
            'value_type': 'string',
            'category': 'general',
            'description': 'Platform name'
        },
        {
            'key': 'enable_multi_tenant',
            'value': 'true',
            'value_type': 'boolean',
            'category': 'features',
            'description': 'Enable multi-tenant functionality'
        }
    ]
    
    for config_data in default_configs:
        config, created = PlatformConfig.objects.get_or_create(
            key=config_data['key'],
            defaults=config_data
        )
        if created:
            print(f"✓ Created platform config: {config.key}")
        else:
            print(f"- Platform config already exists: {config.key}")
    
    print("\n✅ Sample data creation completed!")
    print("\nYou can now test the multi-tenant configuration system:")
    print("1. Visit /api/admin/config/products/ to see products")
    print("2. Visit /api/admin/config/tenants/ to see tenants")
    print("3. Visit /api/config/resolve/?tenant=dps-delhi to see DPS configurations")
    print("4. Visit /api/config/resolve/?tenant=st-marys to see St. Mary's configurations")


if __name__ == '__main__':
    create_sample_data()