import pymysql

try:
    conn = pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='eduyata_db'
    )
    
    cursor = conn.cursor()
    
    with open('create_video_conferencing_tables.sql', 'r') as file:
        sql_commands = file.read().split(';')
        
    for command in sql_commands:
        command = command.strip()
        if command:
            cursor.execute(command)
    
    conn.commit()
    print("Video conferencing tables created successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    
finally:
    if 'conn' in locals():
        conn.close()