from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Fix orphaned chapters and ensure course-specific data'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        
        try:
            # First, let's see what chapters exist
            cursor.execute("SELECT id, title, course_id FROM chapters ORDER BY id")
            chapters = cursor.fetchall()
            
            self.stdout.write(f"Found {len(chapters)} chapters:")
            for chapter_id, title, course_id in chapters:
                self.stdout.write(f"  Chapter {chapter_id}: {title} (course_id: {course_id})")
            
            # Check which chapters have course_id = NULL (orphaned)
            cursor.execute("SELECT id, title FROM chapters WHERE course_id IS NULL")
            orphaned_chapters = cursor.fetchall()
            
            if orphaned_chapters:
                self.stdout.write(f"\nFound {len(orphaned_chapters)} orphaned chapters (course_id = NULL):")
                for chapter_id, title in orphaned_chapters:
                    self.stdout.write(f"  Chapter {chapter_id}: {title}")
                
                # Delete orphaned chapters and their lessons
                self.stdout.write("\nDeleting orphaned chapters and their lessons...")
                
                for chapter_id, title in orphaned_chapters:
                    # Delete lessons for this chapter
                    cursor.execute("DELETE FROM lessons WHERE chapter_id = %s", [chapter_id])
                    lessons_deleted = cursor.rowcount
                    
                    # Delete the chapter
                    cursor.execute("DELETE FROM chapters WHERE id = %s", [chapter_id])
                    
                    self.stdout.write(f"  Deleted chapter '{title}' and {lessons_deleted} lessons")
                
                self.stdout.write(self.style.SUCCESS(f"Deleted {len(orphaned_chapters)} orphaned chapters"))
            else:
                self.stdout.write("No orphaned chapters found")
            
            # Show final counts
            cursor.execute("SELECT COUNT(*) FROM chapters")
            chapters_count = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM lessons")
            lessons_count = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM courses")
            courses_count = cursor.fetchone()[0]
            
            self.stdout.write(f"\nFinal counts:")
            self.stdout.write(f"  Courses: {courses_count}")
            self.stdout.write(f"  Chapters: {chapters_count}")
            self.stdout.write(f"  Lessons: {lessons_count}")
            
            # Show course-chapter mapping
            cursor.execute("""
                SELECT c.id, c.title, c.category, COUNT(ch.id) as chapter_count
                FROM courses c
                LEFT JOIN chapters ch ON c.id = ch.course_id
                GROUP BY c.id, c.title, c.category
                ORDER BY c.id
            """)
            
            self.stdout.write(f"\nCourse-Chapter mapping:")
            for course_id, title, category, chapter_count in cursor.fetchall():
                self.stdout.write(f"  Course {course_id} ({category}): {chapter_count} chapters")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))