from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from .models import Student

@require_http_methods(["GET"])
def get_all_students(request):
    try:
        students = Student.objects.all().order_by('name')
        
        data = []
        for student in students:
            data.append({
                'id': student.id,
                'name': student.name,
                'class': student.class_level,
                'board': student.board,
                'mobile': student.mobile_self,
                'profile_picture': student.profile_picture,
                'created_at': student.created_at.isoformat() if student.created_at else None
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'students': data,
                'total_count': len(data)
            }
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def dashboard_stats(request):
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return JsonResponse({'status': 'error', 'message': 'student_id is required'}, status=400)
        
        with connection.cursor() as cursor:
            # Get courses enrolled count from student_progress table
            cursor.execute("""
                SELECT COUNT(*) FROM student_progress 
                WHERE student_id = %s
            """, [student_id])
            courses_enrolled = cursor.fetchone()[0]
            
            # Get video watch time (in seconds, convert to hours and minutes)
            cursor.execute("""
                SELECT COALESCE(SUM(current_time), 0) FROM video_progress 
                WHERE student_id = %s
            """, [student_id])
            total_seconds = cursor.fetchone()[0] or 0
            watch_hours = int(total_seconds // 3600)
            watch_minutes = int((total_seconds % 3600) // 60)
            
            # Calculate video cost (₹5 per hour)
            video_cost = (total_seconds / 3600) * 5
            
            # Get assignments submitted count (using quiz_results as proxy for now)
            cursor.execute("""
                SELECT COUNT(DISTINCT course_id, topic) FROM quiz_results 
                WHERE student_id = %s AND quiz_type = 'practice_quiz'
            """, [student_id])
            assignments_submitted = cursor.fetchone()[0]
            
            # Get quizzes taken count
            cursor.execute("""
                SELECT COUNT(*) FROM quiz_results 
                WHERE student_id = %s AND quiz_type IN ('topic_quiz', 'chapter_quiz', 'final_quiz')
            """, [student_id])
            quizzes_taken = cursor.fetchone()[0]
            
            # Calculate estimated cost
            # ₹99 per course + ₹5 per hour video + ₹10 per assignment + ₹5 per quiz
            course_cost = courses_enrolled * 99
            assignment_cost = assignments_submitted * 10
            quiz_cost = quizzes_taken * 5
            estimated_cost = course_cost + video_cost + assignment_cost + quiz_cost
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'courses_enrolled': courses_enrolled,
                'video_watch_time': f"{watch_hours}h {watch_minutes}m",
                'assignments_submitted': assignments_submitted,
                'quizzes_taken': quizzes_taken,
                'estimated_cost': f"₹{estimated_cost:.2f}",
                'cost_breakdown': {
                    'course_cost': f"₹{course_cost:.2f}",
                    'video_cost': f"₹{video_cost:.2f}",
                    'assignment_cost': f"₹{assignment_cost:.2f}",
                    'quiz_cost': f"₹{quiz_cost:.2f}"
                }
            }
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)