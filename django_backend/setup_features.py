import pymysql

def setup_feature_flags():
    """Setup feature flags and assign to student"""
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Create feature flags if they don't exist
        features = [
            ('theme_toggle', 'Allow users to switch between light/dark themes', 1),
            ('advanced_dashboard', 'Access to advanced dashboard features', 1),
            ('beta_features', 'Access to beta features and early previews', 1)
        ]
        
        for name, description, enabled in features:
            cursor.execute("""
                INSERT INTO feature_flags (name, description, is_enabled, created_at, updated_at)
                VALUES (%s, %s, %s, NOW(), NOW())
                ON DUPLICATE KEY UPDATE 
                description = VALUES(description),
                is_enabled = VALUES(is_enabled),
                updated_at = NOW()
            """, (name, description, enabled))
            print(f"✅ Created/updated feature: {name}")
        
        # Get student ID
        cursor.execute("SELECT id FROM students WHERE student_id = 'STU20251807'")
        result = cursor.fetchone()
        if not result:
            print("❌ Student STU20251807 not found")
            conn.close()
            return
        
        student_db_id = result[0]
        print(f"Found student with DB ID: {student_db_id}")
        
        # Assign all features to student
        for name, _, _ in features:
            cursor.execute("""
                INSERT INTO feature_flag_users (flag_name, user_id, user_type, assigned_at)
                VALUES (%s, %s, 'student', NOW())
                ON DUPLICATE KEY UPDATE assigned_at = NOW()
            """, (name, student_db_id))
            print(f"✅ Assigned {name} to student")
        
        conn.commit()
        conn.close()
        print("✅ Setup complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    setup_feature_flags()