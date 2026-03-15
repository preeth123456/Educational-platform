import mysql.connector
import os

# Database configuration
config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'eduyata_db'
}

try:
    # Connect to database
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    # First check current table structure
    cursor.execute("DESCRIBE student_enrollments")
    columns = cursor.fetchall()
    print("Current student_enrollments table structure:")
    for col in columns:
        print(f"  Column: {col[0]}, Type: {col[1]}, Extra: {col[5] if len(col) > 5 else 'N/A'}")

    # Fix student_enrollments table
    try:
        alter_command = "ALTER TABLE student_enrollments MODIFY COLUMN id INT PRIMARY KEY AUTO_INCREMENT;"
        cursor.execute(alter_command)
        conn.commit()
        print("Successfully added PRIMARY KEY and AUTO_INCREMENT to student_enrollments.id")
    except Exception as alter_error:
        if "AUTO_INCREMENT" in str(alter_error) or "PRIMARY KEY" in str(alter_error):
            print("PRIMARY KEY and AUTO_INCREMENT already exist on student_enrollments.id. No changes needed.")
        else:
            print(f"Error altering student_enrollments table: {alter_error}")

    # Also fix student_activities table if it exists
    try:
        cursor.execute("DESCRIBE student_activities")
        alter_command = "ALTER TABLE student_activities MODIFY COLUMN id INT PRIMARY KEY AUTO_INCREMENT;"
        cursor.execute(alter_command)
        conn.commit()
        print("Successfully added PRIMARY KEY and AUTO_INCREMENT to student_activities.id")
    except Exception as alter_error:
        if "doesn't exist" in str(alter_error):
            print("student_activities table doesn't exist. Skipping.")
        elif "AUTO_INCREMENT" in str(alter_error) or "PRIMARY KEY" in str(alter_error):
            print("PRIMARY KEY and AUTO_INCREMENT already exist on student_activities.id. No changes needed.")
        else:
            print(f"Error altering student_activities table: {alter_error}")

    print("Database fix completed successfully!")

except Exception as e:
    print(f"Database error: {e}")

finally:
    if 'conn' in locals():
        conn.close()