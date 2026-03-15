import requests

student_id = 26

print("Testing /api/courses/dashboard_stats/:")
url1 = f"http://localhost:8001/api/courses/dashboard_stats/?student_id={student_id}"
try:
    response = requests.get(url1)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
except Exception as e:
    print(f"Error: {e}\n")

print("Testing /api/auth/students/dashboard-stats/:")
url2 = f"http://localhost:8001/api/auth/students/dashboard-stats/?student_id={student_id}"
try:
    response = requests.get(url2)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
