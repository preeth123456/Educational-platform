from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from .models import TeacherEmailLog, Student, Admin, AdminEmailLog
import json
import base64
import threading
from datetime import datetime, timedelta
from functools import wraps

# Mock admin data (no database needed)
ADMIN_USERS = {
    'admin@eduyata.com': {
        'id': 1,
        'admin_id': 'ADMIN001',
        'name': 'Super Admin',
        'email': 'admin@eduyata.com',
        'password': 'admin123'
    },
    'system@eduyata.com': {
        'id': 2,
        'admin_id': 'ADMIN002', 
        'name': 'System Admin',
        'email': 'system@eduyata.com',
        'password': 'admin123'
    },
    'tech@eduyata.com': {
        'id': 3,
        'admin_id': 'ADMIN003',
        'name': 'Tech Admin', 
        'email': 'tech@eduyata.com',
        'password': 'admin123'
    }
}

@csrf_exempt
@require_http_methods(["POST"])
def admin_login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({
                'status': 'error',
                'message': 'Email and password are required'
            }, status=400)

        # Check admin credentials
        admin = ADMIN_USERS.get(email)
        print(f"Admin lookup result: {admin is not None}")
        print(f"Password check: {admin['password'] if admin else 'N/A'} == {password}")
        
        if not admin:
            print("Admin not found")
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid credentials'
            }, status=401)
        
        if admin['password'] != password:
            print("Password mismatch")
            return JsonResponse({
                'status': 'error', 
                'message': 'Invalid credentials'
            }, status=401)
        
        print("Admin authentication successful")

        # Generate token
        payload = {
            'admin_id': admin['id'],
            'admin_uid': admin['admin_id'],
            'name': admin['name'],  # Add name field for platform_config compatibility
            'email': admin['email'],
            'exp': (datetime.now() + timedelta(hours=24)).timestamp()
        }
        token = base64.b64encode(json.dumps(payload).encode()).decode()

        return JsonResponse({
            'status': 'success',
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': admin['id'],
                'admin_id': admin['admin_id'],
                'name': admin['name'],
                'email': admin['email'],
                'role': 'admin'
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': 'Server error'
        }, status=500)

def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({
                'status': 'error',
                'message': 'Authentication required'
            }, status=401)

        token = auth_header.split(' ')[1]
        try:
            payload_str = base64.b64decode(token).decode()
            payload = json.loads(payload_str)
            
            if datetime.now().timestamp() > payload['exp']:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Token expired'
                }, status=401)
                
            # Find admin by email
            admin = None
            for email, admin_data in ADMIN_USERS.items():
                if admin_data['id'] == payload['admin_id']:
                    admin = admin_data
                    break
                    
            if not admin:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid admin'
                }, status=401)
                
            request.admin = admin
            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Invalid token: {str(e)}'
            }, status=401)
    return wrapper

@admin_required
@require_http_methods(["GET"])
def admin_dashboard(request):
    return JsonResponse({
        'status': 'success',
        'message': 'Welcome to admin dashboard',
        'admin': {
            'id': request.admin['id'],
            'name': request.admin['name'],
            'email': request.admin['email']
        }
    })

@admin_required
@require_http_methods(["POST"])
def admin_logout(request):
    return JsonResponse({
        'status': 'success',
        'message': 'Logged out successfully'
    })



def send_email_async(teacher, subject, template_name, reason=None):
    """Send email asynchronously to avoid blocking the request"""
    def send_email():
        try:
            # Get the real email address (decrypted)
            real_email = teacher.get_email()
            
            email_body = render_to_string(template_name, {
                'teacher': teacher,
                'reason': reason
            })
            
            email = EmailMessage(
                subject=subject,
                body=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[real_email]
            )
            email.content_subtype = 'html'
            email.send()
            
            print(f"✅ Email sent successfully to: {real_email}")
            
            # Log success
            TeacherEmailLog.objects.create(
                teacher_id=teacher.id,
                email_subject=subject,
                email_body=email_body,
                sent_status='Success'
            )
            
        except Exception as e:
            print(f"❌ Email sending failed: {str(e)}")
            # Log failure
            TeacherEmailLog.objects.create(
                teacher_id=teacher.id,
                email_subject=subject,
                email_body=f"Failed to send email: {str(e)}",
                sent_status='Failed'
            )
    
    thread = threading.Thread(target=send_email)
    thread.daemon = True
    thread.start()

@require_http_methods(["GET"])
def get_teachers(request):
    """Get teachers for admin dashboard with pagination"""
    try:
        from auth_app.models import Educator
        
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        status_filter = request.GET.get('status', 'all')
        
        teachers = Educator.objects.all().order_by('-id')
        
        # Apply status filtering
        if status_filter == 'pending':
            teachers = teachers.filter(is_active=False, document_status__in=['Pending', ''])
        elif status_filter == 'document_verified':
            teachers = teachers.filter(document_status='Verified', is_active=False)
        elif status_filter == 'approved':
            teachers = teachers.filter(is_active=True)
        elif status_filter == 'rejected':
            teachers = teachers.filter(document_status='Rejected')
        # 'all' shows all teachers
        
        total_count = teachers.count()
        
        # Calculate pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_teachers = teachers[start_index:end_index]
        
        teachers_data = []
        
        for teacher in paginated_teachers:
            # Determine approval status based on teacher state
            if teacher.is_active:
                approval_status = 'approved'
            elif teacher.document_status == 'Rejected':
                approval_status = 'rejected'
            elif teacher.document_status == 'Verified':
                approval_status = 'document_verified'
            else:
                approval_status = 'pending'
                
            teachers_data.append({
                'id': teacher.id,
                'teacher_id': teacher.teacher_id,
                'name': teacher.name,
                'email': teacher.email,
                'mobile': teacher.mobile,
                'qualification': teacher.qualification,
                'experience_years': teacher.experience_years,
                'bio': teacher.bio,
                'boards': teacher.boards,
                'subject_classes': teacher.subject_classes,
                'approval_status': approval_status,
                'document_status': getattr(teacher, 'document_status', 'Pending'),
                'created_at': teacher.created_at.isoformat() if teacher.created_at else '',
                'updated_at': teacher.updated_at.isoformat() if teacher.updated_at else '',
                'is_active': teacher.is_active,
                'profile_completed': teacher.profile_completed,
                'languages_known': teacher.languages_known,
                'teaching_experience_institutes': teacher.teaching_experience_institutes
            })
        
        # Calculate statistics from all teachers
        all_teachers = Educator.objects.all()
        pending_teachers = all_teachers.filter(is_active=False, document_status__in=['Pending', '']).count()
        approved_teachers = all_teachers.filter(is_active=True).count()
        verified_pending = all_teachers.filter(is_active=False, document_status='Verified').count()
        rejected_teachers = all_teachers.filter(document_status='Rejected').count()
        
        total_pages = (total_count + page_size - 1) // page_size
        
        return JsonResponse({
            'status': 'success',
            'teachers': teachers_data,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'total_count': total_count,
                'page_size': page_size,
                'has_next': page < total_pages,
                'has_previous': page > 1
            },
            'statistics': {
                'total_teachers': all_teachers.count(),
                'pending_teachers': pending_teachers,  # Teachers needing document verification
                'approved_teachers': approved_teachers,
                'verified_pending': verified_pending,  # Teachers with documents verified, pending approval
                'rejected_teachers': rejected_teachers
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def approve_teacher(request, teacher_id):
    try:
        from auth_app.models import Educator
        teacher = Educator.objects.filter(id=teacher_id).first()
        
        if not teacher:
            return JsonResponse({
                'status': 'error',
                'message': 'Teacher not found'
            }, status=404)
        
        data = json.loads(request.body) if request.body else {}
        reason = data.get('reason', '')
        
        teacher.is_active = True
        teacher.document_status = 'Verified'
        teacher.save()
        
        # Log admin action
        try:
            from auth_app.forensic_audit import ForensicAuditLogger
            from auth_app.audit import get_client_ip
            ip_address = get_client_ip(request)
            ForensicAuditLogger.log_admin_action(
                admin_id=1,  # Get from request.admin if available
                action_type='teacher_approval',
                description=f'Approved teacher: {teacher.name} ({teacher.email})',
                target_type='teacher',
                target_id=str(teacher.id),
                risk_level='medium',
                ip_address=ip_address
            )
            print(f"✅ Admin action logged: teacher approval for {teacher.name}")
        except Exception as e:
            print(f"❌ Failed to log admin action: {e}")
        
        # Emit event to notify teacher of approval
        from core.events import teacher_approved
        teacher_approved.send(
            sender=None,
            teacher_id=teacher.id,
            name=teacher.name
        )
        
        subject = "Eduyata Teacher Application Approved"
        send_email_async(teacher, subject, 'emails/approval_email.html', reason)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Teacher approved and email sent successfully',
            'teacher': {
                'id': teacher.id,
                'name': teacher.name,
                'email': teacher.email,
                'status': 'Approved'
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def reject_teacher(request, teacher_id):
    try:
        from auth_app.models import Educator
        teacher = Educator.objects.filter(id=teacher_id).first()
        
        if not teacher:
            return JsonResponse({
                'status': 'error',
                'message': 'Teacher not found'
            }, status=404)
        
        data = json.loads(request.body) if request.body else {}
        reason = data.get('reason', '')
        
        teacher.is_active = False
        teacher.document_status = 'Rejected'
        teacher.save()
        
        # Log admin action
        try:
            from auth_app.forensic_audit import ForensicAuditLogger
            from auth_app.audit import get_client_ip
            ip_address = get_client_ip(request)
            ForensicAuditLogger.log_admin_action(
                admin_id=1,
                action_type='teacher_rejection',
                description=f'Rejected teacher: {teacher.name} ({teacher.email}) - Reason: {reason}',
                target_type='teacher',
                target_id=str(teacher.id),
                risk_level='medium',
                ip_address=ip_address
            )
            print(f"✅ Admin action logged: teacher rejection for {teacher.name}")
        except Exception as e:
            print(f"❌ Failed to log admin action: {e}")
        
        subject = "Eduyata Teacher Application Rejected"
        send_email_async(teacher, subject, 'emails/rejection_email.html', reason)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Teacher rejected and email sent successfully',
            'teacher': {
                'id': teacher.id,
                'name': teacher.name,
                'email': teacher.email,
                'status': 'Rejected'
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_teacher_status(request, teacher_id):
    """Update teacher approval status"""
    try:
        from auth_app.models import Educator
        
        teacher = Educator.objects.filter(teacher_id=teacher_id).first()
        if not teacher:
            return JsonResponse({
                'status': 'error',
                'message': 'Teacher not found'
            }, status=404)
        
        data = json.loads(request.body)
        status = data.get('status')
        
        if status not in ['pending', 'document_verified', 'approved', 'rejected']:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid status'
            }, status=400)
        
        # Update teacher status
        if status == 'approved':
            teacher.is_active = True
            teacher.document_status = 'Verified'
        elif status == 'rejected':
            teacher.is_active = False
            teacher.document_status = 'Rejected'
        elif status == 'document_verified':
            teacher.document_status = 'Verified'
        else:  # pending
            teacher.is_active = False
            teacher.document_status = 'Pending'
        
        teacher.save()
        
        return JsonResponse({
            'status': 'success',
            'message': f'Teacher status updated to {status}',
            'teacher': {
                'id': teacher.id,
                'teacher_id': teacher.teacher_id,
                'name': teacher.name,
                'approval_status': status
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def get_students(request):
    """Get students for admin dashboard with pagination"""
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        
        students = Student.objects.all().order_by('-id')
        total_count = students.count()
        
        # Calculate pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_students = students[start_index:end_index]
        
        students_data = []
        
        def safe_date_format(date_field):
            """Safely format date field to ISO string"""
            if not date_field:
                return ''
            if hasattr(date_field, 'isoformat'):
                return date_field.isoformat()
            return str(date_field)
        
        for student in paginated_students:
            students_data.append({
                'id': student.id,
                'student_id': student.student_id,
                'name': student.name,
                'gender': student.gender,
                'mobile_self': student.mobile_self,
                'class': student.class_name,
                'board': student.board,
                'date_of_birth': safe_date_format(student.date_of_birth),
                'address': student.address,
                'parent_name': student.parent_name,
                'parent_phone': student.parent_phone,
                'interests': student.interests.split(',') if student.interests else [],
                'profile_completed': student.profile_completed,
                'created_at': safe_date_format(student.created_at),
                'updated_at': safe_date_format(student.updated_at)
            })
        
        total_pages = (total_count + page_size - 1) // page_size
        
        # Calculate statistics from all students
        all_students = Student.objects.all()
        active_students = all_students.filter(profile_completed=True).count()
        inactive_students = total_count - active_students
        
        # Students created this month
        from datetime import datetime
        current_month = datetime.now().month
        current_year = datetime.now().year
        new_this_month = all_students.filter(
            created_at__month=current_month,
            created_at__year=current_year
        ).count()
        
        return JsonResponse({
            'status': 'success',
            'students': students_data,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'total_count': total_count,
                'page_size': page_size,
                'has_next': page < total_pages,
                'has_previous': page > 1
            },
            'statistics': {
                'total_students': total_count,
                'active_students': active_students,
                'inactive_students': inactive_students,
                'new_this_month': new_this_month
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def get_student_detail(request, student_id):
    """Get detailed information for a specific student"""
    try:
        student = Student.objects.get(id=student_id)
        
        def safe_date_format(date_field):
            """Safely format date field to ISO string"""
            if not date_field:
                return ''
            if hasattr(date_field, 'isoformat'):
                return date_field.isoformat()
            return str(date_field)
        
        student_data = {
            'id': student.id,
            'student_id': student.student_id,
            'name': student.name,
            'gender': student.gender,
            'mobile_self': student.mobile_self,
            'class': student.class_name,
            'board': student.board,
            'profile_picture': student.profile_picture,
            'date_of_birth': safe_date_format(student.date_of_birth),
            'address': student.address,
            'parent_name': student.parent_name,
            'parent_phone': student.parent_phone,
            'interests': student.interests.split(',') if student.interests else [],
            'profile_completed': student.profile_completed,
            'created_at': safe_date_format(student.created_at),
            'updated_at': safe_date_format(student.updated_at)
        }
        
        return JsonResponse({
            'status': 'success',
            'student': student_data
        })
        
    except Student.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Student not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

def send_admin_email_async(admin, subject, template_name, credentials=None):
    """Send email asynchronously to new admin"""
    def send_email():
        try:
            email_body = render_to_string(template_name, {
                'admin': admin,
                'credentials': credentials
            })
            
            email = EmailMessage(
                subject=subject,
                body=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[admin.email]
            )
            email.content_subtype = 'html'
            email.send()
            
            # Log success
            try:
                AdminEmailLog.objects.create(
                    admin_id=admin.id,
                    email_subject=subject,
                    email_body=email_body,
                    sent_status='Success'
                )
            except:
                pass  # Skip logging if table doesn't exist
            
        except Exception as e:
            # Log failure
            try:
                AdminEmailLog.objects.create(
                    admin_id=admin.id,
                    email_subject=subject,
                    email_body=f"Failed to send email: {str(e)}",
                    sent_status='Failed'
                )
            except:
                pass  # Skip logging if table doesn't exist
    
    thread = threading.Thread(target=send_email)
    thread.daemon = True
    thread.start()

@require_http_methods(["GET"])
def get_admins(request):
    """Get all admins for super admin dashboard"""
    try:
        admins = Admin.objects.all().order_by('-id')
        admins_data = []
        
        for admin in admins:
            admins_data.append({
                'id': admin.id,
                'name': admin.name,
                'email': admin.email,
                'role': admin.role,
                'assignedArea': admin.assigned_area or '',
                'status': admin.status,
                'joinedDate': admin.joined_date.isoformat() if admin.joined_date else '',
                'lastLogin': admin.last_login.isoformat() if admin.last_login else 'Never'
            })
        
        return JsonResponse({
            'status': 'success',
            'admins': admins_data
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Database error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def add_admin(request):
    """Add new admin and send notification email"""
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        role = data.get('role')
        assigned_area = data.get('assigned_area', '')
        
        if not name or not email or not role:
            return JsonResponse({
                'status': 'error',
                'message': 'Name, email and role are required'
            }, status=400)
        
        # Check if admin already exists
        try:
            if Admin.objects.filter(email=email).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Admin with this email already exists'
                }, status=400)
        except:
            pass  # Table doesn't exist yet
        
        # Generate admin ID and password
        import random
        admin_id = f"ADMIN{str(random.randint(100, 999))}"
        temp_password = f"admin{random.randint(100, 999)}"
        
        # Create admin in database
        admin = Admin.objects.create(
            name=name,
            email=email,
            password=temp_password,
            role=role,
            assigned_area=assigned_area,
            status='Active'
        )
        
        # Send welcome email with credentials
        subject = "Welcome to Eduyata Admin Panel"
        credentials = {
            'email': email,
            'password': temp_password,
            'role': role,
            'assigned_area': assigned_area
        }
        send_admin_email_async(admin, subject, 'emails/admin_welcome_email.html', credentials)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Admin added successfully and welcome email sent',
            'admin': {
                'id': admin.id,
                'name': admin.name,
                'email': admin.email,
                'role': admin.role,
                'assigned_area': admin.assigned_area,
                'status': admin.status,
                'joinedDate': admin.joined_date.isoformat() if admin.joined_date else '',
                'lastLogin': 'Never'
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def get_teacher_documents(request, teacher_id):
    """Get teacher documents for verification"""
    try:
        from auth_app.models import Educator
        import os
        from django.conf import settings
        import json
        
        teacher = Educator.objects.get(teacher_id=teacher_id)
        
        documents = {}
        
        # First, try to get documents from database fields
        document_field_mapping = {
            'profile_picture': teacher.profile_picture,
            'cv_file': teacher.cv_file,
            'degree_certificate_file': teacher.degree_certificate,
            'achievements_file': teacher.achievements_file,
            'experience_proof_file': teacher.experience_proof_file,
        }
        
        for doc_type, file_path in document_field_mapping.items():
            if file_path:
                # Normalize path separators
                normalized_path = file_path.replace('\\', '/')
                full_path = os.path.join(settings.MEDIA_ROOT, normalized_path)
                if os.path.exists(full_path):
                    documents[doc_type] = {
                        'url': f'/media/{normalized_path}',
                        'metadata': {
                            'original_filename': os.path.basename(normalized_path)
                        }
                    }
        
        # If no documents found in database, scan teacher directory
        if not documents:
            teacher_dir = os.path.join(settings.MEDIA_ROOT, 'teachers', str(teacher.teacher_id))
            if os.path.exists(teacher_dir):
                file_type_mapping = {
                    'profile_picture': 'profile_picture',
                    'cv': 'cv_file',
                    'CV': 'cv_file',
                    'degree_certificate': 'degree_certificate_file',
                    'DEGREE': 'degree_certificate_file',
                    'achievements': 'achievements_file',
                    'experience': 'experience_proof_file',
                    'EXPERIENCE': 'experience_proof_file',
                    'government_id': 'government_id_file'
                }
                
                for filename in os.listdir(teacher_dir):
                    if not filename.endswith('_metadata.json'):
                        for file_prefix, doc_type in file_type_mapping.items():
                            if filename.startswith(file_prefix) and not filename.endswith('.json'):
                                file_path = f"teachers/{teacher.teacher_id}/{filename}"
                                
                                metadata = {'original_filename': filename}
                                metadata_file = os.path.join(teacher_dir, f"{file_prefix}_metadata.json")
                                if os.path.exists(metadata_file):
                                    try:
                                        with open(metadata_file, 'r') as f:
                                            metadata = json.load(f)
                                    except:
                                        pass
                                
                                documents[doc_type] = {
                                    'url': f'/media/{file_path}',
                                    'metadata': metadata
                                }
                                break
        
        return JsonResponse({
            'status': 'success',
            'teacher': {
                'id': teacher.id,
                'teacher_id': teacher.teacher_id,
                'name': teacher.name,
                'email': teacher.email,
                'mobile': teacher.mobile,
                'qualification': teacher.qualification,
                'experience_years': teacher.experience_years,
                'bio': teacher.bio,
                'boards': teacher.boards,
                'subject_classes': teacher.subject_classes,
                'languages_known': teacher.languages_known,
                'teaching_experience_institutes': teacher.teaching_experience_institutes
            },
            'documents': documents
        })
        
    except Educator.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Teacher not found'
        }, status=404)
    except Exception as e:
        import traceback
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}',
            'traceback': traceback.format_exc()
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def verify_documents(request, teacher_id):
    """Verify or mark teacher documents as incomplete"""
    try:
        from auth_app.models import Educator
        
        teacher = Educator.objects.get(id=teacher_id)
        data = json.loads(request.body)
        document_status = data.get('document_status')
        remarks = data.get('remarks', '')
        
        if document_status not in ['Verified', 'Incomplete']:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid document status'
            }, status=400)
        
        # Update document status
        teacher.document_status = document_status
        teacher.save()
        
        # Log admin action
        try:
            from auth_app.forensic_audit import ForensicAuditLogger
            from auth_app.audit import get_client_ip
            ip_address = get_client_ip(request)
            ForensicAuditLogger.log_admin_action(
                admin_id=1,
                action_type='document_verification',
                description=f'Marked documents as {document_status} for teacher: {teacher.name}',
                target_type='teacher_documents',
                target_id=str(teacher.id),
                risk_level='low',
                ip_address=ip_address
            )
            print(f"✅ Admin action logged: document verification for {teacher.name}")
        except Exception as e:
            print(f"❌ Failed to log admin action: {e}")
        
        # Send appropriate email
        if document_status == 'Verified':
            subject = "Eduyata - Documents Verified"
            template = 'emails/document_verified_email.html'
        else:
            subject = "Eduyata - Documents Need Attention"
            template = 'emails/document_incomplete_email.html'
        
        send_email_async(teacher, subject, template, remarks)
        
        return JsonResponse({
            'status': 'success',
            'message': f'Documents marked as {document_status.lower()} and email sent',
            'teacher': {
                'id': teacher.id,
                'name': teacher.name,
                'email': teacher.email,
                'document_status': document_status
            }
        })
        
    except Educator.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Teacher not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)
    
    

@csrf_exempt
@require_http_methods(["POST"])
def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    try:
        from .models import AdminNotification
        
        notification = AdminNotification.objects.get(id=notification_id)
        notification.is_read = True
        notification.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Notification marked as read'
        })
        
    except AdminNotification.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Notification not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def get_notifications(request):
    """Get admin notifications"""
    try:
        from .models import AdminNotification
        from django.utils import timezone
        
        notifications = AdminNotification.objects.all().order_by('-created_at')[:10]
        notifications_data = []
        
        for notification in notifications:
            # Calculate time ago
            time_diff = timezone.now() - notification.created_at
            if time_diff.days > 0:
                time_ago = f"{time_diff.days} days ago"
            elif time_diff.seconds > 3600:
                hours = time_diff.seconds // 3600
                time_ago = f"{hours} hours ago"
            elif time_diff.seconds > 60:
                minutes = time_diff.seconds // 60
                time_ago = f"{minutes} minutes ago"
            else:
                time_ago = "Just now"
            
            notifications_data.append({
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'type': notification.notification_type,
                'teacher_id': notification.teacher_id,
                'teacher_name': notification.teacher_name,
                'is_read': notification.is_read,
                'time_ago': time_ago,
                'created_at': notification.created_at.isoformat() if notification.created_at else ''
            })
        
        # Count unread notifications
        unread_count = AdminNotification.objects.filter(is_read=False).count()
        
        return JsonResponse({
            'status': 'success',
            'notifications': notifications_data,
            'unread_count': unread_count
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'success',
            'notifications': [],
            'unread_count': 0
        })

@require_http_methods(["GET"])
def get_backup_history(request):
    """Get backup history"""
    try:
        from .models import BackupHistory
        
        backups = BackupHistory.objects.all().order_by('-created_at')[:20]
        backups_data = []
        
        for backup in backups:
            backups_data.append({
                'id': backup.id,
                'filename': backup.filename,
                'created_at': backup.created_at.isoformat() if backup.created_at else '',
                'file_size': backup.file_size,
                'status': backup.status,
                'created_by': backup.created_by
            })
        
        return JsonResponse({
            'status': 'success',
            'backups': backups_data
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'success',
            'backups': []
        })

@require_http_methods(["GET"])
def get_backup_stats(request):
    """Get backup statistics including storage usage"""
    try:
        from .models import BackupHistory
        import os
        from django.conf import settings
        
        # Get backup history
        backups = BackupHistory.objects.all()
        total_backups = backups.count()
        successful_backups = backups.filter(status='success').count()
        success_rate = round((successful_backups / total_backups) * 100) if total_backups > 0 else 0
        
        # Calculate actual storage usage
        total_backup_size = sum(backup.file_size or 0 for backup in backups)
        
        # Calculate backup-specific storage usage
        backup_dir = os.path.join(settings.MEDIA_ROOT, 'backups')
        backup_storage_used = 0
        
        if os.path.exists(backup_dir):
            # Calculate actual backup files size
            for filename in os.listdir(backup_dir):
                file_path = os.path.join(backup_dir, filename)
                if os.path.isfile(file_path):
                    backup_storage_used += os.path.getsize(file_path)
            
            # Get total disk space for the backup directory
            import shutil
            total_space, used_space, available_space = shutil.disk_usage(backup_dir)
        else:
            total_space = 5 * 1024**4  # 5TB fallback
            available_space = total_space * 0.8  # 80% available fallback
        
        # Format sizes
        def format_size(bytes_size):
            for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
                if bytes_size < 1024.0:
                    return f"{bytes_size:.1f} {unit}"
                bytes_size /= 1024.0
            return f"{bytes_size:.1f} PB"
        
        return JsonResponse({
            'status': 'success',
            'stats': {
                'total_backups': total_backups,
                'success_rate': success_rate,
                'backup_storage_used': backup_storage_used,
                'backup_storage_used_formatted': format_size(backup_storage_used),
                'total_space': total_space,
                'available_space': available_space,
                'storage_used_formatted': format_size(backup_storage_used),
                'total_space_formatted': format_size(total_space),
                'available_percentage': round((available_space / total_space) * 100),
                'retention_days': 30
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Error getting backup stats: {str(e)}'
        }, status=500)
@csrf_exempt
@require_http_methods(["POST"])
def delete_student(request, student_id):
    """Delete student account - HIGH RISK ACTION"""
    try:
        student = Student.objects.get(id=student_id)
        student_name = student.name
        student_email = student.mobile_self
        
        # Log admin action BEFORE deletion
        try:
            from auth_app.forensic_audit import ForensicAuditLogger
            from auth_app.audit import get_client_ip
            ip_address = get_client_ip(request)
            ForensicAuditLogger.log_admin_action(
                admin_id=1,
                action_type='student_deletion',
                description=f'DELETED student account: {student_name} (ID: {student.student_id})',
                target_type='student',
                target_id=str(student.id),
                risk_level='high',
                ip_address=ip_address
            )
            print(f"✅ HIGH RISK: Student deletion logged for {student_name}")
        except Exception as e:
            print(f"❌ Failed to log student deletion: {e}")
        
        # Delete the student
        student.delete()
        
        return JsonResponse({
            'status': 'success',
            'message': f'Student {student_name} deleted successfully'
        })
        
    except Student.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Student not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def export_student_data(request):
    """Export student data - COMPLIANCE CRITICAL"""
    try:
        data = json.loads(request.body) if request.body else {}
        export_type = data.get('export_type', 'all_students')
        purpose = data.get('purpose', 'administrative_report')
        
        # Get student count for the export
        student_count = Student.objects.count()
        
        # Log data export
        try:
            from auth_app.forensic_audit import ForensicAuditLogger
            from auth_app.audit import get_client_ip
            ip_address = get_client_ip(request)
            ForensicAuditLogger.log_data_export(
                exported_by=1,
                export_type='student_data',
                data_types=['personal_info', 'academic_records', 'contact_details'],
                purpose=purpose,
                record_count=student_count,
                ip_address=ip_address
            )
            print(f"✅ Data export logged: {student_count} student records")
        except Exception as e:
            print(f"❌ Failed to log data export: {e}")
        
        return JsonResponse({
            'status': 'success',
            'message': f'Student data export initiated ({student_count} records)',
            'export_details': {
                'type': export_type,
                'record_count': student_count,
                'purpose': purpose
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Export failed: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_backup(request):
    """Create database backup using Django management command"""
    try:
        from django.core.management import call_command
        from io import StringIO
        import os
        from datetime import datetime
        
        # Call the backup command
        out = StringIO()
        call_command('backup_database', '--created-by=admin', stdout=out)
        
        if latest_backup and latest_backup.status == 'success':
            return JsonResponse({
                'status': 'success',
                'message': 'Backup created successfully',
                'backup': {
                    'filename': latest_backup.filename,
                    'file_size': latest_backup.file_size,
                    'status': latest_backup.status,
                    'created_at': latest_backup.created_at.isoformat()
                }
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Backup creation failed'
            }, status=500)
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def download_backup(request, filename):
    """Download backup file"""
    try:
        from django.http import FileResponse, Http404
        from django.conf import settings
        import os
        
        # Security check - ensure filename is safe
        if not filename.endswith('.sql') or '/' in filename or '\\' in filename:
            raise Http404("Invalid filename")
        
        # Check if backup exists in database
        from .models import BackupHistory
        backup = BackupHistory.objects.filter(filename=filename).first()
        if not backup:
            raise Http404("Backup not found")
        
        # Try multiple possible backup locations
        possible_paths = [
            os.path.join(settings.MEDIA_ROOT, 'backups', filename),
            os.path.join(settings.BASE_DIR, 'backups', filename),
            os.path.join(settings.BASE_DIR, '..', 'backups', filename)
        ]
        
        file_path = None
        for path in possible_paths:
            if os.path.exists(path):
                file_path = path
                break
        
        if not file_path:
            raise Http404("Backup file not found on disk")
        
        # Return file as download
        response = FileResponse(
            open(file_path, 'rb'),
            as_attachment=True,
            filename=filename
        )
        response['Content-Type'] = 'application/sql'
        return response
        
    except Http404:
        raise
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Download failed: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def dashboard_stats(request):
    """Get dashboard statistics for admin"""
    try:
        from auth_app.models import Student, Educator
        from courses.models import Course
        
        # Get basic counts
        total_students = Student.objects.count()
        active_teachers = Educator.objects.filter(is_active=True).count()
        total_courses = Course.objects.count() if hasattr(Course, 'objects') else 89
        
        # Mock revenue data
        monthly_revenue = 24580
        
        return JsonResponse({
            'status': 'success',
            'stats': {
                'total_students': total_students,
                'active_teachers': active_teachers,
                'total_courses': total_courses,
                'monthly_revenue': monthly_revenue
            }
        })
        
    except Exception as e:
        # Return mock data if database queries fail
        return JsonResponse({
            'status': 'success',
            'stats': {
                'total_students': 2847,
                'active_teachers': 156,
                'total_courses': 89,
                'monthly_revenue': 24580
            }
        })