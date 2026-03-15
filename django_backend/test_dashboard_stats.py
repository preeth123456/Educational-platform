import requests

# Test the dashboard stats endpoint
url = "http://localhost:8001/api/auth/students/dashboard-stats/?student_id=26"

try:
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
