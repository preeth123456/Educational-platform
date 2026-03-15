from django.db import connection, transaction
from django.utils import timezone
import json
import hashlib
import logging
import uuid
from typing import Dict, Any, Optional, List

logger = logging.getLogger(__name__)

class ForensicAuditLogger:
    """Forensic-grade audit logging system with immutability and tamper detection"""
    
    @staticmethod
    def _generate_hash_chain(table_name: str, record_data: Dict[str, Any]) -> str:
        """Generate hash chain for tamper detection"""
        try:
            with connection.cursor() as cursor:
                # Get the last hash from the chain
                cursor.execute(
                    "SELECT hash_chain FROM audit_logs_enhanced ORDER BY id DESC LIMIT 1"
                )
                result = cursor.fetchone()
                previous_hash = result[0] if result else "genesis"
                
                # Create new hash with consistent data
                data_for_hash = {
                    'actor_id': record_data['actor_id'],
                    'actor_type': record_data['actor_type'],
                    'action': record_data['action'],
                    'target_type': record_data['target_type'],
                    'target_id': record_data.get('target_id'),
                    'ip_address': record_data['ip_address']
                }
                data_string = json.dumps(data_for_hash, sort_keys=True)
                combined = f"{previous_hash}{data_string}"
                return hashlib.sha256(combined.encode()).hexdigest()
        except Exception as e:
            logger.error(f"Failed to generate hash chain: {e}")
            return hashlib.sha256(str(record_data).encode()).hexdigest()

    @staticmethod
    def log_comprehensive_activity(
        actor_id: int,
        actor_type: str,
        action: str,
        target_type: str,
        target_id: Optional[str] = None,
        before_state: Optional[Dict] = None,
        after_state: Optional[Dict] = None,
        metadata: Optional[Dict] = None,
        ip_address: str = None,
        user_agent: str = None,
        session_id: str = None,
        request_id: str = None
    ):
        """Log comprehensive activity with full forensic details"""
        try:
            record_data = {
                'actor_id': actor_id,
                'actor_type': actor_type,
                'action': action,
                'target_type': target_type,
                'target_id': target_id,
                'before_state': before_state,
                'after_state': after_state,
                'metadata': metadata or {},
                'ip_address': ip_address,
                'user_agent': user_agent,
                'session_id': session_id,
                'request_id': request_id or str(uuid.uuid4())
            }
            
            hash_chain = ForensicAuditLogger._generate_hash_chain('audit_logs_enhanced', record_data)
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO audit_logs_enhanced 
                    (actor_id, actor_type, action, target_type, target_id, before_state, 
                     after_state, metadata, ip_address, user_agent, session_id, request_id, hash_chain)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    actor_id, actor_type, action, target_type, target_id,
                    json.dumps(before_state) if before_state else None,
                    json.dumps(after_state) if after_state else None,
                    json.dumps(metadata or {}), ip_address, user_agent,
                    session_id, request_id, hash_chain
                ])
                
        except Exception as e:
            logger.error(f"Failed to log comprehensive activity: {e}")

    @staticmethod
    def log_data_access(
        actor_id: int,
        actor_type: str,
        data_type: str,
        data_subject_id: Optional[int] = None,
        access_method: str = 'api',
        purpose: str = 'business_operation',
        legal_basis: str = 'legitimate_interest',
        ip_address: str = None
    ):
        """Log data access for GDPR compliance"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO data_access_logs 
                    (actor_id, actor_type, data_type, data_subject_id, access_method, 
                     purpose, legal_basis, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    actor_id, actor_type, data_type, data_subject_id,
                    access_method, purpose, legal_basis, ip_address
                ])
        except Exception as e:
            logger.error(f"Failed to log data access: {e}")

    @staticmethod
    def log_admin_action(
        admin_id: int,
        action_type: str,
        description: str,
        target_type: Optional[str] = None,
        target_id: Optional[str] = None,
        risk_level: str = 'low',
        approval_required: bool = False,
        approved_by: Optional[int] = None,
        ip_address: str = None
    ):
        """Log administrative actions"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO admin_actions_log 
                    (admin_id, action_type, target_type, target_id, description, 
                     risk_level, approval_required, approved_by, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    admin_id, action_type, target_type, target_id, description,
                    risk_level, approval_required, approved_by, ip_address
                ])
        except Exception as e:
            logger.error(f"Failed to log admin action: {e}")

    @staticmethod
    def log_login_event(
        user_id: int,
        user_type: str,
        login_status: str,
        ip_address: str = None,
        user_agent: str = None,
        metadata: Optional[Dict] = None
    ):
        """Log login events for Login Events Today section"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO login_events_log 
                    (user_id, user_type, login_status, ip_address, user_agent, metadata)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, [
                    user_id, user_type, login_status, ip_address, user_agent,
                    json.dumps(metadata or {})
                ])
        except Exception as e:
            logger.error(f"Failed to log login event: {e}")

    @staticmethod
    def log_policy_change(
        changed_by: int,
        policy_type: str,
        policy_name: str,
        change_type: str,
        old_value: Optional[Dict] = None,
        new_value: Optional[Dict] = None,
        reason: Optional[str] = None,
        ip_address: str = None
    ):
        """Log policy and role changes"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO policy_changes_log 
                    (changed_by, policy_type, policy_name, change_type, old_value, 
                     new_value, reason, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    changed_by, policy_type, policy_name, change_type,
                    json.dumps(old_value) if old_value else None,
                    json.dumps(new_value) if new_value else None,
                    reason, ip_address
                ])
        except Exception as e:
            logger.error(f"Failed to log policy change: {e}")

    @staticmethod
    def log_data_export(
        exported_by: int,
        export_type: str,
        data_types: List[str],
        purpose: str,
        filters: Optional[Dict] = None,
        record_count: Optional[int] = None,
        file_hash: Optional[str] = None,
        retention_period: Optional[int] = None,
        ip_address: str = None
    ):
        """Log data exports"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO data_exports_log 
                    (exported_by, export_type, data_types, filters, record_count, 
                     file_hash, retention_period, purpose, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    exported_by, export_type, json.dumps(data_types),
                    json.dumps(filters) if filters else None,
                    record_count, file_hash, retention_period, purpose, ip_address
                ])
        except Exception as e:
            logger.error(f"Failed to log data export: {e}")

    @staticmethod
    def log_incident_response(
        incident_id: str,
        responder_id: int,
        action_type: str,
        description: str,
        evidence: Optional[Dict] = None,
        impact_assessment: Optional[str] = None,
        ip_address: str = None
    ):
        """Log incident response actions"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO incident_response_log 
                    (incident_id, responder_id, action_type, description, 
                     evidence, impact_assessment, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, [
                    incident_id, responder_id, action_type, description,
                    json.dumps(evidence) if evidence else None,
                    impact_assessment, ip_address
                ])
        except Exception as e:
            logger.error(f"Failed to log incident response: {e}")

    @staticmethod
    def verify_audit_integrity(table_name: str = 'audit_logs_enhanced') -> Dict[str, Any]:
        """Verify audit log integrity using hash chains"""
        try:
            with connection.cursor() as cursor:
                # Get all records in chronological order
                cursor.execute(f"""
                    SELECT id, actor_id, actor_type, action, target_type, target_id,
                           ip_address, hash_chain
                    FROM {table_name} ORDER BY id
                """)
                
                records = cursor.fetchall()
                if not records:
                    return {'status': 'valid', 'message': 'No records to verify'}
                
                previous_hash = "genesis"
                tampered_records = []
                
                for record in records:
                    # Create consistent data for hash verification
                    data_for_hash = {
                        'actor_id': record[1],
                        'actor_type': record[2],
                        'action': record[3],
                        'target_type': record[4],
                        'target_id': record[5],
                        'ip_address': record[6]
                    }
                    
                    # Calculate expected hash
                    data_string = json.dumps(data_for_hash, sort_keys=True)
                    combined = f"{previous_hash}{data_string}"
                    expected_hash = hashlib.sha256(combined.encode()).hexdigest()
                    
                    if expected_hash != record[7]:
                        tampered_records.append({
                            'id': record[0],
                            'expected_hash': expected_hash,
                            'actual_hash': record[7]
                        })
                    
                    previous_hash = record[7]
                
                if tampered_records:
                    return {
                        'status': 'tampered',
                        'message': f'Found {len(tampered_records)} tampered records',
                        'tampered_records': tampered_records
                    }
                else:
                    return {'status': 'valid', 'message': 'All records verified successfully'}
                    
        except Exception as e:
            logger.error(f"Failed to verify audit integrity: {e}")
            return {'status': 'error', 'message': str(e)}

    @staticmethod
    def get_forensic_timeline(
        start_date: str = None,
        end_date: str = None,
        actor_id: int = None,
        incident_id: str = None,
        limit: int = 1000
    ) -> List[Dict]:
        """Get comprehensive forensic timeline"""
        try:
            conditions = ["1=1"]
            params = []
            
            if start_date:
                conditions.append("timestamp >= %s")
                params.append(start_date)
            
            if end_date:
                conditions.append("timestamp <= %s")
                params.append(end_date)
            
            if actor_id:
                conditions.append("actor_id = %s")
                params.append(actor_id)
            
            where_clause = " AND ".join(conditions)
            
            with connection.cursor() as cursor:
                # Get comprehensive timeline from all audit tables
                cursor.execute(f"""
                    SELECT 'audit' as source, actor_id, actor_type, action as event_type,
                           target_type, target_id, metadata, ip_address, timestamp
                    FROM audit_logs_enhanced 
                    WHERE {where_clause}
                    
                    UNION ALL
                    
                    SELECT 'data_access' as source, actor_id, actor_type, 
                           CONCAT(access_method, '_', data_type) as event_type,
                           data_type as target_type, data_subject_id as target_id,
                           JSON_OBJECT('purpose', purpose, 'legal_basis', legal_basis) as metadata,
                           ip_address, timestamp
                    FROM data_access_logs 
                    WHERE {where_clause.replace('actor_id', 'actor_id')}
                    
                    UNION ALL
                    
                    SELECT 'admin_action' as source, admin_id as actor_id, 'admin' as actor_type,
                           action_type as event_type, target_type, target_id,
                           JSON_OBJECT('description', description, 'risk_level', risk_level) as metadata,
                           ip_address, timestamp
                    FROM admin_actions_log 
                    WHERE {where_clause.replace('actor_id', 'admin_id')}
                    
                    ORDER BY timestamp DESC
                    LIMIT %s
                """, params + params + params + [limit])
                
                columns = [col[0] for col in cursor.description]
                return [dict(zip(columns, row)) for row in cursor.fetchall()]
                
        except Exception as e:
            logger.error(f"Failed to get forensic timeline: {e}")
            return []

# Decorators for automatic logging
def log_data_modification(target_type: str):
    """Decorator to automatically log data modifications"""
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            # Capture before state if possible
            before_state = None
            target_id = kwargs.get('id') or kwargs.get('pk')
            
            if target_id and hasattr(request, 'method') and request.method in ['PUT', 'PATCH', 'DELETE']:
                # Try to get current state before modification
                try:
                    # This would need to be customized based on your models
                    pass
                except:
                    pass
            
            result = func(request, *args, **kwargs)
            
            # Log the activity
            if hasattr(request, 'user_id'):
                ForensicAuditLogger.log_comprehensive_activity(
                    actor_id=request.user_id,
                    actor_type=getattr(request, 'user_type', 'unknown'),
                    action=f"{request.method.lower()}_{target_type}",
                    target_type=target_type,
                    target_id=str(target_id) if target_id else None,
                    before_state=before_state,
                    metadata={'method': request.method, 'path': request.path},
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    session_id=request.session.session_key if hasattr(request, 'session') else None
                )
            
            return result
        return wrapper
    return decorator

def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip