#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def create_missing_tables():
    with connection.cursor() as cursor:
        # Create api_keys table
        print("Creating api_keys table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS api_keys (
                id INT(11) NOT NULL AUTO_INCREMENT,
                key_value VARCHAR(64) NOT NULL UNIQUE,
                name VARCHAR(200) NOT NULL,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                created_at DATETIME(6) NOT NULL,
                rate_limit_per_hour INT(11) NOT NULL DEFAULT 1000,
                last_used_at DATETIME(6) NULL,
                request_count INT(11) NOT NULL DEFAULT 0,
                allowed_ips LONGTEXT NOT NULL,
                user_id INT(11) NOT NULL,
                PRIMARY KEY (id),
                KEY api_keys_user_id (user_id),
                CONSTRAINT api_keys_user_id_fk FOREIGN KEY (user_id) REFERENCES auth_user (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ api_keys table created")
        
        # Create webhook_endpoints table
        print("Creating webhook_endpoints table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS webhook_endpoints (
                id INT(11) NOT NULL AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL,
                url LONGTEXT NOT NULL,
                event_types VARCHAR(500) NOT NULL,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                created_at DATETIME(6) NOT NULL,
                created_by INT(11) NOT NULL,
                PRIMARY KEY (id),
                KEY webhook_endpoints_created_by (created_by),
                CONSTRAINT webhook_endpoints_created_by_fk FOREIGN KEY (created_by) REFERENCES auth_user (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ webhook_endpoints table created")
        
        print("\nAll missing tables created successfully!")

if __name__ == "__main__":
    create_missing_tables()