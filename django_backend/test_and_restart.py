import subprocess
import time
import requests
import os
import signal

print("Killing existing Python processes...")
os.system('taskkill /F /IM python.exe 2>nul')

time.sleep(2)

print("Starting Django server...")
subprocess.Popen(['python', 'manage.py', 'runserver', '8001'], 
                 cwd=r'c:\Users\User\Downloads\New_Eduyata\Eduyata-collaboration\django_backend',
                 creationflags=subprocess.CREATE_NEW_CONSOLE)

print("Waiting for server to start...")
time.sleep(5)

print("\nTesting API endpoint...")
url = "http://localhost:8001/api/auth/students/dashboard-stats/?student_id=26"
try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
