#!/usr/bin/env python
import os
import sys
import subprocess

# Change to Django directory
os.chdir(r'c:\xampp\htdocs\eduyata\Eduyata-collaboration\django_backend')

print("Starting Django server on port 8001...")
print("Press Ctrl+C to stop the server")

try:
    # Start Django server
    subprocess.run([sys.executable, 'manage.py', 'runserver', '127.0.0.1:8001'])
except KeyboardInterrupt:
    print("\nServer stopped.")
except Exception as e:
    print(f"Error starting server: {e}")
    input("Press Enter to exit...")