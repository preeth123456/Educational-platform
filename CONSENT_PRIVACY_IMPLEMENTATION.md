# Consent & Privacy Management System

## Overview

This implementation provides a comprehensive Consent & Privacy Management system for the Eduyata learning platform, giving students full control over their personal data usage and privacy settings.

## Features

### 1. Privacy Dashboard
- **Location**: Settings → Privacy tab
- **Features**:
  - Toggle switches for each consent type
  - Clear explanations of data usage
  - Consent history tracking
  - Privacy-friendly defaults

### 2. Consent Types Managed
- **Data Collection**: Analytics and recommendations
- **Progress Sharing**: Sharing progress with teachers
- **Achievement Visibility**: Public visibility of badges/achievements
- **Parent Notifications**: Sending updates to parents
- **Marketing Communications**: Promotional emails

### 3. Privacy Notice Component
- **Usage**: Registration/login flows
- **Features**:
  - Transparent data usage explanations
  - Granular consent options
  - Privacy policy details
  - Required vs optional consents

### 4. Database Tracking
- **Consent Storage**: Current preferences per student
- **History Logging**: All consent changes with timestamps
- **IP Tracking**: Security audit trail
- **Default Settings**: Privacy-friendly defaults

## Implementation Details

### Backend Components

#### Models (`auth_app/models.py`)
```python
class StudentConsent(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    consent_type = models.CharField(max_length=50)
    is_granted = models.BooleanField(default=False)
    granted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ConsentHistory(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    consent_type = models.CharField(max_length=50)
    action = models.CharField(max_length=20)  # 'granted', 'revoked', 'updated'
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
```

#### API Endpoints (`auth_app/consent_views.py`)
- `GET /api/auth/consent_status/` - Get current consent settings
- `POST /api/auth/update_consent/` - Update single consent
- `POST /api/auth/bulk_consent/` - Update multiple consents
- `GET /api/auth/consent_history/` - Get consent change history

### Frontend Components

#### Privacy Dashboard (`components/PrivacyDashboard.tsx`)
- Integrated into Settings page
- Toggle switches for each consent type
- Consent history viewer
- Real-time updates

#### Privacy Notice (`components/PrivacyNotice.tsx`)
- Modal component for registration/login
- Detailed privacy explanations
- Granular consent selection
- Privacy policy integration

#### Settings Integration (`pages/Settings.tsx`)
- New "Privacy" tab added
- Seamless integration with existing settings
- Consistent UI/UX patterns

## Installation & Setup

### 1. Database Setup
```bash
cd django_backend
python setup_consent_management.py
```

### 2. Django Migration
```bash
python manage.py makemigrations auth_app
python manage.py migrate auth_app
```

### 3. Manual SQL Setup (if needed)
```bash
mysql -u your_user -p your_database < create_consent_tables.sql
```

## API Usage Examples

### Get Consent Status
```javascript
const response = await fetch(`/api/auth/consent_status/?student_id=${studentId}`);
const data = await response.json();
// Returns: { status: 'success', data: { data_collection: false, ... } }
```

### Update Consent
```javascript
const response = await fetch('/api/auth/update_consent/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: studentId,
    consent_type: 'data_collection',
    is_granted: true
  })
});
```

### Bulk Update
```javascript
const response = await fetch('/api/auth/bulk_consent/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: studentId,
    consents: {
      data_collection: true,
      progress_sharing: false,
      achievement_visibility: true
    }
  })
});
```

## Privacy-First Design

### Default Settings
- **Data Collection**: `false` (opt-in required)
- **Progress Sharing**: `false` (opt-in required)
- **Achievement Visibility**: `false` (opt-in required)
- **Parent Notifications**: `true` (safety default)
- **Marketing Communications**: `false` (opt-in required)

### Transparency Features
- Clear explanations for each consent type
- Complete consent change history
- IP address logging for security
- Easy consent withdrawal

### Compliance Features
- Granular consent management
- Audit trail maintenance
- Right to be forgotten support
- Data minimization principles

## Integration Points

### Existing Systems
- **Student Authentication**: Uses existing session management
- **Settings Page**: Seamlessly integrated as new tab
- **Database**: Extends existing student model
- **UI Components**: Consistent with existing design system

### Future Enhancements
- **Teacher Consent**: Extend to educator accounts
- **Data Export**: GDPR compliance features
- **Consent Expiry**: Time-based consent renewal
- **Advanced Analytics**: Consent pattern analysis

## Security Considerations

### Data Protection
- IP address logging for audit trails
- Secure API endpoints with validation
- Database foreign key constraints
- Input sanitization and validation

### Privacy Controls
- Default privacy-friendly settings
- Clear opt-in requirements
- Easy consent withdrawal
- Transparent data usage explanations

## Testing

### Manual Testing
1. Navigate to Settings → Privacy
2. Toggle consent switches
3. Save settings and verify persistence
4. Check consent history
5. Test API endpoints directly

### API Testing
```bash
# Test consent status
curl "http://localhost:8001/api/auth/consent_status/?student_id=1"

# Test consent update
curl -X POST "http://localhost:8001/api/auth/update_consent/" \
  -H "Content-Type: application/json" \
  -d '{"student_id": 1, "consent_type": "data_collection", "is_granted": true}'
```

## Troubleshooting

### Common Issues
1. **Tables not created**: Run `setup_consent_management.py`
2. **API errors**: Check Django server logs
3. **UI not loading**: Verify component imports
4. **Consent not saving**: Check network requests in browser dev tools

### Database Issues
```sql
-- Check table existence
SHOW TABLES LIKE '%consent%';

-- Check data
SELECT * FROM student_consent LIMIT 5;
SELECT * FROM consent_history ORDER BY timestamp DESC LIMIT 10;
```

## File Structure
```
django_backend/
├── auth_app/
│   ├── models.py (updated with consent models)
│   ├── consent_views.py (new consent API views)
│   └── urls.py (updated with consent endpoints)
├── create_consent_tables.sql (database setup)
└── setup_consent_management.py (setup script)

client/src/
├── components/
│   ├── PrivacyDashboard.tsx (privacy controls)
│   └── PrivacyNotice.tsx (registration notice)
├── pages/
│   └── Settings.tsx (updated with privacy tab)
└── pages/Settings.css (updated with privacy styles)
```

## Compliance Notes

This implementation follows privacy-by-design principles:
- **Minimal Data Collection**: Only essential data by default
- **Transparent Processing**: Clear explanations of data usage
- **User Control**: Easy consent management and withdrawal
- **Audit Trail**: Complete history of consent changes
- **Secure Storage**: Proper database constraints and validation

The system is designed to support GDPR, COPPA, and other privacy regulations while maintaining a user-friendly experience.