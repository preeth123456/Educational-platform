import mysql.connector
import os

# Database configuration - read from .env if available
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

    # Read and execute SQL file
    with open('../add_dismissed_quizzes_column.sql', 'r') as file:
        sql_commands = file.read().split(';')

    for command in sql_commands:
        command = command.strip()
        if command and not command.startswith('--'):
            try:
                cursor.execute(command)
                print(f"Executed: {command[:50]}...")
            except Exception as e:
                print(f"Error executing command: {e}")

    conn.commit()
    print("Dismissed quizzes column added successfully!")

except Exception as e:
    print(f"Database error: {e}")

finally:
    if 'conn' in locals():
        conn.close()