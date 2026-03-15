import requests

try:
    response = requests.get('http://localhost:8001/api/auth/student_login/')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
    print("Django server is not running on port 8001")