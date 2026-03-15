import pymysql
import os
from django.conf import settings

# Database connection
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

# Check teacher documents in database
cursor.execute("""
    SELECT teacher_id, name, profile_picture, cv_file, degree_certificate, 
           achievements_file, experience_proof_file 
    FROM educators 
    WHERE teacher_id='TCH202500016'
""")

result = cursor.fetchone()
if result:
    teacher_id, name, profile_pic, cv, degree, achievements, experience = result
    print(f"Teacher: {name} ({teacher_id})")
    print(f"Profile Picture: {profile_pic}")
    print(f"CV File: {cv}")
    print(f"Degree Certificate: {degree}")
    print(f"Achievements File: {achievements}")
    print(f"Experience Proof: {experience}")
    
    # Check if files exist on disk
    media_root = "C:/xampp/htdocs/EDUYATA-PROJECT/Eduyta-collaboration/Eduyata-collaboration/django_backend/media"
    teacher_dir = os.path.join(media_root, "uploads", "teachers", teacher_id)
    
    print(f"\nChecking directory: {teacher_dir}")
    if os.path.exists(teacher_dir):
        print("Files in teacher directory:")
        for file in os.listdir(teacher_dir):
            file_path = os.path.join(teacher_dir, file)
            size = os.path.getsize(file_path)
            print(f"  - {file} ({size} bytes)")
    else:
        print("Teacher directory does not exist")
        
    # Check media root structure
    uploads_dir = os.path.join(media_root, "uploads")
    if os.path.exists(uploads_dir):
        print(f"\nUploads directory exists: {uploads_dir}")
        teachers_dir = os.path.join(uploads_dir, "teachers")
        if os.path.exists(teachers_dir):
            print("Teacher directories:")
            for dir_name in os.listdir(teachers_dir):
                dir_path = os.path.join(teachers_dir, dir_name)
                if os.path.isdir(dir_path):
                    file_count = len(os.listdir(dir_path))
                    print(f"  - {dir_name} ({file_count} files)")
else:
    print("Teacher not found")

conn.close()