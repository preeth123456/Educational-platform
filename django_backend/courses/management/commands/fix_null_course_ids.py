from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Update NULL course_id values in chapters and lessons tables'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # First, check if there are any courses to link to
            cursor.execute("SELECT id FROM courses LIMIT 1")
            course_result = cursor.fetchone()
            
            if not course_result:
                self.stdout.write(self.style.ERROR('No courses found. Please create a course first.'))
                return
            
            course_id = course_result[0]
            
            # Update chapters with NULL course_id
            cursor.execute("UPDATE chapters SET course_id = %s WHERE course_id IS NULL", [course_id])
            chapters_updated = cursor.rowcount
            
            # Update lessons with NULL course_id
            cursor.execute("UPDATE lessons SET course_id = %s WHERE course_id IS NULL", [course_id])
            lessons_updated = cursor.rowcount
            
            self.stdout.write(
                self.style.SUCCESS(f'Updated {chapters_updated} chapters and {lessons_updated} lessons with course_id = {course_id}')
            )