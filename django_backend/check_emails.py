import pymysql

# Database connection
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

# Get teacher emails
cursor.execute("SELECT teacher_id, name, email FROM educators WHERE teacher_id IN ('TCH202500030', 'TCH202500016') ORDER BY id DESC")
results = cursor.fetchall()

print("Teacher emails in database:")
for teacher_id, name, email in results:
    print(f"  {teacher_id}: {name} -> {email}")

# Check if there are any real email addresses
cursor.execute("SELECT teacher_id, name, email FROM educators WHERE email NOT LIKE 'encrypted_%' LIMIT 5")
real_emails = cursor.fetchall()

print("\nTeachers with real email addresses:")
for teacher_id, name, email in real_emails:
    print(f"  {teacher_id}: {name} -> {email}")

conn.close()