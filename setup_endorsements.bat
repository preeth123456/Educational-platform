@echo off
echo Setting up Skill Endorsements feature...
echo.

echo Creating skill_endorsements table...
"C:\xampp\mysql\bin\mysql.exe" -u root -h localhost eduyata < create_skill_endorsements_table.sql

echo.
echo ✅ Skill Endorsements table created successfully!
echo.
echo The following has been set up:
echo - skill_endorsements table with all required fields
echo - Proper indexes for performance
echo - Foreign key constraints
echo.
echo You can now:
echo 1. Start the Django backend server
echo 2. Start the React frontend
echo 3. Test the endorsement features
echo.
pause