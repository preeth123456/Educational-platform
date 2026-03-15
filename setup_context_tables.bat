@echo off
echo Setting up Context Switching Database Tables...

REM Try different MySQL paths
set MYSQL_PATH=""
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if exist "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe" set MYSQL_PATH="C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"

if %MYSQL_PATH%=="" (
    echo MySQL not found. Please run the SQL script manually in your MySQL client.
    echo File: create_context_switching_tables.sql
    pause
    exit /b 1
)

echo Using MySQL at: %MYSQL_PATH%
%MYSQL_PATH% -u root -p eduyata_db < create_context_switching_tables.sql

if %ERRORLEVEL% EQU 0 (
    echo Context switching tables created successfully!
) else (
    echo Error creating tables. Please check your MySQL connection.
)

pause