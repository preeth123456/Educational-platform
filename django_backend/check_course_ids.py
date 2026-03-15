#!/usr/bin/env python3
"""
Check course_id values in chapters and lessons tables
"""

import os
import sys
import django

# Add the Django project to the path
sys.path.append('d:/AlstonairProject1/Eduyata/django_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def check_course_ids():
    cursor = connection.cursor()
    
    print("🔍 Checking course_id values in tables")
    print("=" * 50)
    
    # Check courses table
    cursor.execute("SELECT id, course_id, title FROM courses")
    courses = cursor.fetchall()
    print(f"📚 Courses table ({len(courses)} found):")
    for course in courses:
        print(f"  ID: {course[0]}, course_id: '{course[1]}', title: '{course[2][:50]}...'")
    
    # Check chapters table
    cursor.execute("SELECT id, title, course_id FROM chapters")
    chapters = cursor.fetchall()
    print(f"\n📖 Chapters table ({len(chapters)} found):")
    for chapter in chapters:
        print(f"  ID: {chapter[0]}, title: '{chapter[1]}', course_id: '{chapter[2]}'")
    
    # Check lessons table
    cursor.execute("SELECT id, title, course_id, chapter_id FROM lessons")
    lessons = cursor.fetchall()
    print(f"\n📝 Lessons table ({len(lessons)} found):")
    for lesson in lessons:
        print(f"  ID: {lesson[0]}, title: '{lesson[1]}', course_id: '{lesson[2]}', chapter_id: {lesson[3]}")
    
    # Check lesson_contents table
    cursor.execute("SELECT id, title, lesson_id FROM lesson_contents")
    contents = cursor.fetchall()
    print(f"\n📄 Lesson_contents table ({len(contents)} found):")
    for content in contents:
        print(f"  ID: {content[0]}, title: '{content[1]}', lesson_id: {content[2]}")
    
    print("\n" + "=" * 50)
    print("✨ Check completed!")

if __name__ == "__main__":
    try:
        check_course_ids()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()