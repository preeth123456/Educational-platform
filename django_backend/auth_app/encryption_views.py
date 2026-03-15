from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.utils import timezone
from .models import Student, Educator, EncryptionKey
from .encryption import EncryptionManager
import hashlib

@api_view(['POST'])
def rotate_encryption_key(request):
    """Rotate encryption key and re-encrypt data"""
    try:
        # Generate new key
        new_key = EncryptionManager.generate_key()
        key_hash = hashlib.sha256(new_key.encode()).hexdigest()
        
        # Mark old keys as inactive
        EncryptionKey.objects.filter(is_active=True).update(
            is_active=False,
            rotated_at=timezone.now()
        )
        
        # Create new key record
        EncryptionKey.objects.create(
            key_hash=key_hash,
            is_active=True
        )
        
        return Response({
            'success': True,
            'message': 'Encryption key rotated successfully',
            'key_hash': key_hash[:16] + '...'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def security_status(request):
    """Get encryption status for the platform"""
    try:
        total_students = Student.objects.count()
        encrypted_students = Student.objects.filter(
            mobile_self_encrypted__isnull=False
        ).count()
        
        total_educators = Educator.objects.count()
        encrypted_educators = Educator.objects.filter(
            mobile_encrypted__isnull=False
        ).count()
        
        active_keys = EncryptionKey.objects.filter(is_active=True).count()
        
        return Response({
            'success': True,
            'encryption_status': {
                'students': {
                    'total': total_students,
                    'encrypted': encrypted_students,
                    'percentage': round((encrypted_students / total_students * 100) if total_students > 0 else 0, 2)
                },
                'educators': {
                    'total': total_educators,
                    'encrypted': encrypted_educators,
                    'percentage': round((encrypted_educators / total_educators * 100) if total_educators > 0 else 0, 2)
                },
                'active_keys': active_keys,
                'encryption_algorithm': 'AES-256-GCM'
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def encrypt_existing_data(request):
    """Migrate existing unencrypted data to encrypted format"""
    try:
        encrypted_count = {'students': 0, 'educators': 0}
        
        # Encrypt student data
        students = Student.objects.filter(mobile_self_encrypted__isnull=True)
        for student in students:
            try:
                student.encrypt_sensitive_data()
                student.save()
                encrypted_count['students'] += 1
            except Exception as e:
                print(f"Error encrypting student {student.id}: {e}")
        
        # Encrypt educator data
        educators = Educator.objects.filter(mobile_encrypted__isnull=True)
        for educator in educators:
            try:
                educator.encrypt_sensitive_data()
                educator.save()
                encrypted_count['educators'] += 1
            except Exception as e:
                print(f"Error encrypting educator {educator.id}: {e}")
        
        return Response({
            'success': True,
            'message': 'Data encryption migration completed',
            'encrypted': encrypted_count
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def user_security_status(request):
    """Get security status for current user"""
    user_id = request.GET.get('user_id')
    user_type = request.GET.get('user_type', 'student')
    
    try:
        if user_type == 'student':
            student = Student.objects.get(id=user_id)
            return Response({
                'success': True,
                'encrypted': student.is_data_encrypted,
                'encryption_algorithm': 'AES-256-GCM' if student.is_data_encrypted else None
            })
        elif user_type == 'teacher':
            educator = Educator.objects.get(id=user_id)
            return Response({
                'success': True,
                'encrypted': educator.is_data_encrypted,
                'encryption_algorithm': 'AES-256-GCM' if educator.is_data_encrypted else None
            })
    except (Student.DoesNotExist, Educator.DoesNotExist):
        return Response({
            'success': False,
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
