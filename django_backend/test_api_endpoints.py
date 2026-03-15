import requests

# Test the API endpoints
base_url = "http://localhost:8000"

print("Testing API endpoints...")

# Test products endpoint
try:
    response = requests.get(f"{base_url}/api/admin/config/products/")
    print(f"Products API: {response.status_code}")
    if response.status_code == 401:
        print("  -> Authentication required")
    elif response.status_code == 200:
        data = response.json()
        print(f"  -> Success: {len(data.get('data', []))} products found")
    else:
        print(f"  -> Error: {response.text}")
except Exception as e:
    print(f"Products API Error: {e}")

# Test tenants endpoint  
try:
    response = requests.get(f"{base_url}/api/admin/config/tenants/")
    print(f"Tenants API: {response.status_code}")
    if response.status_code == 401:
        print("  -> Authentication required")
    elif response.status_code == 200:
        data = response.json()
        print(f"  -> Success: {len(data.get('data', []))} tenants found")
    else:
        print(f"  -> Error: {response.text}")
except Exception as e:
    print(f"Tenants API Error: {e}")

# Test config resolution (no auth needed)
try:
    response = requests.get(f"{base_url}/api/config/resolve/?tenant=dps-delhi")
    print(f"Config Resolution API: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  -> Success: {len(data.get('data', {}))} configs resolved")
    else:
        print(f"  -> Error: {response.text}")
except Exception as e:
    print(f"Config Resolution API Error: {e}")