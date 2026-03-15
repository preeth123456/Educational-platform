# SECURITY CONFIG POLICIES FILE - Security rules management API
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ComplianceRule, ComplianceLog
from django.db.models import Count

@api_view(['GET', 'POST'])
def compliance_rules(request):
    if request.method == 'GET':
        rules = ComplianceRule.objects.filter(is_active=True)
        data = []
        for rule in rules:
            data.append({
                'id': rule.pk,
                'name': rule.name,
                'description': rule.description,
                'is_active': rule.is_active,
                'created_at': rule.created_at.isoformat() if rule.created_at else None
            })
        return Response(data)
    
    if request.method == 'POST':
        from django.db import connection
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO compliance_compliancerule (name, description, is_active, created_at) VALUES (%s, %s, %s, NOW())",
                    [request.data['name'], request.data['description'], True]
                )
                return Response({'id': cursor.lastrowid, 'message': 'Rule created'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

@api_view(['GET', 'POST'])
def compliance_rules_raw(request):
    from django.db import connection
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM compliance_rules WHERE is_active = 1 ORDER BY created_at DESC")
                columns = [col[0] for col in cursor.description]
                rules = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                # Format datetime fields
                for rule in rules:
                    if rule.get('created_at'):
                        rule['created_at'] = rule['created_at'].isoformat()
                
                return Response(rules)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    if request.method == 'POST':
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO compliance_rules (name, description, is_active, created_at) VALUES (%s, %s, %s, NOW())",
                    [request.data['name'], request.data['description'], True]
                )
                return Response({'id': cursor.lastrowid, 'message': 'Rule created'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def log_compliance(request):
    try:
        ComplianceLog.objects.create(
            rule_id=request.data['rule_id'],
            user_id=request.data['user_id'],
            user_type=request.data['user_type'],
            action=request.data['action'],
            ip_address=request.data.get('ip_address')
        )
        return Response({'message': 'Logged'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def compliance_incidents(request):
    from django.db import connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM compliance_incidents ORDER BY created_at DESC")
            columns = [col[0] for col in cursor.description]
            incidents = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Format datetime fields
            for incident in incidents:
                if incident.get('created_at'):
                    incident['created_at'] = incident['created_at'].isoformat()
                if incident.get('resolved_at'):
                    incident['resolved_at'] = incident['resolved_at'].isoformat()
            
            return Response(incidents)
    except Exception as e:
        return Response([])

@api_view(['GET'])
def audit_evidence(request):
    from django.db import connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM auditt_logs ORDER BY timestamp DESC LIMIT 50")
            columns = [col[0] for col in cursor.description]
            logs = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Format datetime fields
            for log in logs:
                if log.get('timestamp'):
                    log['timestamp'] = log['timestamp'].isoformat()
            
            return Response({'status': 'success', 'data': {'logs': logs}})
    except Exception as e:
        return Response({'status': 'error', 'data': {'logs': []}})

@api_view(['GET'])
def compliance_report(request):
    from django.db import connection
    rule_id = request.GET.get('rule_id')
    
    if not rule_id:
        return Response({'error': 'rule_id is required'}, status=400)
    
    try:
        with connection.cursor() as cursor:
            # Get total actions for this specific rule
            cursor.execute("SELECT COUNT(*) FROM compliance_compliancelog WHERE rule_id = %s", [rule_id])
            total_actions = cursor.fetchone()[0]
            
            # Get by user type for this specific rule
            cursor.execute("""
                SELECT user_type, COUNT(*) as count
                FROM compliance_compliancelog 
                WHERE rule_id = %s AND user_type != 'admin'
                GROUP BY user_type
            """, [rule_id])
            by_user_type = [{'user_type': row[0], 'count': row[1]} for row in cursor.fetchall()]
            
            # Get recent logs for this specific rule
            cursor.execute("""
                SELECT user_id, action, timestamp
                FROM compliance_compliancelog 
                WHERE rule_id = %s AND user_type != 'admin'
                ORDER BY timestamp DESC 
                LIMIT 20
            """, [rule_id])
            columns = [col[0] for col in cursor.description]
            recent_logs = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Format datetime fields
            for log in recent_logs:
                if log.get('timestamp'):
                    log['timestamp'] = log['timestamp'].isoformat()
            
            return Response({
                'total_actions': total_actions,
                'by_user_type': by_user_type,
                'recent_logs': recent_logs
            })
    except Exception as e:
        return Response({
            'total_actions': 0,
            'by_user_type': [],
            'recent_logs': []
        })


@api_view(['GET'])
def check_compliance(request):
    user_id = request.GET.get('user_id')
    rule_id = request.GET.get('rule_id')
    
    if not user_id or user_id == 'undefined' or not rule_id:
        return Response({'accepted': False, 'status': None})
    
    try:
        user_id = int(user_id)
        rule_id = int(rule_id)
    except (ValueError, TypeError):
        return Response({'accepted': False, 'status': None})
    
    log = ComplianceLog.objects.filter(user_id=user_id, rule_id=rule_id).order_by('-timestamp').first()
    
    if log:
        is_accepted = 'Accepted' in log.action
        status = 'Accepted' if is_accepted else 'Rejected'
        return Response({'accepted': is_accepted, 'status': status})
    return Response({'accepted': False, 'status': None})