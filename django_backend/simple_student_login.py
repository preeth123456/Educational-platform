from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pymysql
from django.contrib.auth.hashers import check_password

@csrf_exempt
def student_login_simple(request):
    """Simple student login without complex validation"""
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Invalid method"}, status=405)
    
    try:
        data = json.loads(request.body.decode("utf-8"))
        student_id = data.get("studentId")
        password = data.get("password")
        
        if not student_id or not password:
            return JsonResponse({
                "success": False,
                "message": "Student ID and password required"
            }, status=400)
        
        # Connect to database
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Find student
        cursor.execute("""
            SELECT id, student_id, name, mobile_self, class, board, 
                   password_hash, profile_completed
            FROM students 
            WHERE student_id = %s
        """, (student_id,))
        
        result = cursor.fetchone()
        
        if not result:
            conn.close()
            return JsonResponse({
                "success": False,
                "message": "Invalid credentials"
            }, status=401)
        
        user_id, student_id_db, name, mobile, class_val, board, password_hash, profile_completed = result
        
        # Check password (simple check)
        password_valid = False
        
        # Master password
        if password == "123456789":
            password_valid = True
        # Django hash check
        elif password_hash and password_hash.startswith('pbkdf2_sha256'):
            password_valid = check_password(password, password_hash)
        # Plain text fallback
        else:
            password_valid = (password == password_hash)
        
        if not password_valid:
            conn.close()
            return JsonResponse({
                "success": False,
                "message": "Invalid credentials"
            }, status=401)
        
        # Success
        import uuid
        session_token = str(uuid.uuid4())
        
        conn.close()
        
        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "session_token": session_token,
            "data": {
                "id": user_id,
                "student_id": student_id_db,
                "name": name,
                "role": "student",
                "phone": mobile,
                "class": class_val,
                "board": board,
                "profile_completed": bool(profile_completed)
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "message": "Invalid JSON"
        }, status=400)
    except Exception as e:
        print(f"Login error: {e}")
        return JsonResponse({
            "success": False,
            "message": "Server error"
        }, status=500)