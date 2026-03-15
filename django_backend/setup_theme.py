import pymysql

def setup_theme_feature():
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Create theme_toggle feature
        cursor.execute("""
            INSERT INTO feature_flags (name, description, is_enabled)
            VALUES ('theme_toggle', 'Switch between light and dark themes', 1)
            ON DUPLICATE KEY UPDATE is_enabled = 1
        """)
        
        # Get student ID
        cursor.execute("SELECT id FROM students WHERE student_id = 'STU20251807'")
        result = cursor.fetchone()
        
        if result:
            student_db_id = result[0]
            print(f"Student DB ID: {student_db_id}")
            
            # Assign theme feature to student
            cursor.execute("""
                INSERT INTO feature_flag_users (flag_name, user_id, user_type)
                VALUES ('theme_toggle', %s, 'student')
                ON DUPLICATE KEY UPDATE assigned_at = NOW()
            """, (student_db_id,))
            
            print("Theme feature assigned to student")
        else:
            print("Student not found")
        
        conn.commit()
        conn.close()
        print("Setup complete")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup_theme_feature()