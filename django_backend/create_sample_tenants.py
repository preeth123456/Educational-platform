import os
import django
import sys

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from platform_config.models import Tenant, TenantConfig

def create_sample_tenants():
    # Sample tenants
    tenants_data = [
        {
            'tenant_id': 'dps-delhi',
            'name': 'Delhi Public School',
            'description': 'Premier educational institution in Delhi',
            'domain': 'dps-delhi.eduyata.com',
            'is_active': True
        },
        {
            'tenant_id': 'st-marys',
            'name': "St. Mary's School",
            'description': 'Catholic school with excellent academics',
            'domain': 'st-marys.eduyata.com',
            'is_active': True
        },
        {
            'tenant_id': 'kendriya-001',
            'name': 'Kendriya Vidyalaya',
            'description': 'Government school under KVS',
            'domain': 'kv001.eduyata.com',
            'is_active': True
        }
    ]
    
    for tenant_data in tenants_data:
        tenant, created = Tenant.objects.get_or_create(
            tenant_id=tenant_data['tenant_id'],
            defaults=tenant_data
        )
        if created:
            print(f"Created tenant: {tenant.name}")
            
            # Add some sample tenant configs
            configs = [
                {
                    'config_key': 'school_logo_url',
                    'config_value': f'/logos/{tenant.tenant_id}.png',
                    'data_type': 'string'
                },
                {
                    'config_key': 'theme_primary_color',
                    'config_value': '#1e40af' if 'dps' in tenant.tenant_id else '#dc2626',
                    'data_type': 'string'
                },
                {
                    'config_key': 'max_students',
                    'config_value': '2000',
                    'data_type': 'integer'
                }
            ]
            
            for config in configs:
                TenantConfig.objects.get_or_create(
                    tenant_id=tenant.tenant_id,
                    config_key=config['config_key'],
                    defaults={
                        'config_value': config['config_value'],
                        'data_type': config['data_type']
                    }
                )
        else:
            print(f"Tenant already exists: {tenant.name}")

if __name__ == '__main__':
    create_sample_tenants()
    print("Sample tenants created successfully!")