from django.apps import AppConfig


class WebhookSystemConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webhook_system'
    verbose_name = 'Webhook System'
    
    def ready(self):
        """Import signals when app is ready"""
        import webhook_system.signals
