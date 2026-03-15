import pymysql

try:
    # Connect to MySQL
    conn = pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password=''
    )
    
    cursor = conn.cursor()
    
    # Check databases
    cursor.execute("SHOW DATABASES")
    databases = cursor.fetchall()
    print("Available databases:")
    for db in databases:
        print(f"  - {db[0]}")
    
    # Check if eduyata_db exists
    cursor.execute("USE eduyata_db")
    print("\nConnected to eduyata_db")
    
    # Show tables
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("\nTables in eduyata_db:")
    for table in tables:
        print(f"  - {table[0]}")
    
    # Check students table structure if it exists
    try:
        cursor.execute("DESCRIBE students")
        columns = cursor.fetchall()
        print("\nStudents table structure:")
        for col in columns:
            print(f"  {col[0]} - {col[1]}")
        
        # Show sample data
        cursor.execute("SELECT * FROM students LIMIT 3")
        rows = cursor.fetchall()
        print(f"\nSample data ({len(rows)} rows):")
        for row in rows:
            print(f"  {row}")
            
    except Exception as e:
        print(f"Students table error: {e}")
    
    conn.close()
    
except Exception as e:
    print(f"Database connection error: {e}")