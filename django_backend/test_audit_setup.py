import os
import sys
import django
from django.db import connection

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

# Create tables
print("Creating audit tables...")
try:
    with connection.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                user_type ENUM('student', 'teacher', 'admin'),
                action VARCHAR(100),
                resource_type VARCHAR(50),
                resource_id INT,
                details JSON,
                ip_address VARCHAR(45),
                user_agent TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_timestamp (user_id, timestamp),
                INDEX idx_action (action),
                INDEX idx_resource (resource_type, resource_id)
            )
        """)
        print("[OK] audit_logs table created")
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS security_events (
                id INT PRIMARY KEY AUTO_INCREMENT,
                event_type VARCHAR(50),
                severity ENUM('low', 'medium', 'high', 'critical'),
                user_id INT,
                description TEXT,
                metadata JSON,
                ip_address VARCHAR(45),
                resolved BOOLEAN DEFAULT FALSE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_severity_timestamp (severity, timestamp),
                INDEX idx_user_id (user_id),
                INDEX idx_resolved (resolved)
            )
        """)
        print("[OK] security_events table created")
        
        # Test insert
        cursor.execute("""
            INSERT INTO audit_logs (user_id, user_type, action, resource_type, ip_address, user_agent, details)
            VALUES (1, 'student', 'login_success', 'authentication', '127.0.0.1', 'Test Browser', '{}')
        """)
        print("[OK] Test activity logged")
        
        # Verify
        cursor.execute("SELECT COUNT(*) FROM audit_logs")
        count = cursor.fetchone()[0]
        print(f"[OK] Total audit logs: {count}")
        
        print("\n[SUCCESS] Setup complete! Restart Django server.")
        
except Exception as e:
    print(f"[ERROR] {e}")
