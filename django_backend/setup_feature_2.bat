@echo off
echo Setting up Feature 2: Product & Tenant Configuration Management
echo.

echo Step 1: Creating database tables...
mysql -u root -p eduyata_db < create_tenant_config_tables.sql
if %errorlevel% neq 0 (
    echo Error: Failed to create database tables
    pause
    exit /b 1
)
echo ✓ Database tables created successfully

echo.
echo Step 2: Running Django migrations...
python manage.py makemigrations platform_config
python manage.py migrate platform_config
if %errorlevel% neq 0 (
    echo Error: Failed to run Django migrations
    pause
    exit /b 1
)
echo ✓ Django migrations completed

echo.
echo Step 3: Creating sample data...
python setup_tenant_config.py
if %errorlevel% neq 0 (
    echo Error: Failed to create sample data
    pause
    exit /b 1
)
echo ✓ Sample data created successfully

echo.
echo ========================================
echo Feature 2 Setup Complete!
echo ========================================
echo.
echo You can now test the multi-tenant configuration system:
echo.
echo 1. Products API:
echo    GET http://localhost:8000/api/admin/config/products/
echo.
echo 2. Tenants API:
echo    GET http://localhost:8000/api/admin/config/tenants/
echo.
echo 3. Configuration Resolution:
echo    GET http://localhost:8000/api/config/resolve/?tenant=dps-delhi
echo    GET http://localhost:8000/api/config/resolve/?tenant=st-marys
echo.
echo 4. Configuration Hierarchy:
echo    GET http://localhost:8000/api/admin/config/hierarchy/?key=theme_primary_color&tenant=dps-delhi
echo.
echo Press any key to continue...
pause