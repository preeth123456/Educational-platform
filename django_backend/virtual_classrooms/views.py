from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pymysql
import random
import string

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='eduyata_db'
    )

def generate_classroom_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@csrf_exempt
def create_classroom(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            classroom_id = f"VC_{data['course_id']}_{random.randint(1000, 9999)}"
            classroom_code = generate_classroom_code()
            
            cursor.execute("""
                INSERT INTO virtual_classrooms 
                (classroom_id, course_id, teacher_id, title, description, classroom_code, max_students)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                classroom_id,
                data['course_id'],
                data['teacher_id'],
                data['title'],
                data.get('description', ''),
                classroom_code,
                data.get('max_students', 50)
            ))
            
            conn.commit()
            classroom_db_id = cursor.lastrowid
            conn.close()
            
            return JsonResponse({
                'success': True,
                'classroom': {
                    'id': classroom_db_id,
                    'classroom_id': classroom_id,
                    'classroom_code': classroom_code,
                    'title': data['title']
                }
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

def teacher_classrooms(request):
    if request.method == 'GET':
        try:
            teacher_id = request.GET.get('teacher_id')
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, classroom_id, title, description, classroom_code, created_at,
                       (SELECT COUNT(*) FROM classroom_enrollments WHERE classroom_id = virtual_classrooms.id AND is_active = 1) as student_count
                FROM virtual_classrooms 
                WHERE teacher_id = %s AND is_active = 1
            """, (teacher_id,))
            
            classrooms = []
            for row in cursor.fetchall():
                classrooms.append({
                    'id': row[0],
                    'classroom_id': row[1],
                    'title': row[2],
                    'description': row[3],
                    'classroom_code': row[4],
                    'created_at': row[5].isoformat() if row[5] else None,
                    'student_count': row[6]
                })
            
            conn.close()
            
            return JsonResponse({
                'success': True,
                'classrooms': classrooms
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def join_classroom(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Check if classroom exists
            cursor.execute("SELECT id FROM virtual_classrooms WHERE classroom_code = %s", (data['classroom_code'],))
            classroom = cursor.fetchone()
            
            if not classroom:
                conn.close()
                return JsonResponse({'success': False, 'error': 'Invalid classroom code'}, status=404)
            
            # Check if already enrolled
            cursor.execute("""
                SELECT id FROM classroom_enrollments 
                WHERE classroom_id = %s AND student_id = %s
            """, (classroom[0], data['student_id']))
            
            existing = cursor.fetchone()
            if existing:
                conn.close()
                return JsonResponse({'success': True, 'joined': False})
            
            # Create enrollment
            cursor.execute("""
                INSERT INTO classroom_enrollments (classroom_id, student_id, is_active)
                VALUES (%s, %s, 1)
            """, (classroom[0], data['student_id']))
            
            conn.commit()
            conn.close()
            
            return JsonResponse({'success': True, 'joined': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def create_session(request, classroom_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO classroom_sessions 
                (classroom_id, title, description, scheduled_date, duration_minutes)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                classroom_id,
                data['title'],
                data.get('description', ''),
                data['scheduled_date'],
                data.get('duration_minutes', 60)
            ))
            
            conn.commit()
            session_id = cursor.lastrowid
            conn.close()
            
            return JsonResponse({'success': True, 'session_id': session_id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

def classroom_sessions(request, classroom_id):
    if request.method == 'GET':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, title, description, scheduled_date, duration_minutes, status
                FROM classroom_sessions 
                WHERE classroom_id = %s
                ORDER BY scheduled_date DESC
            """, (classroom_id,))
            
            sessions = []
            for row in cursor.fetchall():
                sessions.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'scheduled_date': row[3].isoformat() if row[3] else None,
                    'duration_minutes': row[4],
                    'status': row[5]
                })
            
            conn.close()
            
            return JsonResponse({
                'success': True,
                'sessions': sessions
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

def student_classrooms(request):
    if request.method == 'GET':
        try:
            student_id = request.GET.get('student_id')
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT vc.id, vc.title, vc.description, vc.classroom_code
                FROM virtual_classrooms vc
                JOIN classroom_enrollments ce ON vc.id = ce.classroom_id
                WHERE ce.student_id = %s AND ce.is_active = 1
            """, (student_id,))
            
            classrooms = []
            for row in cursor.fetchall():
                classrooms.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'classroom_code': row[3],
                    'teacher_name': 'Teacher'
                })
            
            conn.close()
            
            return JsonResponse({
                'success': True,
                'classrooms': classrooms
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def create_announcement(request, classroom_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO classroom_announcements 
                (classroom_id, teacher_id, title, message, is_urgent)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                classroom_id,
                data['teacher_id'],
                data['title'],
                data['message'],
                data.get('is_urgent', False)
            ))
            
            conn.commit()
            announcement_id = cursor.lastrowid
            conn.close()
            
            return JsonResponse({'success': True, 'announcement_id': announcement_id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

def classroom_announcements(request, classroom_id):
    if request.method == 'GET':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, title, message, is_urgent, created_at
                FROM classroom_announcements 
                WHERE classroom_id = %s
                ORDER BY created_at DESC
            """, (classroom_id,))
            
            announcements = []
            for row in cursor.fetchall():
                announcements.append({
                    'id': row[0],
                    'title': row[1],
                    'message': row[2],
                    'is_urgent': bool(row[3]),
                    'created_at': row[4].isoformat() if row[4] else None
                })
            
            conn.close()
            
            return JsonResponse({
                'success': True,
                'announcements': announcements
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def create_resource(request, classroom_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO classroom_resources 
                (classroom_id, teacher_id, title, description, resource_type, file_url)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                classroom_id,
                data['teacher_id'],
                data['title'],
                data.get('description', ''),
                data['resource_type'],
                data.get('file_url', '')
            ))
            
            conn.commit()
            resource_id = cursor.lastrowid
            conn.close()
            
            return JsonResponse({'success': True, 'resource_id': resource_id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

def classroom_resources(request, classroom_id):
    if request.method == 'GET':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, title, description, resource_type, file_url, uploaded_at
                FROM classroom_resources 
                WHERE classroom_id = %s
                ORDER BY uploaded_at DESC
            """, (classroom_id,))
            
            resources = []
            for row in cursor.fetchall():
                resources.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'resource_type': row[3],
                    'file_url': row[4],
                    'uploaded_at': row[5].isoformat() if row[5] else None
                })
            
            conn.close()
            
            return JsonResponse({
                'success': True,
                'resources': resources
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)
import uuid
from datetime import datetime

@csrf_exempt
def create_conference(request, classroom_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Generate unique meeting ID and URL
            meeting_id = f"eduyata-{uuid.uuid4().hex[:8]}"
            meeting_url = f"https://meet.jit.si/{meeting_id}"
            host_key = uuid.uuid4().hex[:12]
            
            cursor.execute("""
                INSERT INTO video_conferences 
                (classroom_id, meeting_url, meeting_id, host_key, scheduled_start, max_participants)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                classroom_id,
                meeting_url,
                meeting_id,
                host_key,
                data.get('scheduled_start'),
                data.get('max_participants', 50)
            ))
            
            conn.commit()
            conference_id = cursor.lastrowid
            conn.close()
            
            return JsonResponse({
                'success': True,
                'conference': {
                    'id': conference_id,
                    'meeting_id': meeting_id,
                    'meeting_url': meeting_url,
                    'host_key': host_key
                }
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def start_conference(request, conference_id):
    if request.method == 'POST':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                UPDATE video_conferences 
                SET status = 'live', actual_start = %s
                WHERE id = %s
            """, (datetime.now(), conference_id))
            
            conn.commit()
            conn.close()
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

def classroom_conferences(request, classroom_id):
    if request.method == 'GET':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, meeting_id, meeting_url, host_key, status, 
                       scheduled_start, actual_start, actual_end, max_participants
                FROM video_conferences 
                WHERE classroom_id = %s
                ORDER BY created_at DESC
            """, (classroom_id,))
            
            conferences = []
            for row in cursor.fetchall():
                conferences.append({
                    'id': row[0],
                    'meeting_id': row[1],
                    'meeting_url': row[2],
                    'host_key': row[3],
                    'status': row[4],
                    'scheduled_start': row[5].isoformat() if row[5] else None,
                    'actual_start': row[6].isoformat() if row[6] else None,
                    'actual_end': row[7].isoformat() if row[7] else None,
                    'max_participants': row[8]
                })
            
            conn.close()
            
            return JsonResponse({
                'success': True,
                'conferences': conferences
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def join_conference(request, conference_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Record participant joining
            cursor.execute("""
                INSERT INTO conference_participants 
                (conference_id, user_id, user_type)
                VALUES (%s, %s, %s)
            """, (
                conference_id,
                data['user_id'],
                data['user_type']
            ))
            
            # Get meeting URL
            cursor.execute("""
                SELECT meeting_url, meeting_id FROM video_conferences 
                WHERE id = %s
            """, (conference_id,))
            
            result = cursor.fetchone()
            if result:
                meeting_url, meeting_id = result
                conn.commit()
                conn.close()
                
                return JsonResponse({
                    'success': True,
                    'meeting_url': meeting_url,
                    'meeting_id': meeting_id
                })
            else:
                conn.close()
                return JsonResponse({'success': False, 'error': 'Conference not found'}, status=404)
                
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def end_conference(request, conference_id):
    if request.method == 'POST':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                UPDATE video_conferences 
                SET status = 'ended', actual_end = %s
                WHERE id = %s
            """, (datetime.now(), conference_id))
            
            # Mark all participants as inactive
            cursor.execute("""
                UPDATE conference_participants 
                SET is_active = FALSE, left_at = %s
                WHERE conference_id = %s AND is_active = TRUE
            """, (datetime.now(), conference_id))
            
            conn.commit()
            conn.close()
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)