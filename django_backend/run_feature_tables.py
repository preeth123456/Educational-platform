import pymysql

def run_feature_tables():
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        with open('create_feature_tables.sql', 'r') as file:
            sql_content = file.read()
            
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
        
        for statement in statements:
            print(f"Executing: {statement[:50]}...")
            cursor.execute(statement)
        
        conn.commit()
        print("Feature tables created successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    run_feature_tables()