
import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from auth_app.models import Educator

def check_teachers():
    print(f"{'ID':<5} {'Name':<30} {'Email':<30} {'Profile Completed':<20}")
    print("-" * 90)
    
    teachers = Educator.objects.all().order_by('-id')
    for t in teachers:
        print(f"{t.id:<5} {t.name:<30} {t.email:<30} {str(t.profile_completed):<20}")

if __name__ == "__main__":
    check_teachers()
