from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
import json
from .models import Student, Educator
from .badge_models import SkillEndorsement

@csrf_exempt
@require_http_methods(["POST"])
def create_endorsement(request):
    try:
        data = json.loads(request.body)
        print(f"Received endorsement data: {data}")  # Debug log
        
        # Validate required fields
        required_fields = ['student_id', 'endorser_id', 'endorser_type', 'skill_name', 'skill_category']
        for field in required_fields:
            if field not in data or not data[field]:
                return JsonResponse({'status': 'error', 'message': f'Missing required field: {field}'}, status=400)
        
        # Get student object
        try:
            student = Student.objects.get(id=data['student_id'])
        except Student.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': f'Student with id {data["student_id"]} not found'}, status=400)
        
        # Use raw SQL to insert endorsement
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO skill_endorsements 
                (student_id, endorser_id, endorser_type, skill_name, skill_category, level, 
                 evidence_type, evidence_id, evidence_score, message, is_ai_suggested, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """, [
                data['student_id'],
                data['endorser_id'], 
                data['endorser_type'],
                data['skill_name'],
                data['skill_category'],
                data.get('level', 'beginner'),
                data.get('evidence_type'),
                data.get('evidence_id'),
                data.get('evidence_score'),
                data.get('message', ''),
                data.get('is_ai_suggested', False)
            ])
            endorsement_id = cursor.lastrowid
        
        # Notification creation removed due to table issues
        
        return JsonResponse({
            'status': 'success',
            'message': 'Endorsement created successfully',
            'endorsement_id': endorsement_id
        })
        
    except Exception as e:
        print(f"Error creating endorsement: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@require_http_methods(["GET"])
def get_student_endorsements(request):
    try:
        student_id = request.GET.get('student_id')
        endorsements = SkillEndorsement.objects.filter(student_id=student_id).order_by('-created_at')
        
        data = []
        for endorsement in endorsements:
            data.append({
                'id': endorsement.id,
                'skill_name': endorsement.skill_name,
                'skill_category': endorsement.skill_category,
                'level': endorsement.level,
                'endorser_name': endorsement.endorser_name,
                'endorser_type': endorsement.endorser_type,
                'message': endorsement.message,
                'evidence_type': endorsement.evidence_type,
                'evidence_score': endorsement.evidence_score,
                'created_at': endorsement.created_at.isoformat(),
                'is_ai_suggested': endorsement.is_ai_suggested
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'endorsements': data,
                'total_count': len(data)
            }
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@require_http_methods(["GET"])
def get_teacher_endorsements(request):
    try:
        teacher_id = request.GET.get('teacher_id')
        endorsements = SkillEndorsement.objects.filter(
            endorser_id=teacher_id, 
            endorser_type='teacher'
        ).order_by('-created_at')
        
        data = []
        for endorsement in endorsements:
            data.append({
                'id': endorsement.id,
                'student_name': endorsement.student.name,
                'student_id': endorsement.student.id,
                'skill_name': endorsement.skill_name,
                'skill_category': endorsement.skill_category,
                'level': endorsement.level,
                'message': endorsement.message,
                'evidence_type': endorsement.evidence_type,
                'evidence_score': endorsement.evidence_score,
                'created_at': endorsement.created_at.isoformat()
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'endorsements': data,
                'total_count': len(data)
            }
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@require_http_methods(["GET"])
def get_available_skills(request):
    try:
        skills = {
            'Programming': ['Python', 'Java', 'JavaScript', 'C++', 'HTML/CSS'],
            'Mathematics': ['Algebra', 'Calculus', 'Statistics', 'Geometry'],
            'Science': ['Physics', 'Chemistry', 'Biology'],
            'Soft Skills': ['Teamwork', 'Leadership', 'Communication', 'Problem Solving'],
            'Languages': ['English', 'Hindi', 'Spanish', 'French']
        }
        return JsonResponse({
            'status': 'success',
            'data': {'skills': skills}
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@require_http_methods(["GET"])
def get_endorsement_stats(request):
    try:
        student_id = request.GET.get('student_id')
        
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    skill_category,
                    COUNT(*) as count,
                    AVG(CASE WHEN evidence_score IS NOT NULL THEN evidence_score END) as avg_score
                FROM skill_endorsements 
                WHERE student_id = %s 
                GROUP BY skill_category
            """, [student_id])
            
            stats = []
            for row in cursor.fetchall():
                stats.append({
                    'category': row[0],
                    'count': row[1],
                    'avg_score': float(row[2]) if row[2] else None
                })
        
        return JsonResponse({
            'status': 'success',
            'data': {'stats': stats}
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)