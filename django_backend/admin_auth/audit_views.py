from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from auth_app.audit import AuditLogger
import json
from datetime import datetime, timedelta

@csrf_exempt
@require_http_methods(["GET"])
def audit_logs(request):
    """Get audit logs for admin dashboard"""
    try:
        # Get query parameters
        user_id = request.GET.get('user_id')
        user_type = request.GET.get('user_type')
        action = request.GET.get('action')
        resource_type = request.GET.get('resource_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        
        # Build query
        query = "SELECT * FROM audit_logs WHERE 1=1"
        params = []
        
        if user_id:
            query += " AND user_id = %s"
            params.append(user_id)
        
        if user_type:
            query += " AND user_type = %s"
            params.append(user_type)
        
        if action:
            query += " AND action LIKE %s"
            params.append(f"%{action}%")
        
        if resource_type:
            query += " AND resource_type = %s"
            params.append(resource_type)
        
        if start_date:
            query += " AND timestamp >= %s"
            params.append(start_date)
        
        if end_date:
            query += " AND timestamp <= %s"
            params.append(end_date)
        
        query += " ORDER BY timestamp DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            columns = [col[0] for col in cursor.description]
            logs = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Format timestamps
            for log in logs:
                if log['timestamp']:
                    log['timestamp'] = log['timestamp'].isoformat()
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'logs': logs,
                'total': len(logs)
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def audit_summary(request):
    """Get audit statistics for admin dashboard"""
    try:
        with connection.cursor() as cursor:
            # Get activity counts by type
            cursor.execute("""
                SELECT user_type, COUNT(*) as count
                FROM audit_logs 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY user_type
            """)
            activity_by_type = dict(cursor.fetchall())
            
            # Get top actions
            cursor.execute("""
                SELECT action, COUNT(*) as count
                FROM audit_logs 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY action
                ORDER BY count DESC
                LIMIT 10
            """)
            top_actions = [{'action': row[0], 'count': row[1]} for row in cursor.fetchall()]
            
            # Get security events summary
            cursor.execute("""
                SELECT severity, COUNT(*) as count
                FROM security_events 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY severity
            """)
            security_events = dict(cursor.fetchall())
            
            # Get daily activity
            cursor.execute("""
                SELECT DATE(timestamp) as date, COUNT(*) as count
                FROM audit_logs 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY DATE(timestamp)
                ORDER BY date DESC
            """)
            daily_activity = [{'date': row[0].isoformat(), 'count': row[1]} for row in cursor.fetchall()]
            
            # Get unresolved security events
            cursor.execute("""
                SELECT COUNT(*) FROM security_events WHERE resolved = FALSE
            """)
            unresolved_events = cursor.fetchone()[0]
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'activity_by_type': activity_by_type,
                'top_actions': top_actions,
                'security_events': security_events,
                'daily_activity': daily_activity,
                'unresolved_events': unresolved_events
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def resolve_security_event(request):
    """Mark security event as resolved"""
    try:
        data = json.loads(request.body)
        event_id = data.get('event_id')
        
        if not event_id:
            return JsonResponse({
                'status': 'error',
                'message': 'Event ID is required'
            }, status=400)
        
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE security_events 
                SET resolved = TRUE 
                WHERE id = %s
            """, [event_id])
            
            if cursor.rowcount == 0:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Security event not found'
                }, status=404)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Security event marked as resolved'
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def security_events_admin(request):
    """Get all security events for admin"""
    try:
        severity = request.GET.get('severity')
        resolved = request.GET.get('resolved')
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        
        events = AuditLogger.get_security_events(
            user_id=None, 
            resolved=resolved.lower() == 'true' if resolved else None,
            limit=limit, 
            offset=offset
        )
        
        # Filter by severity if specified
        if severity:
            events = [e for e in events if e['severity'] == severity]
        
        # Format events
        formatted_events = []
        for event in events:
            formatted_events.append({
                'id': event['id'],
                'event_type': event['event_type'],
                'severity': event['severity'],
                'user_id': event['user_id'],
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