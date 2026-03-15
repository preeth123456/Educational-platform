from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth.management import create_permissions
from django.contrib.contenttypes.management import create_contenttypes
from django.db import models

class Command(BaseCommand):
    def handle(self, *args, **options):
        # Disconnect problematic signals
        models.signals.post_migrate.disconnect(create_permissions)
        models.signals.post_migrate.disconnect(create_contenttypes)
        
        # Run migrate
        call_command('migrate', verbosity=0)
        
        print("Migration completed without signals")