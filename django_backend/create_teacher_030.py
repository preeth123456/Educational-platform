import pymysql
import os
import json

# Database connection
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

# Insert teacher
teacher_data = {
    'teacher_id': 'TCH202500030',
    'name': 'Test Teacher 030',
    'email': 'test030@teacher.com',
    'mobile': '9876543030',
    'qualification': 'M.Sc Mathematics',
    'experience_years': 5,
    'bio': 'Mathematics teacher with 5 years experience',
    'boards': ['CBSE', 'State Board'],
    'subject_classes': {'Mathematics': ['9', '10', '11', '12']},
    'languages_known': ['English', 'Hindi'],
    'teaching_experience_institutes': []
}

cursor.execute("""
    INSERT INTO educators (teacher_id, name, email, mobile, qualification, experience_years, bio, 
                          boards, subject_classes, languages_known, teaching_experience_institutes, 
                          profile_completed, is_active, document_status)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
""", (
    teacher_data['teacher_id'],
    teacher_data['name'],
    teacher_data['email'],
    teacher_data['mobile'],
    teacher_data['qualification'],
    teacher_data['experience_years'],
    teacher_data['bio'],
    json.dumps(teacher_data['boards']),
    json.dumps(teacher_data['subject_classes']),
    json.dumps(teacher_data['languages_known']),
    json.dumps(teacher_data['teaching_experience_institutes']),
    True,
    False,
    'Pending'
))

conn.commit()
print(f"Created teacher: {teacher_data['name']} ({teacher_data['teacher_id']})")

# Create directory and documents
teacher_dir = f"C:/xampp/htdocs/EDUYATA-PROJECT/Eduyta-collaboration/Eduyata-collaboration/django_backend/media/teachers/{teacher_data['teacher_id']}"
os.makedirs(teacher_dir, exist_ok=True)

# Create test documents
with open(f"{teacher_dir}/profile_picture.jpg", "w") as f:
    f.write("test profile picture content")

with open(f"{teacher_dir}/cv_file.pdf", "w") as f:
    f.write("test cv content")
    
with open(f"{teacher_dir}/degree_certificate.pdf", "w") as f:
    f.write("test degree certificate content")

with open(f"{teacher_dir}/achievements.pdf", "w") as f:
    f.write("test achievements content")

print(f"Created documents in: {teacher_dir}")

conn.close()