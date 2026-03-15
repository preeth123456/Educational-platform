from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Student
import json

@api_view(['GET'])
def get_user_preferences(request):
    """Get user preferences for settings"""
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return Response({
                'status': 'error',
                'message': 'Student ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Get preferences from session/cache (simplified approach)
        # In a real app, this would be stored in database
        from django.core.cache import cache
        preferences_key = f'user_preferences_{student_id}'
        preferences = cache.get(preferences_key)
        
        if not preferences:
            preferences = {
                'email_notifications': True,
                'push_notifications': True,
                'assignment_reminders': True,
                'course_updates': True,
                'achievement_alerts': True,
                'theme': 'light',
                'language': 'en',
                'timezone': 'UTC',
                'dashboard_layout': 'detailed'
            }
            
        return Response({
            'status': 'success',
            'data': preferences
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def update_user_preferences(request):
    """Update user preferences"""
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.data
            
        student_id = data.get('student_id')
        if not student_id:
            return Response({
                'status': 'error',
                'message': 'Student ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Store preferences in cache (simplified approach)
        from django.core.cache import cache
        preferences_key = f'user_preferences_{student_id}'
        
        # Get existing preferences or create new ones
        preferences = cache.get(preferences_key, {
            'email_notifications': True,
            'push_notifications': True,
            'assignment_reminders': True,
            'course_updates': True,
            'achievement_alerts': True,
            'theme': 'light',
            'language': 'en',
            'timezone': 'UTC',
            'dashboard_layout': 'detailed'
        })
        
        # Update with new values
        preferences.update({
            k: v for k, v in data.items() 
            if k in ['email_notifications', 'push_notifications', 'assignment_reminders', 
                    'course_updates', 'achievement_alerts', 'theme', 'language', 
                    'timezone', 'dashboard_layout']
        })
        
        # Save to cache (expires in 30 days)
        cache.set(preferences_key, preferences, 60 * 60 * 24 * 30)
        
        # Log profile update activity
        from .audit import AuditLogger, get_client_ip
        AuditLogger.log_activity(
            user_id=student_id,
            user_type='student',
            action='update_profile',
            resource_type='profile',
            resource_id=student_id,
            details={
                'fields_updated': list(data.keys()),
                'description': 'Updated profile preferences'
            },
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'status': 'success',
            'message': 'Preferences updated successfully'
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)