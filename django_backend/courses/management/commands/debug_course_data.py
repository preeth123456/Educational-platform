from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Clear chapters and lessons that are not properly linked to courses'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Get all courses and their proper course_id strings
            cursor.execute("SELECT id, course_id FROM courses")
            courses = cursor.fetchall()
            
            for course_numeric_id, course_string_id in courses:
                self.stdout.write(f"Course {course_numeric_id}: {course_string_id}")
                
                # Count chapters for this course
                cursor.execute("SELECT COUNT(*) FROM chapters WHERE course_id = %s", [course_string_id])
                chapter_count = cursor.fetchone()[0]
                
                # Count lessons for this course
                cursor.execute("SELECT COUNT(*) FROM lessons WHERE course_id = %s", [course_string_id])
                lesson_count = cursor.fetchone()[0]
                
                self.stdout.write(f"  Chapters: {chapter_count}, Lessons: {lesson_count}")
            
            # Show chapters that might be linked to wrong courses
            cursor.execute("SELECT id, title, course_id FROM chapters")
            chapters = cursor.fetchall()
            
            self.stdout.write("\nAll chapters:")
            for chapter_id, title, course_id in chapters:
                self.stdout.write(f"  Chapter {chapter_id}: {title} -> Course: {course_id}")
                
            # Show lessons that might be linked to wrong courses  
            cursor.execute("SELECT id, title, course_id FROM lessons")
            lessons = cursor.fetchall()
            
            self.stdout.write("\nAll lessons:")
            for lesson_id, title, course_id in lessons:
                self.stdout.write(f"  Lesson {lesson_id}: {title} -> Course: {course_id}")