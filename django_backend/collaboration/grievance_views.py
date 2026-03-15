from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.files.storage import default_storage
from django.db import connection
import json
from .grievance_models import GrievanceCase, GrievanceEvidence, GrievanceTimeline, GrievanceNotification

def create_app_notification(user_id, user_type, message):
    """Create notification in the app notification system"""
    try:
        print(f"Creating app notification for user {user_id} ({user_type}): {message}")
        with connection.cursor() as cursor:
            # Check if student_notifications table exists
            cursor.execute("SHOW TABLES LIKE 'student_notifications'")
            if not cursor.fetchone():
                print("student_notifications table does not exist, creating it...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS student_notifications (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        student_id INT NOT NULL,
                        message TEXT NOT NULL,
                        is_read BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
            
            # Insert notification
            cursor.execute(
                """
                INSERT INTO student_notifications (student_id, message, is_read, created_at)
                VALUES (%s, %s, %s, NOW())
                """,
                [user_id, message, False]
            )
            print(f"App notification created successfully for user {user_id}")
    except Exception as e:
        print(f"Failed to create app notification: {e}")
        import traceback
        traceback.print_exc()

@csrf_exempt
@require_http_methods(["POST"])
def submit_grievance(request):
    try:
        print(f"Request method: {request.method}")
        print(f"Content type: {request.content_type}")
        
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            complainant_id = request.POST.get('complainant_id')
            complainant_type = request.POST.get('complainant_type')
            grievance_type = request.POST.get('grievance_type')
            title = request.POST.get('title')
            description = request.POST.get('description')
            incident_date = request.POST.get('incident_date')
            respondent_id = request.POST.get('respondent_id')
            respondent_type = request.POST.get('respondent_type')
            files = request.FILES.getlist('evidence')
        else:
            data = json.loads(request.body)
            complainant_id = data.get('complainant_id')
            complainant_type = data.get('complainant_type')
            grievance_type = data['grievance_type']
            title = data['title']
            description = data['description']
            incident_date = data.get('incident_date')
            respondent_id = data.get('respondent_id')
            respondent_type = data.get('respondent_type')
            files = []

        print(f"Data received: complainant_id={complainant_id}, type={complainant_type}")
        print(f"Files received: {len(files)} files")
        for file in files:
            print(f"File: {file.name}, size: {file.size}")

        if not all([complainant_id, complainant_type, grievance_type, title, description]):
            return JsonResponse({'error': 'Required fields missing'}, status=400)

        # Create grievance case
        case = GrievanceCase.objects.create(
            complainant_id=complainant_id,
            complainant_type=complainant_type,
            respondent_id=respondent_id,
            respondent_type=respondent_type,
            grievance_type=grievance_type,
            title=title,
            description=description,
            incident_date=incident_date if incident_date else None,
            priority='high' if grievance_type in ['harassment', 'discrimination'] else 'medium'
        )

        print(f"Created case: {case.case_id}")

        # Create initial timeline entry
        GrievanceTimeline.objects.create(
            case=case,
            action='case_submitted',
            description=f'Grievance case submitted by {complainant_type} #{complainant_id}',
            performed_by=complainant_id,
            performed_by_type=complainant_type
        )

        # Upload evidence files
        print(f"About to upload {len(files)} files")
        for file in files:
            try:
                file_path = default_storage.save(f'grievance_evidence/{case.case_id}_{file.name}', file)
                evidence = GrievanceEvidence.objects.create(
                    case=case,
                    file_path=file_path,
                    file_name=file.name,
                    file_type=file.content_type[:50] if file.content_type else 'unknown',
                    uploaded_by=complainant_id
                )
                print(f"Created evidence record: {evidence.id} for file {file.name}")
            except Exception as file_error:
                print(f"Error uploading file {file.name}: {file_error}")

        print(f"Uploaded {len(files)} evidence files")

        return JsonResponse({
            'success': True,
            'case_id': case.case_id,
            'message': 'Grievance submitted and registered successfully'
        })

    except Exception as e:
        print(f"Error in submit_grievance: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_grievances(request):
    user_id = request.GET.get('user_id')
    user_type = request.GET.get('user_type')
    status = request.GET.get('status')

    try:
        with connection.cursor() as cursor:
            if user_type == 'admin':
                cursor.execute("""
                    SELECT gc.id, gc.case_id, gc.complainant_id, gc.complainant_type, 
                           gc.grievance_type, gc.title, gc.priority, gc.status, 
                           gc.created_at, gc.assigned_investigator,
                           CASE 
                               WHEN gc.complainant_type = 'student' THEN CONCAT(s.name, ' (Student)')
                               WHEN gc.complainant_type = 'teacher' THEN CONCAT(e.name, ' (Teacher)')
                               ELSE CONCAT(gc.complainant_type, ' #', gc.complainant_id)
                           END as complainant_name
                    FROM grievance_cases gc
                    LEFT JOIN students s ON gc.complainant_type = 'student' AND gc.complainant_id = s.id
                    LEFT JOIN educators e ON gc.complainant_type = 'teacher' AND gc.complainant_id = e.id
                    ORDER BY gc.created_at DESC
                """)
            else:
                cursor.execute("""
                    SELECT gc.id, gc.case_id, gc.complainant_id, gc.complainant_type, 
                           gc.grievance_type, gc.title, gc.priority, gc.status, 
                           gc.created_at, gc.assigned_investigator,
                           CASE 
                               WHEN gc.complainant_type = 'student' THEN CONCAT(s.name, ' (Student)')
                               WHEN gc.complainant_type = 'teacher' THEN CONCAT(e.name, ' (Teacher)')
                               ELSE CONCAT(gc.complainant_type, ' #', gc.complainant_id)
                           END as complainant_name
                    FROM grievance_cases gc
                    LEFT JOIN students s ON gc.complainant_type = 'student' AND gc.complainant_id = s.id
                    LEFT JOIN educators e ON gc.complainant_type = 'teacher' AND gc.complainant_id = e.id
                    WHERE gc.complainant_id = %s AND gc.complainant_type = %s
                    ORDER BY gc.created_at DESC
                """, [user_id, user_type])
            
            cases = cursor.fetchall()
            data = []
            for case in cases:
                data.append({
                    'id': case[0],
                    'case_id': case[1],
                    'complainant_id': case[2],
                    'complainant_type': case[3],
                    'complainant_name': case[10],
                    'grievance_type': case[4],
                    'title': case[5],
                    'priority': case[6],
                    'status': case[7],
                    'created_at': case[8].strftime('%Y-%m-%d %H:%M') if case[8] else '',
                    'assigned_investigator': case[9]
                })
            
            return JsonResponse({'cases': data})
    except Exception as e:
        print(f"Error in get_grievances: {e}")
        return JsonResponse({'cases': []})

@csrf_exempt
@require_http_methods(["GET"])
def get_grievance_details(request, case_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT gc.id, gc.case_id, gc.complainant_id, gc.complainant_type, 
                       gc.respondent_id, gc.respondent_type, gc.grievance_type, 
                       gc.priority, gc.status, gc.title, gc.description, 
                       gc.incident_date, gc.investigation_notes, gc.resolution_summary,
                       gc.created_at, gc.assigned_investigator,
                       CASE 
                           WHEN gc.complainant_type = 'student' THEN CONCAT(s.name, ' (Student)')
                           WHEN gc.complainant_type = 'teacher' THEN CONCAT(e.name, ' (Teacher)')
                           ELSE CONCAT(gc.complainant_type, ' #', gc.complainant_id)
                       END as complainant_name
                FROM grievance_cases gc
                LEFT JOIN students s ON gc.complainant_type = 'student' AND gc.complainant_id = s.id
                LEFT JOIN educators e ON gc.complainant_type = 'teacher' AND gc.complainant_id = e.id
                WHERE gc.case_id = %s
            """, [case_id])
            
            row = cursor.fetchone()
            if not row:
                return JsonResponse({'error': 'Case not found'}, status=404)
            
            case_data = {
                'id': row[0],
                'case_id': row[1],
                'complainant_id': row[2],
                'complainant_type': row[3],
                'complainant_name': row[16],
                'respondent_id': row[4],
                'respondent_type': row[5],
                'grievance_type': row[6],
                'priority': row[7],
                'status': row[8],
                'title': row[9],
                'description': row[10],
                'incident_date': row[11].strftime('%Y-%m-%d') if row[11] else None,
                'investigation_notes': row[12],
                'resolution_summary': row[13],
                'created_at': row[14].strftime('%Y-%m-%d %H:%M') if row[14] else '',
                'assigned_investigator': row[15]
            }
        
        # Get evidence
        case = GrievanceCase.objects.get(case_id=case_id)
        evidence = [{
            'id': e.id,
            'file_name': e.file_name,
            'file_path': e.file_path,
            'uploaded_at': e.uploaded_at.strftime('%Y-%m-%d %H:%M')
        } for e in case.evidence.all()]

        timeline = [{
            'id': t.id,
            'action': t.action,
            'description': t.description,
            'performed_by': t.performed_by,
            'performed_by_type': t.performed_by_type,
            'timestamp': t.timestamp.strftime('%Y-%m-%d %H:%M')
        } for t in case.timeline.all()]
        
        case_data['evidence'] = evidence
        case_data['timeline'] = timeline

        return JsonResponse({'case': case_data})
    except Exception as e:
        print(f"Error in get_grievance_details: {e}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def assign_investigator(request):
    try:
        data = json.loads(request.body)
        case = GrievanceCase.objects.get(id=data['case_id'])
        investigator_id = data['investigator_id']
        
        case.assigned_investigator = investigator_id
        case.status = 'under_investigation'
        case.investigation_started_at = timezone.now()
        case.save()

        GrievanceTimeline.objects.create(
            case=case,
            action='investigator_assigned',
            description=f'Case assigned to investigator {investigator_id}',
            performed_by=data.get('admin_id', 0),
            performed_by_type='admin'
        )

        # Notify investigator
        GrievanceNotification.objects.create(
            case=case,
            recipient_id=investigator_id,
            recipient_type='admin',
            message=f'You have been assigned to investigate case {case.case_id}'
        )

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_investigation(request):
    try:
        data = json.loads(request.body)
        case = GrievanceCase.objects.get(id=data['case_id'])
        
        case.investigation_notes = data.get('notes', case.investigation_notes)
        case.save()

        GrievanceTimeline.objects.create(
            case=case,
            action='investigation_updated',
            description='Investigation notes updated',
            performed_by=data.get('investigator_id', 0),
            performed_by_type='admin'
        )

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def resolve_grievance(request):
    try:
        data = json.loads(request.body)
        case = GrievanceCase.objects.get(id=data['case_id'])
        
        case.status = 'resolved'
        case.resolution_summary = data['resolution_summary']
        case.resolved_at = timezone.now()
        case.save()

        GrievanceTimeline.objects.create(
            case=case,
            action='case_resolved',
            description='Case resolved with decision',
            performed_by=data.get('resolver_id', 0),
            performed_by_type='admin'
        )

        # Notify complainant
        GrievanceNotification.objects.create(
            case=case,
            recipient_id=case.complainant_id,
            recipient_type=case.complainant_type,
            message=f'Your grievance case {case.case_id} has been resolved'
        )

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_grievance_status(request):
    try:
        data = json.loads(request.body)
        case = GrievanceCase.objects.get(case_id=data['case_id'])
        new_status = data['status']
        admin_id = data.get('admin_id', 0)
        notes = data.get('notes', '')
        
        old_status = case.status
        case.status = new_status
        
        if new_status == 'under_investigation':
            case.investigation_started_at = timezone.now()
            if notes:
                case.investigation_notes = notes
        elif new_status == 'resolved':
            case.resolved_at = timezone.now()
            if notes:
                case.resolution_summary = notes
                
        case.save()

        # Create timeline entry
        GrievanceTimeline.objects.create(
            case=case,
            action='status_updated',
            description=f'Status changed from {old_status} to {new_status}' + (f': {notes}' if notes else ''),
            performed_by=admin_id,
            performed_by_type='admin'
        )

        # Notify complainant
        GrievanceNotification.objects.create(
            case=case,
            recipient_id=case.complainant_id,
            recipient_type=case.complainant_type,
            message=f'Your grievance case {case.case_id} status updated to {new_status}'
        )

        # Create app notification
        status_messages = {
            'under_investigation': f'Your grievance case {case.case_id} is now under investigation.',
            'resolved': f'Your grievance case {case.case_id} has been resolved. Please check the details.'
        }
        if new_status in status_messages:
            create_app_notification(case.complainant_id, case.complainant_type, status_messages[new_status])

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_grievance(request, case_id):
    try:
        case = GrievanceCase.objects.get(case_id=case_id)
        case.delete()
        return JsonResponse({'success': True})
    except GrievanceCase.DoesNotExist:
        return JsonResponse({'error': 'Case not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_notifications(request):
    user_id = request.GET.get('user_id')
    user_type = request.GET.get('user_type')
    
    notifications = GrievanceNotification.objects.filter(
        recipient_id=user_id,
        recipient_type=user_type
    ).order_by('-created_at')
    
    data = [{
        'id': n.id,
        'case_id': n.case.case_id,
        'message': n.message,
        'is_read': n.is_read,
        'created_at': n.created_at.strftime('%Y-%m-%d %H:%M')
    } for n in notifications]
    
    return JsonResponse({'notifications': data})