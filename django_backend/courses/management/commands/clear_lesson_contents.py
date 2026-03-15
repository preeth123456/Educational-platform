from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Clear all data from lesson_contents table'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM lesson_contents")
            affected_rows = cursor.rowcount
            
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {affected_rows} records from lesson_contents table')
        )