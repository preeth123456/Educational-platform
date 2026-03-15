@echo off
echo Stopping Django server...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *manage.py*" 2>nul

echo Starting Django server on port 8001...
cd /d "%~dp0"
start "Django Server" python manage.py runserver 8001

echo Django server restarted!
timeout /t 3
