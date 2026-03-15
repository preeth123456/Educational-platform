@echo off
echo ========================================
echo Eduyata Database Setup
echo ========================================
echo.
echo This script will help you set up the database for Eduyata.
echo.
echo Please follow these steps:
echo.
echo 1. Open your web browser and go to: http://localhost/phpmyadmin
echo 2. Click on "Import" in the top menu
echo 3. Click "Choose File" and select: server/api/database_setup.sql
echo 4. Click "Go" to import the database structure
echo.
echo 5. Test the database connection by visiting:
echo    http://localhost/AIEduPro/server/api/test_db.php
echo.
echo 6. If everything is working, you can test the registration by:
echo    - Going to your application
echo    - Trying to register a new student
echo.
pause 