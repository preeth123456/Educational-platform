import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

conn = pymysql.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    port=int(os.getenv('DB_PORT', '3306')),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', ''),
    database=os.getenv('DB_NAME', 'eduyata_db')
)

cursor = conn.cursor()

# Create tables without foreign key constraints
sql_statements = [
    """
    CREATE TABLE IF NOT EXISTS student_consent (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        consent_type VARCHAR(50) NOT NULL,
        is_granted BOOLEAN DEFAULT FALSE,
        granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_student_consent (student_id, consent_type)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS consent_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        consent_type VARCHAR(50) NOT NULL,
        action VARCHAR(20) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        INDEX idx_student_timestamp (student_id, timestamp),
        INDEX idx_consent_type (consent_type)
    )
    """
]

for sql in sql_statements:
    try:
        cursor.execute(sql)
        print(f"Executed: {sql[:50]}...")
    except Exception as e:
        print(f"Error: {e}")

conn.commit()
conn.close()
print("Consent tables created successfully!")