"""
Script to create the social_accounts table for SSO integration
Run: python create_social_accounts.py
"""
import pymysql
from dotenv import load_dotenv
import os

# Database connection (matching settings.py)
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

# Create social_accounts table
sql = """
CREATE TABLE IF NOT EXISTS social_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(30) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL,
    name VARCHAR(255) DEFAULT '',
    picture_url VARCHAR(500) DEFAULT '',
    user_type VARCHAR(20) NOT NULL,
    student_id INT NULL,
    educator_id INT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_provider_account (provider, provider_id),
    INDEX idx_email (email),
    INDEX idx_student (user_type, student_id),
    INDEX idx_educator (user_type, educator_id)
);
"""

try:
    cursor.execute(sql)
    conn.commit()
    print("✅ social_accounts table created successfully!")
    
    # Verify table exists
    cursor.execute("SHOW TABLES LIKE 'social_accounts'")
    if cursor.fetchone():
        print("✅ Table verified in database")
        
        cursor.execute("DESCRIBE social_accounts")
        print("\nTable structure:")
        for row in cursor.fetchall():
            print(f"  {row[0]}: {row[1]}")
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    cursor.close()
    conn.close()
