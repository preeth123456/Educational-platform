@echo off
echo Setting up Data Retention & Right-to-Erasure System...

echo.
echo 1. Creating database tables...
python manage.py sqlmigrate auth_app 0001 > nul 2>&1
mysql -u root -p eduyata_db < create_data_retention_tables.sql

echo.
echo 2. Running Django migrations...
python manage.py makemigrations auth_app
python manage.py migrate

echo.
echo 3. Installing additional Python packages...
pip install -r data_retention_requirements.txt

echo.
echo 4. Creating media directories...
if not exist "media\exports" mkdir media\exports

echo.
echo 5. Testing data retention functionality...
python manage.py cleanup_data --dry-run

echo.
echo Setup complete! 
echo.
echo To start the system:
echo 1. Start Redis server (required for Celery)
echo 2. Run: start_celery_worker.bat
echo 3. Run: start_celery_beat.bat (in another terminal)
echo 4. Start Django server: python manage.py runserver
echo.
echo The Data Management tab will be available in student settings.
echo Admin dashboard will be available at /admin/data-retention/

pause