import pymysql

def complete_feature_setup():
    """Complete feature flags setup"""
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # 1. Create feature flags table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feature_flags (
                id INT(11) NOT NULL AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                is_enabled TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY idx_name (name),
                KEY idx_enabled (is_enabled)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        
        # 2. Create feature flag users table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feature_flag_users (
                id INT(11) NOT NULL AUTO_INCREMENT,
                flag_name VARCHAR(100) NOT NULL,
                user_id INT(11) NOT NULL,
                user_type ENUM('student', 'teacher', 'admin') DEFAULT 'student',
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY unique_flag_user (flag_name, user_id, user_type),
                KEY idx_flag_name (flag_name),
                KEY idx_user_id (user_id),
                KEY idx_user_type (user_type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        
        # 3. Insert feature flags
        features = [
            ('theme_toggle', 'Switch between light and dark themes'),
            ('advanced_dashboard', 'Access to advanced dashboard features'),
            ('beta_features', 'Early access to beta features')
        ]
        
        for name, description in features:
            cursor.execute("""
                INSERT INTO feature_flags (name, description, is_enabled)
                VALUES (%s, %s, 1)
                ON DUPLICATE KEY UPDATE 
                description = VALUES(description),
                is_enabled = 1
            """, (name, description))
        
        # 4. Get student database ID
        cursor.execute("SELECT id FROM students WHERE student_id = 'STU20251807'")
        result = cursor.fetchone()
        
        if result:
            student_db_id = result[0]
            print(f"Found student DB ID: {student_db_id}")
            
            # 5. Assign all features to student
            for name, _ in features:
                cursor.execute("""
                    INSERT INTO feature_flag_users (flag_name, user_id, user_type)
                    VALUES (%s, %s, 'student')
                    ON DUPLICATE KEY UPDATE assigned_at = NOW()
                """, (name, student_db_id))
                print(f"✅ Assigned {name}")
        else:
            print("❌ Student not found")
        
        conn.commit()
        conn.close()
        print("✅ Feature flags setup complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    complete_feature_setup()