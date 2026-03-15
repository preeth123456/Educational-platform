from django.core.management.base import BaseCommand
from auth_app.context_service import ContextService
from auth_app.context_models import UserContext

class Command(BaseCommand):
    help = 'Test context switching functionality'

    def handle(self, *args, **options):
        # Test with user_id 22 (student)
        user_id = 22
        user_type = 'student'
        
        # Get available contexts
        contexts = ContextService.get_user_contexts(user_id, user_type)
        self.stdout.write(f"Available contexts for user {user_id}: {len(contexts)}")
        
        if contexts:
            # Test context switch
            context_id = contexts[0]['id']
            success, message = ContextService.switch_context(
                user_id=user_id,
                user_type=user_type,
                context_id=context_id,
                session_token='test-session-token',
                ip_address='127.0.0.1',
                user_agent='Test Browser'
            )
            
            self.stdout.write(f"Context switch result: {success} - {message}")
            
            # Check current context
            current = ContextService.get_current_context(user_id, user_type)
            self.stdout.write(f"Current context: {current['context_name'] if current else 'None'}")
            
        self.stdout.write(self.style.SUCCESS('Context switching test completed!'))