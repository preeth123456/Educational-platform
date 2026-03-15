from .context_models import UserContext, ActiveUserContext, ContextSwitchLog
from .models import Student, Educator
from django.db import transaction
import json

class ContextService:
    
    @staticmethod
    def get_user_contexts(user_id, user_type):
        """Get available contexts for a user"""
        contexts = UserContext.objects.filter(
            user_id=user_id, 
            user_type=user_type, 
            is_active=True
        ).values('id', 'context_type', 'context_id', 'context_name', 'permissions')
        
        return list(contexts)
    
    @staticmethod
    def get_current_context(user_id, user_type):
        """Get user's current active context"""
        try:
            active_context = ActiveUserContext.objects.select_related('current_context').get(
                user_id=user_id, user_type=user_type
            )
            return {
                'id': active_context.current_context.id,
                'context_type': active_context.current_context.context_type,
                'context_id': active_context.current_context.context_id,
                'context_name': active_context.current_context.context_name,
                'permissions': active_context.current_context.permissions,
                'switched_at': active_context.switched_at.isoformat()
            }
        except ActiveUserContext.DoesNotExist:
            return None
    
    @staticmethod
    @transaction.atomic
    def switch_context(user_id, user_type, context_id, session_token=None, ip_address=None, user_agent=None):
        """Switch user to new context"""
        try:
            # Validate context exists and user has access
            new_context = UserContext.objects.get(
                id=context_id, 
                user_id=user_id, 
                user_type=user_type, 
                is_active=True
            )
            
            # Get current context for logging
            current_context = ContextService.get_current_context(user_id, user_type)
            from_context_id = current_context['context_id'] if current_context else None
            
            # Update or create active context with session token
            active_context, created = ActiveUserContext.objects.update_or_create(
                user_id=user_id,
                user_type=user_type,
                defaults={
                    'current_context': new_context,
                    'session_token': session_token or ''
                }
            )
            
            # Update user_sessions table if session_token provided
            if session_token:
                from session_management.models import UserSession
                try:
                    user_session = UserSession.objects.get(session_token=session_token)
                    user_session.current_context_id = new_context.id
                    user_session.save()
                except UserSession.DoesNotExist:
                    pass
            
            # Log the switch
            ContextSwitchLog.objects.create(
                user_id=user_id,
                user_type=user_type,
                from_context_id=from_context_id or '',
                to_context_id=new_context.context_id,
                ip_address=ip_address,
                user_agent=user_agent,
                success=True
            )
            
            return True, "Context switched successfully"
            
        except UserContext.DoesNotExist:
            # Log failed attempt
            ContextSwitchLog.objects.create(
                user_id=user_id,
                user_type=user_type,
                from_context_id='',
                to_context_id=str(context_id),
                ip_address=ip_address,
                user_agent=user_agent,
                success=False
            )
            return False, "Invalid context or access denied"
        except Exception as e:
            return False, str(e)
    
    @staticmethod
    def initialize_user_contexts(user_id, user_type):
        """Initialize default contexts for a user"""
        if user_type == 'admin':
            # Admin gets organization and role contexts
            contexts = [
                {
                    'context_type': 'organization',
                    'context_id': 'eduyata_main',
                    'context_name': 'EduYata Main',
                    'permissions': {'manage_teachers': True, 'manage_students': True, 'manage_courses': True}
                },
                {
                    'context_type': 'role',
                    'context_id': 'super_admin',
                    'context_name': 'Super Admin',
                    'permissions': {'full_access': True}
                }
            ]
        elif user_type == 'teacher':
            # Teacher gets course and class contexts
            try:
                teacher = Educator.objects.get(id=user_id)
                contexts = [
                    {
                        'context_type': 'role',
                        'context_id': 'teacher',
                        'context_name': 'Teacher',
                        'permissions': {'manage_classes': True, 'create_assignments': True}
                    }
                ]
                # Add course contexts based on teacher's subjects
                if teacher.subject_classes:
                    for subject, classes in teacher.subject_classes.items():
                        contexts.append({
                            'context_type': 'course',
                            'context_id': f"course_{subject.lower()}",
                            'context_name': f"{subject} Course",
                            'permissions': {'manage_course': True, 'grade_assignments': True}
                        })
            except:
                contexts = []
        else:
            # Student gets basic context
            contexts = [
                {
                    'context_type': 'role',
                    'context_id': 'student',
                    'context_name': 'Student',
                    'permissions': {'view_courses': True, 'submit_assignments': True}
                }
            ]
        
        # Create contexts
        for context_data in contexts:
            UserContext.objects.get_or_create(
                user_id=user_id,
                user_type=user_type,
                context_type=context_data['context_type'],
                context_id=context_data['context_id'],
                defaults={
                    'context_name': context_data['context_name'],
                    'permissions': context_data['permissions']
                }
            )
        
        # Set default active context with session token
        if contexts:
            default_context = UserContext.objects.filter(
                user_id=user_id, user_type=user_type
            ).first()
            if default_context:
                # Get session token from SessionManager if available
                session_token = ''
                try:
                    from session_management.models import UserSession
                    latest_session = UserSession.objects.filter(
                        user_id=user_id, user_type=user_type, is_active=True
                    ).order_by('-created_at').first()
                    if latest_session:
                        session_token = latest_session.session_token
                        # Update session with context
                        latest_session.current_context_id = default_context.id
                        latest_session.save()
                except:
                    pass
                
                ActiveUserContext.objects.get_or_create(
                    user_id=user_id,
                    user_type=user_type,
                    defaults={
                        'current_context': default_context,
                        'session_token': session_token
                    }
                )