import os
import django
import sys

# Add the Django project directory to the Python path
sys.path.append('d:/AlstonairProject1/Eduyata/django_backend')

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

# Setup Django
django.setup()

# Now test the virtual classrooms
from virtual_classrooms.models import VirtualClassroom

print("Testing virtual classrooms...")
print("Virtual classrooms app loaded successfully!")
print(f"VirtualClassroom model: {VirtualClassroom}")