from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json
from auth_app.models import Educator

@csrf_exempt
def get_teacher_classes(request, teacher_id):
    """Get all classes, subjects, chapters, lessons and topics for a teacher"""
    try:
        teacher = Educator.objects.get(id=teacher_id)
        
        # Get teacher's profile data
        profile_data = json.loads(teacher.profile_picture) if teacher.profile_picture else {}
        boards = profile_data.get('boards', ['CBSE'])
        classes_taught = profile_data.get('classes_taught', ['10', '11', '12'])
        subjects = teacher.subject.split(', ') if teacher.subject else ['Mathematics', 'Science']
        
        # Build curriculum structure with topics
        classes_data = {}
        
        for class_name in classes_taught:
            classes_data[class_name] = {
                'name': class_name,
                'subjects': {}
            }
            
            for subject in subjects:
                classes_data[class_name]['subjects'][subject] = {
                    'name': subject,
                    'chapters': get_chapters_with_lessons_and_topics(teacher_id, class_name, subject)
                }
        
        return JsonResponse({
            'classes': classes_data,
            'teacher_info': {
                'name': teacher.name,
                'subjects': subjects,
                'classes': classes_taught,
                'boards': boards
            }
        })
        
    except Educator.DoesNotExist:
        return JsonResponse({'error': 'Teacher not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def get_chapters_with_lessons_and_topics(teacher_id, class_name, subject):
    """Get chapters with lessons and topics for a specific class and subject"""
    
    # Sample curriculum data - in production, this would come from database
    curriculum = {
        'Mathematics': {
            'Real Numbers': {
                'Introduction to Real Numbers': [],
                'Euclid\'s Division Lemma': [],
                'Fundamental Theorem of Arithmetic': [],
                'Irrational Numbers': []
            },
            'Polynomials': {
                'Introduction to Polynomials': [],
                'Geometrical Meaning of Zeroes': [],
                'Relationship between Zeroes and Coefficients': [],
                'Division Algorithm': []
            },
            'Linear Equations': {
                'Pair of Linear Equations': [],
                'Graphical Method': [],
                'Algebraic Methods': [],
                'Applications': []
            }
        },
        'Science': {
            'Light': {
                'Reflection of Light': [],
                'Spherical Mirrors': [],
                'Refraction of Light': [],
                'Lenses': []
            },
            'Electricity': {
                'Electric Current and Circuit': [],
                'Potential and Potential Difference': [],
                'Ohm\'s Law': [],
                'Resistance': []
            },
            'Life Processes': {
                'Nutrition': [],
                'Respiration': [],
                'Transportation': [],
                'Excretion': []
            }
        },
        'Physics': {
            'Motion': {
                'Introduction to Motion': [],
                'Uniform Motion': [],
                'Non-uniform Motion': [],
                'Acceleration': []
            },
            'Force and Laws of Motion': {
                'Balanced and Unbalanced Forces': [],
                'First Law of Motion': [],
                'Second Law of Motion': [],
                'Third Law of Motion': []
            }
        },
        'Chemistry': {
            'Atoms and Molecules': {
                'Laws of Chemical Combination': [],
                'What is an Atom?': [],
                'What is a Molecule?': [],
                'Writing Chemical Formulae': []
            },
            'Structure of Atom': {
                'Charged Particles in Matter': [],
                'Structure of an Atom': [],
                'How are Electrons Distributed?': []
            }
        }
    }
    
    chapters_data = {}
    subject_chapters = curriculum.get(subject, {})
    
    for chapter_name, lessons in subject_chapters.items():
        chapters_data[chapter_name] = {
            'name': chapter_name,
            'lessons': {}
        }
        
        for lesson_name, _ in lessons.items():
            # Get topics for this lesson from database
            topics = get_topics_for_lesson(teacher_id, class_name, subject, chapter_name, lesson_name)
            
            chapters_data[chapter_name]['lessons'][lesson_name] = {
                'name': lesson_name,
                'topics': topics
            }
    
    return chapters_data

def get_topics_for_lesson(teacher_id, class_name, subject, chapter, lesson):
    """Get topics created by teacher for a specific lesson"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, name, description, video_url, created_at
                FROM teacher_topics 
                WHERE teacher_id = %s AND class_name = %s AND subject = %s 
                AND chapter = %s AND lesson = %s
                ORDER BY created_at DESC
            """, [teacher_id, class_name, subject, chapter, lesson])
            
            topics = []
            for row in cursor.fetchall():
                topics.append({
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'video_url': row[3],
                    'created_at': row[4].isoformat() if row[4] else None
                })
            
            return topics
    except Exception as e:
        print(f"Error fetching topics: {e}")
        return []

@csrf_exempt
def create_topic(request):
    """Create a new topic under a lesson"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        required_fields = ['name', 'teacher_id', 'class_name', 'subject', 'chapter', 'lesson']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'{field} is required'}, status=400)
        
        # Create topics table if it doesn't exist
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS teacher_topics (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    teacher_id INT NOT NULL,
                    class_name VARCHAR(10) NOT NULL,
                    subject VARCHAR(100) NOT NULL,
                    chapter VARCHAR(255) NOT NULL,
                    lesson VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    video_url VARCHAR(500),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            """)
            
            # Insert new topic
            cursor.execute("""
                INSERT INTO teacher_topics 
                (teacher_id, class_name, subject, chapter, lesson, name, description, video_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, [
                data['teacher_id'],
                data['class_name'],
                data['subject'],
                data['chapter'],
                data['lesson'],
                data['name'],
                data.get('description', ''),
                data.get('video_url', '')
            ])
            
            topic_id = cursor.lastrowid
            
            # Get the created topic
            cursor.execute("""
                SELECT id, name, description, video_url, created_at
                FROM teacher_topics WHERE id = %s
            """, [topic_id])
            
            row = cursor.fetchone()
            topic = {
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'video_url': row[3],
                'created_at': row[4].isoformat() if row[4] else None
            }
        
        return JsonResponse({
            'message': 'Topic created successfully',
            'topic': topic
        }, status=201)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def update_topic(request, topic_id):
    """Update an existing topic"""
    if request.method != 'PUT':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE teacher_topics 
                SET name = %s, description = %s, video_url = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, [
                data.get('name'),
                data.get('description', ''),
                data.get('video_url', ''),
                topic_id
            ])
            
            if cursor.rowcount == 0:
                return JsonResponse({'error': 'Topic not found'}, status=404)
        
        return JsonResponse({'message': 'Topic updated successfully'})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def delete_topic(request, topic_id):
    """Delete a topic"""
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM teacher_topics WHERE id = %s", [topic_id])
            
            if cursor.rowcount == 0:
                return JsonResponse({'error': 'Topic not found'}, status=404)
        
        return JsonResponse({'message': 'Topic deleted successfully'})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)