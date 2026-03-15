import os
import sys
import django
import json

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from admin_auth.views import ADMIN_USERS

print("Testing Admin Login System")
print("=" * 40)

# Test credentials
test_email = "admin@eduyata.com"
test_password = "admin123"

print(f"Testing login with: {test_email} / {test_password}")

if test_email in ADMIN_USERS:
    admin = ADMIN_USERS[test_email]
    if admin['password'] == test_password:
        print("SUCCESS: Credentials are valid!")
        print(f"Admin ID: {admin['admin_id']}")
        print(f"Name: {admin['name']}")
        print(f"Email: {admin['email']}")
    else:
        print("ERROR: Invalid password")
else:
    print("ERROR: Admin not found")

print("\nAll available admin accounts:")
for email, admin in ADMIN_USERS.items():
    print(f"- {email} (Password: {admin['password']})")