import pymysql

conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='eduyata_db'
)

cursor = conn.cursor()

print("Checking student_progress for student_id=26:")
cursor.execute("SELECT * FROM student_progress WHERE student_id = 26")
results = cursor.fetchall()
print(f"Found {len(results)} records")
for row in results:
    print(row)

print("\nChecking video_progress for student_id=26:")
cursor.execute("SELECT * FROM video_progress WHERE student_id = 26")
results = cursor.fetchall()
print(f"Found {len(results)} records")

print("\nChecking quiz_results for student_id=26:")
cursor.execute("SELECT * FROM quiz_results WHERE student_id = 26")
results = cursor.fetchall()
print(f"Found {len(results)} records")

print("\nChecking all student_progress records:")
cursor.execute("SELECT student_id, COUNT(*) as course_count FROM student_progress GROUP BY student_id")
results = cursor.fetchall()
for row in results:
    print(f"Student {row[0]}: {row[1]} courses")

conn.close()
