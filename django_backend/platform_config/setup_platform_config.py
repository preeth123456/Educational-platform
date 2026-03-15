"""
Script to create platform_config database tables and seed default configurations
Feature 13: Platform Configuration APIs
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')

import django
django.setup()

from django.db import connection


def create_tables():
    """Create platform_configs and config_change_logs tables"""
    
    sql_commands = [
        """
        CREATE TABLE IF NOT EXISTS platform_configs (
            id INT PRIMARY KEY AUTO_INCREMENT,
            `key` VARCHAR(100) UNIQUE NOT NULL,
            value TEXT NOT NULL,
            value_type VARCHAR(20) DEFAULT 'string',
            category VARCHAR(50) DEFAULT 'general',
            description TEXT,
            is_sensitive BOOLEAN DEFAULT FALSE,
            is_editable BOOLEAN DEFAULT TRUE,
            updated_by INT NULL,
            updated_by_name VARCHAR(255) DEFAULT '',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_category (`category`),
            INDEX idx_key (`key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS config_change_logs (
            id INT PRIMARY KEY AUTO_INCREMENT,
            config_key VARCHAR(100) NOT NULL,
            old_value TEXT,
            new_value TEXT NOT NULL,
            changed_by INT NOT NULL,
            changed_by_name VARCHAR(255) NOT NULL,
            changed_by_role VARCHAR(50) NOT NULL,
            ip_address VARCHAR(45) DEFAULT '',
            user_agent TEXT,
            changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_config_key (config_key),
            INDEX idx_changed_at (changed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
    ]
    
    try:
        with connection.cursor() as cursor:
            for sql in sql_commands:
                print(f"Executing: {sql[:60]}...")
                cursor.execute(sql)
                print("Success")
        
        print("\nPlatform config tables created successfully!")
        return True
        
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False


def seed_default_configs():
    """Insert default platform configurations"""
    
    default_configs = [
        # General Settings
        ('site_name', 'Eduyata', 'string', 'general', 'Platform name displayed in UI', False, True),
        ('site_description', 'AI-Powered Learning Platform', 'string', 'general', 'Platform description for SEO', False, True),
        ('maintenance_mode', 'false', 'boolean', 'general', 'Enable maintenance mode to block user access', False, True),
        ('default_language', 'en', 'string', 'general', 'Default language for new users', False, True),
        ('supported_languages', 'en,hi,kn,te', 'string', 'general', 'Comma-separated list of supported language codes (en=English, hi=Hindi, kn=Kannada, te=Telugu)', False, True),
        ('timezone', 'Asia/Kolkata', 'string', 'general', 'Default timezone for the platform', False, True),
        
        # Email Settings
        ('email_notifications_enabled', 'true', 'boolean', 'email', 'Enable or disable email notifications globally', False, True),
        ('email_from_name', 'Eduyata', 'string', 'email', 'Sender name for outgoing emails', False, True),
        ('email_reply_to', 'support@eduyata.com', 'string', 'email', 'Reply-to email address', False, True),
        
        # Storage Settings
        ('max_file_upload_size', '10485760', 'integer', 'storage', 'Maximum file upload size in bytes (10MB default)', False, True),
        ('allowed_file_types', 'pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,png,mp4', 'string', 'storage', 'Comma-separated list of allowed file extensions', False, True),
        ('max_video_size', '104857600', 'integer', 'storage', 'Maximum video upload size in bytes (100MB default)', False, True),
        
        # Security Settings
        ('session_timeout_minutes', '60', 'integer', 'security', 'Session timeout in minutes', False, True),
        ('max_login_attempts', '5', 'integer', 'security', 'Maximum failed login attempts before lockout', False, True),
        ('lockout_duration_minutes', '15', 'integer', 'security', 'Account lockout duration in minutes', False, True),
        ('allow_user_registration', 'true', 'boolean', 'security', 'Allow new users to register', False, True),
        ('require_email_verification', 'true', 'boolean', 'security', 'Require email verification for new accounts', False, True),
        ('password_min_length', '8', 'integer', 'security', 'Minimum password length', False, True),
        
        # API Settings
        ('api_rate_limit_per_hour', '1000', 'integer', 'api', 'Maximum API requests per hour per user', False, True),
        ('api_key_expiry_days', '365', 'integer', 'api', 'API key validity in days', False, True),
        ('enable_public_api', 'true', 'boolean', 'api', 'Enable public API access', False, True),
        
        # Notification Settings
        ('push_notifications_enabled', 'true', 'boolean', 'notification', 'Enable push notifications', False, True),
        ('sms_notifications_enabled', 'false', 'boolean', 'notification', 'Enable SMS notifications', False, True),
        ('notification_digest_frequency', 'daily', 'string', 'notification', 'Email digest frequency: instant, daily, weekly', False, True),
        
        # Appearance Settings
        ('primary_color', '#667eea', 'string', 'appearance', 'Primary theme color (hex)', False, True),
        ('secondary_color', '#764ba2', 'string', 'appearance', 'Secondary theme color (hex)', False, True),
        ('logo_url', '/logo.png', 'string', 'appearance', 'Platform logo URL', False, True),
        ('favicon_url', '/favicon.ico', 'string', 'appearance', 'Favicon URL', False, True),
        
        # Integration Settings
        ('google_analytics_id', '', 'string', 'integration', 'Google Analytics tracking ID', True, True),
        ('facebook_pixel_id', '', 'string', 'integration', 'Facebook Pixel ID', True, True),
        ('stripe_enabled', 'false', 'boolean', 'integration', 'Enable Stripe payment integration', False, True),
        ('razorpay_enabled', 'false', 'boolean', 'integration', 'Enable Razorpay payment integration', False, True),
    ]
    
    insert_sql = """
        INSERT IGNORE INTO platform_configs 
        (`key`, value, value_type, category, description, is_sensitive, is_editable, updated_by, updated_by_name)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 1, 'System')
    """
    
    try:
        with connection.cursor() as cursor:
            inserted = 0
            for config in default_configs:
                try:
                    cursor.execute(insert_sql, config)
                    inserted += 1
                except Exception as e:
                    print(f"Skipping {config[0]}: {e}")
            
            connection.connection.commit()
        
        print(f"\nInserted {inserted} default configurations!")
        return True
        
    except Exception as e:
        print(f"Error seeding configs: {e}")
        return False


def verify_setup():
    """Verify the tables and data were created correctly"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM platform_configs")
            config_count = cursor.fetchone()[0]
            
            cursor.execute("DESCRIBE platform_configs")
            columns = cursor.fetchall()
            
            print(f"\nVerification Results:")
            print(f"   - platform_configs table has {len(columns)} columns")
            print(f"   - {config_count} configurations stored")
            
        return True
        
    except Exception as e:
        print(f"Verification failed: {e}")
        return False


if __name__ == "__main__":
    print("Setting up Platform Configuration System...")
    print("=" * 50)
    
    if create_tables():
        if seed_default_configs():
            verify_setup()
            print("\nPlatform Configuration setup completed!")
            print("\nAPI Endpoints available at:")
            print("  GET    /api/admin/config/          - List all configs")
            print("  GET    /api/admin/config/{key}/    - Get single config")
            print("  PUT    /api/admin/config/{key}/update/  - Update config")
            print("  POST   /api/admin/config/bulk/     - Bulk update")
            print("  GET    /api/admin/config/logs/     - Audit logs")
        else:
            print("\nTables created but seeding failed")
    else:
        print("\nSetup failed")
        sys.exit(1)
