from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Setup context switching database tables'

    def handle(self, *args, **options):
        sql_commands = [
            """
            CREATE TABLE IF NOT EXISTS user_contexts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_type VARCHAR(10) NOT NULL,
                context_type VARCHAR(20) NOT NULL,
                context_id VARCHAR(50) NOT NULL,
                context_name VARCHAR(255) NOT NULL,
                permissions JSON,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_context (user_id, user_type, context_type, context_id),
                INDEX idx_user_context (user_id, user_type),
                INDEX idx_context_type (context_type)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS active_user_contexts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_type VARCHAR(10) NOT NULL,
                current_context_id INT NOT NULL,
                session_token VARCHAR(255),
                switched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_active_user (user_id, user_type),
                FOREIGN KEY (current_context_id) REFERENCES user_contexts(id) ON DELETE CASCADE,
                INDEX idx_session_token (session_token)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS context_switch_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_type VARCHAR(10) NOT NULL,
                from_context_id VARCHAR(50),
                to_context_id VARCHAR(50) NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                success BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_switch_log (user_id, user_type),
                INDEX idx_switch_time (created_at)
            )
            """,
            """
            ALTER TABLE user_sessions 
            ADD COLUMN IF NOT EXISTS current_context_id INT,
            ADD INDEX IF NOT EXISTS idx_current_context (current_context_id)
            """
        ]

        with connection.cursor() as cursor:
            for sql in sql_commands:
                try:
                    cursor.execute(sql)
                    self.stdout.write(f"OK: Executed table creation")
                except Exception as e:
                    self.stdout.write(f"Error: {e}")

        self.stdout.write(self.style.SUCCESS('Context switching tables setup complete!'))