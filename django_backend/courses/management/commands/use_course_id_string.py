from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Update chapters and lessons to use course_id string from courses table'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Get the course_id string from courses table
            cursor.execute("SELECT id, course_id FROM courses")
            courses = cursor.fetchall()
            
            for course_numeric_id, course_string_id in courses:
                # Update chapters to use course_id string
                cursor.execute("UPDATE chapters SET course_id = %s WHERE course_id = %s OR course_id IS NULL", 
                             [course_string_id, course_numeric_id])
                chapters_updated = cursor.rowcount
                
                # Update lessons to use course_id string  
                cursor.execute("UPDATE lessons SET course_id = %s WHERE course_id = %s OR course_id IS NULL", 
                             [course_string_id, course_numeric_id])
                lessons_updated = cursor.rowcount
                
                self.stdout.write(
                    self.style.SUCCESS(f'Updated {chapters_updated} chapters and {lessons_updated} lessons to use course_id = {course_string_id}')
                )