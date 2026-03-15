from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Clean up duplicate courses, keeping only one per subject/class/board combination'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        
        try:
            # First, let's see what we have
            cursor.execute("SELECT id, title, category FROM courses ORDER BY category, created_at")
            all_courses = cursor.fetchall()
            
            self.stdout.write(f"Found {len(all_courses)} total courses")
            
            # Group courses by category (board-class-subject)
            categories_seen = {}
            courses_to_delete = []
            
            for course_id, title, category in all_courses:
                if category in categories_seen:
                    # This is a duplicate, mark for deletion
                    courses_to_delete.append(course_id)
                    self.stdout.write(f"Marking duplicate for deletion: {title} (ID: {course_id})")
                else:
                    # First occurrence, keep it
                    categories_seen[category] = course_id
                    self.stdout.write(f"Keeping: {title} (ID: {course_id})")
            
            # Delete duplicate courses
            if courses_to_delete:
                self.stdout.write(f"\nDeleting {len(courses_to_delete)} duplicate courses...")
                
                # Delete related data first (enrollments, progress, etc.)
                for course_id in courses_to_delete:
                    cursor.execute("DELETE FROM student_enrollments WHERE course_id = %s", [course_id])
                    cursor.execute("DELETE FROM student_progress WHERE course_id = %s", [course_id])
                    cursor.execute("DELETE FROM video_progress WHERE course_id = %s", [course_id])
                    cursor.execute("DELETE FROM quiz_results WHERE course_id = %s", [course_id])
                
                # Delete the courses
                course_ids_str = ','.join(map(str, courses_to_delete))
                cursor.execute(f"DELETE FROM courses WHERE id IN ({course_ids_str})")
                
                self.stdout.write(self.style.SUCCESS(f"Successfully deleted {len(courses_to_delete)} duplicate courses"))
            else:
                self.stdout.write("No duplicate courses found")
            
            # Show final count
            cursor.execute("SELECT COUNT(*) FROM courses")
            final_count = cursor.fetchone()[0]
            self.stdout.write(self.style.SUCCESS(f"Final course count: {final_count}"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error cleaning up courses: {e}"))