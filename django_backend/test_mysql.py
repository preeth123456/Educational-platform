import pymysql

passwords = ['', 'password', 'admin']

for pwd in passwords:
    try:
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password=pwd,
            database='eduyata_db'
        )
        print(f"SUCCESS with password: '{pwd}'")
        conn.close()
        break
    except Exception as e:
        print(f"FAILED with password '{pwd}': {e}")
