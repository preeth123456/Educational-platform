# Feature 2: Product & Tenant Configuration Management

## Overview

This feature implements a comprehensive multi-tenant configuration management system for Eduyata, allowing different schools (tenants) and educational products to have customized settings while maintaining a single codebase.

## What This Feature Does

### 🏢 Multi-Tenancy Support
- **Products**: Different educational offerings (CBSE, ICSE, State Board)
- **Tenants**: Different schools/organizations using the platform
- **Hierarchical Configuration**: Global → Product → Tenant → User levels

### 🎨 Customization Capabilities
- **Branding**: Custom logos, colors, themes per school
- **Grading Systems**: Different grading scales per curriculum/school
- **Feature Toggles**: Enable/disable features per tenant
- **Business Rules**: Custom policies and settings

## Database Schema

### New Tables Created
```sql
products              # Educational products (CBSE, ICSE, etc.)
tenants              # Schools/organizations
product_configs      # Product-level configurations
tenant_configs       # Tenant-level configurations (overrides)
```

### Configuration Hierarchy
1. **Global Config** (platform_configs) - Lowest priority
2. **Product Config** (product_configs) - Medium priority  
3. **Tenant Config** (tenant_configs) - Highest priority

## API Endpoints

### Product Management
```
GET    /api/admin/config/products/                    # List all products
POST   /api/admin/config/products/create/             # Create product
GET    /api/admin/config/products/{product_id}/       # Get product details
PUT    /api/admin/config/products/{product_id}/update/ # Update product
```

### Tenant Management
```
GET    /api/admin/config/tenants/                     # List all tenants
POST   /api/admin/config/tenants/create/              # Create tenant
GET    /api/admin/config/tenants/{tenant_id}/         # Get tenant details
PUT    /api/admin/config/tenants/{tenant_id}/update/  # Update tenant
```

### Configuration Resolution
```
GET    /api/config/resolve/?tenant={id}&product={id}  # Get resolved configs
GET    /api/admin/config/hierarchy/?key={key}&tenant={id} # Debug hierarchy
```

## Installation & Setup

### 1. Run the Setup Script
```bash
cd django_backend
setup_feature_2.bat
```

This will:
- Create database tables
- Run Django migrations
- Insert sample data

### 2. Manual Setup (Alternative)
```bash
# Create database tables
mysql -u root -p eduyata_db < create_tenant_config_tables.sql

# Run Django migrations
python manage.py makemigrations platform_config
python manage.py migrate platform_config

# Create sample data
python setup_tenant_config.py
```

## Usage Examples

### 1. Configuration Resolution in Code
```python
from platform_config.utils import resolve_config

# Get theme color for DPS Delhi
color = resolve_config('theme_primary_color', tenant_id='dps-delhi')
# Returns: '#dc3545' (DPS red, overrides default blue)

# Get grading system for CBSE product
grades = resolve_config('grading_system', product_id='cbse-standard')
# Returns: ["A+", "A", "B+", "B", "C+", "C", "D", "F"]
```

### 2. API Usage
```bash
# Get all configurations for DPS Delhi
curl "http://localhost:8000/api/config/resolve/?tenant=dps-delhi"

# Get configuration hierarchy for debugging
curl "http://localhost:8000/api/admin/config/hierarchy/?key=theme_primary_color&tenant=dps-delhi"
```

### 3. Frontend Integration
```javascript
// Fetch tenant-specific configurations
const response = await fetch('/api/config/resolve/?tenant=dps-delhi');
const configs = await response.json();

// Apply theme color
document.documentElement.style.setProperty('--primary-color', configs.data.theme_primary_color.value);
```

## Sample Data Created

### Products
- **cbse-standard**: CBSE Standard curriculum
- **icse-premium**: ICSE Premium curriculum  
- **state-basic**: State Board Basic curriculum

### Tenants
- **dps-delhi**: Delhi Public School (Premium)
- **st-marys**: St. Mary's Convent (Standard)
- **kendriya-001**: Kendriya Vidyalaya No.1 (Basic)

### Configuration Examples
```json
{
  "dps-delhi": {
    "theme_primary_color": "#dc3545",  // Red theme
    "school_logo_url": "/logos/dps-logo.png",
    "enable_advanced_analytics": true
  },
  "st-marys": {
    "theme_primary_color": "#17a2b8",  // Cyan theme
    "school_logo_url": "/logos/stmarys-logo.png",
    "grading_system": ["Excellent", "Very Good", "Good", "Satisfactory", "Needs Improvement"]
  }
}
```

## Testing

### Run Tests
```bash
python test_feature_2.py
```

### Manual Testing
1. Start Django server: `python manage.py runserver`
2. Test endpoints with Postman or curl
3. Check configuration resolution works correctly

## Real-World Use Cases

### 1. School Branding
- **Problem**: Each school wants their own colors and logo
- **Solution**: Tenant-specific appearance configurations
- **Result**: DPS sees red theme, St. Mary's sees cyan theme

### 2. Different Grading Systems
- **Problem**: CBSE uses A+/A/B grades, some schools use Excellent/Good/Poor
- **Solution**: Product and tenant-level grading_system configs
- **Result**: Each school can have their preferred grading display

### 3. Feature Access Control
- **Problem**: Premium schools get advanced features, basic schools don't
- **Solution**: Tenant-level feature toggle configurations
- **Result**: Advanced analytics only for premium subscribers

### 4. Curriculum Customization
- **Problem**: Different boards have different requirements
- **Solution**: Product-level configurations for each curriculum
- **Result**: CBSE and ICSE can have different default settings

## Configuration Categories

### Appearance Settings
- `theme_primary_color`: Primary brand color
- `theme_secondary_color`: Secondary brand color
- `school_logo_url`: Custom school logo
- `favicon_url`: Custom favicon

### Feature Toggles
- `enable_advanced_analytics`: Advanced reporting features
- `enable_video_conferencing`: Video classroom features
- `enable_ai_assistant`: AI-powered learning assistant

### Grading Systems
- `grading_system`: Array of grade labels
- `grade_thresholds`: Percentage thresholds for grades
- `show_percentage`: Whether to show percentage with grades

### Content Settings
- `default_language`: Primary language for content
- `supported_languages`: Available language options
- `curriculum_mapping`: Subject-curriculum mappings

## Benefits

### For Platform Administrators
- **Centralized Management**: Manage all tenant configurations from one place
- **Scalability**: Easy to onboard new schools with custom settings
- **Flexibility**: Support diverse educational requirements

### For School Administrators
- **Customization**: Tailor the platform to match school branding and policies
- **Control**: Manage school-specific settings independently
- **Consistency**: Maintain school identity across the platform

### For End Users (Students/Teachers)
- **Familiar Experience**: See their school's branding and familiar grading systems
- **Relevant Features**: Access features appropriate for their subscription level
- **Personalization**: Experience tailored to their educational context

## Architecture Benefits

### Single Codebase
- One application serves multiple tenants
- Reduced maintenance overhead
- Consistent feature updates across all tenants

### Configuration Hierarchy
- Sensible defaults at global level
- Product-specific customizations
- Tenant-specific overrides
- Clear precedence rules

### Audit Trail
- All configuration changes are logged
- Track who changed what and when
- Compliance and debugging support

## Future Enhancements

### User-Level Configurations
- Individual user preferences
- Personal theme settings
- Custom dashboard layouts

### Advanced Feature Toggles
- Time-based feature activation
- Geographic feature restrictions
- Usage-based feature limits

### Configuration Templates
- Pre-defined configuration sets
- Quick setup for new tenants
- Best practice configurations

## Troubleshooting

### Common Issues

1. **Configuration not resolving**
   - Check tenant_id and product_id are correct
   - Verify configuration exists in database
   - Use hierarchy endpoint to debug resolution

2. **Database connection errors**
   - Ensure MySQL is running
   - Check database credentials in .env file
   - Verify tables were created successfully

3. **API authentication errors**
   - Include Authorization header for admin endpoints
   - Use valid admin token
   - Check token expiration

### Debug Commands
```bash
# Check configuration hierarchy
curl "http://localhost:8000/api/admin/config/hierarchy/?key=theme_primary_color&tenant=dps-delhi"

# List all tenant configurations
curl "http://localhost:8000/api/config/resolve/?tenant=dps-delhi"

# Test configuration resolution in Django shell
python manage.py shell
>>> from platform_config.utils import resolve_config
>>> resolve_config('theme_primary_color', tenant_id='dps-delhi')
```

## Support

For issues or questions about this feature:
1. Check the troubleshooting section above
2. Run the test script: `python test_feature_2.py`
3. Review the API documentation in this README
4. Check Django logs for detailed error messages

---

**Feature Status**: ✅ Implemented and Ready for Use
**Last Updated**: January 2025
**Version**: 1.0.0