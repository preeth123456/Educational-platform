from django.core.management.base import BaseCommand
from django.db import connection
import uuid

class Command(BaseCommand):
    help = 'Fix existing context data with session tokens'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Update existing active_user_contexts with session tokens
            cursor.execute("""
                UPDATE active_user_contexts 
                SET session_token = %s 
                WHERE session_token IS NULL OR session_token = ''
            """, [str(uuid.uuid4())])
            
            self.stdout.write(f"Updated {cursor.rowcount} active contexts with session tokens")
            
            # Update user_sessions with context_id from active contexts
            cursor.execute("""
                UPDATE user_sessions us
                JOIN active_user_contexts auc ON us.user_id = auc.user_id AND us.user_type = auc.user_type
                SET us.current_context_id = auc.current_context_id
                WHERE us.current_context_id IS NULL
            """)
            
            self.stdout.write(f"Updated {cursor.rowcount} user sessions with context IDs")
            
        self.stdout.write(self.style.SUCCESS('Context data fixed successfully!'))