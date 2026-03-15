from django.core.management.base import BaseCommand
from django.db import transaction
from django.db import models
from auth_app.models import Educator
from auth_app.encryption import EncryptionManager

class Command(BaseCommand):
    help = 'Encrypt existing email and mobile data for educators'

    def handle(self, *args, **options):
        self.stdout.write('Starting encryption of existing educator data...')
        
        with transaction.atomic():
            educators = Educator.objects.filter(
                models.Q(email_encrypted__isnull=True) | models.Q(mobile_encrypted__isnull=True)
            )
            
            count = 0
            for educator in educators:
                try:
                    # Encrypt email if not already encrypted
                    if educator.email and not educator.email_encrypted:
                        educator.email_encrypted = EncryptionManager.encrypt(educator.email)
                    
                    # Encrypt mobile if not already encrypted
                    if educator.mobile and not educator.mobile_encrypted:
                        educator.mobile_encrypted = EncryptionManager.encrypt(educator.mobile)
                    
                    educator.save(update_fields=['email_encrypted', 'mobile_encrypted'])
                    count += 1
                    
                    if count % 100 == 0:
                        self.stdout.write(f'Encrypted {count} records...')
                        
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Failed to encrypt data for educator {educator.id}: {str(e)}')
                    )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully encrypted data for {count} educators')
            )