#!/usr/bin/env python3
"""
Test the course structure API directly
"""

import requests
import json

def test_course_structure():
    print("🧪 Testing Course Structure API")
    print("=" * 40)
    
    try:
        # Test course structure API
        url = "http://localhost:8001/api/courses/course/1/structure/"
        print(f"📡 Calling: {url}")
        
        response = requests.get(url)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API Response:")
            print(json.dumps(data, indent=2))
            
            # Analyze the structure
            if data.get('status') == 'success':
                course_data = data.get('data', {})
                chapters = course_data.get('chapters', [])
                print(f"\n📚 Found {len(chapters)} chapters")
                
                for i, chapter in enumerate(chapters):
                    lessons = chapter.get('lessons', [])
                    print(f"  Chapter {i+1}: {chapter.get('title')} ({len(lessons)} lessons)")
                    
                    for j, lesson in enumerate(lessons):
                        contents = lesson.get('contents', [])
                        print(f"    Lesson {j+1}: {lesson.get('title')} ({len(contents)} contents)")
            else:
                print(f"❌ API Error: {data.get('message')}")
        else:
            print(f"❌ HTTP Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_course_structure()