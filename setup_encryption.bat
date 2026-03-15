@echo off
echo ============================================================
echo Eduyata Encryption Setup
echo ============================================================
echo.

cd django_backend

echo Step 1: Installing dependencies...
pip install cryptography==41.0.7 argon2-cffi==23.1.0
echo.

echo Step 2: Generating encryption keys...
python generate_encryption_keys.py
echo.

echo Step 3: Running database migration...
echo Please run this SQL file manually in MySQL:
echo mysql -u root -p eduyata_db ^< add_encryption_fields.sql
echo.

echo Step 4: After adding keys to .env, start the server and run:
echo curl -X POST http://localhost:8001/api/auth/encrypt_existing_data/
echo.

echo ============================================================
echo Setup Complete!
echo ============================================================
echo.
echo Next steps:
echo 1. Copy the generated keys to your .env file
echo 2. Run the SQL migration: add_encryption_fields.sql
echo 3. Start Django server: python manage.py runserver
echo 4. Encrypt existing data via API endpoint
echo.
pause
