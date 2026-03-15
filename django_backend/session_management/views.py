from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserSession, UserDevice, SessionEvent, SessionPolicy
from .services import SessionManager, get_client_ip
import json

@csrf_exempt
@require_http_methods(["POST"])
def enhanced_login(request):
    """Enhanced login with session and device management"""
    try:
        data = json.loads(request.body.decode("utf-8"))
        user_type = data.get("user_type")  # student, teacher, admin
        
        # Validate user credentials (integrate with existing auth)
        if user_type == "admin":
            email = data.get("email")
            password = data.get("password")
            if email == "admin@eduyata.com" and password == "admin123":
                user_id = 1
                user_data = {"id": 1, "name": "Admin", "email": email, "role": "admin"}
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)
        else:
            # Use existing student/teacher login logic
            return JsonResponse({"error": "Use existing login endpoints"}, status=400)
        
        # Create session and device tracking
        session, device, is_new_device = SessionManager.create_session(
            user_id=user_id,
            user_type=user_type,
            request=request
        )
        
        response_data = {
            "message": "Login successful",
            "session_token": session.session_token,
            "expires_at": session.expires_at.isoformat(),
            "device_trusted": device.is_trusted,
            "new_device": is_new_device,
            "data": user_data
        }
        
        if is_new_device:
            response_data["warning"] = "New device detected. Please verify this login."
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def logout(request):
    """Logout and revoke session"""
    try:
        data = json.loads(request.body.decode("utf-8"))
        session_token = data.get("session_token")
        
        if SessionManager.revoke_session(session_token, "logout"):
            return JsonResponse({"message": "Logged out successfully"})
        else:
            return JsonResponse({"error": "Session not found"}, status=404)
            
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_active_sessions(request):
    """Get user's active sessions"""
    try:
        user_id = request.GET.get("user_id")
        user_type = request.GET.get("user_type")
        
        if not user_id or not user_type:
            return JsonResponse({"error": "user_id and user_type required"}, status=400)
        
        sessions = SessionManager.get_user_sessions(int(user_id), user_type)
        
        sessions_data = []
        for session in sessions:
            sessions_data.append({
                "id": session.id,
                "device_name": session.device.device_name,
                "device_type": session.device.device_type,
                "browser": session.device.browser,
                "os": session.device.os,
                "ip_address": session.ip_address,
                "last_activity": session.last_activity.isoformat(),
                "created_at": session.created_at.isoformat(),
                "is_current": session.session_token == request.GET.get("current_token"),
                "is_trusted": session.device.is_trusted
            })
        
        return JsonResponse({"sessions": sessions_data})
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def revoke_session(request):
    """Revoke a specific session"""
    try:
        data = json.loads(request.body.decode("utf-8"))
        session_id = data.get("session_id")
        
        session = UserSession.objects.get(id=session_id)
        SessionManager.revoke_session(session.session_token, "user_revoked")
        
        return JsonResponse({"message": "Session revoked successfully"})
        
    except UserSession.DoesNotExist:
        return JsonResponse({"error": "Session not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def trust_device(request):
    """Mark device as trusted"""
    try:
        data = json.loads(request.body.decode("utf-8"))
        device_id = data.get("device_id")
        
        device = UserDevice.objects.get(device_id=device_id)
        device.is_trusted = True
        device.save()
        
        return JsonResponse({"message": "Device marked as trusted"})
        
    except UserDevice.DoesNotExist:
        return JsonResponse({"error": "Device not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_user_devices(request):
    """Get user's registered devices"""
    try:
        user_id = request.GET.get("user_id")
        user_type = request.GET.get("user_type")
        
        devices = UserDevice.objects.filter(
            user_id=user_id,
            user_type=user_type
        ).order_by('-last_used')
        
        devices_data = []
        for device in devices:
            devices_data.append({
                "id": device.id,
                "device_id": device.device_id,
                "device_name": device.device_name,
                "device_type": device.device_type,
                "browser": device.browser,
                "os": device.os,
                "is_trusted": device.is_trusted,
                "last_used": device.last_used.isoformat(),
                "created_at": device.created_at.isoformat()
            })
        
        return JsonResponse({"devices": devices_data})
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Admin endpoints
@csrf_exempt
@require_http_methods(["GET"])
def admin_get_all_sessions(request):
    """Admin: Get all active sessions"""
    try:
        sessions = UserSession.objects.filter(is_active=True).select_related('device')
        
        sessions_data = []
        for session in sessions:
            sessions_data.append({
                "id": session.id,
                "user_id": session.user_id,
                "user_type": session.user_type,
                "device_name": session.device.device_name,
                "ip_address": session.ip_address,
                "last_activity": session.last_activity.isoformat(),
                "created_at": session.created_at.isoformat()
            })
        
        return JsonResponse({"sessions": sessions_data})
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def admin_revoke_session(request):
    """Admin: Revoke any session"""
    try:
        data = json.loads(request.body.decode("utf-8"))
        session_id = data.get("session_id")
        
        session = UserSession.objects.get(id=session_id)
        SessionManager.revoke_session(session.session_token, "admin_revoked")
        
        return JsonResponse({"message": "Session revoked by admin"})
        
    except UserSession.DoesNotExist:
        return JsonResponse({"error": "Session not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_session_policies(request):
    """Get session policies"""
    try:
        policy = SessionPolicy.objects.first()
        if not policy:
            policy = SessionPolicy.objects.create(policy_name='default')
        
        return JsonResponse({
            "policy": {
                "max_concurrent_sessions": policy.max_concurrent_sessions,
                "session_timeout_minutes": policy.session_timeout_minutes,
                "max_devices_per_user": policy.max_devices_per_user,
                "require_device_approval": policy.require_device_approval,
                "auto_logout_inactive": policy.auto_logout_inactive
            }
        })
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_session_policies(request):
    """Update session policies"""
    try:
        data = json.loads(request.body.decode("utf-8"))
        
        policy = SessionPolicy.objects.first()
        if not policy:
            policy = SessionPolicy.objects.create(policy_name='default')
        
        policy.max_concurrent_sessions = data.get("max_concurrent_sessions", policy.max_concurrent_sessions)
        policy.session_timeout_minutes = data.get("session_timeout_minutes", policy.session_timeout_minutes)
        policy.max_devices_per_user = data.get("max_devices_per_user", policy.max_devices_per_user)
        policy.require_device_approval = data.get("require_device_approval", policy.require_device_approval)
        policy.auto_logout_inactive = data.get("auto_logout_inactive", policy.auto_logout_inactive)
        policy.save()
        
        return JsonResponse({"message": "Policies updated successfully"})
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def admin_get_all_devices(request):
    """Admin: Get all registered devices"""
    try:
        devices = UserDevice.objects.all().order_by('-last_used')
        
        devices_data = []
        for device in devices:
            devices_data.append({
                "id": device.id,
                "user_id": device.user_id,
                "user_type": device.user_type,
                "device_id": device.device_id,
                "device_name": device.device_name,
                "device_type": device.device_type,
                "browser": device.browser,
                "os": device.os,
                "is_trusted": device.is_trusted,
                "last_used": device.last_used.isoformat(),
                "created_at": device.created_at.isoformat()
            })
        
        return JsonResponse({"devices": devices_data})
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)