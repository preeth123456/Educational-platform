from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
def fix_feature_assignments(request):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First, modify the table structure
        cursor.execute("ALTER TABLE feature_flag_users MODIFY COLUMN user_id VARCHAR(50) NOT NULL")
        
        # Clear existing assignments
        cursor.execute("DELETE FROM feature_flag_users")
        
        # Add correct assignments
        cursor.execute("INSERT INTO feature_flag_users (flag_name, user_id, user_type) VALUES ('Theme button', 'STU20251807', 'student')")
        cursor.execute("INSERT INTO feature_flag_users (flag_name, user_id, user_type) VALUES ('Theme button', 'STU20258610', 'student')")
        
        conn.commit()
        conn.close()
        
        return JsonResponse({
            "success": True,
            "message": "Feature assignments fixed successfully"
        })
        
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        })