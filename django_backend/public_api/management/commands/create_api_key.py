"""
Management command to create an API key
Usage: python manage.py create_api_key --name "My API Key" --user admin
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from public_api.models import APIKey


class Command(BaseCommand):
    help = 'Create a new API key for a user'

    def add_arguments(self, parser):
        parser.add_argument('--name', type=str, required=True, help='Name for the API key')
        parser.add_argument('--user', type=str, required=True, help='Username of the user')

    def handle(self, *args, **options):
        name = options['name']
        username = options['user']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User "{username}" does not exist'))
            return

        api_key = APIKey.objects.create(
            name=name,
            user=user,
            is_active=True
        )

        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('API KEY CREATED SUCCESSFULLY'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(f'Name: {api_key.name}')
        self.stdout.write(f'User: {api_key.user.username}')
        self.stdout.write(f'Key: {api_key.key_value}')
        self.stdout.write(f'Active: {api_key.is_active}')
        self.stdout.write(f'Rate Limit: {api_key.rate_limit_per_hour} requests/hour')
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.WARNING('\n⚠️  IMPORTANT: Copy this API key now!'))
        self.stdout.write(self.style.WARNING('You won\'t be able to see it again.\n'))
