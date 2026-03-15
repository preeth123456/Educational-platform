import pymysql

def assign_features_to_student():
    """Assign all available features to test student"""
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Get student ID
        cursor.execute("SELECT id FROM students WHERE student_id = 'STU20251807'")
        result = cursor.fetchone()
        if not result:
            print("❌ Student STU20251807 not found")
            return
        
        student_db_id = result[0]
        print(f"Found student with DB ID: {student_db_id}")
        
        # Get all enabled feature flags
        cursor.execute("SELECT name FROM feature_flags WHERE is_enabled = 1")
        flags = cursor.fetchall()
        
        if not flags:
            print("❌ No enabled feature flags found")
            return
        
        # Assign student to all flags
        for flag in flags:
            flag_name = flag[0]
            
            # Check if already assigned
            cursor.execute("""
                SELECT COUNT(*) FROM feature_flag_users 
                WHERE flag_name = %s AND user_id = %s AND user_type = 'student'
            """, (flag_name, student_db_id))
            
            if cursor.fetchone()[0] == 0:
                # Assign feature
                cursor.execute("""
                    INSERT INTO feature_flag_users (flag_name, user_id, user_type, assigned_at)
                    VALUES (%s, %s, 'student', NOW())
                """, (flag_name, student_db_id))
                print(f"✅ Assigned {flag_name} to student")
            else:
                print(f"ℹ️ {flag_name} already assigned")
        
        conn.commit()
        conn.close()
        print("✅ Feature assignment complete")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    assign_features_to_student()