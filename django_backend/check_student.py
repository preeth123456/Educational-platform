import pymysql

try:
    conn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='',
        database='eduyata_db'
    )
    cursor = conn.cursor()
    
    cursor.execute("SELECT student_id, name, password_hash FROM students WHERE student_id = 'STU20251807'")
    result = cursor.fetchone()
    
    if result:
        print(f"Student: {result[0]}, Name: {result[1]}, Password: {result[2]}")
    else:
        print("Student STU20251807 not found")
        
    conn.close()
except Exception as e:
    print(f"Database error: {e}")