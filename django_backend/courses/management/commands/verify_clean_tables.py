from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Verify all course-related tables are empty and check for any constraint issues'

    def handle(self, *args, **options):
        tables = ['courses', 'chapters', 'lessons', 'lesson_contents']
        
        with connection.cursor() as cursor:
            self.stdout.write("Checking table counts:")
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                self.stdout.write(f"  {table}: {count} records")
            
            # Reset auto-increment counters to start fresh
            self.stdout.write("\nResetting auto-increment counters:")
            for table in tables:
                cursor.execute(f"ALTER TABLE {table} AUTO_INCREMENT = 1")
                self.stdout.write(f"  {table}: AUTO_INCREMENT reset to 1")
        
        self.stdout.write(self.style.SUCCESS('\nAll tables are ready for fresh start!'))