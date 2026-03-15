import json
import os
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from datetime import timedelta
import requests
from urllib.parse import urlencode

from .models import SocialAccount
from auth_app.models import Student, Educator


# OAuth Configuration (loaded from environment or settings)
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8001/api/auth/social/google/callback/')

MICROSOFT_CLIENT_ID = os.getenv('MICROSOFT_CLIENT_ID', '')
MICROSOFT_CLIENT_SECRET = os.getenv('MICROSOFT_CLIENT_SECRET', '')
MICROSOFT_REDIRECT_URI = os.getenv('MICROSOFT_REDIRECT_URI', 'http://localhost:8001/api/auth/social/microsoft/callback/')

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')


# ========================
# GOOGLE SSO
# ========================

@csrf_exempt
def google_login(request):
    """Initiates Google OAuth flow"""
    params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline',
        'prompt': 'consent',
    }
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return redirect(auth_url)


@csrf_exempt
def google_callback(request):
    """Handles Google OAuth callback"""
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        return redirect(f"{FRONTEND_URL}/login?error={error}")
    
    if not code:
        return redirect(f"{FRONTEND_URL}/login?error=no_code")
    
    try:
        # Exchange code for tokens
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': GOOGLE_REDIRECT_URI,
            }
        )
        
        if token_response.status_code != 200:
            return redirect(f"{FRONTEND_URL}/login?error=token_exchange_failed")
        
        tokens = token_response.json()
        access_token = tokens.get('access_token')
        refresh_token = tokens.get('refresh_token', '')
        expires_in = tokens.get('expires_in', 3600)
        
        # Get user info from Google
        userinfo_response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if userinfo_response.status_code != 200:
            return redirect(f"{FRONTEND_URL}/login?error=userinfo_failed")
        
        userinfo = userinfo_response.json()
        google_id = userinfo.get('id')
        email = userinfo.get('email')
        name = userinfo.get('name', '')
        picture = userinfo.get('picture', '')
        
        # Process the social login
        result = process_social_login(
            provider='google',
            provider_id=google_id,
            email=email,
            name=name,
            picture_url=picture,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in
        )
        
        if result.get('success'):
            # Redirect to frontend with user data
            user_data = result.get('user_data', {})
            redirect_url = result.get('redirect_url', '/dashboard')
            
            # Pass data via query params (frontend will handle it)
            params = urlencode({
                'sso_success': 'true',
                'user_type': user_data.get('user_type', ''),
                'user_id': user_data.get('id', ''),
                'name': user_data.get('name', ''),
                'email': email,
                'profile_completed': str(user_data.get('profile_completed', 'true')).lower(),
            })
            return redirect(f"{FRONTEND_URL}/sso-callback?{params}")
        else:
            # New user - redirect to role selection
            if result.get('needs_role_selection'):
                params = urlencode({
                    'sso_new': 'true',
                    'provider': 'google',
                    'email': email,
                    'name': name,
                })
                return redirect(f"{FRONTEND_URL}/sso-callback?{params}")
            return redirect(f"{FRONTEND_URL}/login?error={result.get('error', 'unknown')}")
            
    except Exception as e:
        print(f"Google SSO error: {e}")
        return redirect(f"{FRONTEND_URL}/login?error=server_error")


# ========================
# MICROSOFT SSO
# ========================

@csrf_exempt
def microsoft_login(request):
    """Initiates Microsoft OAuth flow"""
    params = {
        'client_id': MICROSOFT_CLIENT_ID,
        'redirect_uri': MICROSOFT_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'openid email profile User.Read',
        'response_mode': 'query',
    }
    auth_url = f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?{urlencode(params)}"
    return redirect(auth_url)


@csrf_exempt
def microsoft_callback(request):
    """Handles Microsoft OAuth callback"""
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        return redirect(f"{FRONTEND_URL}/login?error={error}")
    
    if not code:
        return redirect(f"{FRONTEND_URL}/login?error=no_code")
    
    try:
        # Exchange code for tokens
        token_response = requests.post(
            'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            data={
                'client_id': MICROSOFT_CLIENT_ID,
                'client_secret': MICROSOFT_CLIENT_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': MICROSOFT_REDIRECT_URI,
            }
        )
        
        if token_response.status_code != 200:
            return redirect(f"{FRONTEND_URL}/login?error=token_exchange_failed")
        
        tokens = token_response.json()
        access_token = tokens.get('access_token')
        refresh_token = tokens.get('refresh_token', '')
        expires_in = tokens.get('expires_in', 3600)
        
        # Get user info from Microsoft Graph
        userinfo_response = requests.get(
            'https://graph.microsoft.com/v1.0/me',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if userinfo_response.status_code != 200:
            return redirect(f"{FRONTEND_URL}/login?error=userinfo_failed")
        
        userinfo = userinfo_response.json()
        microsoft_id = userinfo.get('id')
        email = userinfo.get('mail') or userinfo.get('userPrincipalName', '')
        name = userinfo.get('displayName', '')
        
        # Process the social login
        result = process_social_login(
            provider='microsoft',
            provider_id=microsoft_id,
            email=email,
            name=name,
            picture_url='',  # Microsoft requires separate call for photo
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in
        )
        
        if result.get('success'):
            user_data = result.get('user_data', {})
            params = urlencode({
                'sso_success': 'true',
                'user_type': user_data.get('user_type', ''),
                'user_id': user_data.get('id', ''),
                'name': user_data.get('name', ''),
                'email': email,
                'profile_completed': str(user_data.get('profile_completed', 'true')).lower(),
            })
            return redirect(f"{FRONTEND_URL}/sso-callback?{params}")
        else:
            if result.get('needs_role_selection'):
                params = urlencode({
                    'sso_new': 'true',
                    'provider': 'microsoft',
                    'email': email,
                    'name': name,
                })
                return redirect(f"{FRONTEND_URL}/sso-callback?{params}")
            return redirect(f"{FRONTEND_URL}/login?error={result.get('error', 'unknown')}")
            
    except Exception as e:
        print(f"Microsoft SSO error: {e}")
        return redirect(f"{FRONTEND_URL}/login?error=server_error")


# ========================
# COMMON FUNCTIONS
# ========================

def process_social_login(provider, provider_id, email, name, picture_url, 
                         access_token, refresh_token, expires_in):
    """
    Process social login - links to existing account or signals new user registration.
    Auto-links if email matches existing Student or Educator.
    """
    
    # Check if social account already exists
    try:
        social_account = SocialAccount.objects.get(
            provider=provider, 
            provider_id=provider_id
        )
        # Update tokens
        social_account.access_token = access_token
        social_account.refresh_token = refresh_token
        social_account.token_expires_at = timezone.now() + timedelta(seconds=expires_in)
        social_account.save()
        
        # Get linked user
        user = social_account.get_linked_user()
        if user:
            # Check profile completion status
            profile_completed = True
            if social_account.user_type == 'student':
                profile_completed = getattr(user, 'profile_completed', True)
            elif social_account.user_type == 'educator':
                profile_completed = getattr(user, 'profile_completed', True)
            
            return {
                'success': True,
                'user_data': {
                    'id': user.id,
                    'name': user.name,
                    'email': email,
                    'user_type': social_account.user_type,
                    'student_id': getattr(user, 'student_id', None),
                    'teacher_id': getattr(user, 'teacher_id', None),
                    'profile_completed': profile_completed,
                },
                'redirect_url': '/dashboard' if social_account.user_type == 'student' else '/teacher-dashboard'
            }
    except SocialAccount.DoesNotExist:
        pass
    
    # Try to find existing user by email (auto-link)
    student = None
    educator = None
    
    try:
        # Check for existing student with this email
        # Note: Students use mobile_self, but we'll check if there's an email field
        # For now, we'll check educators who have email
        educator = Educator.objects.filter(email__iexact=email).first()
    except Exception:
        pass
    
    if educator:
        # Auto-link to existing educator
        social_account = SocialAccount.objects.create(
            provider=provider,
            provider_id=provider_id,
            email=email,
            name=name,
            picture_url=picture_url,
            user_type='educator',
            educator_id=educator.id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_expires_at=timezone.now() + timedelta(seconds=expires_in)
        )
        
        return {
            'success': True,
            'user_data': {
                'id': educator.id,
                'name': educator.name,
                'email': educator.email,
                'user_type': 'educator',
                'teacher_id': educator.teacher_id,
            },
            'redirect_url': '/teacher-dashboard'
        }
    
    # No existing account found - user needs to select role
    return {
        'success': False,
        'needs_role_selection': True,
        'email': email,
        'name': name,
    }


@csrf_exempt
@require_http_methods(["POST"])
def complete_sso_registration(request):
    """
    Completes registration for new SSO users.
    Called after user selects their role (student/teacher).
    """
    try:
        data = json.loads(request.body)
        provider = data.get('provider')
        email = data.get('email')
        name = data.get('name')
        user_type = data.get('user_type')  # 'student' or 'educator'
        
        # Additional fields for students
        class_level = data.get('class_level', '')
        board = data.get('board', '')
        mobile = data.get('mobile', '')
        
        if not all([provider, email, name, user_type]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        if user_type == 'student':
            # Create new student
            from django.utils.crypto import get_random_string
            import random
            
            student_id = f"STU2026{random.randint(10000, 99999)}"
            
            student = Student.objects.create(
                student_id=student_id,
                name=name,
                mobile_self=mobile or f"SSO{get_random_string(8)}",  # Placeholder if no mobile
                class_level=class_level or '10',
                board=board or 'CBSE',
                password_hash='',  # No password for SSO users
                profile_completed=False
            )
            
            # Create social account link
            SocialAccount.objects.create(
                provider=provider,
                provider_id=email,  # Use email as provider_id for new registrations
                email=email,
                name=name,
                user_type='student',
                student_id=student.id
            )
            
            return JsonResponse({
                'success': True,
                'data': {
                    'id': student.id,
                    'student_id': student.student_id,
                    'name': student.name,
                    'email': email,
                    'user_type': 'student',
                    'profile_completed': False,
                },
                'redirect_url': '/profile-completion'
            })
            
        elif user_type == 'educator':
            # Create new educator
            educator = Educator.objects.create(
                name=name,
                email=email,
                mobile=mobile or f"SSO{Educator.objects.count() + 1:08d}",
                password_hash='',  # No password for SSO users
                is_active=True,
                profile_completed=False
            )
            
            # Create social account link
            SocialAccount.objects.create(
                provider=provider,
                provider_id=email,
                email=email,
                name=name,
                user_type='educator',
                educator_id=educator.id
            )
            
            return JsonResponse({
                'success': True,
                'data': {
                    'id': educator.id,
                    'teacher_id': educator.teacher_id,
                    'name': educator.name,
                    'email': educator.email,
                    'user_type': 'educator',
                    'profile_completed': False,
                },
                'redirect_url': '/teacher-dashboard'
            })
        else:
            return JsonResponse({'error': 'Invalid user type'}, status=400)
            
    except Exception as e:
        print(f"SSO registration error: {e}")
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_linked_accounts(request):
    """Returns social accounts linked to a user"""
    user_type = request.GET.get('user_type')
    user_id = request.GET.get('user_id')
    
    if not user_type or not user_id:
        return JsonResponse({'error': 'Missing user_type or user_id'}, status=400)
    
    try:
        if user_type == 'student':
            accounts = SocialAccount.objects.filter(
                user_type='student', 
                student_id=user_id
            ).values('provider', 'email', 'created_at')
        else:
            accounts = SocialAccount.objects.filter(
                user_type='educator', 
                educator_id=user_id
            ).values('provider', 'email', 'created_at')
        
        return JsonResponse({
            'success': True,
            'accounts': list(accounts)
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ========================
# GENERIC OAUTH CALLBACK FOR ALL PROVIDERS
# ========================
# These callbacks support the Integration Marketplace credential testing
# They handle OAuth callbacks for: Canvas, Zoom, Slack, Salesforce, HubSpot, Dropbox, GitHub, Notion

def generic_oauth_callback(request, provider):
    """
    Generic OAuth callback handler for Integration Marketplace
    
    This handles the OAuth redirect from provider (Google, Zoom, etc.).
    It exchanges the authorization code for access tokens, stores them securely,
    and redirects to frontend with success/error status.
    """
    import base64
    
    code = request.GET.get('code')
    error = request.GET.get('error')
    state = request.GET.get('state', '')
    
    frontend_url = 'http://localhost:5173/admin/connectors'
    
    # Check if this is an error response
    if error:
        error_description = request.GET.get('error_description', 'Unknown error')
        return redirect(f'{frontend_url}?error={error}&provider={provider}&message={error_description}')
    
    # No code received - endpoint test
    if not code:
        return JsonResponse({
            'success': True,
            'provider': provider,
            'message': f'{provider.title()} OAuth callback endpoint is configured correctly'
        })
    
    # We have a code - exchange it for tokens
    try:
        from third_party_connectors.models import OAuthAPIKey, OAuthIntegration
        from integration_marketplace.encryption import EncryptionService
        from integration_marketplace.models import Integration
        
        # Get OAuth app configuration
        app = OAuthAPIKey.objects.filter(oauth_provider=provider, is_active=True).first()
        if not app:
            return redirect(f'{frontend_url}?error=no_app&provider={provider}&message=OAuth+app+not+configured')
        
        # Get credentials
        client_id = app.oauth_client_id
        client_secret = EncryptionService.decrypt_value(app.allowed_ips)
        redirect_uri = app.oauth_redirect_uri
        
        # Token endpoints for all 10 providers
        token_endpoints = {
            'google': 'https://oauth2.googleapis.com/token',
            'microsoft': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            'canvas': 'https://canvas.instructure.com/login/oauth2/token',
            'zoom': 'https://zoom.us/oauth/token',
            'slack': 'https://slack.com/api/oauth.v2.access',
            'salesforce': 'https://login.salesforce.com/services/oauth2/token',
            'hubspot': 'https://api.hubapi.com/oauth/v1/token',
            'dropbox': 'https://api.dropbox.com/oauth2/token',
            'github': 'https://github.com/login/oauth/access_token',
            'notion': 'https://api.notion.com/v1/oauth/token',
        }
        
        token_url = token_endpoints.get(provider)
        if not token_url:
            return redirect(f'{frontend_url}?error=unsupported&provider={provider}&message=Token+endpoint+not+configured')
        
        # Build token exchange request
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': client_id,
            'client_secret': client_secret
        }
        
        headers = {'Accept': 'application/json'}
        
        # Provider-specific adjustments
        if provider == 'notion':
            # Notion uses Basic Auth
            auth_header = base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()
            headers['Authorization'] = f'Basic {auth_header}'
            headers['Content-Type'] = 'application/json'
            token_data = {'grant_type': 'authorization_code', 'code': code, 'redirect_uri': redirect_uri}
        elif provider == 'zoom':
            # Zoom uses Basic Auth
            auth_header = base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()
            headers['Authorization'] = f'Basic {auth_header}'
        
        # Make token exchange request
        response = requests.post(token_url, data=token_data, headers=headers, timeout=15)
        
        if response.status_code != 200:
            error_msg = response.text[:100].replace(' ', '+')
            return redirect(f'{frontend_url}?error=token_exchange_failed&provider={provider}&message={error_msg}')
        
        token_response = response.json()
        
        # Extract tokens
        access_token = token_response.get('access_token')
        refresh_token = token_response.get('refresh_token')
        expires_in = token_response.get('expires_in', 3600)
        
        if not access_token:
            return redirect(f'{frontend_url}?error=no_token&provider={provider}&message=No+access+token+received')
        
        # Store tokens in Integration model
        # Find or create integration for this user (use session user or default)
        from django.contrib.auth.models import User
        user = request.user if request.user.is_authenticated else User.objects.first()
        
        integration, created = OAuthIntegration.objects.get_or_create(
            integration_type=provider,
            installed_by=user,
            defaults={'name': f'{provider.title()} Connection', 'status': 'active'}
        )
        
        # Store tokens securely
        integration.set_oauth_tokens(
            access_token=access_token,
            refresh_token=refresh_token,
            scopes=token_response.get('scope', ''),
            expires_in=expires_in
        )
        integration.status = 'active'
        integration.save()
        
        # Also update base Integration table
        Integration.objects.filter(
            integration_type=provider,
            installed_by=user
        ).update(status='active')
        
        # Redirect to frontend with success
        return redirect(f'{frontend_url}?success=true&provider={provider}&message=Connected+successfully')
        
    except Exception as e:
        error_msg = str(e)[:100].replace(' ', '+')
        return redirect(f'{frontend_url}?error=exception&provider={provider}&message={error_msg}')


@csrf_exempt
def canvas_callback(request):
    """Canvas LMS OAuth callback"""
    return generic_oauth_callback(request, 'canvas')

@csrf_exempt
def zoom_callback(request):
    """Zoom OAuth callback"""
    return generic_oauth_callback(request, 'zoom')

@csrf_exempt
def slack_callback(request):
    """Slack OAuth callback"""
    return generic_oauth_callback(request, 'slack')

@csrf_exempt
def salesforce_callback(request):
    """Salesforce OAuth callback"""
    return generic_oauth_callback(request, 'salesforce')

@csrf_exempt
def hubspot_callback(request):
    """HubSpot OAuth callback"""
    return generic_oauth_callback(request, 'hubspot')

@csrf_exempt
def dropbox_callback(request):
    """Dropbox OAuth callback"""
    return generic_oauth_callback(request, 'dropbox')

@csrf_exempt
def github_callback(request):
    """GitHub OAuth callback"""
    return generic_oauth_callback(request, 'github')

@csrf_exempt
def notion_callback(request):
    """Notion OAuth callback"""
    return generic_oauth_callback(request, 'notion')
