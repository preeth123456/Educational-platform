# Data Encryption & Key Management - Setup Guide

## Overview
This implementation provides enterprise-grade encryption for the Eduyata platform with:
- AES-256-GCM encryption for sensitive PII data
- Encrypted session tokens with automatic expiration
- File encryption for uploads
- Key rotation mechanism
- Security status indicators in UI

## Installation Steps

### 1. Install Dependencies
```bash
cd django_backend
pip install -r requirements.txt
```

### 2. Generate Encryption Keys
```bash
python generate_encryption_keys.py
```

Copy the generated keys and add them to your `.env` file.

### 3. Run Database Migration
```bash
# Using MySQL command line
mysql -u root -p eduyata_db < add_encryption_fields.sql

# Or using Django
python manage.py makemigrations
python manage.py migrate
```

### 4. Encrypt Existing Data (One-time migration)
```bash
# Start Django server
python manage.py runserver

# In another terminal, call the migration endpoint
curl -X POST http://localhost:8001/api/auth/encrypt_existing_data/
```

## API Endpoints

### 1. Encrypt Existing Data
**POST** `/api/auth/encrypt_existing_data/`

Migrates all existing unencrypted data to encrypted format.

**Response:**
```json
{
  "success": true,
  "message": "Data encryption migration completed",
  "encrypted": {
    "students": 150,
    "educators": 25
  }
}
```

### 2. Get Security Status
**GET** `/api/auth/security_status/`

Returns platform-wide encryption statistics.

**Response:**
```json
{
  "success": true,
  "encryption_status": {
    "students": {
      "total": 150,
      "encrypted": 150,
      "percentage": 100.0
    },
    "educators": {
      "total": 25,
      "encrypted": 25,
      "percentage": 100.0
    },
    "active_keys": 1,
    "encryption_algorithm": "AES-256-GCM"
  }
}
```

### 3. Get User Security Status
**GET** `/api/auth/user_security_status/?user_id=1&user_type=student`

Returns encryption status for a specific user.

**Response:**
```json
{
  "success": true,
  "encrypted": true,
  "encryption_algorithm": "AES-256-GCM"
}
```

### 4. Rotate Encryption Key
**POST** `/api/auth/rotate_encryption_key/`

Rotates the encryption key (admin only).

**Response:**
```json
{
  "success": true,
  "message": "Encryption key rotated successfully",
  "key_hash": "a1b2c3d4e5f6g7h8..."
}
```

## Frontend Integration

### Using Security Indicator Component

```tsx
import SecurityIndicator, { SecurityBadge } from '@/components/SecurityIndicator';

// In your profile component
<SecurityIndicator 
  userId={student.id} 
  userType="student" 
  showDetails={true} 
/>

// As a badge
<SecurityBadge encrypted={true} />
```

### Session Manager Usage

The enhanced session manager automatically:
- Encrypts session tokens in localStorage
- Sets 24-hour session timeout
- Validates session on each access
- Clears expired sessions automatically

No code changes needed - existing SessionManager calls work as before!

## Security Features

### 1. Password Hashing
- Upgraded to Argon2 (industry standard)
- Automatic fallback to PBKDF2 and BCrypt
- Existing passwords remain compatible

### 2. Data Encryption
**Encrypted Fields:**
- Student: mobile_self, address, parent_phone
- Educator: mobile, email

**Encryption Method:**
- Algorithm: AES-256-GCM
- Authenticated encryption with associated data (AEAD)
- Unique nonce per encryption

### 3. Session Security
- Base64-encoded encrypted tokens
- 24-hour automatic expiration
- Secure cleanup on logout

### 4. File Encryption
Files can be encrypted using:
```python
from auth_app.encryption import FileEncryption

# Encrypt file
encrypted_path = FileEncryption.encrypt_file('/path/to/file.pdf')

# Decrypt file
content = FileEncryption.decrypt_file(encrypted_path)
```

## Database Schema Changes

### Students Table
```sql
mobile_self_encrypted TEXT
address_encrypted TEXT
parent_phone_encrypted TEXT
encryption_key_id INT
```

### Educators Table
```sql
mobile_encrypted TEXT
email_encrypted TEXT
encryption_key_id INT
```

### New Table: encryption_keys
```sql
id INT PRIMARY KEY AUTO_INCREMENT
key_hash VARCHAR(255)
created_at TIMESTAMP
is_active BOOLEAN
rotated_at TIMESTAMP
```

## Model Usage

### Encrypting Data
```python
# Automatic encryption on save
student = Student.objects.get(id=1)
student.encrypt_sensitive_data()
student.save()
```

### Accessing Encrypted Data
```python
# Automatic decryption
student = Student.objects.get(id=1)
phone = student.get_mobile_self()  # Returns decrypted value
address = student.get_address()    # Returns decrypted value
```

### Checking Encryption Status
```python
student = Student.objects.get(id=1)
if student.is_data_encrypted:
    print("Data is encrypted")
```

## Key Rotation Process

1. Generate new key: `POST /api/auth/rotate_encryption_key/`
2. Old keys are marked inactive
3. New key is activated
4. Re-encrypt data with new key (manual process)

## Backward Compatibility

- Existing unencrypted data remains accessible
- Gradual migration supported
- Fallback to plaintext if decryption fails
- No breaking changes to existing APIs

## Security Best Practices

1. **Never commit encryption keys to git**
2. **Rotate keys periodically** (recommended: every 90 days)
3. **Backup encryption keys securely**
4. **Monitor encryption status** via dashboard
5. **Use HTTPS in production**

## Troubleshooting

### Issue: "ENCRYPTION_KEY not configured"
**Solution:** Run `generate_encryption_keys.py` and add keys to `.env`

### Issue: Decryption fails
**Solution:** Check if encryption key matches the one used for encryption

### Issue: Session expires too quickly
**Solution:** Adjust `SESSION_TIMEOUT` in `sessionManager.ts`

## Testing

### Test Encryption
```python
from auth_app.encryption import EncryptionManager

# Test encryption/decryption
plaintext = "sensitive data"
encrypted = EncryptionManager.encrypt(plaintext)
decrypted = EncryptionManager.decrypt(encrypted)
assert plaintext == decrypted
```

### Test Session Encryption
```typescript
import SessionManager from '@/utils/sessionManager';

// Save session
SessionManager.saveSession(userData);

// Retrieve session
const session = SessionManager.getSession();
console.log(session);
```

## Performance Considerations

- Encryption adds ~1-2ms per operation
- Minimal impact on API response times
- Database queries unchanged
- Client-side encryption is lightweight

## Compliance

This implementation helps meet:
- GDPR requirements for data protection
- PCI DSS standards for sensitive data
- FERPA requirements for student data
- SOC 2 compliance standards

## Support

For issues or questions:
1. Check this documentation
2. Review error logs in Django console
3. Test with provided examples
4. Contact development team

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready
