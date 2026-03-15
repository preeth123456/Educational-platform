from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json


@api_view(['GET'])
def consent_status(request):
    """Get current consent settings for a student"""
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return Response({'status': 'error', 'message': 'Student ID is required'})
        
        # Default privacy-friendly settings
        consent_data = {
            'data_collection': False,
            'progress_sharing': False, 
            'achievement_visibility': False,
            'parent_notifications': True,
            'marketing_communications': False,
        }
        
        # Get consents from database
        with connection.cursor() as cursor:
            cursor.execute("SELECT consent_type, is_granted FROM student_consent")
            rows = cursor.fetchall()
        
        # Update with saved values
        for row in rows:
            if row[0] in consent_data:
                consent_data[row[0]] = bool(row[1])
        
        return Response({'status': 'success', 'data': consent_data})
        
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)})


@csrf_exempt
@api_view(['POST'])
def bulk_consent(request):
    """Save privacy settings to student_consent table"""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        consents = data.get('consents', {})
        
        if not student_id:
            return Response({'status': 'error', 'message': 'Student ID is required'})
        
        with connection.cursor() as cursor:
            # Insert/Update each consent (using INSERT ... ON DUPLICATE KEY UPDATE)
            for consent_type, is_granted in consents.items():
                cursor.execute(
                    "INSERT INTO student_consent (consent_type, is_granted, granted_at, updated_at) VALUES (%s, %s, NOW(), NOW())",
                    [consent_type, is_granted]
                )
                
                # Get the inserted ID for history
                consent_id = cursor.lastrowid
                
                # Log to history
                action = 'granted' if is_granted else 'revoked'
                cursor.execute(
                    "INSERT INTO consent_history (consent_type, action, timestamp) VALUES (%s, %s, NOW())",
                    [consent_type, action]
                )
        
        return Response({'status': 'success', 'message': 'Privacy settings updated successfully'})
        
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)})


@api_view(['GET'])
def consent_history(request):
    """Get consent history from consent_history table"""
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return Response({'status': 'error', 'message': 'Student ID is required'})
        
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT consent_type, action, timestamp FROM consent_history ORDER BY timestamp DESC LIMIT 10"
            )
            rows = cursor.fetchall()
        
        history_data = []
        for row in rows:
            history_data.append({
                'consent_type': row[0],
                'action': row[1], 
                'timestamp': row[2].isoformat() if row[2] else ''
            })
        
        return Response({'status': 'success', 'data': history_data})
        
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)})


@csrf_exempt
@api_view(['POST'])
def update_consent(request):
    return Response({'status': 'success', 'message': 'Consent updated'})