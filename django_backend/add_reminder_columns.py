import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
config = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'database': os.getenv('DB_NAME', 'eduyata_db'),
    'port': int(os.getenv('DB_PORT', '3306'))
}

try:
    # Connect to database
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    # Add reminder tracking columns
    alter_commands = [
        "ALTER TABLE schedules ADD COLUMN reminder_1_day_sent BOOLEAN DEFAULT FALSE",
        "ALTER TABLE schedules ADD COLUMN reminder_1_hour_sent BOOLEAN DEFAULT FALSE"
    ]

    for command in alter_commands:
        try:
            cursor.execute(command)
            print(f"Executed: {command}")
        except Exception as e:
            print(f"Error executing command: {e}")

    conn.commit()
    print("Reminder tracking columns added successfully!")

except Exception as e:
    print(f"Database error: {e}")

finally:
    if 'conn' in locals():
        conn.close()