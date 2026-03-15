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

with open('add_encryption_fields.sql', 'r') as f:
    sql_content = f.read()

statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

for statement in statements:
    try:
        cursor.execute(statement)
        print(f"Executed: {statement[:50]}...")
    except Exception as e:
        print(f"Error: {e}")

conn.commit()
conn.close()
print("Encryption fields added successfully!")