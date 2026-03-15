from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from notifications.models import Notification
from notifications.utils import mark_all_as_read


@csrf_exempt
@require_http_methods(["GET"])
def get_notifications(request):
    """
    Get notifications for a user.
    
    Query params:
        user_type: 'student' or 'teacher'
        user_id: ID of the user
        limit: Optional, max number of notifications (default: 50)
    
    Returns:
        JSON with notifications list and unread count
    """
    user_type = request.GET.get('user_type')
    user_id = request.GET.get('user_id')
    limit = int(request.GET.get('limit', 50))
    
    if not user_type or not user_id:
        return JsonResponse({
            'success': False,
            'error': 'user_type and user_id are required'
        }, status=400)
    
    try:
        user_id = int(user_id)
    except ValueError:
        return JsonResponse({
            'success': False,
            'error': 'user_id must be a number'
        }, status=400)
    
    # Get notifications
    notifications = Notification.get_for_user(user_id, user_type, limit)
    unread_count = Notification.get_unread_count(user_id, user_type)
    
    # Format response
    notifications_data = [
        {
            'id': n.id,
            'type': n.type,
            'title': n.title,
            'message': n.message,
            'priority': n.priority,
            'status': 'unread' if not n.is_read else 'read',
            'created_at': n.created_at.isoformat(),
        }
        for n in notifications
    ]
    
    return JsonResponse({
        'success': True,
        'notifications': notifications_data,
        'unread_count': unread_count,
        'total_count': len(notifications_data)
    })


@csrf_exempt
@require_http_methods(["POST"])
def mark_as_read(request, notification_id):
    """
    Mark a single notification as read.
    
    Args:
        notification_id: ID of the notification to mark as read
    
    Returns:
        JSON with success status
    """
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.mark_as_read()
        return JsonResponse({
            'success': True,
            'message': 'Notification marked as read'
        })
    except Notification.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Notification not found'
        }, status=404)


@csrf_exempt
@require_http_methods(["POST"])
def mark_all_read(request):
    """
    Mark all notifications as read for a user.
    
    Body params (JSON):
        user_type: 'student' or 'teacher'
        user_id: ID of the user
    
    Returns:
        JSON with success status and count of marked notifications
    """
    try:
        data = json.loads(request.body)
        user_type = data.get('user_type')
        user_id = data.get('user_id')
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON body'
        }, status=400)
    
    if not user_type or not user_id:
        return JsonResponse({
            'success': False,
            'error': 'user_type and user_id are required'
        }, status=400)
    
    count = mark_all_as_read(user_id, user_type)
    
    return JsonResponse({
        'success': True,
        'message': f'{count} notifications marked as read',
        'count': count
    })


@csrf_exempt
@require_http_methods(["POST"])
def create_notification(request):
    """
    Create a new notification (for admin/system use).
    
    Body params (JSON):
        user_id: ID of the user
        user_type: 'student' or 'teacher'
        title: Notification title
        message: Notification message
        type: Optional, notification type (default: 'message')
        priority: Optional, priority level (default: 'medium')
    
    Returns:
        JSON with created notification data
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON body'
        }, status=400)
    
    required_fields = ['user_id', 'user_type', 'title', 'message']
    for field in required_fields:
        if field not in data:
            return JsonResponse({
                'success': False,
                'error': f'{field} is required'
            }, status=400)
    
    notification = Notification.objects.create(
        user_id=data['user_id'],
        user_type=data['user_type'],
        title=data['title'],
        message=data['message'],
        type=data.get('type', 'message'),
        priority=data.get('priority', 'medium')
    )
    
    return JsonResponse({
        'success': True,
        'notification': {
            'id': notification.id,
            'type': notification.type,
            'title': notification.title,
            'message': notification.message,
            'priority': notification.priority,
            'created_at': notification.created_at.isoformat()
        }
    }, status=201)
