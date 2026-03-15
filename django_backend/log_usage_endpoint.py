@csrf_exempt
@require_http_methods(["POST"])
def log_feature_usage(request):
    """Log feature flag usage"""
    try:
        data = json.loads(request.body)
        flag_name = data.get('flag_name')
        user_id = data.get('user_id')
        user_type = data.get('user_type', 'student')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Convert student_id to database ID if needed
        db_user_id = user_id
        if user_type == 'student' and isinstance(user_id, str) and user_id.startswith('STU'):
            cursor.execute("SELECT id FROM students WHERE student_id = %s", (user_id,))
            student_result = cursor.fetchone()
            if student_result:
                db_user_id = student_result[0]
        
        # Create feature_flag_logs table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feature_flag_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                flag_name VARCHAR(100) NOT NULL,
                user_id INT NOT NULL,
                user_type ENUM('student', 'teacher', 'admin') DEFAULT 'student',
                used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                KEY idx_flag_user (flag_name, user_id),
                KEY idx_used_at (used_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        
        # Log usage
        cursor.execute("""
            INSERT INTO feature_flag_logs (flag_name, user_id, user_type, used_at)
            VALUES (%s, %s, %s, NOW())
        """, (flag_name, db_user_id, user_type))
        
        conn.commit()
        conn.close()
        
        return JsonResponse({'success': True, 'message': 'Usage logged'})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})