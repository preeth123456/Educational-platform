import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from django.db import connection

def create_project_tables():
    with connection.cursor() as cursor:
        # Create projects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                teacher_id INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                due_date DATETIME NULL,
                is_active BOOLEAN DEFAULT TRUE
            )
        """)
        
        # Create project_groups table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS project_groups (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        """)
        
        # Create project_group_members table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS project_group_members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                group_id INT NOT NULL,
                student_id INT NOT NULL,
                student_name VARCHAR(100) NOT NULL,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES project_groups(id) ON DELETE CASCADE,
                UNIQUE KEY unique_group_student (group_id, student_id)
            )
        """)
        
        # Create project_documents table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS project_documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                title VARCHAR(200) NOT NULL,
                file VARCHAR(100) NOT NULL,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        """)
        
        # Create project_submissions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS project_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                group_id INT NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                file VARCHAR(100),
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                grade DECIMAL(5,2) NULL,
                feedback TEXT,
                FOREIGN KEY (group_id) REFERENCES project_groups(id) ON DELETE CASCADE
            )
        """)
        
        print("All project tables created successfully!")

if __name__ == "__main__":
    create_project_tables()