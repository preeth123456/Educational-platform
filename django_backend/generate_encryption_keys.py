"""
Generate encryption keys for Eduyata platform
Run this script to generate secure encryption keys for .env file
"""

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64

def generate_keys():
    print("=" * 60)
    print("Eduyata Encryption Key Generator")
    print("=" * 60)
    print()
    
    # Generate AES-256 key for data encryption
    aes_key = AESGCM.generate_key(bit_length=256)
    aes_key_b64 = base64.urlsafe_b64encode(aes_key).decode()
    
    # Generate Fernet key for session encryption
    fernet_key = Fernet.generate_key().decode()
    
    print("Add these keys to your .env file:")
    print()
    print(f"ENCRYPTION_KEY={aes_key_b64}")
    print(f"SESSION_ENCRYPTION_KEY={fernet_key}")
    print()
    print("=" * 60)
    print("IMPORTANT: Keep these keys secure and never commit to git!")
    print("=" * 60)

if __name__ == "__main__":
    generate_keys()
