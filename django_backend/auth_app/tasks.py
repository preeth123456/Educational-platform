from celery import shared_task
from django.utils import timezone
from .data_export import DataExporter
from .data_retention import DataRetentionManager
from .models import DataExport, DeletionRequest
import logging

logger = logging.getLogger(__name__)

@shared_task
def process_data_export(export_id):
    """Background task for data export"""
    try:
        export_request = DataExport.objects.get(id=export_id)
        export_request.status = 'processing'
        export_request.save()
        
        exporter = DataExporter(export_request.student_id)
        file_path = exporter.export_all_data(export_request.export_format)
        
        export_request.file_path = file_path
        export_request.status = 'completed'
        export_request.save()
        
        logger.info(f"Data export completed for student {export_request.student_id}")
        return {'success': True, 'file_path': file_path}
        
    except DataExport.DoesNotExist:
        logger.error(f"Export request {export_id} not found")
        return {'success': False, 'error': 'Export request not found'}
    except Exception as e:
        logger.error(f"Data export failed for request {export_id}: {str(e)}")
        try:
            export_request = DataExport.objects.get(id=export_id)
            export_request.status = 'failed'
            export_request.save()
        except:
            pass
        return {'success': False, 'error': str(e)}

@shared_task
def process_account_deletion(deletion_request_id):
    """Background task for account deletion"""
    try:
        result = DataRetentionManager.process_account_deletion(deletion_request_id)
        
        if result['success']:
            logger.info(f"Account deletion completed for request {deletion_request_id}")
        else:
            logger.error(f"Account deletion failed for request {deletion_request_id}: {result['message']}")
        
        return result
        
    except Exception as e:
        logger.error(f"Account deletion task failed for request {deletion_request_id}: {str(e)}")
        return {'success': False, 'error': str(e)}

@shared_task
def cleanup_old_data():
    """Scheduled task for data retention cleanup"""
    try:
        results = DataRetentionManager.cleanup_old_data()
        logger.info(f"Data cleanup completed: {results}")
        return {'success': True, 'results': results}
        
    except Exception as e:
        logger.error(f"Data cleanup failed: {str(e)}")
        return {'success': False, 'error': str(e)}

@shared_task
def process_pending_deletions():
    """Process all pending deletion requests that are due"""
    try:
        pending_deletions = DataRetentionManager.get_pending_deletions()
        processed_count = 0
        
        for deletion_request in pending_deletions:
            result = DataRetentionManager.process_account_deletion(deletion_request.id)
            if result['success']:
                processed_count += 1
            else:
                logger.error(f"Failed to process deletion request {deletion_request.id}: {result['message']}")
        
        logger.info(f"Processed {processed_count} pending deletion requests")
        return {'success': True, 'processed_count': processed_count}
        
    except Exception as e:
        logger.error(f"Failed to process pending deletions: {str(e)}")
        return {'success': False, 'error': str(e)}

@shared_task
def cleanup_expired_exports():
    """Clean up expired data export files"""
    try:
        import os
        from django.conf import settings
        
        expired_exports = DataExport.objects.filter(
            expires_at__lt=timezone.now(),
            status='completed'
        )
        
        cleaned_count = 0
        for export in expired_exports:
            if export.file_path and os.path.exists(export.file_path):
                try:
                    os.remove(export.file_path)
                    cleaned_count += 1
                except OSError:
                    pass
            export.delete()
        
        logger.info(f"Cleaned up {cleaned_count} expired export files")
        return {'success': True, 'cleaned_count': cleaned_count}
        
    except Exception as e:
        logger.error(f"Failed to cleanup expired exports: {str(e)}")
        return {'success': False, 'error': str(e)}