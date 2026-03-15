import os
import sys
import django

# Add the project directory to Python path
sys.path.append('C:/xampp/htdocs/EDUYATA-PROJECT/Eduyta-collaboration/Eduyata-collaboration/django_backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

try:
    # Test email sending
    send_mail(
        'Test Email from EduYata',
        'This is a test email to verify email configuration is working.',
        settings.DEFAULT_FROM_EMAIL,
        ['test@example.com'],  # Replace with a real email to test
        fail_silently=False,
    )
    print("✅ Email sent successfully!")
    print(f"Email settings:")
    print(f"  Host: {settings.EMAIL_HOST}")
    print(f"  Port: {settings.EMAIL_PORT}")
    print(f"  User: {settings.EMAIL_HOST_USER}")
    print(f"  From: {settings.DEFAULT_FROM_EMAIL}")
    
except Exception as e:
    print(f"❌ Email sending failed: {str(e)}")
    print(f"Email settings:")
    print(f"  Host: {settings.EMAIL_HOST}")
    print(f"  Port: {settings.EMAIL_PORT}")
    print(f"  User: {settings.EMAIL_HOST_USER}")
    print(f"  From: {settings.DEFAULT_FROM_EMAIL}")