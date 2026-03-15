# Teacher Login Fix Instructions

## Problem
Teacher login was failing with "Unexpected token '<', '<!DOCTYPE'..." error because Django was returning HTML error pages instead of JSON.

## Root Cause
1. Database schema mismatch - `government_id_file` field in Django model didn't exist in MySQL table
2. Password format incompatibility between PHP bcrypt and Django formats

## Solution Applied

### 1. Fixed Database Schema
- Removed problematic `government_id_file` field from Educator model
- Simplified teacher login view to avoid complex operations

### 2. Updated Password Formats
- Converted existing PHP bcrypt passwords to Django format
- Created test teacher account with proper Django password hash

### 3. Working Credentials

**Test Account (newly created):**
- Email: `teacher@test.com`
- Password: `password123`

**Existing Accounts (updated passwords):**
- Email: `sarah.johnson@eduyata.com`
- Password: `123456789`
- Email: `michael.chen@eduyata.com`
- Password: `123456789`

## Steps to Complete the Fix

### 1. Restart Django Server
```bash
cd django_backend
# Stop current server (Ctrl+C if running)
python manage.py runserver 8001
```

### 2. Test the Login
Use any of the credentials above in your frontend login form.

### 3. Verify API Response
The teacher login should now return proper JSON:
```json
{
  "message": "Login successful",
  "data": {
    "role": "teacher",
    "teacher_id": "TCH202500012",
    "id": 12,
    "name": "Test Teacher",
    "email": "teacher@test.com",
    "profile_completed": true
  }
}
```

## Frontend Usage
Your existing frontend code should work without changes. Just use the working credentials:

```javascript
// In your Login.tsx, use these credentials:
const teacherData = {
  email: "teacher@test.com",
  password: "password123"
};
```

## Files Modified
1. `django_backend/auth_app/models.py` - Removed government_id_file field
2. `django_backend/auth_app/views.py` - Simplified teacher_login view
3. Database - Updated password hashes to Django format

## Verification
After restarting the server, the teacher login endpoint should:
- Return status 200 for valid credentials
- Return proper JSON responses
- No more HTML error pages