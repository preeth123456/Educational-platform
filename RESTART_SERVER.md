# RESTART DJANGO SERVER

## Step 1: Stop Current Server
Press `Ctrl+C` in your Django server terminal to stop it.

## Step 2: Start Server Again
```bash
cd django_backend
python manage.py runserver 8001
```

## Step 3: Test Login
Use these credentials in your frontend:

**Working Credentials:**
- Email: `sarah.johnson@eduyata.com`
- Password: `123456789`

OR

- Email: `teacher@test.com` 
- Password: `password123`

## What I Fixed:
- Replaced Django ORM with direct SQL query
- Simplified password checking
- Removed complex operations that cause 500 errors

The teacher login should now return proper JSON instead of HTML error pages.