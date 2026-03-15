from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .forensic_audit import ForensicAuditLogger, get_client_ip
import json
import uuid
import logging

logger = logging.getLogger(__name__)

class ForensicAuditMiddleware(MiddlewareMixin):
    """Middleware to automatically log all sensitive activities"""
    
    # Actions that should be logged
    LOGGED_ACTIONS = {
        'POST': ['create', 'login', 'register', 'export', 'upload'],
        'PUT': ['update', 'modify'],
        'PATCH': ['update', 'modify'],
        'DELETE': ['delete', 'remove'],
        'GET': ['view', 'access', 'download', 'export']
    }
    
    # Sensitive endpoints that require logging
    SENSITIVE_ENDPOINTS = [
        '/api/auth/',
        '/api/admin/',
        '/api/users/',
        '/api/students/',
        '/api/teachers/',
        '/api/courses/',
        '/api/grades/',
        '/api/reports/',
        '/api/exports/',
        '/api/settings/',
        '/api/policies/'
    ]
    
    # Admin-only endpoints
    ADMIN_ENDPOINTS = [
        '/api/admin/',
        '/api/users/create',
        '/api/users/delete',
        '/api/policies/',
        '/api/settings/',
        '/api/exports/'
    ]
    
    def process_request(self, request):
        """Process incoming request and prepare for logging"""
        # Generate unique request ID
        request.request_id = str(uuid.uuid4())
        
        # Store original request body for logging
        if hasattr(request, 'body'):
            try:
                request._cached_body = request.body
            except:
                request._cached_body = b''
        
        return None
    
    def process_response(self, request, response):
        """Process response and log activities"""
        try:
            # Check if this endpoint should be logged
            if not self._should_log_request(request):
                return response
            
            # Extract user information
            user_id = getattr(request, 'user_id', None)
            user_type = getattr(request, 'user_type', 'unknown')
            
            if not user_id:
                # Try to extract from session or headers
                user_id = self._extract_user_id(request)
                user_type = self._extract_user_type(request)
            
            if user_id:
                # Determine action and target
                action = self._determine_action(request)
                target_type, target_id = self._determine_target(request)
                
                # Get before/after state for modifications
                before_state, after_state = self._get_state_changes(request, response)
                
                # Log the activity
                ForensicAuditLogger.log_comprehensive_activity(
                    actor_id=user_id,
                    actor_type=user_type,
                    action=action,
                    target_type=target_type,
                    target_id=target_id,
                    before_state=before_state,
                    after_state=after_state,
                    metadata={
                        'method': request.method,
                        'path': request.path,
                        'status_code': response.status_code,
                        'content_type': response.get('Content-Type', ''),
                        'user_agent': request.META.get('HTTP_USER_AGENT', '')[:500]
                    },
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')[:1000],
                    session_id=request.session.session_key if hasattr(request, 'session') else None,
                    request_id=getattr(request, 'request_id', None)
                )
                
                # Log data access for GET requests
                if request.method == 'GET' and self._is_data_access(request):
                    ForensicAuditLogger.log_data_access(
                        actor_id=user_id,
                        actor_type=user_type,
                        data_type=target_type,
                        data_subject_id=self._extract_data_subject_id(request),
                        access_method='api',
                        purpose='business_operation',
                        legal_basis='legitimate_interest',
                        ip_address=get_client_ip(request)
                    )
                
                # Log admin actions
                if self._is_admin_action(request) and user_type == 'admin':
                    ForensicAuditLogger.log_admin_action(
                        admin_id=user_id,
                        action_type=action,
                        description=f"{request.method} {request.path}",
                        target_type=target_type,
                        target_id=target_id,
                        risk_level=self._assess_risk_level(request),
                        ip_address=get_client_ip(request)
                    )
        
        except Exception as e:
            logger.error(f"Failed to log activity in middleware: {e}")
        
        return response
    
    def _should_log_request(self, request):
        """Determine if request should be logged"""
        path = request.path.lower()
        
        # Always log sensitive endpoints
        for endpoint in self.SENSITIVE_ENDPOINTS:
            if path.startswith(endpoint.lower()):
                return True
        
        # Log based on method
        if request.method in self.LOGGED_ACTIONS:
            return True
        
        return False
    
    def _extract_user_id(self, request):
        """Extract user ID from request"""
        # Try session first
        if hasattr(request, 'session') and 'user_id' in request.session:
            return request.session['user_id']
        
        # Try headers
        user_id = request.META.get('HTTP_X_USER_ID')
        if user_id:
            try:
                return int(user_id)
            except:
                pass
        
        # Try JWT token or other auth methods
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            # Extract from JWT token if you're using JWT
            pass
        
        return None
    
    def _extract_user_type(self, request):
        """Extract user type from request"""
        if hasattr(request, 'session') and 'user_type' in request.session:
            return request.session['user_type']
        
        user_type = request.META.get('HTTP_X_USER_TYPE')
        if user_type:
            return user_type
        
        return 'unknown'
    
    def _determine_action(self, request):
        """Determine action based on request"""
        method = request.method.upper()
        path = request.path.lower()
        
        # Specific action mappings
        if 'login' in path:
            return 'login'
        elif 'logout' in path:
            return 'logout'
        elif 'export' in path:
            return 'export_data'
        elif 'upload' in path:
            return 'upload_file'
        elif 'download' in path:
            return 'download_file'
        elif 'password' in path:
            return 'change_password'
        elif 'profile' in path:
            return 'update_profile' if method in ['PUT', 'PATCH'] else 'view_profile'
        
        # Generic action based on method
        action_map = {
            'GET': 'view',
            'POST': 'create',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete'
        }
        
        return action_map.get(method, 'unknown')
    
    def _determine_target(self, request):
        """Determine target type and ID from request path"""
        path_parts = request.path.strip('/').split('/')
        
        # Common patterns
        if len(path_parts) >= 3 and path_parts[0] == 'api':
            target_type = path_parts[1]
            target_id = path_parts[2] if len(path_parts) > 2 and path_parts[2].isdigit() else None
            return target_type, target_id
        
        # Fallback
        if len(path_parts) >= 2:
            return path_parts[-2] if len(path_parts) > 1 else path_parts[0], None
        
        return 'unknown', None
    
    def _get_state_changes(self, request, response):
        """Get before and after state for modifications"""
        before_state = None
        after_state = None
        
        # For modifications, try to capture state changes
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            # Before state would need to be captured before the operation
            # This is a simplified version - you'd need to implement based on your models
            pass
        
        # After state from response (for successful operations)
        if response.status_code < 400 and hasattr(response, 'content'):
            try:
                content_type = response.get('Content-Type', '')
                if 'application/json' in content_type:
                    after_state = json.loads(response.content.decode('utf-8'))
            except:
                pass
        
        return before_state, after_state
    
    def _is_data_access(self, request):
        """Check if request is accessing personal data"""
        path = request.path.lower()
        data_endpoints = ['/api/students/', '/api/teachers/', '/api/users/', '/api/grades/', '/api/reports/']
        return any(endpoint in path for endpoint in data_endpoints)
    
    def _extract_data_subject_id(self, request):
        """Extract data subject ID from request"""
        # Try to get user ID from path
        path_parts = request.path.strip('/').split('/')
        for i, part in enumerate(path_parts):
            if part.isdigit():
                return int(part)
        
        # Try query parameters
        user_id = request.GET.get('user_id') or request.GET.get('student_id') or request.GET.get('teacher_id')
        if user_id and user_id.isdigit():
            return int(user_id)
        
        return None
    
    def _is_admin_action(self, request):
        """Check if request is an admin action"""
        path = request.path.lower()
        return any(endpoint in path for endpoint in self.ADMIN_ENDPOINTS)
    
    def _assess_risk_level(self, request):
        """Assess risk level of admin action"""
        path = request.path.lower()
        method = request.method.upper()
        
        # Critical actions
        if method == 'DELETE' or 'delete' in path:
            return 'critical'
        
        # High risk actions
        if any(keyword in path for keyword in ['users', 'admin', 'policies', 'settings']):
            return 'high'
        
        # Medium risk actions
        if method in ['PUT', 'PATCH'] or 'update' in path:
            return 'medium'
        
        return 'low'