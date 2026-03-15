from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password, check_password
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EducatorSerializer
import json
import traceback
from .models import Student, Educator
from django.db import transaction, IntegrityError
from django.db.models import Q
import pymysql
import random

# =======================
# STUDENT VIEWS
# =======================
@csrf_exempt
def student_register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            name = data.get("name")
            mobile_self = data.get("mobile_self")
            class_level = data.get("class_level")
            board = data.get("board")
            password = data.get("password")

            # Validate required fields
            if not all([name, mobile_self, class_level, board, password]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            # Check if phone number already exists
            if Student.objects.filter(mobile_self=mobile_self).exists():
                return JsonResponse({"error": "Phone number already exists"}, status=400)

            # Generate unique student ID
            student_id = "S" + get_random_string(length=8, allowed_chars='0123456789')
            while Student.objects.filter(student_id=student_id).exists():
                student_id = "S" + get_random_string(length=8, allowed_chars='0123456789')

            hashed_password = make_password(password)
            student = Student.objects.create(
                student_id=student_id,
                name=name,
                mobile_self=mobile_self,
                class_level=class_level,
                board=board,
                password_hash=hashed_password
            )
            
            return JsonResponse({
                "message": "Student registered successfully", 
                "student_id": student.student_id,
                "data": {
                    "role": "student",
                    "student_id": student.student_id,
                    "id": student.id,
                    "name": student.name,
                    "phone": student.mobile_self,
                    "class": student.class_level,
                    "board": student.board,
                    "profile_completed": student.profile_completed
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=405)


@csrf_exempt
def student_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            student_id = data.get("studentId")
            password = data.get("password")

            if not student_id or not password:
                return JsonResponse({"error": "Student ID and password are required"}, status=400)

            student = Student.objects.filter(student_id=student_id).first()
            if student:
                # Check if password matches (handle both Django and PHP formats)
                password_valid = False
                
                if student.password_hash.startswith('pbkdf2_sha256'):
                    # Django format
                    password_valid = check_password(password, student.password_hash)
                elif student.password_hash.startswith('$2y$'):
                    # PHP bcrypt format - verify with bcrypt
                    import bcrypt
                    password_valid = bcrypt.checkpw(password.encode('utf-8'), student.password_hash.encode('utf-8'))
                
                if password_valid:
                    return JsonResponse({
                        "message": "Login successful", 
                        "data": {
                            "role": "student",
                            "student_id": student.student_id,
                            "id": student.id,
                            "name": student.name,
                            "phone": student.mobile_self,
                            "class": student.class_level,
                            "board": student.board,
                            "gender": student.gender,
                            "profile_picture": student.profile_picture,
                            "profile_completed": student.profile_completed
                        }
                    }, status=200)
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=405)


def get_student(request):
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return JsonResponse({"error": "Student ID is required"}, status=400)
            
        # Try to find by student_id field first, then by id
        student = None
        if student_id.startswith('STU'):
            student = Student.objects.filter(student_id=student_id).first()
        else:
            student = Student.objects.filter(id=student_id).first()
            
        if not student:
            return JsonResponse({"error": "Student not found"}, status=404)
            
        return JsonResponse({
            "status": "success",
            "data": {
                "id": student.id,
                "student_id": student.student_id,
                "name": student.name,
                "mobile_self": student.mobile_self,
                "class": student.class_level,
                "board": student.board,
                "gender": student.gender or '',
                "date_of_birth": str(student.date_of_birth) if student.date_of_birth else '',
                "address": student.address or '',
                "parent_name": student.parent_name or '',
                "parent_phone": student.parent_phone or '',
                "interests": student.interests or '',
                "profile_picture": student.profile_picture or '',
                "profile_completed": student.profile_completed
            }
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

 
@csrf_exempt
def update_student(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            student_id = data.get("student_id")
            if not student_id:
                return JsonResponse({"error": "Student ID is required"}, status=400)
 
            student = Student.objects.get(student_id=student_id)
 
            # Update fields that exist in the model
            student.name = data.get("name", student.name)
            student.gender = data.get("gender", student.gender)
 
            # Handle date_of_birth - parse or set to None
            date_of_birth_str = data.get("date_of_birth", '')
            if date_of_birth_str:
                try:
                    from datetime import datetime
                    student.date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d').date()
                except ValueError:
                    return JsonResponse({"error": "Invalid date format for date_of_birth"}, status=400)
            else:
                student.date_of_birth = None
 
            student.address = data.get("address", student.address)
            student.parent_name = data.get("parent_name", student.parent_name)
            student.parent_phone = data.get("parent_phone", student.parent_phone)
            student.interests = data.get("interests", student.interests)
            student.mobile_self = data.get("mobile_self", student.mobile_self)
            student.profile_picture = data.get("profile_picture", student.profile_picture)
 
            # Update class and board if provided
            if "class" in data:
                student.class_level = data["class"]
            if "board" in data:
                student.board = data["board"]
 
            student.save()

            # Check if profile is now complete
            # student.check_profile_completion()
 
            return JsonResponse({
                "status": "success",
                "message": "Student updated successfully",
                "data": {
                    "id": student.id,
                    "student_id": student.student_id,
                    "name": student.name,
                    "gender": student.gender,
                    "mobile_self": student.mobile_self,
                    "class": student.class_level,
                    "board": student.board,
                    "profile_picture": student.profile_picture,
                    "profile_completed": student.profile_completed
                }
            })
        except Student.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=405)
 

@csrf_exempt
def complete_profile(request, student_id):
    if request.method == "POST":
        try:
            student = Student.objects.get(id=student_id)
            student.profile_completed = True
            student.save()
            return JsonResponse({"message": "Profile completed"})
        except Student.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)
    return JsonResponse({"error": "Invalid request"}, status=405)


# =======================
# TEACHER VIEWS
# =======================
@csrf_exempt
@api_view(['POST'])
def teacher_register(request):
    serializer = EducatorSerializer(data=request.data)

    if serializer.is_valid():
        educator = serializer.save()
        return Response({
            "message": "Teacher registered successfully. Your account is pending admin approval.",
            "status": "pending_approval",
            "data": {
                "teacher_id": educator.teacher_id,
                "name": educator.name,
                "email": educator.email,
                "profile_completed": educator.profile_completed,
                "is_active": educator.is_active,
                "document_status": educator.document_status
            }
        }, status=201)

    return Response(serializer.errors, status=400)


def teacher_register_simple(request):
    if request.method == "POST":
        try:
            # Get data from FormData
            name = request.POST.get('name', '')
            email = request.POST.get('email', '')
            mobile = request.POST.get('mobile', '')
            password = request.POST.get('password', '')
            
            if not name or not email or not mobile or not password:
                return JsonResponse({"error": "Missing required fields"}, status=400)
            
            # Insert into database
            import pymysql
            conn = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            
            cursor = conn.cursor()
            
            # Check if email exists
            cursor.execute("SELECT COUNT(*) FROM educators WHERE email = %s", (email,))
            if cursor.fetchone()[0] > 0:
                conn.close()
                return JsonResponse({"error": "Email already exists"}, status=400)
            
            # Insert new teacher - requires admin approval
            teacher_id = f"TCH{random.randint(100000, 999999)}"
            cursor.execute(
                "INSERT INTO educators (teacher_id, name, email, mobile, password_hash, profile_completed, is_active, document_status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (teacher_id, name, email, mobile, password, 1, 0, 'Pending Verification')
            )
            conn.commit()
            conn.close()
            
            return JsonResponse({
                "message": "Teacher registered successfully. Your account is pending admin approval.",
                "status": "pending_approval",
                "data": {
                    "role": "teacher",
                    "teacher_id": teacher_id,
                    "name": name,
                    "email": email,
                    "profile_completed": True,
                    "is_active": False,
                    "document_status": "Pending Verification"
                }
            }, status=201)
            
        except Exception as e:
            print(f"Registration error: {e}")
            return JsonResponse({"error": "Registration failed"}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def simple_teacher_register(request):
    if request.method == "POST":
        try:
            # Get data from request
            if hasattr(request, 'content_type') and request.content_type and 'multipart' in request.content_type:
                data = dict(request.POST)
                for key, value in data.items():
                    if isinstance(value, list) and len(value) == 1:
                        data[key] = value[0]
            else:
                data = json.loads(request.body.decode("utf-8"))
            
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            mobile = data.get('mobile', '').strip()
            password = data.get('password', '').strip()
            
            if not all([name, email, mobile, password]):
                return JsonResponse({"error": "All fields required"}, status=400)
            
            # Direct MySQL connection
            import pymysql
            connection = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            
            with connection.cursor() as cursor:
                # Check if email exists
                cursor.execute("SELECT COUNT(*) FROM educators WHERE email = %s", (email,))
                if cursor.fetchone()[0] > 0:
                    return JsonResponse({"error": "Email already exists"}, status=400)
                
                # Insert new teacher - requires admin approval
                import random
                teacher_id = f"TCH{random.randint(100000, 999999)}"
                
                cursor.execute("""
                    INSERT INTO educators (teacher_id, name, email, mobile, password_hash, profile_completed, is_active, document_status) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (teacher_id, name, email, mobile, password, 1, 0, 'Pending Verification'))
                
                connection.commit()
            
            connection.close()
            
            return JsonResponse({
                "message": "Teacher registered successfully",
                "data": {
                    "role": "teacher",
                    "teacher_id": teacher_id,
                    "name": name,
                    "email": email,
                    "profile_completed": True
                }
            }, status=201)
            
        except Exception as e:
            return JsonResponse({"error": f"Registration failed: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)
@csrf_exempt
def teacher_register(request):
    if request.method == "POST":
        try:
            import os
            from django.conf import settings
            
            # Get data from FormData
            name = request.POST.get('name', '')
            email = request.POST.get('email', '')
            mobile = request.POST.get('mobile', '')
            password = request.POST.get('password', '')
            
            if not name or not email or not mobile or not password:
                return JsonResponse({"error": "Missing required fields"}, status=400)
            
            # Generate teacher ID first
            conn = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            
            cursor = conn.cursor()
            
            # Check if email exists
            cursor.execute("SELECT COUNT(*) FROM educators WHERE email = %s", (email,))
            if cursor.fetchone()[0] > 0:
                conn.close()
                return JsonResponse({"error": "Email already exists"}, status=400)
            
            # Generate teacher ID
            cursor.execute("SELECT MAX(CAST(SUBSTRING(teacher_id, 4) AS UNSIGNED)) FROM educators WHERE teacher_id LIKE 'TCH%'")
            result = cursor.fetchone()[0]
            next_number = (result + 1) if result else 202500013
            teacher_id = f"TCH{next_number:09d}"
            
            # Create media directory for this teacher
            teacher_media_dir = os.path.join(settings.MEDIA_ROOT, 'teachers', teacher_id)
            os.makedirs(teacher_media_dir, exist_ok=True)
            
            # Handle file uploads
            file_paths = {}
            file_fields = ['profile_picture', 'cv_file', 'degree_certificate', 'achievements_file', 'experience_proof_file']
            
            for field in file_fields:
                if field in request.FILES:
                    uploaded_file = request.FILES[field]
                    file_extension = os.path.splitext(uploaded_file.name)[1]
                    file_name = f"{field}{file_extension}"
                    file_path = os.path.join(teacher_media_dir, file_name)
                    
                    # Save file
                    with open(file_path, 'wb+') as destination:
                        for chunk in uploaded_file.chunks():
                            destination.write(chunk)
                    
                    # Store relative path for database
                    file_paths[field] = f"teachers/{teacher_id}/{file_name}"
            
            # Get other form data
            gender = request.POST.get('gender', '')
            highest_qualification = request.POST.get('highest_qualification', '')
            experience_years = request.POST.get('experience_years', 0)
            bio = request.POST.get('bio', '')
            boards = request.POST.get('boards', '[]')
            subject_classes = request.POST.get('subject_classes', '{}')
            languages_known = request.POST.get('languages_known', '[]')
            institutes = request.POST.get('institutes', '[]')
            
            # Insert into database with file paths - requires admin approval
            cursor.execute("""
                INSERT INTO educators (
                    teacher_id, name, email, mobile, password_hash, profile_completed, is_active,
                    gender, highest_qualification, experience_years, bio, boards, 
                    subject_classes, languages_known, teaching_experience_institutes,
                    document_status, created_at, profile_picture, cv_file, 
                    degree_certificate, achievements_file, experience_proof_file
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s, %s, %s)
            """, (
                teacher_id, name, email, mobile, password, 1, 0,
                gender, highest_qualification, experience_years, bio, boards,
                subject_classes, languages_known, institutes, 'Pending Verification',
                file_paths.get('profile_picture'), file_paths.get('cv_file'),
                file_paths.get('degree_certificate'), file_paths.get('achievements_file'),
                file_paths.get('experience_proof_file')
            ))
            
            conn.commit()
            conn.close()
            
            return JsonResponse({
                "message": "Teacher registered successfully. Your account is pending admin approval.",
                "status": "pending_approval",
                "data": {
                    "role": "teacher",
                    "teacher_id": teacher_id,
                    "teacherId": teacher_id,
                    "name": name,
                    "email": email,
                    "profile_completed": True,
                    "is_active": False,
                    "document_status": "Pending Verification"
                }
            }, status=201)
            
        except Exception as e:
            return JsonResponse({"error": f"Registration failed: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def teacher_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            email = data.get("email")
            password = data.get("password")
            
            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            # Direct MySQL connection
            conn = pymysql.connect(
                host='localhost',
                port=3306,
                user='root',
                password='',
                database='eduyata_db'
            )
            
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, teacher_id, name, email, password_hash, profile_completed, is_active, document_status FROM educators WHERE email = %s",
                (email,)
            )
            row = cursor.fetchone()
            conn.close()
                
            if row:
                educator_id, teacher_id, name, educator_email, password_hash, profile_completed, is_active, document_status = row
                
                # Check password - handle both formats
                password_valid = False
                if password_hash:
                    if password_hash.startswith('pbkdf2_sha256'):
                        password_valid = check_password(password, password_hash)
                    elif password_hash.startswith('$2y$'):
                        try:
                            import bcrypt
                            password_valid = bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
                        except:
                            password_valid = False
                    else:
                        # Plain text comparison
                        password_valid = (password == password_hash)
                
                if password_valid:
                    # Check if teacher is approved by admin
                    if not is_active:
                        return JsonResponse({
                            "error": "Your account is pending admin approval. Please wait for verification.",
                            "status": "pending_approval",
                            "document_status": document_status
                        }, status=403)
                    
                    return JsonResponse({
                        "message": "Login successful", 
                        "data": {
                            "role": "teacher",
                            "teacherId": teacher_id or f"TCH{educator_id}",
                            "id": educator_id,
                            "name": name,
                            "email": educator_email,
                            "profile_completed": bool(profile_completed),
                            "is_active": bool(is_active),
                            "document_status": document_status
                        }
                    }, status=200)
                    
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        except Exception as e:
            return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)
    return JsonResponse({"error": "Invalid request"}, status=405)


# =======================
# CURRICULUM DATA VIEWS
# =======================
@csrf_exempt
def get_teacher_scope(request, teacher_id):
    """Get teacher's registered scope (boards, classes, subjects)"""
    try:
        educator = Educator.objects.get(teacher_id=teacher_id)
        
        return JsonResponse({
            "teacher_scope": {
                "boards": educator.boards,
                "classes_taught": educator.get_all_classes(),
                "subjects": educator.get_subjects(),
                "subject_classes": educator.subject_classes
            }
        })
    except Educator.DoesNotExist:
        return JsonResponse({"error": "Teacher not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e), "traceback": traceback.format_exc()}, status=400)


def get_chapters(request, board, class_level, subject):
    """Get chapters for a specific board, class, and subject"""
    try:
        # Curriculum data mapping
        curriculum_data = {
            'CBSE': {
                '11': {
                    'Chemistry': [
                        'Some Basic Concepts of Chemistry',
                        'Structure of Atom',
                        'Classification of Elements and Periodicity in Properties',
                        'Chemical Bonding and Molecular Structure',
                        'States of Matter',
                        'Thermodynamics',
                        'Equilibrium',
                        'Redox Reactions',
                        'Hydrogen',
                        'The s-Block Elements',
                        'The p-Block Elements',
                        'Organic Chemistry - Some Basic Principles and Techniques',
                        'Hydrocarbons',
                        'Environmental Chemistry'
                    ],
                    'Physics': [
                        'Physical World',
                        'Units and Measurements',
                        'Motion in a Straight Line',
                        'Motion in a Plane',
                        'Laws of Motion',
                        'Work, Energy and Power',
                        'System of Particles and Rotational Motion',
                        'Gravitation',
                        'Mechanical Properties of Solids',
                        'Mechanical Properties of Fluids',
                        'Thermal Properties of Matter',
                        'Thermodynamics',
                        'Kinetic Theory',
                        'Oscillations',
                        'Waves'
                    ],
                    'Mathematics': [
                        'Sets',
                        'Relations and Functions',
                        'Trigonometric Functions',
                        'Principle of Mathematical Induction',
                        'Complex Numbers and Quadratic Equations',
                        'Linear Inequalities',
                        'Permutations and Combinations',
                        'Binomial Theorem',
                        'Sequences and Series',
                        'Straight Lines',
                        'Conic Sections',
                        'Introduction to Three Dimensional Geometry',
                        'Limits and Derivatives',
                        'Mathematical Reasoning',
                        'Statistics',
                        'Probability'
                    ]
                },
                '10': {
                    'Mathematics': [
                        'Real Numbers',
                        'Polynomials',
                        'Pair of Linear Equations in Two Variables',
                        'Quadratic Equations',
                        'Arithmetic Progressions',
                        'Triangles',
                        'Coordinate Geometry',
                        'Introduction to Trigonometry',
                        'Some Applications of Trigonometry',
                        'Circles',
                        'Areas Related to Circles',
                        'Surface Areas and Volumes',
                        'Statistics',
                        'Probability'
                    ],
                    'Science': [
                        'Light - Reflection and Refraction',
                        'Human Eye and Colourful World',
                        'Electricity',
                        'Magnetic Effects of Electric Current',
                        'Sources of Energy',
                        'Life Processes',
                        'Control and Coordination',
                        'How do Organisms Reproduce?',
                        'Heredity and Evolution',
                        'Our Environment',
                        'Management of Natural Resources',
                        'Acids, Bases and Salts',
                        'Metals and Non-metals',
                        'Carbon and its Compounds',
                        'Periodic Classification of Elements'
                    ]
                }
            }
        }
        
        chapters = curriculum_data.get(board, {}).get(class_level, {}).get(subject, [])
        
        return JsonResponse({
            "chapters": chapters,
            "board": board,
            "class_level": class_level,
            "subject": subject
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_lessons(request, board, class_level, subject, chapter):
    """Get lessons for a specific chapter"""
    try:
        # Sample lessons data - in real app, this would come from database
        lessons_data = {
            'Some Basic Concepts of Chemistry': [
                'Importance of Chemistry',
                'Nature of Matter',
                'Properties of Matter and their Measurement',
                'The International System of Units (SI)',
                'Uncertainty in Measurement',
                'Significant Figures',
                'Dimensional Analysis',
                'Laws of Chemical Combination',
                'Dalton\'s Atomic Theory',
                'Atomic and Molecular Masses',
                'Mole Concept and Molar Masses',
                'Percentage Composition',
                'Stoichiometry and Stoichiometric Calculations'
            ],
            'Structure of Atom': [
                'Discovery of Electron',
                'Atomic Models',
                'Thomson Model of Atom',
                'Rutherford\'s Nuclear Model of Atom',
                'Bohr\'s Model of Atom',
                'Quantum Mechanical Model of Atom',
                'Orbitals and Quantum Numbers',
                'Shapes of Atomic Orbitals',
                'Aufbau Principle',
                'Pauli Exclusion Principle',
                'Hund\'s Rule',
                'Electronic Configuration of Atoms'
            ],
            'Real Numbers': [
                'Introduction to Real Numbers',
                'Euclid\'s Division Lemma',
                'The Fundamental Theorem of Arithmetic',
                'Revisiting Irrational Numbers',
                'Revisiting Rational Numbers and Their Decimal Expansions'
            ],
            'Polynomials': [
                'Introduction to Polynomials',
                'Geometrical Meaning of the Zeroes of a Polynomial',
                'Relationship between Zeroes and Coefficients of a Polynomial',
                'Division Algorithm for Polynomials'
            ]
        }
        
        lessons = lessons_data.get(chapter, [
            'Introduction',
            'Basic Concepts',
            'Advanced Topics',
            'Applications',
            'Problem Solving'
        ])
        
        return JsonResponse({
            "lessons": lessons,
            "chapter": chapter,
            "board": board,
            "class_level": class_level,
            "subject": subject
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_uploaded_files(request, teacher_id):
    """Get list of uploaded files for a teacher with metadata"""
    try:
        import os
        from django.conf import settings
        
        teacher_dir = os.path.join(settings.MEDIA_ROOT, 'uploads', 'teachers', teacher_id)
        
        if not os.path.exists(teacher_dir):
            return JsonResponse({"files": [], "message": "No files found"})
        
        files_info = []
        
        for filename in os.listdir(teacher_dir):
            if filename.endswith('_metadata.json'):
                metadata_path = os.path.join(teacher_dir, filename)
                try:
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                    
                    # Get actual file info
                    file_type = filename.replace('_metadata.json', '')
                    actual_file = None
                    for ext in ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']:
                        potential_file = os.path.join(teacher_dir, f"{file_type}{ext}")
                        if os.path.exists(potential_file):
                            actual_file = f"{file_type}{ext}"
                            break
                    
                    if actual_file:
                        files_info.append({
                            'file_name': actual_file,
                            'file_type': metadata.get('file_type'),
                            'original_filename': metadata.get('original_filename'),
                            'teacher_name': metadata.get('teacher_name'),
                            'upload_date': metadata.get('upload_date'),
                            'file_size': metadata.get('file_size'),
                            'file_path': f"uploads/teachers/{teacher_id}/{actual_file}"
                        })
                except Exception as e:
                    print(f"Error reading metadata {filename}: {e}")
        
        return JsonResponse({
            "files": files_info,
            "teacher_id": teacher_id,
            "total_files": len(files_info)
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# =======================
# ADMIN TEACHER MANAGEMENT
# =======================
def get_teachers_for_admin(request):
    """Get teachers for admin verification page"""
    try:
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, teacher_id, name, email, mobile, document_status, 
                   created_at, updated_at, boards, subject_classes, subject
            FROM educators 
            ORDER BY created_at DESC
        """)
        
        teachers = []
        for row in cursor.fetchall():
            teacher_id, teacher_code, name, email, mobile, doc_status, created_at, updated_at, boards, subject_classes, subject = row
            
            # Parse subjects from multiple sources
            subjects = []
            try:
                # First try subject_classes JSON
                if subject_classes:
                    import json
                    subject_data = json.loads(subject_classes) if isinstance(subject_classes, str) else subject_classes
                    if isinstance(subject_data, dict):
                        subjects = list(subject_data.keys())
                
                # If no subjects from subject_classes, try the subject field
                if not subjects and subject:
                    subjects = [s.strip() for s in subject.split(',')]
                    
            except Exception as e:
                print(f"Error parsing subjects for teacher {teacher_code}: {e}")
                subjects = []
            
            teachers.append({
                'id': teacher_id,
                'teacher_id': teacher_code,
                'name': name,
                'email': email,
                'mobile': mobile,
                'subjects': subjects,
                'document_status': doc_status or 'Pending',
                'created_at': str(created_at) if created_at else '',
                'date_updated': str(updated_at) if updated_at else ''
            })
        
        conn.close()
        
        return JsonResponse({
            'status': 'success',
            'teachers': teachers
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_teacher_statistics(request):
    """Get teacher statistics for admin dashboard"""
    try:
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Get total teachers
        cursor.execute("SELECT COUNT(*) FROM educators")
        total_teachers = cursor.fetchone()[0]
        
        # Get pending verification
        cursor.execute("SELECT COUNT(*) FROM educators WHERE document_status IN ('Pending', 'Pending Verification', 'pending') OR document_status IS NULL OR document_status = ''")
        pending_verification = cursor.fetchone()[0]
        
        # Get verified/approved teachers
        cursor.execute("SELECT COUNT(*) FROM educators WHERE document_status = 'Verified'")
        approved_teachers = cursor.fetchone()[0]
        
        # Get rejected teachers
        cursor.execute("SELECT COUNT(*) FROM educators WHERE document_status NOT IN ('Pending', 'Pending Verification', 'Verified', 'pending') AND document_status IS NOT NULL AND document_status != ''")
        rejected_teachers = cursor.fetchone()[0]
        
        conn.close()
        
        return JsonResponse({
            'status': 'success',
            'statistics': {
                'total_teachers': total_teachers,
                'verify_teachers': pending_verification,
                'pending_approvals': pending_verification,
                'approved_teachers': approved_teachers,
                'rejected_teachers': rejected_teachers
            }
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_all_teachers_with_details(request):
    """Get all teachers with detailed information for teacher management page"""
    try:
        status_filter = request.GET.get('status', 'all')
        
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Build query to get all teacher data
        query = """
            SELECT id, teacher_id, name, email, mobile, document_status,
                   created_at, updated_at, boards, subject_classes, subject,
                   highest_qualification, experience_years
            FROM educators 
            ORDER BY created_at DESC
        """
        cursor.execute(query)
        
        teachers = []
        for row in cursor.fetchall():
            teacher_id, teacher_code, name, email, mobile, doc_status, created_at, updated_at, boards, subject_classes, subject, qualification, experience = row
            
            # Parse subjects from multiple sources
            subjects = []
            try:
                # First try subject_classes JSON
                if subject_classes:
                    import json
                    subject_data = json.loads(subject_classes) if isinstance(subject_classes, str) else subject_classes
                    if isinstance(subject_data, dict):
                        subjects = list(subject_data.keys())
                
                # If no subjects from subject_classes, try the subject field
                if not subjects and subject:
                    subjects = [s.strip() for s in subject.split(',')]
                    
            except Exception as e:
                print(f"Error parsing subjects for teacher {teacher_code}: {e}")
                subjects = []
            
            # Determine status for display based on document_status
            if doc_status == 'Verified':
                display_status = 'Approved'
            elif doc_status in ['Pending', 'Pending Verification', 'pending']:
                display_status = 'Pending'
            elif doc_status in [None, '']:
                display_status = 'Pending'
            else:
                display_status = 'Rejected'
                
            # Debug logging
            if teacher_code == 'TCH202500013':
                print(f"DEBUG: {name} - DB Status: '{doc_status}' -> Display Status: '{display_status}'")
            
            teachers.append({
                'id': teacher_id,
                'teacher_id': teacher_code,
                'name': name,
                'email': email,
                'mobile': mobile,
                'subjects': subjects,
                'status': display_status,
                'courses': 0,  # Placeholder for courses count
                'date_joined': str(created_at) if created_at else '',
                'qualification': qualification or '',
                'experience': experience or 0
            })
        
        conn.close()
        
        return JsonResponse({
            'status': 'success',
            'teachers': teachers,
            'total': len(teachers)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@csrf_exempt
@require_http_methods(["GET"])
def get_schedules(request):
    """Get all schedules"""
    try:
        from django.db import connection
        cursor = connection.cursor()
        
        # Check if schedules table exists
        cursor.execute("SHOW TABLES LIKE 'schedules'")
        if not cursor.fetchone():
            return JsonResponse({
                'status': 'success',
                'schedules': []
            })
        
        cursor.execute("""
            SELECT id, title, description, start_time, end_time, 
                   date, type, created_at 
            FROM schedules 
            ORDER BY date DESC, start_time ASC
        """)
        
        schedules = []
        for row in cursor.fetchall():
            schedules.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'start_time': str(row[3]) if row[3] else '',
                'end_time': str(row[4]) if row[4] else '',
                'date': str(row[5]) if row[5] else '',
                'type': row[6],
                'created_at': row[7].isoformat() if row[7] else ''
            })
        
        return JsonResponse({
            'status': 'success',
            'schedules': schedules
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'success',
            'schedules': []
        })

@csrf_exempt
@require_http_methods(["GET"])
def get_schedules(request):
    """Get all schedules"""
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title, description, start_time, end_time, 
                   date, type, created_at 
            FROM schedules 
            ORDER BY date DESC, start_time ASC
        """)
        
        schedules = []
        for row in cursor.fetchall():
            schedules.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'start_time': str(row[3]) if row[3] else '',
                'end_time': str(row[4]) if row[4] else '',
                'date': str(row[5]) if row[5] else '',
                'type': row[6],
                'created_at': row[7].isoformat() if row[7] else ''
            })
        
        conn.close()
        
        return JsonResponse({
            'status': 'success',
            'schedules': schedules
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'schedules': []
        })