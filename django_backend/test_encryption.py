#!/usr/bin/env python3
"""
Test script to verify encryption is working for teacher registration
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiedupro.settings')
django.setup()

from auth_app.models import Educator
from auth_app.encryption import EncryptionManager

def test_encryption():
    print("Testing encryption functionality...")
    
    try:
        # Test encryption key
        test_data = "test@example.com"
        encrypted = EncryptionManager.encrypt(test_data)
        decrypted = EncryptionManager.decrypt(encrypted)
        
        print(f"Original: {test_data}")
        print(f"Encrypted: {encrypted}")
        print(f"Decrypted: {decrypted}")
        print(f"Encryption working: {test_data == decrypted}")
        
        return test_data == decrypted
        
    except Exception as e:
        print(f"Encryption test failed: {e}")
        return False

def test_teacher_registration():
    print("\nTesting teacher registration encryption...")
    
    try:
        # Create a test educator
        educator = Educator(
            name="Test Teacher",
            email="test.teacher@example.com",
            mobile="1234567890",
            password_hash="test_password"
        )
        
        # Call encrypt_sensitive_data manually
        educator.encrypt_sensitive_data()
        
        print(f"Email encrypted: {bool(educator.email_encrypted)}")
        print(f"Mobile encrypted: {bool(educator.mobile_encrypted)}")
        
        if educator.email_encrypted:
            print(f"Encrypted email: {educator.email_encrypted[:50]}...")
        if educator.mobile_encrypted:
            print(f"Encrypted mobile: {educator.mobile_encrypted[:50]}...")
            
        return bool(educator.email_encrypted and educator.mobile_encrypted)
        
    except Exception as e:
        print(f"Teacher registration test failed: {e}")
        return False

if __name__ == "__main__":
    encryption_works = test_encryption()
    registration_works = test_teacher_registration()
    
    print(f"\nResults:")
    print(f"Encryption functionality: {'✓' if encryption_works else '✗'}")
    print(f"Teacher registration encryption: {'✓' if registration_works else '✗'}")
    
    if not encryption_works:
        print("\nPlease run 'python generate_keys.py' to set up encryption keys.")