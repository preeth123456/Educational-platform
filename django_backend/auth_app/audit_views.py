from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .audit import AuditLogger
import json

@csrf_exempt
@require_http_methods(["GET"])
def activity_history(request):
    """Get user activity history"""
    try:
        user_id = request.GET.get('user_id')
        if not user_id:
            return JsonResponse({
                'status': 'error',
                'message': 'User ID is required'
            }, status=400)
        
        limit = int(request.GET.get('limit', 50))
        offset = int(request.GET.get('offset', 0))
        
        activities = AuditLogger.get_user_activity(user_id, limit, offset)
        
        # Format activities for frontend
        formatted_activities = []
        for activity in activities:
            formatted_activities.append({
                'action': activity['action'],
                'resource_type': activity['resource_type'],
                'resource_id': activity['resource_id'],
                'details': activity['details'],
                'timestamp': activity['timestamp'].isoformat() if activity['timestamp'] else None,
                'description': _format_activity_description(activity)
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'activities': formatted_activities,
                'total': len(formatted_activities)
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def security_events(request):
    """Get security events for user"""
    try:
        user_id = request.GET.get('user_id')
        resolved = request.GET.get('resolved')
        
        if resolved is not None:
            resolved = resolved.lower() == 'true'
        
        limit = int(request.GET.get('limit', 50))
        offset = int(request.GET.get('offset', 0))
        
        events = AuditLogger.get_security_events(user_id, resolved, limit, offset)
        
        # Format events for frontend
        formatted_events = []
        for event in events:
            formatted_events.append({
                'id': event['id'],
                'event_type': event['event_type'],
                'severity': event['severity'],
                'description': event['description'],
                'metadata': event['metadata'],
                'ip_address': event['ip_address'],
                'resolved': event['resolved'],
                'timestamp': event['timestamp'].isoformat() if event['timestamp'] else None
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'events': formatted_events,
                'total': len(formatted_events)
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

def _format_activity_description(activity):
    """Format activity description for display"""
    action = activity['action']
    resource_type = activity['resource_type']
    
    descriptions = {
        'login_success': 'Successfully logged in',
        'login_failed': 'Failed login attempt',
        'logout': 'Logged out',
        'view_profile': 'Viewed profile',
        'update_profile': 'Updated profile information',
        'change_password': 'Changed password',
        'access_course': f'Accessed {resource_type}',
        'enroll_course': 'Enrolled in course',
        'update_progress': 'Updated learning progress',
        'view_resource': f'Viewed {resource_type}',
        'create_resource': f'Created {resource_type}',
        'update_resource': f'Updated {resource_type}',
        'delete_resource': f'Deleted {resource_type}',
    }
    
    return descriptions.get(action, f'{action.replace("_", " ").title()} on {resource_type}')