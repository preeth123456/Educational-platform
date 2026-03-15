"""
Django management command to refresh OAuth tokens

Run this command daily via cron:
python manage.py refresh_oauth_tokens
"""

from django.core.management.base import BaseCommand
from integration_marketplace.services import integration_service


class Command(BaseCommand):
    help = 'Refresh OAuth tokens that are expiring soon'

    def handle(self, *args, **options):
        self.stdout.write('Checking and refreshing OAuth tokens...')
        
        refreshed_count = integration_service.check_and_refresh_tokens()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully refreshed {refreshed_count} token(s)')
        )
