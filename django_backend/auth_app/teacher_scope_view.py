from django.http import JsonResponse
import json
from .models import Teacher

def get_teacher_scope(request, teacher_id):
    try:
        teacher = Teacher.objects.get(id=teacher_id)
        
        # Parse profile data from profile_picture field (JSON)
        profile_data = {}
        if teacher.profile_picture:
            try:
                profile_data = json.loads(teacher.profile_picture)
            except:
                profile_data = {}
        
        # Extract teaching scope
        boards = profile_data.get('boards', [])
        subjects = teacher.subject.split(', ') if teacher.subject else []
        classes_taught = profile_data.get('classes_taught', [])
        
        return JsonResponse({
            "teacher_scope": {
                "boards": boards,
                "subjects": subjects,
                "classes_taught": classes_taught,
                "qualification": teacher.qualification or '',
                "experience_years": teacher.experience_years
            }
        })
    except Teacher.DoesNotExist:
        return JsonResponse({"error": "Teacher not found"}, status=404)