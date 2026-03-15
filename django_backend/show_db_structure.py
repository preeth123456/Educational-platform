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

print("=== EDUYATA DATABASE STRUCTURE ===\n")

# Get all tables
cursor.execute("SHOW TABLES")
tables = [table[0] for table in cursor.fetchall()]

for table in sorted(tables):
    print(f"TABLE: {table}")
    print("-" * 50)
    
    # Get table structure
    cursor.execute(f"DESCRIBE {table}")
    columns = cursor.fetchall()
    
    for col in columns:
        field, type_, null, key, default, extra = col
        key_info = f" [{key}]" if key else ""
        null_info = "NULL" if null == "YES" else "NOT NULL"
        default_info = f" DEFAULT {default}" if default else ""
        extra_info = f" {extra}" if extra else ""
        
        print(f"  {field}: {type_} {null_info}{default_info}{key_info}{extra_info}")
    
    # Get row count
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"  Rows: {count}")
    print()

conn.close()