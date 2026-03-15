#!/usr/bin/env python3
"""
Test script for Student Learning System APIs
Run this to test the new APIs for course learning experience
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/courses"

def test_course_details(course_id=1):
    """Test get course details API"""
    print(f"\n=== Testing Course Details API ===")
    url = f"{BASE_URL}/course/{course_id}/details/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Course Details API working!")
            print(f"Course Title: {data['data']['title']}")
            print(f"Teacher: {data['data']['teacher']['name']}")
            print(f"Category: {data['data']['category']}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

def test_course_structure(course_id=1):
    """Test get course structure API"""
    print(f"\n=== Testing Course Structure API ===")
    url = f"{BASE_URL}/course/{course_id}/structure/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Course Structure API working!")
            print(f"Course: {data['data']['course']['title']}")
            print(f"Chapters: {len(data['data']['chapters'])}")
            
            for chapter in data['data']['chapters']:
                print(f"  Chapter {chapter['chapter_no']}: {chapter['title']}")
                print(f"    Lessons: {len(chapter['lessons'])}")
                for lesson in chapter['lessons']:
                    print(f"      Lesson {lesson['lesson_no']}: {lesson['title']}")
                    print(f"        Contents: {len(lesson['contents'])}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

def test_enrollment_check(course_id=1, student_id=1):
    """Test check enrollment API"""
    print(f"\n=== Testing Enrollment Check API ===")
    url = f"{BASE_URL}/course/{course_id}/enrollment/{student_id}/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Enrollment Check API working!")
            print(f"Is Enrolled: {data['data']['is_enrolled']}")
            if data['data']['is_enrolled']:
                print(f"Enrollment Status: {data['data']['enrollment_status']}")
                print(f"Progress: {data['data']['progress_percentage']}%")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

def main():
    """Run all tests"""
    print("🚀 Testing Student Learning System APIs")
    print("=" * 50)
    
    # Test with course_id=1 and student_id=1
    course_id = 1
    student_id = 1
    
    test_course_details(course_id)
    test_course_structure(course_id)
    test_enrollment_check(course_id, student_id)
    
    print("\n" + "=" * 50)
    print("✨ Testing completed!")
    print("\nNext steps:")
    print("1. Use these APIs in your React frontend")
    print("2. Create the learning interface at /course/1/learn")
    print("3. Display chapters, lessons, and content")

if __name__ == "__main__":
    main()