import os
import django
from django.db import connection

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

cursor = connection.cursor()

# Create platform_configs table
sql = """
CREATE TABLE IF NOT EXISTS platform_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(20) DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    updated_by INT,
    updated_by_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
"""

try:
    cursor.execute(sql)
    print("platform_configs table created")
    
    # Insert default data
    cursor.execute("""
    INSERT IGNORE INTO platform_configs (`key`, value, value_type, category, description) VALUES
    ('theme_primary_color', '#007bff', 'string', 'appearance', 'Default platform primary color'),
    ('site_name', 'Eduyata', 'string', 'general', 'Platform name'),
    ('enable_multi_tenant', 'true', 'boolean', 'features', 'Enable multi-tenant functionality');
    """)
    print("Default platform configs inserted")
    
except Exception as e:
    print(f"Error: {e}")