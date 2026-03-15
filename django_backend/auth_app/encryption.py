from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.conf import settings
import os
import base64

class EncryptionManager:
    """Handles AES-256-GCM encryption for sensitive data"""
    
    @staticmethod
    def get_encryption_key():
        """Get or generate encryption key"""
        key = getattr(settings, 'ENCRYPTION_KEY', None)
        if not key:
            raise ValueError("ENCRYPTION_KEY not configured in settings")
        return base64.urlsafe_b64decode(key.encode())
    
    @staticmethod
    def encrypt(plaintext):
        """Encrypt data using AES-256-GCM"""
        if not plaintext:
            return None
        
        key = EncryptionManager.get_encryption_key()
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode(), None)
        return base64.urlsafe_b64encode(nonce + ciphertext).decode()
    
    @staticmethod
    def decrypt(encrypted_data):
        """Decrypt data using AES-256-GCM"""
        if not encrypted_data:
            return None
        
        try:
            key = EncryptionManager.get_encryption_key()
            aesgcm = AESGCM(key)
            data = base64.urlsafe_b64decode(encrypted_data.encode())
            nonce = data[:12]
            ciphertext = data[12:]
            plaintext = aesgcm.decrypt(nonce, ciphertext, None)
            return plaintext.decode()
        except Exception:
            return None
    
    @staticmethod
    def generate_key():
        """Generate a new AES-256 key"""
        return base64.urlsafe_b64encode(AESGCM.generate_key(bit_length=256)).decode()

class SessionEncryption:
    """Handles session token encryption"""
    
    @staticmethod
    def get_session_key():
        """Get session encryption key"""
        key = getattr(settings, 'SESSION_ENCRYPTION_KEY', None)
        if not key:
            raise ValueError("SESSION_ENCRYPTION_KEY not configured")
        return key.encode()
    
    @staticmethod
    def encrypt_token(token_data):
        """Encrypt session token"""
        f = Fernet(SessionEncryption.get_session_key())
        return f.encrypt(token_data.encode()).decode()
    
    @staticmethod
    def decrypt_token(encrypted_token):
        """Decrypt session token"""
        try:
            f = Fernet(SessionEncryption.get_session_key())
            return f.decrypt(encrypted_token.encode()).decode()
        except Exception:
            return None

class FileEncryption:
    """Handles file encryption for uploads"""
    
    @staticmethod
    def encrypt_file(file_path):
        """Encrypt uploaded file"""
        key = EncryptionManager.get_encryption_key()
        aesgcm = AESGCM(key)
        
        with open(file_path, 'rb') as f:
            plaintext = f.read()
        
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)
        
        encrypted_path = f"{file_path}.enc"
        with open(encrypted_path, 'wb') as f:
            f.write(nonce + ciphertext)
        
        return encrypted_path
    
    @staticmethod
    def decrypt_file(encrypted_path):
        """Decrypt file for serving"""
        key = EncryptionManager.get_encryption_key()
        aesgcm = AESGCM(key)
        
        with open(encrypted_path, 'rb') as f:
            data = f.read()
        
        nonce = data[:12]
        ciphertext = data[12:]
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        
        return plaintext
