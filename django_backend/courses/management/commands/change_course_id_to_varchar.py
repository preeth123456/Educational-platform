from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Change course_id columns to VARCHAR to store string course IDs'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Change chapters.course_id to VARCHAR
            cursor.execute("ALTER TABLE chapters MODIFY COLUMN course_id VARCHAR(20)")
            self.stdout.write(self.style.SUCCESS('Changed chapters.course_id to VARCHAR(20)'))
            
            # Change lessons.course_id to VARCHAR
            cursor.execute("ALTER TABLE lessons MODIFY COLUMN course_id VARCHAR(20)")
            self.stdout.write(self.style.SUCCESS('Changed lessons.course_id to VARCHAR(20)'))
            
            # Now update the values to use course_id strings
            cursor.execute("SELECT id, course_id FROM courses")
            courses = cursor.fetchall()
            
            for course_numeric_id, course_string_id in courses:
                # Update chapters
                cursor.execute("UPDATE chapters SET course_id = %s WHERE course_id = %s OR course_id IS NULL", 
                             [course_string_id, str(course_numeric_id)])
                chapters_updated = cursor.rowcount
                
                # Update lessons
                cursor.execute("UPDATE lessons SET course_id = %s WHERE course_id = %s OR course_id IS NULL", 
                             [course_string_id, str(course_numeric_id)])
                lessons_updated = cursor.rowcount
                
                self.stdout.write(
                    self.style.SUCCESS(f'Updated {chapters_updated} chapters and {lessons_updated} lessons to use course_id = {course_string_id}')
                )