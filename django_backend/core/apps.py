from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'Event Bus / Messaging Layer'

    def ready(self):
        """Register event handlers when Django starts"""
        from . import handlers  # noqa: F401 - Import to register signal handlers
