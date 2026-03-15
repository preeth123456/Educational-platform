import requests
import json

# Test the backup settings endpoints
base_url = "http://localhost:8001/api/admin"

# Test GET settings
try:
    response = requests.get(f"{base_url}/backup/settings/")
    print(f"GET Settings - Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"GET Settings Error: {e}")

# Test POST save settings
try:
    test_data = {
        "daily_enabled": True,
        "weekly_enabled": False,
        "daily_time": "18:28",
        "weekly_time": "18:28",
        "weekly_day": "Sunday",
        "retention_days": 30,
        "retention_months": 12,
        "storage_destinations": {"local": True, "cloud": False, "external": False}
    }
    
    response = requests.post(
        f"{base_url}/backup/settings/save/",
        json=test_data,
        headers={'Content-Type': 'application/json'}
    )
    print(f"POST Save Settings - Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"POST Save Settings Error: {e}")