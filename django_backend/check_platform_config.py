import pymysql

try:
    conn = pymysql.connect(
        host='localhost',
        user='root', 
        password='',
        database='eduyata_db'
    )
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES LIKE 'platform_config'")
    result = cursor.fetchone()
    print(f"platform_config table exists: {result is not None}")
    conn.close()
except Exception as e:
    print(f"Database error: {e}")