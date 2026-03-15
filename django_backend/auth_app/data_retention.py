import json
import uuid
from datetime import datetime, timedelta
from django.db import connection, transaction
from django.utils import timezone
from .models import Student
from .models import DataRetentionPolicy, DeletionRequest, AnonymizedData

class DataRetentionManager:
    """Handle data retention and deletion operations"""
    
    @staticmethod
    def create_deletion_request(student_id, reason=""):
        """Create a new deletion request with 30-day grace period"""
        try:
            student = Student.objects.get(id=student_id)
            
            # Check if there's already a pending request
            existing = DeletionRequest.objects.filter(
                student_id=student_id, 
                status='pending'
            ).first()
            
            if existing:
                return {'success': False, 'message': 'Deletion request already exists'}
            
            deletion_request = DeletionRequest.objects.create(
                student_id=student_id,
                reason=reason,
                scheduled_deletion_at=timezone.now() + timedelta(days=30)
            )
            
            return {
                'success': True, 
                'deletion_id': deletion_request.id,
                'scheduled_date': deletion_request.scheduled_deletion_at.isoformat()
            }
            
        except Student.DoesNotExist:
            return {'success': False, 'message': 'Student not found'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    @staticmethod
    def cancel_deletion_request(student_id):
        """Cancel a pending deletion request"""
        try:
            deletion_request = DeletionRequest.objects.filter(
                student_id=student_id,
                status='pending'
            ).first()
            
            if not deletion_request:
                return {'success': False, 'message': 'No pending deletion request found'}
            
            deletion_request.status = 'cancelled'
            deletion_request.processed_at = timezone.now()
            deletion_request.save()
            
            return {'success': True, 'message': 'Deletion request cancelled'}
            
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    @staticmethod
    def process_account_deletion(deletion_request_id, processed_by=None):
        """Process account deletion and anonymize data"""
        try:
            with transaction.atomic():
                deletion_request = DeletionRequest.objects.get(id=deletion_request_id)
                student = Student.objects.get(id=deletion_request.student_id)
                
                # Update deletion request status
                deletion_request.status = 'processing'
                deletion_request.processed_by = processed_by
                deletion_request.processed_at = timezone.now()
                deletion_request.save()
                
                # Anonymize data before deletion
                anonymized_data = DataRetentionManager._anonymize_student_data(student)
                
                # Delete student data
                DataRetentionManager._delete_student_data(student.id)
                
                # Mark as completed
                deletion_request.status = 'completed'
                deletion_request.save()
                
                return {
                    'success': True, 
                    'message': 'Account deleted successfully',
                    'anonymized_id': anonymized_data.anonymized_id
                }
                
        except DeletionRequest.DoesNotExist:
            return {'success': False, 'message': 'Deletion request not found'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    @staticmethod
    def _anonymize_student_data(student):
        """Create anonymized version of student data for analytics"""
        # Collect data for anonymization
        anonymized_data = {
            'demographics': {
                'age_group': DataRetentionManager._get_age_group(student.date_of_birth),
                'gender': student.gender,
                'class_level': student.class_level,
                'board': student.board,
                'registration_year': student.created_at.year if student.created_at else None
            },
            'academic_performance': DataRetentionManager._get_academic_summary(student.id),
            'engagement_metrics': DataRetentionManager._get_engagement_metrics(student.id),
            'anonymized_at': timezone.now().isoformat()
        }
        
        # Create anonymized record
        anon_record = AnonymizedData.objects.create(
            original_student_id=student.id,
            data_snapshot=anonymized_data
        )
        
        return anon_record
    
    @staticmethod
    def _get_age_group(date_of_birth):
        """Convert date of birth to age group for anonymization"""
        if not date_of_birth:
            return 'unknown'
        
        age = (datetime.now().date() - date_of_birth).days // 365
        if age < 13:
            return 'under_13'
        elif age < 16:
            return '13_15'
        elif age < 18:
            return '16_17'
        else:
            return '18_plus'
    
    @staticmethod
    def _get_academic_summary(student_id):
        """Get anonymized academic performance summary"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    AVG(progress_percentage) as avg_progress,
                    COUNT(DISTINCT course_name) as courses_enrolled,
                    COUNT(CASE WHEN completed = 1 THEN 1 END) as lessons_completed
                FROM student_progress 
                WHERE student_id = %s
            """, [student_id])
            
            row = cursor.fetchone()
            if row:
                return {
                    'average_progress': float(row[0]) if row[0] else 0,
                    'courses_enrolled': int(row[1]) if row[1] else 0,
                    'lessons_completed': int(row[2]) if row[2] else 0
                }
            return {}
    
    @staticmethod
    def _get_engagement_metrics(student_id):
        """Get anonymized engagement metrics"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_activities,
                    COUNT(DISTINCT DATE(created_at)) as active_days,
                    MIN(created_at) as first_activity,
                    MAX(created_at) as last_activity
                FROM student_activities 
                WHERE student_id = %s
            """, [student_id])
            
            row = cursor.fetchone()
            if row:
                return {
                    'total_activities': int(row[0]) if row[0] else 0,
                    'active_days': int(row[1]) if row[1] else 0,
                    'engagement_duration_days': (row[3] - row[2]).days if row[2] and row[3] else 0
                }
            return {}
    
    @staticmethod
    def _delete_student_data(student_id):
        """Delete all student data from database"""
        tables_to_clean = [
            'student_progress',
            'quiz_results',
            'student_badges',
            'skill_endorsements',
            'student_activities',
            'student_enrollments',
            'user_preferences',
            'student_consent',
            'consent_history',
            'data_exports',
            'student_notifications'
        ]
        
        with connection.cursor() as cursor:
            for table in tables_to_clean:
                cursor.execute(f"DELETE FROM {table} WHERE student_id = %s", [student_id])
            
            # Finally delete the student record
            cursor.execute("DELETE FROM students WHERE id = %s", [student_id])
    
    @staticmethod
    def cleanup_old_data():
        """Clean up old data based on retention policies"""
        policies = DataRetentionPolicy.objects.filter(is_active=True)
        cleanup_results = []
        
        for policy in policies:
            cutoff_date = timezone.now() - timedelta(days=policy.retention_days)
            
            if policy.data_type == 'activity_logs':
                with connection.cursor() as cursor:
                    cursor.execute("""
                        DELETE FROM student_activities 
                        WHERE created_at < %s
                    """, [cutoff_date])
                    cleanup_results.append(f"Cleaned {cursor.rowcount} activity logs")
            
            elif policy.data_type == 'session_data':
                with connection.cursor() as cursor:
                    cursor.execute("""
                        DELETE FROM data_exports 
                        WHERE created_at < %s AND status = 'completed'
                    """, [cutoff_date])
                    cleanup_results.append(f"Cleaned {cursor.rowcount} old exports")
        
        return cleanup_results
    
    @staticmethod
    def get_pending_deletions():
        """Get all pending deletion requests"""
        return DeletionRequest.objects.filter(
            status='pending',
            scheduled_deletion_at__lte=timezone.now()
        )
    
    @staticmethod
    def get_retention_stats():
        """Get data retention statistics"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_students,
                    COUNT(CASE WHEN dr.id IS NOT NULL THEN 1 END) as pending_deletions,
                    COUNT(CASE WHEN ad.id IS NOT NULL THEN 1 END) as anonymized_records
                FROM students s
                LEFT JOIN deletion_requests dr ON s.id = dr.student_id AND dr.status = 'pending'
                LEFT JOIN anonymized_data ad ON s.id = ad.original_student_id
            """)
            
            row = cursor.fetchone()
            return {
                'total_students': row[0] if row else 0,
                'pending_deletions': row[1] if row else 0,
                'anonymized_records': row[2] if row else 0
            }