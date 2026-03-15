import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def execute_sql_file():
    with open('create_grievance_tables.sql', 'r') as file:
        sql_content = file.read()
    
    # Split by semicolon and execute each statement
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
    
    with connection.cursor() as cursor:
        for statement in statements:
            if statement:
                print(f"Executing: {statement[:50]}...")
                cursor.execute(statement)
                print("Success")
    
    print(f"\nCreated {len(statements)} grievance tables successfully!")

if __name__ == "__main__":
    execute_sql_file()