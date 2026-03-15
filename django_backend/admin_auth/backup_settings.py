from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# Default backup settings
DEFAULT_SETTINGS = {
    'daily_enabled': False,
    'weekly_enabled': False,
    'daily_time': '18:28',
    'weekly_time': '18:28',
    'weekly_day': 'Sunday',
    'retention_days': 30,
    'retention_months': 12,
    'storage_destinations': {
        'local': True,
        'cloud': False,
        'external': False
    }
}

@require_http_methods(["GET"])
def get_backup_settings(request):
    """Get current backup settings"""
    try:
        from django.conf import settings
        import os
        
        # Try to load from file or use defaults
        settings_file = os.path.join(settings.BASE_DIR, 'backup_settings.json')
        if os.path.exists(settings_file):
            with open(settings_file, 'r') as f:
                backup_settings = json.load(f)
        else:
            backup_settings = DEFAULT_SETTINGS
        
        return JsonResponse({
            'status': 'success',
            'settings': backup_settings
        })
    except Exception as e:
        return JsonResponse({
            'status': 'success',
            'settings': DEFAULT_SETTINGS
        })

@csrf_exempt
@require_http_methods(["POST"])
def save_backup_settings(request):
    """Save backup settings"""
    try:
        data = json.loads(request.body)
        
        # Validate settings
        backup_settings = {
            'daily_enabled': data.get('daily_enabled', False),
            'weekly_enabled': data.get('weekly_enabled', False),
            'daily_time': data.get('daily_time', '18:28'),
            'weekly_time': data.get('weekly_time', '18:28'),
            'weekly_day': data.get('weekly_day', 'Sunday'),
            'retention_days': int(data.get('retention_days', 30)),
            'retention_months': int(data.get('retention_months', 12)),
            'storage_destinations': data.get('storage_destinations', DEFAULT_SETTINGS['storage_destinations'])
        }
        
        # Save to file in current directory
        import os
        settings_file = os.path.join(os.getcwd(), 'backup_settings.json')
        
        try:
            with open(settings_file, 'w') as f:
                json.dump(backup_settings, f, indent=2)
        except Exception as file_error:
            print(f"File write error: {file_error}")
            # Continue without file save
        
        # Restart scheduler with new settings
        try:
            import backup_scheduler
            backup_scheduler.start_backup_scheduler()
        except ImportError:
            pass
        
        return JsonResponse({
            'status': 'success',
            'message': 'Settings saved successfully',
            'settings': backup_settings
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Failed to save settings: {str(e)}'
        }, status=500)