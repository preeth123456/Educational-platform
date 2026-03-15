from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Fix unique constraint on chapters table to allow same chapter_no for different courses'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            try:
                # Drop the existing unique constraint on chapter_no
                cursor.execute("ALTER TABLE chapters DROP INDEX uq_chapter_no")
                self.stdout.write(self.style.SUCCESS('Dropped existing unique constraint on chapter_no'))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'Could not drop constraint: {e}'))
            
            try:
                # Add a new unique constraint on (course_id, chapter_no) combination
                cursor.execute("ALTER TABLE chapters ADD UNIQUE KEY uq_course_chapter (course_id, chapter_no)")
                self.stdout.write(self.style.SUCCESS('Added unique constraint on (course_id, chapter_no)'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to add new constraint: {e}'))
                
            # Do the same for lessons table if needed
            try:
                cursor.execute("ALTER TABLE lessons DROP INDEX uq_lesson_no")
                self.stdout.write(self.style.SUCCESS('Dropped existing unique constraint on lesson_no'))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'Could not drop lesson constraint: {e}'))
                
            try:
                cursor.execute("ALTER TABLE lessons ADD UNIQUE KEY uq_chapter_lesson (chapter_id, lesson_no)")
                self.stdout.write(self.style.SUCCESS('Added unique constraint on (chapter_id, lesson_no)'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to add lesson constraint: {e}'))