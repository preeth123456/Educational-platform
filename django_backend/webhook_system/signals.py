"""
Webhook Event Signals - Phase 4

Connections:
- Feature 1: Monitors Feature 1 models (Student, Course, Enrollment, etc.)
- Feature 2: No direct connection (independent functionality)
- Phase 1: Deliveries logged in admin_notifications (Phase 1 extended table)
- Phase 2: Uses WebhookEndpoint model
- Phase 3: Calls webhook_service.trigger_event()

Event Triggers:
1. student.enrolled - When student enrolls in course
2. student.course_completed - When student completes course
3. classroom.session_started - When classroom session goes live
4. classroom.session_completed - When classroom session ends
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .services import webhook_service
import logging

logger = logging.getLogger(__name__)

# Import Feature 1 models
try:
    from auth_app.models import Student, Enrollment
    from virtual_classrooms.models import ClassroomSession
    MODELS_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Could not import models for webhook signals: {e}")
    MODELS_AVAILABLE = False


if MODELS_AVAILABLE:
    
    # ============================================================================
    # EVENT 1: STUDENT ENROLLED
    # ============================================================================
    @receiver(post_save, sender=Enrollment)
    def student_enrollment_webhook(sender, instance, created, **kwargs):
        """
        Trigger webhook when student enrolls in a course
        
        Connection to Feature 1:
        - Monitors Enrollment model (Feature 1 table: student_enrollments)
        - Triggered automatically when new enrollment created
        
        Connection to Phase 3:
        - Calls webhook_service.trigger_event() (Phase 3 service)
        
        Connection to Feature 4 (Phase 6):
        - Also triggers integration handlers (Zoom, Slack)
        """
        if created:
            try:
                event_data = {
                    'student_id': instance.student.student_id if hasattr(instance.student, 'student_id') else instance.student.id,
                    'student_name': instance.student.name if hasattr(instance.student, 'name') else str(instance.student),
                    'course_id': instance.course.course_id if hasattr(instance.course, 'course_id') else instance.course.id,
                    'course_title': instance.course.title if hasattr(instance.course, 'title') else str(instance.course),
                    'enrollment_date': instance.enrollment_date.isoformat(),
                    'status': instance.status
                }
                
                # Feature 3: Trigger webhooks
                webhook_service.trigger_event('student.enrolled', event_data)
                logger.info(f"Triggered webhook: student.enrolled for enrollment {instance.id}")
                
                # Feature 4 Phase 6: Trigger integration handlers
                try:
                    from integration_marketplace.services import integration_service
                    from integration_marketplace.models import Integration
                    
                    active_integrations = Integration.objects.filter(status='active')
                    for integration in active_integrations:
                        integration_service.handle_webhook_event(
                            integration.id, 'student.enrolled', event_data
                        )
                except Exception as e:
                    logger.error(f"Error triggering integration handlers: {e}")
                
            except Exception as e:
                logger.error(f"Error triggering student.enrolled webhook: {e}")
    
    
    # ============================================================================
    # EVENT 2: STUDENT COURSE COMPLETED
    # ============================================================================
    @receiver(pre_save, sender=Enrollment)
    def student_course_completion_webhook(sender, instance, **kwargs):
        """
        Trigger webhook when student completes a course
        
        Connection to Feature 1:
        - Monitors Enrollment model status changes
        - Triggered when status changes to 'completed'
        
        Connection to Phase 3:
        - Calls webhook_service.trigger_event() (Phase 3 service)
        """
        if instance.pk:  # Only for existing records
            try:
                old_instance = Enrollment.objects.get(pk=instance.pk)
                
                # Check if status changed to completed
                if old_instance.status != 'completed' and instance.status == 'completed':
                    event_data = {
                        'student_id': instance.student.student_id if hasattr(instance.student, 'student_id') else instance.student.id,
                        'student_name': instance.student.name if hasattr(instance.student, 'name') else str(instance.student),
                        'course_id': instance.course.course_id if hasattr(instance.course, 'course_id') else instance.course.id,
                        'course_title': instance.course.title if hasattr(instance.course, 'title') else str(instance.course),
                        'enrollment_date': instance.enrollment_date.isoformat(),
                        'completion_date': instance.enrollment_date.isoformat()  # Using enrollment_date as proxy
                    }
                    
                    webhook_service.trigger_event('student.course_completed', event_data)
                    logger.info(f"Triggered webhook: student.course_completed for enrollment {instance.id}")
                    
            except Enrollment.DoesNotExist:
                pass
            except Exception as e:
                logger.error(f"Error triggering student.course_completed webhook: {e}")
    
    
    # ============================================================================
    # EVENT 3: CLASSROOM SESSION STARTED
    # ============================================================================
    @receiver(pre_save, sender=ClassroomSession)
    def classroom_session_started_webhook(sender, instance, **kwargs):
        """
        Trigger webhook when classroom session starts (status changes to 'live')
        
        Connection to Feature 1:
        - Monitors ClassroomSession model (Feature 1 table: classroom_sessions)
        - Triggered when status changes to 'live'
        
        Connection to Phase 3:
        - Calls webhook_service.trigger_event() (Phase 3 service)
        
        Connection to Feature 4 (Phase 6):
        - Also triggers integration handlers (Zoom auto-creates meetings)
        """
        if instance.pk:  # Only for existing records
            try:
                old_instance = ClassroomSession.objects.get(pk=instance.pk)
                
                # Check if status changed to live
                if old_instance.status != 'live' and instance.status == 'live':
                    event_data = {
                        'session_id': instance.id,
                        'classroom_id': instance.classroom.classroom_id if hasattr(instance.classroom, 'classroom_id') else instance.classroom.id,
                        'title': instance.title,
                        'description': instance.description,
                        'scheduled_date': instance.scheduled_date.isoformat(),
                        'duration_minutes': instance.duration_minutes
                    }
                    
                    # Feature 3: Trigger webhooks
                    webhook_service.trigger_event('classroom.session_started', event_data)
                    logger.info(f"Triggered webhook: classroom.session_started for session {instance.id}")
                    
                    # Feature 4 Phase 6: Trigger integration handlers (Zoom creates meeting)
                    try:
                        from integration_marketplace.services import integration_service
                        from integration_marketplace.models import Integration
                        
                        active_integrations = Integration.objects.filter(status='active')
                        for integration in active_integrations:
                            integration_service.handle_webhook_event(
                                integration.id, 'classroom.session_started', event_data
                            )
                    except Exception as e:
                        logger.error(f"Error triggering integration handlers: {e}")
                    
            except ClassroomSession.DoesNotExist:
                pass
            except Exception as e:
                logger.error(f"Error triggering classroom.session_started webhook: {e}")
    
    
    # ============================================================================
    # EVENT 4: CLASSROOM SESSION COMPLETED
    # ============================================================================
    @receiver(pre_save, sender=ClassroomSession)
    def classroom_session_completed_webhook(sender, instance, **kwargs):
        """
        Trigger webhook when classroom session completes
        
        Connection to Feature 1:
        - Monitors ClassroomSession model status changes
        - Triggered when status changes to 'completed'
        
        Connection to Phase 3:
        - Calls webhook_service.trigger_event() (Phase 3 service)
        """
        if instance.pk:  # Only for existing records
            try:
                old_instance = ClassroomSession.objects.get(pk=instance.pk)
                
                # Check if status changed to completed
                if old_instance.status != 'completed' and instance.status == 'completed':
                    event_data = {
                        'session_id': instance.id,
                        'classroom_id': instance.classroom.classroom_id if hasattr(instance.classroom, 'classroom_id') else instance.classroom.id,
                        'title': instance.title,
                        'scheduled_date': instance.scheduled_date.isoformat(),
                        'duration_minutes': instance.duration_minutes,
                        'status': 'completed'
                    }
                    
                    webhook_service.trigger_event('classroom.session_completed', event_data)
                    logger.info(f"Triggered webhook: classroom.session_completed for session {instance.id}")
                    
            except ClassroomSession.DoesNotExist:
                pass
            except Exception as e:
                logger.error(f"Error triggering classroom.session_completed webhook: {e}")

else:
    logger.warning("Webhook signals not registered - models not available")
