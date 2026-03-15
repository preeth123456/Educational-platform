from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Add course_id columns to chapters and lessons tables'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        
        try:
            # Add course_id column to chapters table
            cursor.execute("ALTER TABLE chapters ADD COLUMN course_id INT NULL")
            self.stdout.write(self.style.SUCCESS('Added course_id column to chapters table'))
        except Exception as e:
            if 'Duplicate column name' in str(e):
                self.stdout.write(self.style.WARNING('course_id column already exists in chapters table'))
            else:
                self.stdout.write(self.style.ERROR(f'Error adding course_id to chapters: {e}'))
        
        try:
            # Add course_id column to lessons table
            cursor.execute("ALTER TABLE lessons ADD COLUMN course_id INT NULL")
            self.stdout.write(self.style.SUCCESS('Added course_id column to lessons table'))
        except Exception as e:
            if 'Duplicate column name' in str(e):
                self.stdout.write(self.style.WARNING('course_id column already exists in lessons table'))
            else:
                self.stdout.write(self.style.ERROR(f'Error adding course_id to lessons: {e}'))
        
        try:
            # Add indexes for better performance
            cursor.execute("CREATE INDEX idx_chapters_course_id ON chapters(course_id)")
            self.stdout.write(self.style.SUCCESS('Added index on chapters.course_id'))
        except Exception as e:
            if 'Duplicate key name' in str(e):
                self.stdout.write(self.style.WARNING('Index on chapters.course_id already exists'))
            else:
                self.stdout.write(self.style.ERROR(f'Error creating index on chapters: {e}'))
        
        try:
            cursor.execute("CREATE INDEX idx_lessons_course_id ON lessons(course_id)")
            self.stdout.write(self.style.SUCCESS('Added index on lessons.course_id'))
        except Exception as e:
            if 'Duplicate key name' in str(e):
                self.stdout.write(self.style.WARNING('Index on lessons.course_id already exists'))
            else:
                self.stdout.write(self.style.ERROR(f'Error creating index on lessons: {e}'))
        
        self.stdout.write(self.style.SUCCESS('Migration completed successfully'))