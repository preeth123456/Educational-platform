from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.conf import settings
import os
import json
import pymysql
import random

@csrf_exempt
@require_http_methods(["POST"])
def teacher_register_with_files(request):
    """Teacher registration with file uploads to media/teachers folder"""
    try:
        # Get form data
        name = request.POST.get('name')
        email = request.POST.get('email')
        mobile = request.POST.get('phone') or request.POST.get('mobile')
        password = request.POST.get('password')
        gender = request.POST.get('gender', '')
        highest_qualification = request.POST.get('highest_qualification', '')
        experience_years = int(request.POST.get('experience_years', 0))
        bio = request.POST.get('bio', '')
        
        # Parse JSON fields
        import json
        boards = json.loads(request.POST.get('boards', '[]'))
        subject_classes = json.loads(request.POST.get('subject_classes', '{}'))
        languages_known = json.loads(request.POST.get('languages_known', '[]'))
        institutes = json.loads(request.POST.get('institutes', '[]'))
        
        # Get uploaded files
        profile_picture = request.FILES.get('profile_picture')
        cv_file = request.FILES.get('cv_file')
        degree_file = request.FILES.get('degree_certificate')
        achievements_file = request.FILES.get('achievements_file')
        experience_file = request.FILES.get('experience_proof_file')
        
        if not all([name, email, mobile, password]):
            return JsonResponse({"error": "Missing required fields"}, status=400)
        
        # Database connection
        conn = pymysql.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', '3306')),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'eduyata_db')
        )
        
        cursor = conn.cursor()
        
        # Check if email exists
        cursor.execute("SELECT COUNT(*) FROM educators WHERE email = %s", (email,))
        if cursor.fetchone()[0] > 0:
            conn.close()
            return JsonResponse({"error": "Email already exists"}, status=400)
        
        # Generate sequential teacher ID
        cursor.execute("SELECT MAX(CAST(SUBSTRING(teacher_id, 4) AS UNSIGNED)) FROM educators WHERE teacher_id LIKE 'TCH%'")
        result = cursor.fetchone()
        last_number = result[0] if result[0] else 202600000
        teacher_id = f"TCH{last_number + 1:09d}"
        
        # Create teachers folder if it doesn't exist
        teachers_folder = os.path.join(settings.MEDIA_ROOT, 'teachers', teacher_id)
        os.makedirs(teachers_folder, exist_ok=True)
        
        # Save files and get paths
        file_paths = {}
        
        if profile_picture:
            pic_filename = f"profile_picture.{profile_picture.name.split('.')[-1]}"
            pic_path = f"teachers/{teacher_id}/{pic_filename}"
            full_pic_path = os.path.join(settings.MEDIA_ROOT, 'teachers', teacher_id, pic_filename)
            
            with open(full_pic_path, 'wb+') as destination:
                for chunk in profile_picture.chunks():
                    destination.write(chunk)
            file_paths['profile_picture'] = pic_path
        
        if cv_file:
            cv_filename = f"cv_file.{cv_file.name.split('.')[-1]}"
            cv_path = f"teachers/{teacher_id}/{cv_filename}"
            full_cv_path = os.path.join(settings.MEDIA_ROOT, 'teachers', teacher_id, cv_filename)
            
            with open(full_cv_path, 'wb+') as destination:
                for chunk in cv_file.chunks():
                    destination.write(chunk)
            file_paths['cv_file'] = cv_path
        
        if degree_file:
            degree_filename = f"degree_certificate.{degree_file.name.split('.')[-1]}"
            degree_path = f"teachers/{teacher_id}/{degree_filename}"
            full_degree_path = os.path.join(settings.MEDIA_ROOT, 'teachers', teacher_id, degree_filename)
            
            with open(full_degree_path, 'wb+') as destination:
                for chunk in degree_file.chunks():
                    destination.write(chunk)
            file_paths['degree_certificate'] = degree_path
        
        if achievements_file:
            ach_filename = f"achievements.{achievements_file.name.split('.')[-1]}"
            ach_path = f"teachers/{teacher_id}/{ach_filename}"
            full_ach_path = os.path.join(settings.MEDIA_ROOT, 'teachers', teacher_id, ach_filename)
            
            with open(full_ach_path, 'wb+') as destination:
                for chunk in achievements_file.chunks():
                    destination.write(chunk)
            file_paths['achievements_file'] = ach_path
        
        if experience_file:
            exp_filename = f"experience_proof.{experience_file.name.split('.')[-1]}"
            exp_path = f"teachers/{teacher_id}/{exp_filename}"
            full_exp_path = os.path.join(settings.MEDIA_ROOT, 'teachers', teacher_id, exp_filename)
            
            with open(full_exp_path, 'wb+') as destination:
                for chunk in experience_file.chunks():
                    destination.write(chunk)
            file_paths['experience_proof_file'] = exp_path
        
        # Insert teacher record with all fields
        cursor.execute("""
            INSERT INTO educators (teacher_id, name, email, mobile, password_hash, gender,
                                 qualification, experience_years, bio, boards, subject_classes,
                                 languages_known, teaching_experience_institutes,
                                 profile_picture, cv_file, degree_certificate, 
                                 achievements_file, experience_proof_file,
                                 profile_completed, document_status, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            teacher_id, name, email, mobile, password, gender,
            highest_qualification, experience_years, bio, 
            json.dumps(boards), json.dumps(subject_classes), json.dumps(languages_known),
            json.dumps(institutes),
            file_paths.get('profile_picture', ''),
            file_paths.get('cv_file', ''),
            file_paths.get('degree_certificate', ''),
            file_paths.get('achievements_file', ''),
            file_paths.get('experience_proof_file', ''),
            1, 'Pending', 0
        ))
        
        conn.commit()
        conn.close()
        
        return JsonResponse({
            "message": "Teacher registered successfully",
            "data": {
                "role": "teacher",
                "teacher_id": teacher_id,
                "teacherId": teacher_id,
                "name": name,
                "email": email,
                "profile_completed": True,
                "is_active": False,
                "documents_uploaded": len(file_paths),
                "document_paths": file_paths
            }
        }, status=201)
        
    except Exception as e:
        return JsonResponse({"error": f"Registration failed: {str(e)}"}, status=500)