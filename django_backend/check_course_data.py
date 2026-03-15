#!/usr/bin/env python3
"""
Database Check Script for Course 1
Checks if chapters, lessons, and lesson_contents exist
"""

import os
import sys
import django

# Add the Django project to the path
sys.path.append('d:/AlstonairProject1/Eduyata/django_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def check_course_data():
    cursor = connection.cursor()
    
    print("🔍 Checking Course 1 Data Structure")
    print("=" * 50)
    
    # Check course exists
    cursor.execute("SELECT id, title, is_published FROM courses WHERE id = 1")
    course = cursor.fetchone()
    if course:
        print(f"✅ Course Found: ID={course[0]}, Title='{course[1]}', Published={course[2]}")
    else:
        print("❌ Course 1 not found!")
        return
    
    # Check chapters
    cursor.execute("SELECT id, title, chapter_no FROM chapters WHERE course_id = 1 ORDER BY chapter_no")
    chapters = cursor.fetchall()
    print(f"\n📚 Chapters ({len(chapters)} found):")
    
    if not chapters:
        print("❌ No chapters found for course 1")
        return
    
    for chapter in chapters:
        print(f"  Chapter {chapter[2]}: {chapter[1]} (ID: {chapter[0]})")
        
        # Check lessons for this chapter
        cursor.execute("SELECT id, title, lesson_no FROM lessons WHERE chapter_id = %s ORDER BY lesson_no", [chapter[0]])
        lessons = cursor.fetchall()
        print(f"    📖 Lessons ({len(lessons)} found):")
        
        if not lessons:
            print("    ❌ No lessons found for this chapter")
            continue
            
        for lesson in lessons:
            print(f"      Lesson {lesson[2]}: {lesson[1]} (ID: {lesson[0]})")
            
            # Check lesson contents
            cursor.execute("SELECT id, title, content_type FROM lesson_contents WHERE lesson_id = %s ORDER BY content_order", [lesson[0]])
            contents = cursor.fetchall()
            print(f"        📄 Contents ({len(contents)} found):")
            
            if not contents:
                print("        ❌ No contents found for this lesson")
                continue
                
            for content in contents:
                print(f"          - {content[1]} ({content[2]}) (ID: {content[0]})")
    
    print("\n" + "=" * 50)
    print("✨ Database check completed!")

if __name__ == "__main__":
    try:
        check_course_data()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()