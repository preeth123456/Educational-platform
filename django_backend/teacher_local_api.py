from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import pymysql
import os
from django.conf import settings

@csrf_exempt
@require_http_methods(["GET"])
def get_teacher_documents_local(request, teacher_id):
    """Get teacher documents from local media folder"""
    try:
        conn = pymysql.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', '3306')),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'eduyata_db')
        )
        
        cursor = conn.cursor()
        
        # Get teacher info
        cursor.execute("""
            SELECT teacher_id, name, email, cv_file, degree_certificate, 
                   experience_proof_file, document_status, created_at
            FROM educators WHERE teacher_id = %s
        """, (teacher_id,))
        
        teacher_data = cursor.fetchone()
        if not teacher_data:
            return JsonResponse({"error": "Teacher not found"}, status=404)
        
        conn.close()
        
        # Build document URLs
        base_url = "http://localhost:8001/media/"
        
        documents = {
            'cv_file': {
                'path': teacher_data[3],
                'url': base_url + teacher_data[3] if teacher_data[3] else None,
                'exists': os.path.exists(os.path.join(settings.MEDIA_ROOT, teacher_data[3])) if teacher_data[3] else False
            },
            'degree_certificate': {
                'path': teacher_data[4],
                'url': base_url + teacher_data[4] if teacher_data[4] else None,
                'exists': os.path.exists(os.path.join(settings.MEDIA_ROOT, teacher_data[4])) if teacher_data[4] else False
            },
            'experience_proof_file': {
                'path': teacher_data[5],
                'url': base_url + teacher_data[5] if teacher_data[5] else None,
                'exists': os.path.exists(os.path.join(settings.MEDIA_ROOT, teacher_data[5])) if teacher_data[5] else False
            }
        }
        
        return JsonResponse({
            "teacher_info": {
                "teacher_id": teacher_data[0],
                "name": teacher_data[1],
                "email": teacher_data[2],
                "document_status": teacher_data[6],
                "created_at": teacher_data[7].isoformat() if teacher_data[7] else ""
            },
            "documents": documents
        })
        
    except Exception as e:
        return JsonResponse({"error": f"Failed to fetch documents: {str(e)}"}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_all_teachers_local(request):
    """Get all teachers for verification from local storage"""
    try:
        conn = pymysql.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', '3306')),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'eduyata_db')
        )
        
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT teacher_id, name, email, mobile, document_status, created_at,
                   cv_file, degree_certificate, experience_proof_file
            FROM educators 
            ORDER BY created_at DESC
        """)
        
        teachers = []
        for row in cursor.fetchall():
            # Count existing documents
            docs_count = 0
            if row[6] and os.path.exists(os.path.join(settings.MEDIA_ROOT, row[6])):
                docs_count += 1
            if row[7] and os.path.exists(os.path.join(settings.MEDIA_ROOT, row[7])):
                docs_count += 1
            if row[8] and os.path.exists(os.path.join(settings.MEDIA_ROOT, row[8])):
                docs_count += 1
            
            teachers.append({
                "teacher_id": row[0],
                "name": row[1],
                "email": row[2],
                "mobile": row[3],
                "document_status": row[4],
                "created_at": row[5].isoformat() if row[5] else "",
                "documents_count": docs_count,
                "has_documents": docs_count > 0
            })
        
        conn.close()
        
        return JsonResponse({
            "teachers": teachers,
            "total_count": len(teachers)
        })
        
    except Exception as e:
        return JsonResponse({"error": f"Failed to fetch teachers: {str(e)}"}, status=500)