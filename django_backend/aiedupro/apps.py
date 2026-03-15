from django.apps import AppConfig

class AieduprojConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'aiedupro'
    
    def ready(self):
        # Start backup scheduler when Django starts
        try:
            import backup_scheduler
        except ImportError:
            pass