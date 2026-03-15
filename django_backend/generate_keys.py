#!/usr/bin/env python3
"""
Script to generate encryption keys for the Eduyata application.
Run this script to generate new encryption keys and add them to your .env file.
"""

import os
import sys
from pathlib import Path
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64

def generate_aes_key():
    """Generate AES-256 key for data encryption"""
    return base64.urlsafe_b64encode(AESGCM.generate_key(bit_length=256)).decode()

def generate_fernet_key():
    """Generate Fernet key for session encryption"""
    return Fernet.generate_key().decode()

def main():
    # Generate keys
    encryption_key = generate_aes_key()
    session_key = generate_fernet_key()
    
    print("Generated Encryption Keys:")
    print("=" * 50)
    print(f"ENCRYPTION_KEY={encryption_key}")
    print(f"SESSION_ENCRYPTION_KEY={session_key}")
    print("=" * 50)
    print()
    print("Add these keys to your .env file in the django_backend directory.")
    print("Keep these keys secure and never commit them to version control!")
    
    # Try to update .env file if it exists
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        try:
            with open(env_path, 'r') as f:
                content = f.read()
            
            # Update or add keys
            lines = content.split('\n')
            updated_lines = []
            encryption_key_found = False
            session_key_found = False
            
            for line in lines:
                if line.startswith('ENCRYPTION_KEY='):
                    updated_lines.append(f'ENCRYPTION_KEY={encryption_key}')
                    encryption_key_found = True
                elif line.startswith('SESSION_ENCRYPTION_KEY='):
                    updated_lines.append(f'SESSION_ENCRYPTION_KEY={session_key}')
                    session_key_found = True
                else:
                    updated_lines.append(line)
            
            # Add keys if not found
            if not encryption_key_found:
                updated_lines.append(f'ENCRYPTION_KEY={encryption_key}')
            if not session_key_found:
                updated_lines.append(f'SESSION_ENCRYPTION_KEY={session_key}')
            
            # Write back to file
            with open(env_path, 'w') as f:
                f.write('\n'.join(updated_lines))
            
            print(f"Updated {env_path} with new encryption keys.")
            
        except Exception as e:
            print(f"Could not update .env file: {e}")
            print("Please manually add the keys to your .env file.")
    else:
        print("No .env file found. Please create one and add the keys manually.")

if __name__ == "__main__":
    main()