from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .audit import AuditLogger, get_client_ip, detect_suspicious_activity
import json
import re

class AuditMiddleware(MiddlewareMixin):
    """Middleware to automatically track user activities"""
    
    # Define actions to track based on URL patterns
    TRACKED_ACTIONS = {
        r'/api/auth/login/': ('login', 'authentication'),
        r'/api/auth/logout/': ('logout', 'authentication'),
        r'/api/auth/student_profile/': ('view_profile', 'profile'),
        r'/api/auth/update_profile/': ('update_profile', 'profile'),
        r'/api/auth/change_password/': ('change_password', 'security'),
        r'/api/courses/': ('access_course', 'course'),
        r'/api/courses/enroll/': ('enroll_course', 'enrollment'),
        r'/api/courses/progress/': ('update_progress', 'learning'),
        r'/api/admin/': ('admin_access', 'administration'),
    }
    
    def process_request(self, request):
        """Process incoming request to extract user info"""
        # Extract user info from session or request data
        if hasattr(request, 'session') and 'student_id' in request.session:
            request.user_id = request.session['student_id']
            request.user_type = 'student'
        elif hasattr(request, 'session') and 'teacher_id' in request.session:
            request.user_id = request.session['teacher_id']
            request.user_type = 'teacher'
        elif hasattr(request, 'session') and 'admin_id' in request.session:
            request.user_id = request.session['admin_id']
            request.user_type = 'admin'
        else:
            # Try to extract from request body for API calls
            try:
                if request.content_type == 'application/json' and request.body:
                    data = json.loads(request.body)
                    if 'student_id' in data:
                        request.user_id = data['student_id']
                        request.user_type = 'student'
                    elif 'teacher_id' in data:
                        request.user_id = data['teacher_id']
                        request.user_type = 'teacher'
            except:
                pass
        
        return None
    
    def process_response(self, request, response):
        """Process response to log activities"""
        # Skip tracking for certain paths
        if self._should_skip_tracking(request.path):
            return response
        
        # Find matching action
        action, resource_type = self._get_action_for_path(request.path, request.method)
        
        if action and hasattr(request, 'user_id'):
            # Determine if action was successful
            success = self._is_successful_response(response)
            
            # Log the activity
            AuditLogger.log_activity(
                user_id=request.user_id,
                user_type=getattr(request, 'user_type', 'unknown'),
                action=f"{action}{'_success' if success else '_failed'}",
                resource_type=resource_type,
                details={
                    'method': request.method,
                    'path': request.path,
                    'status_code': response.status_code
                },
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Check for suspicious activities
            if not success and action == 'login':
                detect_suspicious_activity(
                    request.user_id, 
                    'login_failed', 
                    get_client_ip(request)
                )
        
        return response
    
    def _should_skip_tracking(self, path):
        """Determine if path should be skipped from tracking"""
        skip_patterns = [
            r'/static/',
            r'/media/',
            r'/favicon.ico',
            r'/api/auth/activity_history/',  # Avoid recursive logging
        ]
        
        for pattern in skip_patterns:
            if re.match(pattern, path):
                return True
        return False
    
    def _get_action_for_path(self, path, method):
        """Get action and resource type for given path"""
        for pattern, (action, resource_type) in self.TRACKED_ACTIONS.items():
            if re.match(pattern, path):
                return action, resource_type
        
        # Default actions based on method
        if method == 'GET':
            return 'view', 'resource'
        elif method == 'POST':
            return 'create', 'resource'
        elif method == 'PUT' or method == 'PATCH':
            return 'update', 'resource'
        elif method == 'DELETE':
            return 'delete', 'resource'
        
        return None, None
    
    def _is_successful_response(self, response):
        """Determine if response indicates success"""
        if response.status_code < 400:
            return True
        
        # Check response content for success indicators
        try:
            if hasattr(response, 'content'):
                content = json.loads(response.content.decode('utf-8'))
                return content.get('status') == 'success'
        except:
            pass
        
        return False