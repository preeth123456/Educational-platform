#!/usr/bin/env python
"""
Add sample configuration data for testing
"""
import pymysql
import traceback
from datetime import datetime

def add_sample_configs():
    """Add sample configuration data"""
    try:
        # Connect to database
        connection = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = connection.cursor()
        
        print("Connected to database")
        
        # Create platform_configs table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS platform_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                `key` VARCHAR(100) UNIQUE NOT NULL,
                value TEXT NOT NULL,
                value_type VARCHAR(20) DEFAULT 'string',
                category VARCHAR(50) DEFAULT 'general',
                description TEXT,
                is_sensitive BOOLEAN DEFAULT FALSE,
                is_editable BOOLEAN DEFAULT TRUE,
                updated_by INT NULL,
                updated_by_name VARCHAR(255),
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_key (`key`),
                INDEX idx_category (category)
            )
        """)
        
        print("Created platform_configs table")
        
        # Sample configuration data
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        configs = [
            ('site_name', 'Eduyata Platform', 'string', 'general', 'Platform name displayed to users'),
            ('theme_primary_color', '#3B82F6', 'string', 'appearance', 'Primary theme color'),
            ('theme_secondary_color', '#6B7280', 'string', 'appearance', 'Secondary theme color'),
            ('grading_system', 'percentage', 'string', 'general', 'Default grading system'),
            ('school_logo_url', '/assets/default-logo.png', 'string', 'appearance', 'Default school logo URL'),
            ('max_students_per_class', '40', 'integer', 'general', 'Maximum students allowed per class'),
            ('enable_notifications', 'true', 'boolean', 'general', 'Enable push notifications'),
            ('timezone', 'Asia/Kolkata', 'string', 'general', 'Default timezone'),
        ]
        
        # Insert sample configs
        for key, value, value_type, category, description in configs:
            cursor.execute("""
                INSERT IGNORE INTO platform_configs 
                (`key`, value, value_type, category, description, is_sensitive, is_editable, updated_by_name, updated_at, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (key, value, value_type, category, description, False, True, 'System', now, now))
        
        print(f"Inserted {cursor.rowcount} configuration records")
        
        # Create product_configs table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS product_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id VARCHAR(50) NOT NULL,
                `key` VARCHAR(100) NOT NULL,
                value TEXT NOT NULL,
                value_type VARCHAR(20) DEFAULT 'string',
                category VARCHAR(50) DEFAULT 'general',
                description TEXT,
                is_sensitive BOOLEAN DEFAULT FALSE,
                updated_by INT NULL,
                updated_by_name VARCHAR(255),
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_product_key (product_id, `key`),
                FOREIGN KEY (product_id) REFERENCES products(product_id),
                INDEX idx_product (product_id),
                INDEX idx_key (`key`)
            )
        """)
        
        print("Created product_configs table")
        
        # Sample product configs
        product_configs = [
            ('cbse-standard', 'grading_system', 'cgpa', 'string', 'grading', 'CBSE uses CGPA system'),
            ('cbse-standard', 'theme_primary_color', '#FF6B35', 'string', 'appearance', 'CBSE brand color'),
            ('icse-premium', 'grading_system', 'percentage', 'string', 'grading', 'ICSE uses percentage system'),
            ('icse-premium', 'theme_primary_color', '#8B5CF6', 'string', 'appearance', 'ICSE premium color'),
        ]
        
        for product_id, key, value, value_type, category, description in product_configs:
            cursor.execute("""
                INSERT IGNORE INTO product_configs 
                (product_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (product_id, key, value, value_type, category, description, False, 'System', now, now))
        
        print(f"Inserted {cursor.rowcount} product configuration records")
        
        # Create tenant_configs table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tenant_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id VARCHAR(50) NOT NULL,
                product_id VARCHAR(50) NULL,
                `key` VARCHAR(100) NOT NULL,
                value TEXT NOT NULL,
                value_type VARCHAR(20) DEFAULT 'string',
                category VARCHAR(50) DEFAULT 'general',
                description TEXT,
                is_sensitive BOOLEAN DEFAULT FALSE,
                updated_by INT NULL,
                updated_by_name VARCHAR(255),
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_tenant_product_key (tenant_id, product_id, `key`),
                FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
                FOREIGN KEY (product_id) REFERENCES products(product_id),
                INDEX idx_tenant (tenant_id),
                INDEX idx_key (`key`)
            )
        """)
        
        print("Created tenant_configs table")
        
        # Sample tenant configs
        tenant_configs = [
            ('dps-delhi', None, 'school_logo_url', '/assets/dps-logo.png', 'string', 'appearance', 'DPS Delhi logo'),
            ('dps-delhi', None, 'site_name', 'DPS Delhi Portal', 'string', 'general', 'DPS Delhi site name'),
            ('st-marys', None, 'school_logo_url', '/assets/stmarys-logo.png', 'string', 'appearance', 'St. Marys logo'),
            ('st-marys', None, 'theme_primary_color', '#DC2626', 'string', 'appearance', 'St. Marys red theme'),
        ]
        
        for tenant_id, product_id, key, value, value_type, category, description in tenant_configs:
            cursor.execute("""
                INSERT IGNORE INTO tenant_configs 
                (tenant_id, product_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (tenant_id, product_id, key, value, value_type, category, description, False, 'System', now, now))
        
        print(f"Inserted {cursor.rowcount} tenant configuration records")
        
        # Commit changes
        connection.commit()
        
        # Verify the data
        print("\nVerifying configuration data...")
        cursor.execute("SELECT COUNT(*) FROM platform_configs")
        print(f"Platform configs: {cursor.fetchone()[0]}")
        
        cursor.execute("SELECT COUNT(*) FROM product_configs")
        print(f"Product configs: {cursor.fetchone()[0]}")
        
        cursor.execute("SELECT COUNT(*) FROM tenant_configs")
        print(f"Tenant configs: {cursor.fetchone()[0]}")
        
        cursor.close()
        connection.close()
        
        print("\nSample configuration data added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    add_sample_configs()