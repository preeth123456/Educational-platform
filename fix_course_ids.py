import os
import django
import sys

# Add the project directory to Python path
sys.path.append('d:/AlstonairProject1/Eduyata/django_backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings')
django.setup()

from django.db import connection

def fix_null_course_ids():
    cursor = connection.cursor()
    
    # Update chapter with NULL course_id to COURSE0002 (since it was created for COURSE0002)
    cursor.execute("UPDATE chapters SET course_id = 'COURSE0002' WHERE id = 4 AND course_id IS NULL")
    print(f"Updated {cursor.rowcount} chapter(s)")
    
    # Update lessons with NULL course_id to COURSE0002
    cursor.execute("UPDATE lessons SET course_id = 'COURSE0002' WHERE course_id IS NULL")
    print(f"Updated {cursor.rowcount} lesson(s)")
    
    # Verify the fixes
    cursor.execute("SELECT id, title, course_id FROM chapters WHERE course_id IS NULL")
    null_chapters = cursor.fetchall()
    print(f"Remaining chapters with NULL course_id: {len(null_chapters)}")
    
    cursor.execute("SELECT id, title, course_id FROM lessons WHERE course_id IS NULL")
    null_lessons = cursor.fetchall()
    print(f"Remaining lessons with NULL course_id: {len(null_lessons)}")

if __name__ == "__main__":
    fix_null_course_ids()