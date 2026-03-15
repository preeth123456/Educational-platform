from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from django.utils import timezone
import json
from datetime import datetime, timedelta

@csrf_exempt
@require_http_methods(["GET"])
def realtime_activity_history(request):
    """Get real-time user activity history with live updates"""
    try:
        user_id = request.GET.get('user_id')
        user_type = request.GET.get('user_type', 'student')
        limit = int(request.GET.get('limit', 50))
        
        if not user_id:
            return JsonResponse({
                'status': 'error',
                'message': 'User ID is required'
            }, status=400)
        
        activities = []
        
        with connection.cursor() as cursor:
            # Get activities from audit_logs_enhanced first, then legacy if needed
            cursor.execute("""
                SELECT DISTINCT
                    id,
                    actor_id,
                    action,
                    target_type as resource_type,
                    target_id as resource_id,
                    metadata as details,
                    ip_address,
                    user_agent,
                    timestamp
                FROM audit_logs_enhanced 
                WHERE actor_id = %s AND actor_type = %s
                ORDER BY timestamp DESC 
                LIMIT %s
            """, [user_id, user_type, limit])
            
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            
            for row in rows:
                row_dict = dict(zip(columns, row))
                
                # Parse details/metadata
                details = {}
                if row_dict['details']:
                    try:
                        if isinstance(row_dict['details'], str):
                            details = json.loads(row_dict['details'])
                        else:
                            details = row_dict['details']
                    except (json.JSONDecodeError, TypeError):
                        details = {}
                
                # Format activity description
                description = format_activity_description(
                    row_dict['action'], 
                    row_dict['resource_type'], 
                    details
                )
                
                activities.append({
                    'id': row_dict['id'],
                    'action': row_dict['action'],
                    'resource_type': row_dict['resource_type'] or 'system',
                    'resource_id': row_dict['resource_id'],
                    'details': details,
                    'timestamp': row_dict['timestamp'].isoformat() if row_dict['timestamp'] else None,
                    'description': description,
                    'ip_address': row_dict['ip_address'],
                    'user_agent': row_dict['user_agent']
                })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'activities': activities,
                'total': len(activities),
                'last_updated': timezone.now().isoformat(),
                'user_id': user_id,
                'user_type': user_type
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

def format_activity_description(action, resource_type, details):
    """Format activity description for display"""
    descriptions = {
        'login': 'Successfully logged in',
        'login_success': 'Successfully logged in',
        'login_failed': 'Failed login attempt',
        'logout': 'Logged out',
        'update_profile': 'Updated profile information',
        'export_data': 'Exported personal data',
        'view_profile': 'Viewed profile',
        'change_password': 'Changed password',
        'access_course': f'Accessed {resource_type}',
        'enroll_course': 'Enrolled in course',
        'update_progress': 'Updated learning progress',
        'view_resource': f'Viewed {resource_type}',
        'create_resource': f'Created {resource_type}',
        'update_resource': f'Updated {resource_type}',
        'delete_resource': f'Deleted {resource_type}',
    }
    
    # Check if we have a custom description in details
    if details and 'description' in details:
        return details['description']
    
    # Use predefined descriptions or generate one
    base_description = descriptions.get(action)
    if base_description:
        return base_description
    
    # Generate description from action and resource_type
    action_words = action.replace('_', ' ').title()
    if resource_type and resource_type != 'system':
        return f'{action_words} on {resource_type}'
    else:
        return action_words

@csrf_exempt
@require_http_methods(["POST"])
def log_profile_update(request):
    """Log profile update activity"""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_type = data.get('user_type', 'student')
        fields_updated = data.get('fields_updated', [])
        
        if not user_id:
            return JsonResponse({
                'status': 'error',
                'message': 'User ID is required'
            }, status=400)
        
        # Log the activity
        from .audit import AuditLogger, get_client_ip
        
        AuditLogger.log_activity(
            user_id=user_id,
            user_type=user_type,
            action='update_profile',
            resource_type='profile',
            resource_id=user_id,
            details={
                'fields_updated': fields_updated,
                'timestamp': timezone.now().isoformat(),
                'description': f'Updated profile fields: {", ".join(fields_updated)}'
            },
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'Profile update logged successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def log_data_export(request):
    """Log data export activity"""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_type = data.get('user_type', 'student')
        export_format = data.get('export_format', 'pdf')
        
        if not user_id:
            return JsonResponse({
                'status': 'error',
                'message': 'User ID is required'
            }, status=400)
        
        # Log the activity
        from .audit import AuditLogger, get_client_ip
        
        AuditLogger.log_activity(
            user_id=user_id,
            user_type=user_type,
            action='export_data',
            resource_type='data',
            resource_id=user_id,
            details={
                'export_format': export_format,
                'timestamp': timezone.now().isoformat(),
                'description': f'Exported personal data in {export_format.upper()} format'
            },
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'Data export logged successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_activity_stats(request):
    """Get activity statistics for the user"""
    try:
        user_id = request.GET.get('user_id')
        user_type = request.GET.get('user_type', 'student')
        
        if not user_id:
            return JsonResponse({
                'status': 'error',
                'message': 'User ID is required'
            }, status=400)
        
        stats = {}
        
        with connection.cursor() as cursor:
            # Get activity counts by action type
            cursor.execute("""
                SELECT 
                    action,
                    COUNT(*) as count,
                    MAX(timestamp) as last_activity
                FROM (
                    SELECT action, timestamp FROM audit_logs_enhanced 
                    WHERE actor_id = %s AND actor_type = %s
                    UNION ALL
                    SELECT action, timestamp FROM audit_logs 
                    WHERE user_id = %s AND user_type = %s
                ) combined_logs
                GROUP BY action
                ORDER BY count DESC
            """, [user_id, user_type, user_id, user_type])
            
            activity_counts = {}
            for row in cursor.fetchall():
                activity_counts[row[0]] = {
                    'count': row[1],
                    'last_activity': row[2].isoformat() if row[2] else None
                }
            
            # Get today's activity count
            cursor.execute("""
                SELECT COUNT(*) FROM (
                    SELECT timestamp FROM audit_logs_enhanced 
                    WHERE actor_id = %s AND actor_type = %s 
                    AND DATE(timestamp) = CURDATE()
                    UNION ALL
                    SELECT timestamp FROM audit_logs 
                    WHERE user_id = %s AND user_type = %s 
                    AND DATE(timestamp) = CURDATE()
                ) today_logs
            """, [user_id, user_type, user_id, user_type])
            
            today_count = cursor.fetchone()[0]
            
            stats = {
                'activity_counts': activity_counts,
                'today_activities': today_count,
                'total_activities': sum(item['count'] for item in activity_counts.values())
            }
        
        return JsonResponse({
            'status': 'success',
            'data': stats
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)