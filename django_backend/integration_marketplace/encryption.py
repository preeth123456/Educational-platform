import os
import json
import secrets
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from django.db import models

from auth_app.models import EncryptionKey

class EncryptionService:
    """
    Handles encryption/decryption of sensitive integration configs
    """
    
    _CACHED_KEY = None
    
    SENSITIVE_FIELDS = [
        'api_key', 'api_secret', 'password', 'token', 
        'webhook_url', 'client_id', 'client_secret', 'private_key', 'access_token'
    ]
    
    # Metadata for Monitoring (Single Source of Truth)
    ALGORITHM_NAME = "AES-128-CBC (Fernet)"
    KDF_NAME = "PBKDF2-HMAC-SHA256 (100k iter)"
    
    @staticmethod
    def _get_encryption_key():
        """Get or create encryption key with Caching Support"""
        if EncryptionService._CACHED_KEY:
             return EncryptionService._CACHED_KEY

        cache_key = 'vault_encryption_key'
        key = cache.get(cache_key)
        
        if not key:
            encryption_key = EncryptionKey.objects.filter(is_active=True).first()
            
            if not encryption_key:
                master_key = os.environ.get('VAULT_MASTER_KEY')
                if not master_key:
                    # Fallback for dev/initial setup - generate a random key
                    # In production, this should always be provided via environment
                    key = base64.urlsafe_b64encode(os.urandom(32))
                    
                    # Create the first key if none exists
                    salt = secrets.token_bytes(16)
                    EncryptionKey.objects.create(
                        key_hash=base64.b64encode(salt + key).decode(),
                        is_active=True
                    )
                else:
                    salt = secrets.token_bytes(16)
                    kdf = PBKDF2HMAC(
                        algorithm=hashes.SHA256(),
                        length=32,
                        salt=salt,
                        iterations=100000,
                    )
                    key = base64.urlsafe_b64encode(kdf.derive(master_key.encode()))
                    
                    EncryptionKey.objects.create(
                        key_hash=base64.b64encode(salt + key).decode(),
                        is_active=True
                    )
            else:
                key_data = base64.b64decode(encryption_key.key_hash.encode())
                # salt = key_data[:16] # Not needed for retrieval but stored for record
                key = key_data[16:]
            
            cache.set(cache_key, key, 3600)
            EncryptionService._CACHED_KEY = key
        
        return key
        
    @staticmethod
    def encrypt_value(plaintext_value):
        """Encrypt a single value"""
        if not plaintext_value:
            return plaintext_value
            
        try:
            key = EncryptionService._get_encryption_key()
            f = Fernet(key)
            encrypted_bytes = f.encrypt(str(plaintext_value).encode())
            return f"ENCRYPTED:{base64.b64encode(encrypted_bytes).decode()}"
        except Exception as e:
            raise ValueError(f"Encryption failed: {str(e)}")
        
    @staticmethod
    def decrypt_value(encrypted_value):
        """Decrypt a single value"""
        if not encrypted_value or not str(encrypted_value).startswith('ENCRYPTED:'):
            return encrypted_value
            
        try:
            encrypted_data = encrypted_value[10:]
            encrypted_bytes = base64.b64decode(encrypted_data.encode())
            
            key = EncryptionService._get_encryption_key()
            f = Fernet(key)
            decrypted_bytes = f.decrypt(encrypted_bytes)
            return decrypted_bytes.decode()
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")
        
    @staticmethod
    def encrypt_config(config_dict):
        """Encrypt sensitive fields in config dictionary"""
        if not isinstance(config_dict, dict):
            return config_dict
            
        encrypted_config = config_dict.copy()
        
        for key, value in config_dict.items():
            if EncryptionService._is_sensitive_field(key):
                encrypted_config[key] = EncryptionService.encrypt_value(value)
        
        return encrypted_config
        
    @staticmethod
    def decrypt_config(encrypted_config):
        """Decrypt config dictionary"""
        if not isinstance(encrypted_config, dict):
            return encrypted_config
            
        decrypted_config = encrypted_config.copy()
        
        for key, value in encrypted_config.items():
            if isinstance(value, str) and value.startswith('ENCRYPTED:'):
                decrypted_config[key] = EncryptionService.decrypt_value(value)
        
        return decrypted_config
    
    @staticmethod
    def _is_sensitive_field(field_name):
        """Check if field contains sensitive data"""
        field_lower = field_name.lower()
        return any(sensitive in field_lower for sensitive in EncryptionService.SENSITIVE_FIELDS)
    
    @staticmethod
    def rotate_keys():
        """Rotate encryption keys"""
        try:
            EncryptionKey.objects.filter(is_active=True).update(
                is_active=False,
                rotated_at=timezone.now()
            )
            
            # Clear cache to force generation of new key
            cache.delete('vault_encryption_key')
            EncryptionService._CACHED_KEY = None
            
            # This will trigger creation of a new key if master key is set
            EncryptionService._get_encryption_key()
            
            return True
        except Exception as e:
            raise ValueError(f"Key rotation failed: {str(e)}")
