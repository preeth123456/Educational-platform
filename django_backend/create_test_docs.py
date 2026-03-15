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

# Check if teacher exists
cursor.execute("SELECT teacher_id, name FROM educators WHERE teacher_id='TCH202500030'")
result = cursor.fetchone()

if result:
    teacher_id, name = result
    print(f"Teacher exists: {name} ({teacher_id})")
    
    # Create directory and test documents
    teacher_dir = f"C:/xampp/htdocs/EDUYATA-PROJECT/Eduyta-collaboration/Eduyata-collaboration/django_backend/media/teachers/{teacher_id}"
    os.makedirs(teacher_dir, exist_ok=True)
    
    # Create test documents
    with open(f"{teacher_dir}/profile_picture.jpg", "w") as f:
        f.write("test profile picture content")
    
    with open(f"{teacher_dir}/cv_file.pdf", "w") as f:
        f.write("test cv content")
        
    with open(f"{teacher_dir}/degree_certificate.pdf", "w") as f:
        f.write("test degree certificate content")
    
    print(f"Created test documents in: {teacher_dir}")
else:
    print("Teacher TCH202500030 not found")

conn.close()