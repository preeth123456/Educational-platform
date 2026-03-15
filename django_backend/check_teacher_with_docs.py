import pymysql
import os

# Database connection
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

# Check teacher with documents
teacher_id = 'TCH202500015'
cursor.execute("""
    SELECT teacher_id, name, profile_picture, cv_file, degree_certificate, 
           achievements_file, experience_proof_file 
    FROM educators 
    WHERE teacher_id=%s
""", (teacher_id,))

result = cursor.fetchone()
if result:
    teacher_id, name, profile_pic, cv, degree, achievements, experience = result
    print(f"Teacher: {name} ({teacher_id})")
    print(f"Profile Picture: {profile_pic}")
    print(f"CV File: {cv}")
    print(f"Degree Certificate: {degree}")
    print(f"Achievements File: {achievements}")
    print(f"Experience Proof: {experience}")
    
    # Check files in directory
    media_root = "C:/xampp/htdocs/EDUYATA-PROJECT/Eduyta-collaboration/Eduyata-collaboration/django_backend/media"
    teacher_dir = os.path.join(media_root, "uploads", "teachers", teacher_id)
    
    print(f"\nChecking directory: {teacher_dir}")
    if os.path.exists(teacher_dir):
        print("Files in teacher directory:")
        for file in os.listdir(teacher_dir):
            file_path = os.path.join(teacher_dir, file)
            if os.path.isfile(file_path):
                size = os.path.getsize(file_path)
                print(f"  - {file} ({size} bytes)")

conn.close()