from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
import json
from .models import SupportTicket, TicketResponse, TicketAttachment

@csrf_exempt
@require_http_methods(["POST"])
def create_ticket(request):
    try:
        if request.content_type.startswith('multipart/form-data'):
            user_id = request.POST.get('user_id')
            user_type = request.POST.get('user_type')
            category = request.POST.get('category')
            subject = request.POST.get('subject')
            description = request.POST.get('description')
            file = request.FILES.get('file')
        else:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            user_type = data.get('user_type')
            category = data['category']
            subject = data['subject']
            description = data['description']
            file = None
        
        if not user_id or not user_type:
            return JsonResponse({'error': 'user_id and user_type required'}, status=400)
        
        ticket = SupportTicket.objects.create(
            user_id=user_id,
            user_type=user_type,
            category=category,
            priority='medium',
            subject=subject,
            description=description
        )
        
        if file:
            from django.core.files.storage import default_storage
            file_path = default_storage.save(f'ticket_attachments/{ticket.ticket_id}_{file.name}', file)
            TicketAttachment.objects.create(
                ticket=ticket,
                file_path=file_path,
                file_name=file.name,
                uploaded_by=user_id
            )
        
        return JsonResponse({'success': True, 'ticket_id': ticket.ticket_id})
    except Exception as e:
        print('Error:', str(e))
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def get_tickets(request):
    user_id = request.GET.get('user_id')
    user_type = request.GET.get('user_type')
    
    print(f'Get tickets - user_id: {user_id}, user_type: {user_type}')  # Debug
    
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            if user_type == 'admin':
                cursor.execute("""
                    SELECT st.id, st.ticket_id, st.user_id, st.user_type, st.category, 
                           st.priority, st.status, st.subject, st.created_at,
                           CASE 
                               WHEN st.user_type = 'student' THEN CONCAT(s.name, ' (Student)')
                               WHEN st.user_type = 'teacher' THEN CONCAT(e.name, ' (Teacher)')
                               ELSE CONCAT(st.user_type, ' #', st.user_id)
                           END as user_name,
                           (SELECT COUNT(*) FROM ticket_responses tr WHERE tr.ticket_id = st.id) as responses_count
                    FROM support_tickets st
                    LEFT JOIN students s ON st.user_type = 'student' AND st.user_id = s.id
                    LEFT JOIN educators e ON st.user_type = 'teacher' AND st.user_id = e.id
                    ORDER BY st.created_at DESC
                """)
            else:
                cursor.execute("""
                    SELECT st.id, st.ticket_id, st.user_id, st.user_type, st.category, 
                           st.priority, st.status, st.subject, st.created_at,
                           CASE 
                               WHEN st.user_type = 'student' THEN CONCAT(s.name, ' (Student)')
                               WHEN st.user_type = 'teacher' THEN CONCAT(e.name, ' (Teacher)')
                               ELSE CONCAT(st.user_type, ' #', st.user_id)
                           END as user_name,
                           (SELECT COUNT(*) FROM ticket_responses tr WHERE tr.ticket_id = st.id) as responses_count
                    FROM support_tickets st
                    LEFT JOIN students s ON st.user_type = 'student' AND st.user_id = s.id
                    LEFT JOIN educators e ON st.user_type = 'teacher' AND st.user_id = e.id
                    WHERE st.user_id = %s AND st.user_type = %s
                    ORDER BY st.created_at DESC
                """, [user_id, user_type])
            
            tickets = cursor.fetchall()
            data = []
            for ticket in tickets:
                data.append({
                    'id': ticket[0],
                    'ticket_id': ticket[1],
                    'user_id': ticket[2],
                    'user_type': ticket[3],
                    'user_name': ticket[9],
                    'category': ticket[4],
                    'priority': ticket[5],
                    'status': ticket[6],
                    'subject': ticket[7],
                    'created_at': ticket[8].strftime('%Y-%m-%d %H:%M') if ticket[8] else '',
                    'responses_count': ticket[10]
                })
            
            print(f'Returning {len(data)} tickets')
            return JsonResponse({'tickets': data})
    except Exception as e:
        print(f"Error in get_tickets: {e}")
        return JsonResponse({'tickets': []})

@csrf_exempt
@require_http_methods(["GET"])
def get_ticket_details(request, ticket_id):
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT st.id, st.ticket_id, st.user_id, st.user_type, st.category, 
                       st.priority, st.status, st.subject, st.description, st.created_at,
                       CASE 
                           WHEN st.user_type = 'student' THEN CONCAT(s.name, ' (Student)')
                           WHEN st.user_type = 'teacher' THEN CONCAT(e.name, ' (Teacher)')
                           ELSE CONCAT(st.user_type, ' #', st.user_id)
                       END as user_name
                FROM support_tickets st
                LEFT JOIN students s ON st.user_type = 'student' AND st.user_id = s.id
                LEFT JOIN educators e ON st.user_type = 'teacher' AND st.user_id = e.id
                WHERE st.ticket_id = %s
            """, [ticket_id])
            
            row = cursor.fetchone()
            if not row:
                return JsonResponse({'error': 'Ticket not found'}, status=404)
            
            ticket_data = {
                'id': row[0],
                'ticket_id': row[1],
                'user_id': row[2],
                'user_type': row[3],
                'user_name': row[10],
                'category': row[4],
                'priority': row[5],
                'status': row[6],
                'subject': row[7],
                'description': row[8],
                'created_at': row[9].strftime('%Y-%m-%d %H:%M') if row[9] else ''
            }
        
        # Get responses and attachments
        ticket = SupportTicket.objects.get(ticket_id=ticket_id)
        responses = [{
            'id': r.id,
            'responder_id': r.responder_id,
            'responder_type': r.responder_type,
            'message': r.message,
            'created_at': r.created_at.strftime('%Y-%m-%d %H:%M')
        } for r in ticket.responses.all()]
        
        attachments = [{
            'id': a.id,
            'file_name': a.file_name,
            'file_path': f'/media/{a.file_path}'
        } for a in ticket.attachments.all()]
        
        ticket_data['responses'] = responses
        ticket_data['attachments'] = attachments
        
        return JsonResponse({'ticket': ticket_data})
    except Exception as e:
        print(f"Error in get_ticket_details: {e}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def add_response(request):
    data = json.loads(request.body)
    ticket = SupportTicket.objects.get(id=data['ticket_id'])
    
    TicketResponse.objects.create(
        ticket=ticket,
        responder_id=data['responder_id'],
        responder_type=data['responder_type'],
        message=data['message']
    )
    
    ticket.status = 'in_progress'
    ticket.save()
    
    return JsonResponse({'success': True})

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_ticket(request, ticket_id):
    try:
        ticket = SupportTicket.objects.get(ticket_id=ticket_id)
        ticket.delete()
        return JsonResponse({'success': True})
    except SupportTicket.DoesNotExist:
        return JsonResponse({'error': 'Ticket not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_status(request):
    data = json.loads(request.body)
    ticket = SupportTicket.objects.get(id=data['ticket_id'])
    ticket.status = data['status']
    
    if data['status'] == 'resolved':
        ticket.resolved_at = timezone.now()
    
    ticket.save()
    return JsonResponse({'success': True})
