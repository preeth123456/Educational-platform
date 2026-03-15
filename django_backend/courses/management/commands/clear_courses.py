from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Clear all data from courses table'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM courses")
            affected_rows = cursor.rowcount
            
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {affected_rows} records from courses table')
        )