import json
from .encryption import EncryptionService, EncryptionKey
from admin_auth.models import AdminNotification
from django.utils import timezone
from django.db import models

class VaultService:
    """
    High-level vault operations with audit logging
    """
    
    @staticmethod
    def store_secret(integration_id, config_dict, user, request=None):
        """Store encrypted config with audit log"""
        try:
            encrypted_config = EncryptionService.encrypt_config(config_dict)
            
            VaultService.audit_secret_access(
                integration_id=integration_id,
                action='secret_stored',
                user=user,
                request=request,
                details=f"Stored {len(config_dict)} configuration fields"
            )
            
            return encrypted_config
            
        except Exception as e:
            VaultService.audit_secret_access(
                integration_id=integration_id,
                action='secret_store_failed',
                user=user,
                request=request,
                details=f"Storage failed: {str(e)}"
            )
            raise
        
    @staticmethod
    def retrieve_secret(integration_id, user, request=None):
        """Retrieve and decrypt config with audit log"""
        try:
            from .models import Integration
            
            integration = Integration.objects.get(id=integration_id)
            decrypted_config = EncryptionService.decrypt_config(integration.config)
            
            VaultService.audit_secret_access(
                integration_id=integration_id,
                action='secret_accessed',
                user=user,
                request=request,
                details=f"Accessed {integration.name} configuration"
            )
            
            return decrypted_config
            
        except Exception as e:
            VaultService.audit_secret_access(
                integration_id=integration_id,
                action='secret_access_failed',
                user=user,
                request=request,
                details=f"Access failed: {str(e)}"
            )
            raise
        
    @staticmethod
    def rotate_keys(user=None, request=None):
        """Rotate encryption keys"""
        try:
            success = EncryptionService.rotate_keys()
            
            if success:
                VaultService.audit_secret_access(
                    integration_id=None,
                    action='keys_rotated',
                    user=user,
                    request=request,
                    details="Encryption keys rotated successfully"
                )
                return True
            else:
                raise ValueError("Key rotation returned false")
                
        except Exception as e:
            VaultService.audit_secret_access(
                integration_id=None,
                action='key_rotation_failed',
                user=user,
                request=request,
                details=f"Key rotation failed: {str(e)}"
            )
            raise
        
    @staticmethod
    def audit_secret_access(integration_id, action, user, request=None, details=None):
        """Log secret access to admin_notifications"""
        try:
            ip_address = None
            if request:
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip_address = x_forwarded_for.split(',')[0]
                else:
                    ip_address = request.META.get('REMOTE_ADDR')
            
            username = user.username if (user and hasattr(user, 'username')) else str(user) if user else 'system'
            user_id = user.id if (user and hasattr(user, 'id')) else None

            # Note: teacher_id and teacher_name are used in AdminNotification for legacy reasons
            # but here we reuse them for integration_id and username
            AdminNotification.objects.create(
                title=f"Vault Access: {action}",
                message=details or f"User {username} performed {action}",
                notification_type='vault_audit',
                teacher_id=str(integration_id) if integration_id else None,
                teacher_name=username,
                is_read=False,
                webhook_event_type=action,
                webhook_event_data={
                    'integration_id': integration_id,
                    'action': action,
                    'user_id': user_id,
                    'username': username,
                    'ip_address': ip_address,
                    'timestamp': timezone.now().isoformat(),
                    'details': details
                }
            )
            
        except Exception as e:
            print(f"Audit logging failed: {str(e)}")
    
    @staticmethod
    def get_vault_health():
        """Get vault health status"""
        try:
            active_keys = EncryptionKey.objects.filter(is_active=True).count()
            total_keys = EncryptionKey.objects.count()
            last_rotation = EncryptionKey.objects.filter(is_active=True).first()
            
            # Self-Healing: If DB is empty, force regeneration (ignore cache)
            if active_keys == 0:
                EncryptionService._CACHED_KEY = None
                from django.core.cache import cache
                cache.delete('vault_encryption_key')
                # Trigger generation
                EncryptionService.encrypt_value("heal_trigger")
                # Update status
                active_keys = EncryptionKey.objects.filter(is_active=True).count()
                last_rotation = EncryptionKey.objects.filter(is_active=True).first()
            
            # Test encryption/decryption
            test_data = {"test_key": "test_value"}
            encrypted = EncryptionService.encrypt_config(test_data)
            decrypted = EncryptionService.decrypt_config(encrypted)
            
            encryption_working = decrypted.get("test_key") == "test_value"
            
            return {
                "status": "healthy" if encryption_working and active_keys > 0 else "unhealthy",
                "encryption_status": "working" if encryption_working else "failed",
                "active_keys": active_keys,
                "total_keys": total_keys,
                "last_rotation": last_rotation.created_at.isoformat() if last_rotation else None,
                "algorithm": EncryptionService.ALGORITHM_NAME,
                "kdf": EncryptionService.KDF_NAME,
                "encryption_algorithm": EncryptionService.ALGORITHM_NAME,
                "key_derivation": EncryptionService.KDF_NAME
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "encryption_status": "failed",
                "error": str(e),
                "active_keys": 0,
                "total_keys": 0,
                "last_rotation": None
            }
