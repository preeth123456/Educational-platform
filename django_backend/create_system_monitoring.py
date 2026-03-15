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

# Create system_metrics table based on Django migration
sql_statements = [
    """
    CREATE TABLE IF NOT EXISTS system_metrics (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        metric_type VARCHAR(50) NOT NULL,
        value FLOAT NOT NULL,
        unit VARCHAR(20) DEFAULT '%',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        server_name VARCHAR(100) DEFAULT 'main'
    )
    """,
    """
    CREATE INDEX IF NOT EXISTS system_metr_metric__ef2754_idx 
    ON system_metrics(metric_type, timestamp)
    """,
    """
    CREATE INDEX IF NOT EXISTS system_metr_timesta_206ca6_idx 
    ON system_metrics(timestamp)
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
print("System monitoring tables created successfully!")