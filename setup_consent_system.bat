@echo off
echo ========================================
echo Consent Management System Setup
echo ========================================
echo.

echo Step 1: Creating Django migrations...
cd django_backend
python manage.py makemigrations auth_app
if %errorlevel% neq 0 (
    echo Warning: Migration creation failed. This is normal if database is not running.
    echo The migration files have been created and will be applied when the database is available.
)

echo.
echo Step 2: Applying migrations (requires running database)...
python manage.py migrate auth_app
if %errorlevel% neq 0 (
    echo Warning: Migration application failed. Please ensure:
    echo 1. MySQL server is running
    echo 2. Database credentials are correct in settings.py
    echo 3. Run this command manually when database is available: python manage.py migrate auth_app
)

echo.
echo Step 3: Setting up initial consent data...
python -c "
import os, sys, django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

try:
    from auth_app.models import Student, StudentConsent, ConsentHistory
    from django.db import connection
    
    # Check if tables exist
    with connection.cursor() as cursor:
        cursor.execute('SHOW TABLES LIKE \"student_consent\"')
        if cursor.fetchone():
            print('✓ student_consent table exists')
        else:
            print('✗ student_consent table not found')
            
        cursor.execute('SHOW TABLES LIKE \"consent_history\"')
        if cursor.fetchone():
            print('✓ consent_history table exists')
        else:
            print('✗ consent_history table not found')
    
    print('Database connection successful!')
    
except Exception as e:
    print(f'Database connection failed: {e}')
    print('Please ensure MySQL is running and try again.')
"

echo.
echo ========================================
echo Setup Summary
echo ========================================
echo.
echo Files created:
echo - Django migration: auth_app/migrations/0010_consenthistory_studentconsent_and_more.py
echo - Backend views: auth_app/consent_views.py
echo - Frontend components: client/src/components/PrivacyDashboard.tsx
echo - Frontend components: client/src/components/PrivacyNotice.tsx
echo - Updated Settings page with Privacy tab
echo - Database setup script: create_consent_tables.sql
echo.
echo Next steps:
echo 1. Start MySQL server if not running
echo 2. Run: python manage.py migrate auth_app
echo 3. Start Django server: python manage.py runserver
echo 4. Test the Privacy tab in Settings page
echo.
echo API Endpoints available:
echo - GET  /api/auth/consent_status/
echo - POST /api/auth/update_consent/
echo - POST /api/auth/bulk_consent/
echo - GET  /api/auth/consent_history/
echo.
pause