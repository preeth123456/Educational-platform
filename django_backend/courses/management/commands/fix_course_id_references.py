from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Fix course_id references to use numeric id instead of course_id string'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Update chapters to use the correct course id (1) instead of the string
            cursor.execute("UPDATE chapters SET course_id = 1 WHERE course_id IS NULL OR course_id != 1")
            chapters_updated = cursor.rowcount
            
            # Update lessons to use the correct course id (1) instead of the string  
            cursor.execute("UPDATE lessons SET course_id = 1 WHERE course_id IS NULL OR course_id != 1")
            lessons_updated = cursor.rowcount
            
            self.stdout.write(
                self.style.SUCCESS(f'Fixed {chapters_updated} chapters and {lessons_updated} lessons to use course_id = 1')
            )