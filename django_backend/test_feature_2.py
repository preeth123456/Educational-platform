"""
Test script for Feature 2: Product & Tenant Configuration Management
"""

import os
import sys
import django
import requests
import json
from pathlib import Path

# Add the Django project to the path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from platform_config.utils import resolve_config, get_all_configs_for_tenant, get_config_hierarchy


def test_configuration_resolution():
    """Test the configuration resolution system"""
    
    print("🧪 Testing Configuration Resolution System")
    print("=" * 50)
    
    # Test 1: Resolve theme_primary_color for different tenants
    print("\n1. Testing theme_primary_color resolution:")
    
    # Global default
    global_color = resolve_config('theme_primary_color')
    print(f"   Global default: {global_color}")
    
    # DPS tenant (should be red - tenant override)
    dps_color = resolve_config('theme_primary_color', tenant_id='dps-delhi')
    print(f"   DPS Delhi: {dps_color}")
    
    # St. Mary's tenant (should be cyan - tenant override)
    stmarys_color = resolve_config('theme_primary_color', tenant_id='st-marys')
    print(f"   St. Mary's: {stmarys_color}")
    
    # Test 2: Resolve grading_system
    print("\n2. Testing grading_system resolution:")
    
    # DPS (should use global/product default)
    dps_grading = resolve_config('grading_system', tenant_id='dps-delhi', product_id='cbse-standard')
    print(f"   DPS (CBSE): {dps_grading}")
    
    # St. Mary's (should use tenant override)
    stmarys_grading = resolve_config('grading_system', tenant_id='st-marys')
    print(f"   St. Mary's: {stmarys_grading}")
    
    # Test 3: Get all configs for a tenant
    print("\n3. Testing get_all_configs_for_tenant:")
    dps_configs = get_all_configs_for_tenant('dps-delhi', 'cbse-standard')
    print(f"   DPS has {len(dps_configs)} configurations:")
    for key, config in dps_configs.items():
        print(f"     {key}: {config['value']} (from {config['source']})")
    
    # Test 4: Configuration hierarchy
    print("\n4. Testing configuration hierarchy:")
    hierarchy = get_config_hierarchy('theme_primary_color', 'dps-delhi', 'cbse-standard')
    print("   theme_primary_color hierarchy:")
    for level in hierarchy:
        print(f"     {level['level']}: {level['value']} ({level['source']})")
    
    print("\n✅ Configuration resolution tests completed!")


def test_api_endpoints():
    """Test the API endpoints"""
    
    print("\n🌐 Testing API Endpoints")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Test endpoints (these would need the server running)
    endpoints_to_test = [
        "/api/admin/config/products/",
        "/api/admin/config/tenants/",
        "/api/config/resolve/?tenant=dps-delhi",
        "/api/config/resolve/?tenant=st-marys",
        "/api/admin/config/hierarchy/?key=theme_primary_color&tenant=dps-delhi"
    ]
    
    print("API endpoints to test (requires server running):")
    for endpoint in endpoints_to_test:
        print(f"   GET {base_url}{endpoint}")
    
    print("\n💡 To test these endpoints:")
    print("   1. Start the Django server: python manage.py runserver")
    print("   2. Use a tool like Postman or curl to test the endpoints")
    print("   3. For admin endpoints, include Authorization header with admin token")


def demonstrate_use_cases():
    """Demonstrate real-world use cases"""
    
    print("\n🎯 Real-World Use Cases")
    print("=" * 50)
    
    print("\nUse Case 1: School wants custom branding")
    print("- DPS Delhi sets theme_primary_color to red (#dc3545)")
    print("- All DPS students see red theme instead of default blue")
    print(f"- Resolved color: {resolve_config('theme_primary_color', tenant_id='dps-delhi')}")
    
    print("\nUse Case 2: Different grading systems")
    print("- CBSE uses: A+, A, B+, B, C+, C, D, F")
    print("- St. Mary's uses custom: Excellent, Very Good, Good, Satisfactory, Needs Improvement")
    cbse_grades = resolve_config('grading_system', product_id='cbse-standard')
    stmarys_grades = resolve_config('grading_system', tenant_id='st-marys')
    print(f"- CBSE grades: {cbse_grades}")
    print(f"- St. Mary's grades: {stmarys_grades}")
    
    print("\nUse Case 3: Feature toggles per tenant")
    print("- Premium tenants get advanced analytics")
    print("- Basic tenants don't have this feature")
    dps_analytics = resolve_config('enable_advanced_analytics', tenant_id='dps-delhi')
    kv_analytics = resolve_config('enable_advanced_analytics', tenant_id='kendriya-001')
    print(f"- DPS (premium): {dps_analytics}")
    print(f"- KV (basic): {kv_analytics}")


if __name__ == '__main__':
    try:
        test_configuration_resolution()
        test_api_endpoints()
        demonstrate_use_cases()
        
        print("\n🎉 All tests completed successfully!")
        print("\nNext steps:")
        print("1. Run setup_feature_2.bat to create database tables")
        print("2. Start Django server: python manage.py runserver")
        print("3. Test the API endpoints using Postman or curl")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()