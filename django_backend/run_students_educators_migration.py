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

# Run educators table
with open('create_educators_table.sql', 'r') as f:
    sql_content = f.read()
    try:
        cursor.execute(sql_content)
        print("Educators table created/updated")
    except Exception as e:
        print(f"Educators table error: {e}")

# Run progress tables
with open('../create_tables.sql', 'r') as f:
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
print("Students and educators tables migration completed!")