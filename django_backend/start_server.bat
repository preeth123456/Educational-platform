@echo off
echo Starting Django server on port 8001...
cd /d c:\xampp\htdocs\eduyata\Eduyata-collaboration\django_backend
python manage.py runserver 127.0.0.1:8001
pause