import pymysql

try:
    # Connect to database
    conn = pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='eduyata_db'
    )
    
    cursor = conn.cursor()
    
    # Read and execute SQL file
    with open('create_virtual_classrooms_tables.sql', 'r') as file:
        sql_commands = file.read().split(';')
        
    for command in sql_commands:
        command = command.strip()
        if command:
            cursor.execute(command)
    
    conn.commit()
    print("Virtual classrooms tables created successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    
finally:
    if 'conn' in locals():
        conn.close()