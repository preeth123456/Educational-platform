import requests

def test_endpoints():
    base_url = "http://localhost:8000"
    
    # Test if server is running
    try:
        response = requests.get(f"{base_url}/api/admin/dashboard-stats/")
        print(f"✅ Server running: {response.status_code}")
    except:
        print("❌ Django server not running!")
        print("Run: cd django_backend && python manage.py runserver")
        return
    
    # Test session endpoints
    endpoints = [
        "/api/session/admin/sessions/all/",
        "/api/session/policies/",
        "/api/session/auth/enhanced-login/"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            print(f"✅ {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint}: {e}")

if __name__ == "__main__":
    test_endpoints()