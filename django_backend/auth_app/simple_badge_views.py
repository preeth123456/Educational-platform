from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import json

@api_view(['GET'])
@permission_classes([AllowAny])
def get_student_badges(request):
    """Get all badges earned by a student"""
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return Response({
                'status': 'error',
                'message': 'Student ID required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cursor = connection.cursor()
        cursor.execute("""
            SELECT b.id, b.name, b.description, b.icon, b.category, b.difficulty, 
                   b.points, b.color, sb.earned_at, sb.context
            FROM badges b
            JOIN student_badges sb ON b.id = sb.badge_id
            WHERE sb.student_id = %s
            ORDER BY sb.earned_at DESC
        """, [student_id])
        
        badges = []
        for row in cursor.fetchall():
            badges.append({
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'icon': row[3],
                'category': row[4],
                'difficulty': row[5],
                'points': row[6],
                'color': row[7],
                'earned_at': row[8].isoformat() if row[8] else None,
                'context': json.loads(row[9]) if row[9] else {}
            })
        
        # Group by difficulty
        badges_by_difficulty = {
            'beginner': [b for b in badges if b['difficulty'] == 'beginner'],
            'intermediate': [b for b in badges if b['difficulty'] == 'intermediate'],
            'advanced': [b for b in badges if b['difficulty'] == 'advanced']
        }
        
        total_points = sum(badge['points'] for badge in badges)
        
        return Response({
            'status': 'success',
            'data': {
                'badges': badges,
                'badges_by_difficulty': badges_by_difficulty,
                'total_badges': len(badges),
                'total_points': total_points,
                'badge_counts': {
                    'beginner': len(badges_by_difficulty['beginner']),
                    'intermediate': len(badges_by_difficulty['intermediate']),
                    'advanced': len(badges_by_difficulty['advanced'])
                }
            }
        })
    except Exception as e:
        print(f"Get student badges error: {str(e)}")
        return Response({
            'status': 'success',
            'data': {
                'badges': [],
                'badges_by_difficulty': {
                    'beginner': [],
                    'intermediate': [],
                    'advanced': []
                },
                'total_badges': 0,
                'total_points': 0,
                'badge_counts': {
                    'beginner': 0,
                    'intermediate': 0,
                    'advanced': 0
                }
            }
        })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_available_badges(request):
    """Get badges student can still earn"""
    try:
        student_id = request.GET.get('student_id')
        if not student_id:
            return Response({
                'status': 'error',
                'message': 'Student ID required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cursor = connection.cursor()
        cursor.execute("""
            SELECT b.id, b.name, b.description, b.icon, b.category, b.difficulty, 
                   b.points, b.color, b.criteria
            FROM badges b
            WHERE b.is_active = 1 
            AND b.id NOT IN (
                SELECT badge_id FROM student_badges WHERE student_id = %s
            )
            ORDER BY b.difficulty, b.points
        """, [student_id])
        
        badges = []
        for row in cursor.fetchall():
            badges.append({
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'icon': row[3],
                'category': row[4],
                'difficulty': row[5],
                'points': row[6],
                'color': row[7],
                'criteria': json.loads(row[8]) if row[8] else {}
            })
        
        # Group by difficulty
        badges_by_difficulty = {
            'beginner': [b for b in badges if b['difficulty'] == 'beginner'],
            'intermediate': [b for b in badges if b['difficulty'] == 'intermediate'],
            'advanced': [b for b in badges if b['difficulty'] == 'advanced']
        }
        
        return Response({
            'status': 'success',
            'data': {
                'available_badges': badges,
                'badges_by_difficulty': badges_by_difficulty,
                'total_available': len(badges)
            }
        })
    except Exception as e:
        print(f"Get available badges error: {str(e)}")
        return Response({
            'status': 'success',
            'data': {
                'available_badges': [],
                'badges_by_difficulty': {
                    'beginner': [],
                    'intermediate': [],
                    'advanced': []
                },
                'total_available': 0
            }
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def check_badge_triggers(request):
    """Check badge triggers - placeholder for now"""
    try:
        return Response({
            'status': 'success',
            'data': {
                'newly_earned_badges': [],
                'count': 0
            }
        })
    except Exception as e:
        return Response({
            'status': 'success',
            'data': {
                'newly_earned_badges': [],
                'count': 0
            }
        })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_badge_leaderboard(request):
    """Get badge leaderboard - placeholder"""
    return Response({
        'status': 'success',
        'data': {
            'leaderboard': []
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_badge_stats(request):
    """Get badge statistics - placeholder"""
    return Response({
        'status': 'success',
        'data': {
            'total_badges': 9,
            'earned_badges': 0,
            'remaining_badges': 9,
            'total_points': 0,
            'completion_percentage': 0,
            'recent_badges': []
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def initialize_badges(request):
    """Initialize badges - placeholder"""
    return Response({
        'status': 'success',
        'message': 'Badges will be initialized once database is set up'
    })