from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import os
from .models import *
from auth_app.models import Student

@csrf_exempt
@require_http_methods(["GET", "POST"])
def teacher_projects(request):
    if request.method == 'GET':
        teacher_id = request.GET.get('teacher_id')
        if not teacher_id:
            return JsonResponse({'error': 'Teacher ID required'}, status=400)
        
        projects = Project.objects.filter(teacher_id=teacher_id, is_active=True)
        projects_data = []
        
        for project in projects:
            groups_count = project.groups.count()
            total_members = sum(group.members.count() for group in project.groups.all())
            
            projects_data.append({
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'created_at': project.created_at.strftime('%Y-%m-%d'),
                'due_date': project.due_date.strftime('%Y-%m-%d') if project.due_date else None,
                'groups_count': groups_count,
                'total_members': total_members,
                'documents_count': project.documents.count()
            })
        
        return JsonResponse({'projects': projects_data})
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            project = Project.objects.create(
                title=data['title'],
                description=data['description'],
                teacher_id=data['teacher_id'],
                due_date=data.get('due_date')
            )
            return JsonResponse({'success': True, 'project_id': project.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def create_project_group(request):
    try:
        data = json.loads(request.body)
        project = Project.objects.get(id=data['project_id'])
        
        group = ProjectGroup.objects.create(
            project=project,
            name=data['group_name']
        )
        
        # Add members to group
        for member in data['members']:
            ProjectGroupMember.objects.create(
                group=group,
                student_id=member['student_id'],
                student_name=member['student_name']
            )
        
        return JsonResponse({'success': True, 'group_id': group.id})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def project_details(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
        groups = []
        
        for group in project.groups.all():
            members = []
            for member in group.members.all():
                members.append({
                    'student_id': member.student_id,
                    'student_name': member.student_name,
                    'joined_at': member.joined_at.strftime('%Y-%m-%d')
                })
            
            groups.append({
                'id': group.id,
                'name': group.name,
                'members': members,
                'submissions_count': group.submissions.count()
            })
        
        documents = []
        for doc in project.documents.all():
            documents.append({
                'id': doc.id,
                'title': doc.title,
                'file_url': doc.file.url if doc.file else None,
                'uploaded_at': doc.uploaded_at.strftime('%Y-%m-%d %H:%M')
            })
        
        project_data = {
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'created_at': project.created_at.strftime('%Y-%m-%d'),
            'due_date': project.due_date.strftime('%Y-%m-%d') if project.due_date else None,
            'groups': groups,
            'documents': documents
        }
        
        return JsonResponse({'project': project_data})
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        import traceback
        return JsonResponse({
            'error': f'Internal server error: {str(e)}',
            'traceback': traceback.format_exc()
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def upload_project_document(request):
    try:
        project_id = request.POST.get('project_id')
        title = request.POST.get('title')
        file = request.FILES.get('file')
        
        if not all([project_id, title, file]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        project = Project.objects.get(id=project_id)
        
        document = ProjectDocument.objects.create(
            project=project,
            title=title,
            file=file
        )
        
        return JsonResponse({
            'success': True,
            'document': {
                'id': document.id,
                'title': document.title,
                'file_url': document.file.url,
                'uploaded_at': document.uploaded_at.strftime('%Y-%m-%d %H:%M')
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def student_projects(request):
    student_id = request.GET.get('student_id')
    if not student_id:
        return JsonResponse({'error': 'Student ID required'}, status=400)
    
    # Get projects where student is a member
    memberships = ProjectGroupMember.objects.filter(student_id=student_id)
    projects_data = []
    
    for membership in memberships:
        project = membership.group.project
        group = membership.group
        
        # Get project documents
        documents = []
        for doc in project.documents.all():
            documents.append({
                'id': doc.id,
                'title': doc.title,
                'file_url': doc.file.url if doc.file else None
            })
        
        # Get group members
        members = []
        for member in group.members.all():
            members.append({
                'student_id': member.student_id,
                'student_name': member.student_name
            })
        
        projects_data.append({
            'project_id': project.id,
            'project_title': project.title,
            'project_description': project.description,
            'due_date': project.due_date.strftime('%Y-%m-%d') if project.due_date else None,
            'group_id': group.id,
            'group_name': group.name,
            'members': members,
            'documents': documents,
            'submissions_count': group.submissions.count()
        })
    
    return JsonResponse({'projects': projects_data})

@csrf_exempt
@require_http_methods(["GET"])
def get_students(request):
    students = Student.objects.all()
    students_data = []
    
    for student in students:
        students_data.append({
            'id': student.id,
            'name': student.name,
            'email': student.email
        })
    
    return JsonResponse({'students': students_data})

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_group(request, group_id):
    try:
        group = ProjectGroup.objects.get(id=group_id)
        group.delete()
        return JsonResponse({'success': True, 'message': 'Group deleted successfully'})
    except ProjectGroup.DoesNotExist:
        return JsonResponse({'error': 'Group not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# Existing collaboration views
@csrf_exempt
@require_http_methods(["GET"])
def student_project_groups_for_chat(request):
    student_id = request.GET.get('student_id')
    if not student_id:
        return JsonResponse({'error': 'Student ID required'}, status=400)
    
    try:
        import pymysql
        
        # Direct database connection
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        
        cursor = conn.cursor()
        
        # Get project groups where student is a member
        cursor.execute("""
            SELECT DISTINCT pgm.id, pg.id as group_id, pg.name as group_name, 
                   p.id as project_id, p.title as project_title
            FROM project_group_members pgm
            JOIN project_groups pg ON pgm.group_id = pg.id
            JOIN projects p ON pg.project_id = p.id
            WHERE pgm.student_id = %s
            ORDER BY p.id, pg.id
        """, (student_id,))
        
        memberships = cursor.fetchall()
        print(f"SQL Query: SELECT DISTINCT pgm.id, pg.id as group_id, pg.name as group_name, p.id as project_id, p.title as project_title FROM project_group_members pgm JOIN project_groups pg ON pgm.group_id = pg.id JOIN projects p ON pg.project_id = p.id WHERE pgm.student_id = {student_id}")
        print(f"Found {len(memberships)} memberships for student {student_id}: {memberships}")
        
        # Debug: Check what student ID we're using and what's in the members table
        cursor.execute("SELECT * FROM project_group_members WHERE student_id = %s", (student_id,))
        student_memberships = cursor.fetchall()
        print(f"Direct query - student {student_id} memberships: {student_memberships}")
        
        cursor.execute("SELECT * FROM project_group_members ORDER BY group_id")
        all_memberships = cursor.fetchall()
        print(f"All memberships in table: {all_memberships}")
        
        chat_rooms = []
        all_project_members = []
        processed_groups = set()
        
        for membership in memberships:
            _, group_id, group_name, project_id, project_title = membership
            
            if group_id not in processed_groups:
                processed_groups.add(group_id)
                
                # Add group as chat room
                chat_rooms.append({
                    'id': f'project_{group_id}',
                    'name': f'{project_title} - {group_name}',
                    'type': 'project_group',
                    'project_id': project_id,
                    'group_id': group_id,
                    'participants_count': 0  # Will be updated below
                })
                
                # Get all members of this group (including count)
                cursor.execute("""
                    SELECT COUNT(*) as member_count
                    FROM project_group_members
                    WHERE group_id = %s
                """, (group_id,))
                
                member_count = cursor.fetchone()[0]
                
                # Update participants count
                for room in chat_rooms:
                    if room['group_id'] == group_id:
                        room['participants_count'] = member_count
                        break
                
                # Get all members of this group
                cursor.execute("""
                    SELECT student_id, student_name
                    FROM project_group_members
                    WHERE group_id = %s AND student_id != %s
                """, (group_id, student_id))
                
                group_members = cursor.fetchall()
                
                for member_student_id, member_name in group_members:
                    member_data = {
                        'id': member_student_id,
                        'name': member_name,
                        'project_group': group_name,
                        'project_title': project_title,
                        'group_id': group_id,
                        'isOnline': True,
                        'role': 'student'
                    }
                    # Avoid duplicates
                    if not any(m['id'] == member_student_id for m in all_project_members):
                        all_project_members.append(member_data)
        
        conn.close()
        
        print(f"Returning {len(chat_rooms)} chat rooms and {len(all_project_members)} members")
        return JsonResponse({
            'chat_rooms': chat_rooms,
            'project_members': all_project_members
        })
        
    except Exception as e:
        print(f"Error in student_project_groups_for_chat: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'error': f'Database error: {str(e)}',
            'chat_rooms': [],
            'project_members': []
        }, status=500)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def collaboration_groups(request):
    if request.method == 'GET':
        groups = CollaborationGroup.objects.filter(is_active=True)
        groups_data = []
        
        for group in groups:
            groups_data.append({
                'id': group.id,
                'name': group.name,
                'description': group.description,
                'subject': group.subject,
                'members_count': group.members.count(),
                'discussions_count': group.discussions.count(),
                'created_at': group.created_at.strftime('%Y-%m-%d')
            })
        
        return JsonResponse({'groups': groups_data})
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            creator = Student.objects.get(id=data['created_by'])
            
            group = CollaborationGroup.objects.create(
                name=data['name'],
                description=data['description'],
                subject=data['subject'],
                created_by=creator
            )
            
            return JsonResponse({'success': True, 'group_id': group.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
