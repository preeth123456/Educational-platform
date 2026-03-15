from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .context_service import ContextService
from .audit import get_client_ip
import json

@require_http_methods(["GET"])
def get_available_contexts(request):
    """Get available contexts for current user"""
    try:
        user_id = request.GET.get('user_id')
        user_type = request.GET.get('user_type')
        
        if not user_id or not user_type:
            return JsonResponse({'error': 'user_id and user_type required'}, status=400)
        
        # Return empty contexts if context system is not available
        try:
            contexts = ContextService.get_user_contexts(int(user_id), user_type)
        except Exception:
            contexts = []
        
        return JsonResponse({
            'status': 'success',
            'contexts': contexts
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'success',
            'contexts': []
        })

@require_http_methods(["GET"])
def get_current_context(request):
    """Get user's current active context"""
    try:
        user_id = request.GET.get('user_id')
        user_type = request.GET.get('user_type')
        
        if not user_id or not user_type:
            return JsonResponse({'error': 'user_id and user_type required'}, status=400)
        
        # Return null context if context system is not available
        try:
            context = ContextService.get_current_context(int(user_id), user_type)
        except Exception:
            context = None
        
        return JsonResponse({
            'status': 'success',
            'current_context': context
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'success',
            'current_context': None
        })

@csrf_exempt
@require_http_methods(["POST"])
def switch_context(request):
    """Switch user to new context"""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_type = data.get('user_type')
        context_id = data.get('context_id')
        session_token = data.get('session_token')
        
        if not all([user_id, user_type, context_id]):
            return JsonResponse({'error': 'user_id, user_type, and context_id required'}, status=400)
        
        # Get client info for audit
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        success, message = ContextService.switch_context(
            int(user_id), user_type, int(context_id), 
            session_token, ip_address, user_agent
        )
        
        if success:
            # Get updated context
            new_context = ContextService.get_current_context(int(user_id), user_type)
            return JsonResponse({
                'status': 'success',
                'message': message,
                'current_context': new_context
            })
        else:
            return JsonResponse({'error': message}, status=400)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def initialize_contexts(request):
    """Initialize contexts for a user (called after login)"""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_type = data.get('user_type')
        
        if not user_id or not user_type:
            return JsonResponse({'error': 'user_id and user_type required'}, status=400)
        
        ContextService.initialize_user_contexts(int(user_id), user_type)
        
        # Get initialized contexts
        contexts = ContextService.get_user_contexts(int(user_id), user_type)
        current_context = ContextService.get_current_context(int(user_id), user_type)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Contexts initialized',
            'contexts': contexts,
            'current_context': current_context
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)