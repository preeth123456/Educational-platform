import pymysql
import os

def run_session_schema():
    try:
        # Read the schema file
        schema_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'session_management_schema.sql')
        with open(schema_path, 'r') as file:
            schema_sql = file.read()
        
        # Connect to database
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Split and execute SQL statements
        statements = schema_sql.split(';')
        for statement in statements:
            statement = statement.strip()
            if statement:
                print(f"Executing: {statement[:50]}...")
                cursor.execute(statement)
        
        conn.commit()
        print("Session management schema created successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    run_session_schema()