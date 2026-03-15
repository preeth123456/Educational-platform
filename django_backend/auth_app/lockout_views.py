from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .lockout_service import AccountLockoutService
from .lockout_models import AccountLockout, LoginHistory, BlockedEntity, FraudEvent
import json

@require_http_methods(["GET"])
def get_account_lockouts(request):
    """Get all account lockouts for admin dashboard"""
    try:
        # Get query parameters
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        search = request.GET.get('search', '')
        user_type = request.GET.get('user_type', '')
        status = request.GET.get('status', '')
        
        # Base query
        lockouts = AccountLockout.objects.all()
        
        # Apply filters
        if search:
            lockouts = lockouts.filter(username__icontains=search)
        
        if user_type:
            lockouts = lockouts.filter(user_type=user_type)
        
        if status == 'locked':
            lockouts = lockouts.filter(lockout_until__gt=timezone.now())
        elif status == 'unlocked':
            lockouts = lockouts.filter(lockout_until__lte=timezone.now())
        
        # Order by most recent
        lockouts = lockouts.order_by('-updated_at')
        
        # Get total count
        total_count = lockouts.count()
        
        # Apply pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_lockouts = lockouts[start_index:end_index]
        
        # Format data
        lockout_data = []
        for lockout in paginated_lockouts:
            lockout_data.append({
                'id': lockout.id,
                'user_id': lockout.user_id,
                'user_type': lockout.user_type,
                'username': lockout.username,
                'failed_attempts': lockout.failed_attempts,
                'is_locked': lockout.is_currently_locked(),
                'lockout_until': lockout.lockout_until.isoformat() if lockout.lockout_until else None,
                'last_failed_ip': lockout.last_failed_ip,
                'last_failed_at': lockout.last_failed_at.isoformat() if lockout.last_failed_at else None,
                'created_at': lockout.created_at.isoformat(),
                'updated_at': lockout.updated_at.isoformat()
            })
        
        # Calculate statistics
        total_lockouts = AccountLockout.objects.count()
        currently_locked = AccountLockout.objects.filter(lockout_until__gt=timezone.now()).count()
        student_lockouts = AccountLockout.objects.filter(user_type='student').count()
        teacher_lockouts = AccountLockout.objects.filter(user_type='teacher').count()
        
        return JsonResponse({
            'success': True,
            'lockouts': lockout_data,
            'pagination': {
                'current_page': page,
                'total_pages': (total_count + page_size - 1) // page_size,
                'total_count': total_count,
                'page_size': page_size
            },
            'statistics': {
                'total_lockouts': total_lockouts,
                'currently_locked': currently_locked,
                'student_lockouts': student_lockouts,
                'teacher_lockouts': teacher_lockouts
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Failed to fetch lockouts: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def unlock_account(request):
    """Unlock a user account"""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_type = data.get('user_type')
        
        if not user_id or not user_type:
            return JsonResponse({
                'success': False,
                'error': 'User ID and user type are required'
            }, status=400)
        
        result = AccountLockoutService.unlock_user_account(user_id, user_type)
        
        if result['success']:
            return JsonResponse({
                'success': True,
                'message': result['message']
            })
        else:
            return JsonResponse({
                'success': False,
                'error': result['message']
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Failed to unlock account: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def get_login_history(request):
    """Get login history for admin dashboard"""
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 50))
        user_type = request.GET.get('user_type', '')
        status = request.GET.get('status', '')
        
        # Base query
        history = LoginHistory.objects.all()
        
        # Apply filters
        if user_type:
            history = history.filter(user_type=user_type)
        
        if status:
            history = history.filter(status=status)
        
        # Order by most recent
        history = history.order_by('-timestamp')
        
        # Get total count
        total_count = history.count()
        
        # Apply pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_history = history[start_index:end_index]
        
        # Format data
        history_data = []
        for entry in paginated_history:
            history_data.append({
                'id': entry.id,
                'user_id': entry.user_id,
                'user_type': entry.user_type,
                'username': entry.username,
                'status': entry.status,
                'ip_address': entry.ip_address,
                'user_agent': entry.user_agent,
                'failure_reason': entry.failure_reason,
                'timestamp': entry.timestamp.isoformat()
            })
        
        return JsonResponse({
            'success': True,
            'history': history_data,
            'pagination': {
                'current_page': page,
                'total_pages': (total_count + page_size - 1) // page_size,
                'total_count': total_count,
                'page_size': page_size
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Failed to fetch login history: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def get_fraud_events(request):
    """Get fraud events for admin dashboard"""
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        severity = request.GET.get('severity', '')
        
        # Base query
        events = FraudEvent.objects.all()
        
        # Apply filters
        if severity:
            events = events.filter(severity=severity)
        
        # Order by most recent
        events = events.order_by('-timestamp')
        
        # Get total count
        total_count = events.count()
        
        # Apply pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_events = events[start_index:end_index]
        
        # Format data
        events_data = []
        for event in paginated_events:
            events_data.append({
                'id': event.id,
                'event_type': event.event_type,
                'severity': event.severity,
                'user_id': event.user_id,
                'ip_address': event.ip_address,
                'user_agent': event.user_agent,
                'details': event.details,
                'timestamp': event.timestamp.isoformat()
            })
        
        return JsonResponse({
            'success': True,
            'events': events_data,
            'pagination': {
                'current_page': page,
                'total_pages': (total_count + page_size - 1) // page_size,
                'total_count': total_count,
                'page_size': page_size
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Failed to fetch fraud events: {str(e)}'
        }, status=500)

from django.utils import timezone