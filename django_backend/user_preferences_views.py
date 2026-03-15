from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import pymysql

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='eduyata_db'
    )

@csrf_exempt
@require_http_methods(["GET"])
def get_user_preferences(request):
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return JsonResponse({"error": "Student ID required"}, status=400)

        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT theme FROM user_preferences 
            WHERE user_id = %s AND user_type = 'student'
        """, (student_id,))
        
        result = cursor.fetchone()
        theme = result[0] if result else 'auto'
        
        conn.close()
        
        return JsonResponse({
            "status": "success",
            "data": {"theme": theme}
        })
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_user_preferences(request):
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        theme = data.get('theme', 'auto')
        
        if not student_id:
            return JsonResponse({"error": "Student ID required"}, status=400)

        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create user_preferences table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INT(11) NOT NULL AUTO_INCREMENT,
                user_id INT(11) NOT NULL,
                user_type ENUM('student', 'teacher', 'admin') DEFAULT 'student',
                theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY unique_user_prefs (user_id, user_type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        
        # Insert or update preferences
        cursor.execute("""
            INSERT INTO user_preferences (user_id, user_type, theme)
            VALUES (%s, 'student', %s)
            ON DUPLICATE KEY UPDATE theme = VALUES(theme), updated_at = CURRENT_TIMESTAMP
        """, (student_id, theme))
        
        conn.commit()
        conn.close()
        
        return JsonResponse({
            "status": "success",
            "message": "Theme preference updated"
        })
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)