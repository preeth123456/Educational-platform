import pymysql

def create_feature_flags_tables():
    try:
        # Database connection
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Read and execute SQL file
        with open('create_feature_flags_tables.sql', 'r') as file:
            sql_content = file.read()
            
        # Split by semicolon and execute each statement
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
        
        for statement in statements:
            print(f"Executing: {statement[:50]}...")
            cursor.execute(statement)
        
        conn.commit()
        print("✅ Feature flags tables created successfully!")
        
        # Verify tables exist
        cursor.execute("SHOW TABLES LIKE 'feature_%'")
        tables = cursor.fetchall()
        print(f"Created tables: {[table[0] for table in tables]}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    create_feature_flags_tables()