import pymysql

def update_theme_description():
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Update theme toggle description
        cursor.execute("""
            UPDATE feature_flags 
            SET description = 'Click the button to toggle between light and dark themes'
            WHERE name = 'theme_toggle'
        """)
        
        conn.commit()
        conn.close()
        print("Theme description updated")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_theme_description()