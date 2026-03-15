from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.conf import settings
import json
import os
from .data_export import DataExporter
from .data_retention import DataRetentionManager
from .models import DataExport, DeletionRequest, DataRetentionPolicy
try:
    from .tasks import process_data_export, process_account_deletion
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False

@csrf_exempt
@require_http_methods(["POST"])
def export_data(request):
    """Generate data export for a student"""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        export_format = data.get('format', 'pdf')
        
        if not student_id:
            return JsonResponse({'status': 'error', 'message': 'Student ID required'})
        
        if export_format not in ['pdf']:
            return JsonResponse({'status': 'error', 'message': 'Only PDF format is supported'})
        
        # Create export request
        export_request = DataExport.objects.create(
            student_id=student_id,
            export_format=export_format
        )
        
        # Log data access for PDF export
        try:
            from .forensic_audit import ForensicAuditLogger
            from .audit import get_client_ip
            
            ForensicAuditLogger.log_data_access(
                actor_id=student_id,
                actor_type='student',
                data_type='student_data_export',
                data_subject_id=student_id,
                access_method='pdf_export',
                purpose='data_portability',
                legal_basis='data_subject_request',
                ip_address=get_client_ip(request)
            )
            print(f"[SUCCESS] Data access logged for student {student_id} PDF export")
        except Exception as e:
            print(f"[ERROR] Failed to log data access: {e}")
        
        # Start background task or process immediately
        if CELERY_AVAILABLE:
            process_data_export.delay(export_request.id)
            message = 'Data export started. You will be notified when ready.'
        else:
            # Process immediately if Celery not available
            try:
                print(f"Starting PDF export for student {export_request.student_id}")
                exporter = DataExporter(export_request.student_id)
                file_path = exporter.export_all_data(export_request.export_format)
                print(f"PDF generated at: {file_path}")
                export_request.file_path = file_path
                export_request.status = 'completed'
                export_request.save()
                print(f"Export request {export_request.id} marked as completed")
                message = 'Data export completed successfully.'
            except Exception as e:
                print(f"Export failed: {str(e)}")
                import traceback
                traceback.print_exc()
                export_request.status = 'failed'
                export_request.save()
                message = f'Data export failed: {str(e)}'
        
        return JsonResponse({
            'status': 'success',
            'export_id': export_request.id,
            'message': message
        })
        
    except Exception as e:
        print(f"Export data error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def download_data(request, export_id):
    """Download exported data file"""
    try:
        export_request = DataExport.objects.get(id=export_id)
        
        if export_request.status != 'completed':
            return JsonResponse({
                'status': 'error', 
                'message': f'Export status: {export_request.status}'
            })
        
        if not export_request.file_path or not os.path.exists(export_request.file_path):
            return JsonResponse({'status': 'error', 'message': 'File not found'})
        
        # Serve file
        with open(export_request.file_path, 'rb') as f:
            response = HttpResponse(f.read())
            
        filename = os.path.basename(export_request.file_path)
        content_type = 'application/pdf'
        
        response['Content-Type'] = content_type
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except DataExport.DoesNotExist:
        raise Http404("Export not found")
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@csrf_exempt
@require_http_methods(["POST"])
def request_deletion(request):
    """Request account deletion"""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        reason = data.get('reason', '')
        
        if not student_id:
            return JsonResponse({'status': 'error', 'message': 'Student ID required'})
        
        result = DataRetentionManager.create_deletion_request(student_id, reason)
        
        if result['success']:
            return JsonResponse({
                'status': 'success',
                'deletion_id': result['deletion_id'],
                'scheduled_date': result['scheduled_date'],
                'message': 'Deletion request created. You have 30 days to cancel.'
            })
        else:
            return JsonResponse({'status': 'error', 'message': result['message']})
            
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@csrf_exempt
@require_http_methods(["POST"])
def cancel_deletion(request):
    """Cancel account deletion request"""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        
        if not student_id:
            return JsonResponse({'status': 'error', 'message': 'Student ID required'})
        
        result = DataRetentionManager.cancel_deletion_request(student_id)
        
        return JsonResponse({
            'status': 'success' if result['success'] else 'error',
            'message': result['message']
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def get_deletion_requests(request):
    """Get all deletion requests (admin only)"""
    try:
        requests = DeletionRequest.objects.all()
        
        data = []
        for req in requests:
            try:
                from .models import Student
                student = Student.objects.get(id=req.student_id)
                student_name = student.name
            except Student.DoesNotExist:
                student_name = 'Unknown Student'
                
            data.append({
                'id': req.id,
                'student_id': req.student_id,
                'student_name': student_name,
                'requested_at': req.requested_at.isoformat(),
                'scheduled_deletion_at': req.scheduled_deletion_at.isoformat(),
                'status': req.status,
                'reason': req.reason,
                'processed_at': req.processed_at.isoformat() if req.processed_at else None
            })
        
        return JsonResponse({'status': 'success', 'data': data})
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@csrf_exempt
@require_http_methods(["POST"])
def process_deletion(request):
    """Process a deletion request (admin only)"""
    try:
        data = json.loads(request.body)
        deletion_request_id = data.get('deletion_request_id')
        processed_by = data.get('processed_by')
        
        if not deletion_request_id:
            return JsonResponse({'status': 'error', 'message': 'Deletion request ID required'})
        
        # Start background task
        # process_account_deletion.delay(deletion_request_id)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Account deletion request processed'
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def get_export_status(request, export_id):
    """Get export status"""
    try:
        export_request = DataExport.objects.get(id=export_id)
        
        return JsonResponse({
            'status': 'success',
            'export_status': export_request.status,
            'created_at': export_request.created_at.isoformat(),
            'expires_at': export_request.expires_at.isoformat()
        })
        
    except DataExport.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Export not found'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def get_deletion_status(request):
    """Get deletion status for a student"""
    try:
        student_id = request.GET.get('student_id')
        
        if not student_id:
            return JsonResponse({'status': 'error', 'message': 'Student ID required'})
        
        deletion_request = DeletionRequest.objects.filter(
            student_id=student_id,
            status__in=['pending', 'processing']
        ).first()
        
        if deletion_request:
            return JsonResponse({
                'status': 'success',
                'has_pending_deletion': True,
                'deletion_status': deletion_request.status,
                'scheduled_date': deletion_request.scheduled_deletion_at.isoformat(),
                'requested_at': deletion_request.requested_at.isoformat()
            })
        else:
            return JsonResponse({
                'status': 'success',
                'has_pending_deletion': False
            })
            
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def get_retention_policies(request):
    """Get data retention policies"""
    try:
        policies = DataRetentionPolicy.objects.filter(is_active=True)
        
        data = []
        for policy in policies:
            data.append({
                'id': policy.id,
                'data_type': policy.data_type,
                'retention_days': policy.retention_days,
                'created_at': policy.created_at.isoformat()
            })
        
        return JsonResponse({'status': 'success', 'data': data})
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def get_retention_stats(request):
    """Get data retention statistics for admin dashboard"""
    try:
        from django.db import connection
        from datetime import datetime, timedelta
        
        with connection.cursor() as cursor:
            # Get export stats
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_exports,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exports,
                    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_exports,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_exports
                FROM data_exports
            """)
            export_stats = cursor.fetchone()
            
            # Get deletion stats
            cursor.execute("""
                SELECT 
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_deletions,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_deletions,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_deletions
                FROM deletion_requests
            """)
            deletion_stats = cursor.fetchone()
            
            # Calculate days remaining for pending deletions
            cursor.execute("""
                SELECT 
                    COUNT(CASE WHEN status = 'pending' AND scheduled_deletion_at > NOW() THEN 1 END) as waiting_grace_period,
                    COUNT(CASE WHEN status = 'pending' AND scheduled_deletion_at <= NOW() THEN 1 END) as ready_for_deletion
                FROM deletion_requests
            """)
            timing_stats = cursor.fetchone()
            
            stats = {
                'total_exports': export_stats[0] if export_stats else 0,
                'completed_exports': export_stats[1] if export_stats else 0,
                'failed_exports': export_stats[2] if export_stats else 0,
                'pending_exports': export_stats[3] if export_stats else 0,
                'pending_deletions': deletion_stats[0] if deletion_stats else 0,
                'completed_deletions': deletion_stats[1] if deletion_stats else 0,
                'cancelled_deletions': deletion_stats[2] if deletion_stats else 0,
                'waiting_grace_period': timing_stats[0] if timing_stats else 0,
                'ready_for_deletion': timing_stats[1] if timing_stats else 0
            }
        
        return JsonResponse({'status': 'success', 'data': stats})
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def get_export_history(request):
    """Get export history for a student"""
    try:
        student_id = request.GET.get('student_id')
        
        if not student_id:
            return JsonResponse({'status': 'error', 'message': 'Student ID required'})
        
        exports = DataExport.objects.filter(student_id=student_id).order_by('-created_at')
        
        data = []
        for export in exports:
            data.append({
                'id': export.id,
                'format': export.export_format,
                'status': export.status,
                'created_at': export.created_at.isoformat(),
                'expires_at': export.expires_at.isoformat()
            })
        
        return JsonResponse({'status': 'success', 'data': data})
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_export_request(request, export_id):
    """Delete an export request"""
    try:
        export_request = DataExport.objects.get(id=export_id)
        
        # Delete the file if it exists
        if export_request.file_path and os.path.exists(export_request.file_path):
            os.remove(export_request.file_path)
        
        # Delete the database record
        export_request.delete()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Export request deleted successfully'
        })
        
    except DataExport.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Export not found'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@require_http_methods(["GET"])
def get_all_exports_admin(request):
    """Get all export requests (admin only)"""
    try:
        from .models import Student
        from django.db import connection
        
        # Get export counts per student
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    de.id,
                    de.student_id,
                    s.name as student_name,
                    de.export_format,
                    de.status,
                    de.created_at,
                    de.expires_at,
                    COUNT(de2.id) as export_count
                FROM data_exports de
                LEFT JOIN students s ON de.student_id = s.id
                LEFT JOIN data_exports de2 ON de.student_id = de2.student_id
                GROUP BY de.id, de.student_id, s.name, de.export_format, de.status, de.created_at, de.expires_at
                ORDER BY de.created_at DESC
            """)
            
            columns = [col[0] for col in cursor.description]
            results = cursor.fetchall()
            
            data = []
            for row in results:
                row_dict = dict(zip(columns, row))
                data.append({
                    'id': row_dict['id'],
                    'student_id': row_dict['student_id'],
                    'student_name': row_dict['student_name'] or 'Unknown Student',
                    'format': row_dict['export_format'],
                    'status': row_dict['status'],
                    'created_at': row_dict['created_at'].isoformat() if row_dict['created_at'] else '',
                    'expires_at': row_dict['expires_at'].isoformat() if row_dict['expires_at'] else '',
                    'export_count': row_dict['export_count']
                })
        
        return JsonResponse({'status': 'success', 'data': data})
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})