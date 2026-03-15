from django.core.management.base import BaseCommand
from django.db import connection
import json

class Command(BaseCommand):
    help = 'Test lesson content creation'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Get a lesson ID to test with
            cursor.execute("SELECT id FROM lessons LIMIT 1")
            lesson_result = cursor.fetchone()
            
            if not lesson_result:
                self.stdout.write(self.style.ERROR('No lessons found'))
                return
            
            lesson_id = lesson_result[0]
            
            # Test creating lesson content
            cursor.execute("""
                INSERT INTO lesson_contents (lesson_id, title, description, content_type, file_url, content_order, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
            """, [lesson_id, 'Test Content', 'Test Description', 'PDF', 'test.pdf', 1])
            
            content_id = cursor.lastrowid
            
            self.stdout.write(
                self.style.SUCCESS(f'Created test lesson content with ID {content_id} for lesson {lesson_id}')
            )