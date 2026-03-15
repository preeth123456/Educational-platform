@csrf_exempt
def student_login(request):
    if request.method == "POST":
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body.decode("utf-8"))
            else:
                data = request.POST
            
            student_id = data.get("studentId")
            password = data.get("password")

            if not student_id or not password:
                return JsonResponse({"error": "Student ID and password are required"}, status=400)

            conn = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, student_id, name, mobile_self, class, board, gender, profile_picture, profile_completed, password_hash FROM students WHERE student_id = %s",
                (student_id,)
            )
            row = cursor.fetchone()
            
            if row:
                id, student_id_db, name, mobile_self, class_val, board, gender, profile_picture, profile_completed, password_hash = row
                
                password_valid = False
                if password_hash and password_hash.startswith('$2y$'):
                    try:
                        import bcrypt
                        password_valid = bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
                    except ImportError:
                        password_valid = False
                
                if password_valid:
                    conn.close()
                    return JsonResponse({
                        "message": "Login successful", 
                        "data": {
                            "role": "student",
                            "student_id": student_id_db,
                            "id": id,
                            "name": name,
                            "phone": mobile_self,
                            "class": class_val,
                            "board": board,
                            "gender": gender or "",
                            "profile_picture": profile_picture or "",
                            "profile_completed": bool(profile_completed)
                        }
                    }, status=200)
            
            conn.close()
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)