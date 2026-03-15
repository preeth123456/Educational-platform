from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Clean up orphaned chapters and lessons that reference non-existent courses'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        
        try:
            # Clean up chapters with non-existent course_id
            cursor.execute("""
                DELETE FROM chapters 
                WHERE course_id IS NOT NULL 
                AND course_id NOT IN (SELECT id FROM courses)
            """)
            deleted_chapters = cursor.rowcount
            self.stdout.write(f"Deleted {deleted_chapters} orphaned chapters")
            
            # Clean up lessons with non-existent course_id
            cursor.execute("""
                DELETE FROM lessons 
                WHERE course_id IS NOT NULL 
                AND course_id NOT IN (SELECT id FROM courses)
            """)
            deleted_lessons = cursor.rowcount
            self.stdout.write(f"Deleted {deleted_lessons} orphaned lessons")
            
            # Clean up lessons with non-existent chapter_id
            cursor.execute("""
                DELETE FROM lessons 
                WHERE chapter_id NOT IN (SELECT id FROM chapters)
            """)
            deleted_lessons_orphaned = cursor.rowcount
            self.stdout.write(f"Deleted {deleted_lessons_orphaned} lessons with orphaned chapter references")
            
            # Show final counts
            cursor.execute("SELECT COUNT(*) FROM chapters")
            chapters_count = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM lessons")
            lessons_count = cursor.fetchone()[0]
            
            self.stdout.write(self.style.SUCCESS(f"Final counts - Chapters: {chapters_count}, Lessons: {lessons_count}"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error cleaning up orphaned data: {e}"))