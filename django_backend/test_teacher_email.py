import pymysql
import os
import sys
import django

# Add the project directory to Python path
sys.path.append('C:/xampp/htdocs/EDUYATA-PROJECT/Eduyta-collaboration/Eduyata-collaboration/django_backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

# Database connection to check teacher email
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

# Get teacher email from database
cursor.execute("SELECT teacher_id, name, email FROM educators WHERE teacher_id = 'TCH202500030'")
result = cursor.fetchone()

if result:
    teacher_id, name, email = result
    print(f"Teacher: {name} ({teacher_id})")
    print(f"Email in database: {email}")
    
    # Test if we can send email to this address
    try:
        django.setup()
        from django.core.mail import send_mail
        from django.conf import settings
        
        # Send test email
        send_mail(
            'Test Email from EduYata Admin',
            f'Hello {name}, this is a test email to verify your email address is working.',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        print(f"✅ Test email sent successfully to: {email}")
        
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        
else:
    print("Teacher not found")

conn.close()