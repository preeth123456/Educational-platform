from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from .badge_service import BadgeService
from .badge_models import Badge, StudentBadge
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
        
        badges = BadgeService.get_student_badges(student_id)
        
        # Calculate total points
        total_points = sum(badge['points'] for badge in badges)
        
        # Group by difficulty
        badges_by_difficulty = {
            'beginner': [b for b in badges if b['difficulty'] == 'beginner'],
            'intermediate': [b for b in badges if b['difficulty'] == 'intermediate'],
            'advanced': [b for b in badges if b['difficulty'] == 'advanced']
        }
        
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
            'status': 'error',
            'message': 'Failed to get student badges'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        
        badges = BadgeService.get_available_badges(student_id)
        
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
            'status': 'error',
            'message': 'Failed to get available badges'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def check_badge_triggers(request):
    """Manually trigger badge checking (called after student actions)"""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        trigger_type = data.get('trigger_type')  # 'lesson_complete', 'quiz_complete', etc.
        context = data.get('context', {})
        
        if not student_id or not trigger_type:
            return Response({
                'status': 'error',
                'message': 'Student ID and trigger type required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        newly_earned = BadgeService.check_and_award_badges(student_id, trigger_type, context)
        
        return Response({
            'status': 'success',
            'data': {
                'newly_earned_badges': [
                    {
                        'id': badge.id,
                        'name': badge.name,
                        'description': badge.description,
                        'icon': badge.icon,
                        'difficulty': badge.difficulty,
                        'points': badge.points,
                        'color': badge.color
                    } for badge in newly_earned
                ],
                'count': len(newly_earned)
            }
        })
    except Exception as e:
        print(f"Check badge triggers error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'Failed to check badge triggers'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_badge_leaderboard(request):
    """Get top students by badge points"""
    try:
        limit = int(request.GET.get('limit', 10))
        
        cursor = connection.cursor()
        cursor.execute("""
            SELECT s.id, s.name, s.profile_picture, 
                   COUNT(sb.id) as badge_count,
                   SUM(b.points) as total_points
            FROM students s
            LEFT JOIN student_badges sb ON s.id = sb.student_id
            LEFT JOIN badges b ON sb.badge_id = b.id
            GROUP BY s.id, s.name, s.profile_picture
            HAVING total_points > 0
            ORDER BY total_points DESC, badge_count DESC
            LIMIT %s
        """, [limit])
        
        leaderboard = []
        for i, row in enumerate(cursor.fetchall()):
            leaderboard.append({
                'rank': i + 1,
                'student_id': row[0],
                'name': row[1],
                'profile_picture': row[2],
                'badge_count': row[3],
                'total_points': int(row[4]) if row[4] else 0
            })
        
        return Response({
            'status': 'success',
            'data': {
                'leaderboard': leaderboard
            }
        })
    except Exception as e:
        print(f"Get badge leaderboard error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'Failed to get badge leaderboard'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def initialize_badges(request):
    """Initialize default badges (admin function)"""
    try:
        BadgeService.initialize_default_badges()
        
        return Response({
            'status': 'success',
            'message': 'Default badges initialized successfully'
        })
    except Exception as e:
        print(f"Initialize badges error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'Failed to initialize badges'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_badge_stats(request):
    """Get overall badge statistics"""
    try:
        student_id = request.GET.get('student_id')
        
        cursor = connection.cursor()
        
        # Total badges in system
        cursor.execute("SELECT COUNT(*) FROM badges WHERE is_active = 1")
        total_badges = cursor.fetchone()[0]
        
        if student_id:
            # Student-specific stats
            cursor.execute("SELECT COUNT(*) FROM student_badges WHERE student_id = %s", [student_id])
            earned_badges = cursor.fetchone()[0]
            
            cursor.execute("""
                SELECT SUM(b.points) FROM student_badges sb 
                JOIN badges b ON sb.badge_id = b.id 
                WHERE sb.student_id = %s
            """, [student_id])
            total_points = cursor.fetchone()[0] or 0
            
            # Recent badges
            cursor.execute("""
                SELECT b.name, b.icon, sb.earned_at 
                FROM student_badges sb
                JOIN badges b ON sb.badge_id = b.id
                WHERE sb.student_id = %s
                ORDER BY sb.earned_at DESC
                LIMIT 3
            """, [student_id])
            
            recent_badges = []
            for row in cursor.fetchall():
                recent_badges.append({
                    'name': row[0],
                    'icon': row[1],
                    'earned_at': row[2].isoformat() if row[2] else None
                })
        else:
            earned_badges = 0
            total_points = 0
            recent_badges = []
        
        return Response({
            'status': 'success',
            'data': {
                'total_badges': total_badges,
                'earned_badges': earned_badges,
                'remaining_badges': total_badges - earned_badges,
                'total_points': int(total_points),
                'completion_percentage': round((earned_badges / total_badges) * 100, 1) if total_badges > 0 else 0,
                'recent_badges': recent_badges
            }
        })
    except Exception as e:
        print(f"Get badge stats error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'Failed to get badge statistics'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)