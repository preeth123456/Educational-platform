from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from .forensic_audit import ForensicAuditLogger
import json
from datetime import datetime, timedelta

@csrf_exempt
@require_http_methods(["GET"])
def forensic_timeline(request):
    """Get comprehensive forensic timeline for investigations"""
    try:
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        actor_id = request.GET.get('actor_id')
        incident_id = request.GET.get('incident_id')
        limit = int(request.GET.get('limit', 1000))
        
        timeline = ForensicAuditLogger.get_forensic_timeline(
            start_date=start_date,
            end_date=end_date,
            actor_id=int(actor_id) if actor_id else None,
            incident_id=incident_id,
            limit=limit
        )
        
        # Format timeline for frontend
        formatted_timeline = []
        for event in timeline:
            formatted_timeline.append({
                'source': event['source'],
                'actor_id': event['actor_id'],
                'actor_type': event['actor_type'],
                'event_type': event['event_type'],
                'target_type': event['target_type'],
                'target_id': event['target_id'],
                'metadata': event['metadata'],
                'ip_address': event['ip_address'],
                'timestamp': event['timestamp'].isoformat() if event['timestamp'] else None
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'timeline': formatted_timeline,
                'total': len(formatted_timeline)
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def audit_integrity_check(request):
    """Verify audit log integrity"""
    try:
        table_name = request.GET.get('table', 'audit_logs_enhanced')
        result = ForensicAuditLogger.verify_audit_integrity(table_name)
        
        return JsonResponse({
            'status': 'success',
            'data': result
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def data_access_report(request):
    """Get data access report for compliance"""
    try:
        data_subject_id = request.GET.get('data_subject_id')
        data_type = request.GET.get('data_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        
        query = "SELECT * FROM data_access_logs WHERE 1=1"
        params = []
        
        if data_subject_id:
            query += " AND data_subject_id = %s"
            params.append(data_subject_id)
        
        if data_type:
            query += " AND data_type = %s"
            params.append(data_type)
        
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
                'access_logs': logs,
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
def admin_actions_report(request):
    """Get admin actions report"""
    try:
        admin_id = request.GET.get('admin_id')
        risk_level = request.GET.get('risk_level')
        action_type = request.GET.get('action_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        
        query = "SELECT * FROM admin_actions_log WHERE 1=1"
        params = []
        
        if admin_id:
            query += " AND admin_id = %s"
            params.append(admin_id)
        
        if risk_level:
            query += " AND risk_level = %s"
            params.append(risk_level)
        
        if action_type:
            query += " AND action_type = %s"
            params.append(action_type)
        
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
                'admin_actions': logs,
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
def policy_changes_report(request):
    """Get policy changes report"""
    try:
        changed_by = request.GET.get('changed_by')
        policy_type = request.GET.get('policy_type')
        change_type = request.GET.get('change_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        
        query = "SELECT * FROM policy_changes_log WHERE 1=1"
        params = []
        
        if changed_by:
            query += " AND changed_by = %s"
            params.append(changed_by)
        
        if policy_type:
            query += " AND policy_type = %s"
            params.append(policy_type)
        
        if change_type:
            query += " AND change_type = %s"
            params.append(change_type)
        
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
            
            # Format timestamps and JSON fields
            for log in logs:
                if log['timestamp']:
                    log['timestamp'] = log['timestamp'].isoformat()
                if log['old_value']:
                    log['old_value'] = json.loads(log['old_value'])
                if log['new_value']:
                    log['new_value'] = json.loads(log['new_value'])
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'policy_changes': logs,
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
def data_exports_report(request):
    """Get data exports report"""
    try:
        exported_by = request.GET.get('exported_by')
        export_type = request.GET.get('export_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        
        query = "SELECT * FROM data_exports_log WHERE 1=1"
        params = []
        
        if exported_by:
            query += " AND exported_by = %s"
            params.append(exported_by)
        
        if export_type:
            query += " AND export_type = %s"
            params.append(export_type)
        
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
            
            # Format timestamps and JSON fields
            for log in logs:
                if log['timestamp']:
                    log['timestamp'] = log['timestamp'].isoformat()
                if log['data_types']:
                    log['data_types'] = json.loads(log['data_types'])
                if log['filters']:
                    log['filters'] = json.loads(log['filters'])
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'data_exports': logs,
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
def incident_response_report(request):
    """Get incident response report"""
    try:
        incident_id = request.GET.get('incident_id')
        responder_id = request.GET.get('responder_id')
        action_type = request.GET.get('action_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        
        query = "SELECT * FROM incident_response_log WHERE 1=1"
        params = []
        
        if incident_id:
            query += " AND incident_id = %s"
            params.append(incident_id)
        
        if responder_id:
            query += " AND responder_id = %s"
            params.append(responder_id)
        
        if action_type:
            query += " AND action_type = %s"
            params.append(action_type)
        
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
            
            # Format timestamps and JSON fields
            for log in logs:
                if log['timestamp']:
                    log['timestamp'] = log['timestamp'].isoformat()
                if log['evidence']:
                    log['evidence'] = json.loads(log['evidence'])
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'incident_responses': logs,
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
def audit_dashboard_stats(request):
    """Get comprehensive audit dashboard statistics"""
    try:
        with connection.cursor() as cursor:
            # Get activity counts by type (last 7 days)
            cursor.execute("""
                SELECT actor_type, COUNT(*) as count
                FROM audit_logs_enhanced 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY actor_type
            """)
            activity_by_type = dict(cursor.fetchall())
            
            # Get top actions (last 7 days)
            cursor.execute("""
                SELECT action, COUNT(*) as count
                FROM audit_logs_enhanced 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY action
                ORDER BY count DESC
                LIMIT 10
            """)
            top_actions = [{'action': row[0], 'count': row[1]} for row in cursor.fetchall()]
            
            # Get high-risk admin actions (last 30 days)
            cursor.execute("""
                SELECT COUNT(*) FROM admin_actions_log 
                WHERE risk_level IN ('high', 'critical') 
                AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            """)
            high_risk_actions = cursor.fetchone()[0]
            
            # Get data export count (last 30 days)
            cursor.execute("""
                SELECT COUNT(*) FROM data_exports_log 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            """)
            data_exports_count = cursor.fetchone()[0]
            
            # Get policy changes (last 30 days)
            cursor.execute("""
                SELECT COUNT(*) FROM policy_changes_log 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            """)
            policy_changes_count = cursor.fetchone()[0]
            
            # Get active incidents
            cursor.execute("""
                SELECT COUNT(DISTINCT incident_id) FROM incident_response_log 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            """)
            active_incidents = cursor.fetchone()[0]
            
            # Get daily activity trend (last 30 days)
            cursor.execute("""
                SELECT DATE(timestamp) as date, COUNT(*) as count
                FROM audit_logs_enhanced 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY DATE(timestamp)
                ORDER BY date DESC
            """)
            daily_activity = [{'date': row[0].isoformat(), 'count': row[1]} for row in cursor.fetchall()]
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'activity_by_type': activity_by_type,
                'top_actions': top_actions,
                'high_risk_actions': high_risk_actions,
                'data_exports_count': data_exports_count,
                'policy_changes_count': policy_changes_count,
                'active_incidents': active_incidents,
                'daily_activity': daily_activity
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)