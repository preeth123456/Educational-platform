from django.db import connection
from .badge_models import Badge, StudentBadge, BadgeProgress
from .models import Student
import json
from datetime import datetime, timedelta

class BadgeService:
    """Service class to handle badge logic and awarding"""
    
    @staticmethod
    def initialize_default_badges():
        """Create default badges for the system"""
        default_badges = [
            # Beginner Badges
            {
                'name': 'First Steps',
                'description': 'Complete your first lesson',
                'icon': '🎯',
                'category': 'completion',
                'difficulty': 'beginner',
                'points': 10,
                'color': '#4CAF50',
                'criteria': {'lessons_completed': 1}
            },
            {
                'name': 'Quick Learner',
                'description': 'Complete a lesson in under 30 minutes',
                'icon': '⚡',
                'category': 'performance',
                'difficulty': 'beginner',
                'points': 15,
                'color': '#FF9800',
                'criteria': {'lesson_time_under': 30}
            },
            {
                'name': 'Quiz Master',
                'description': 'Score 80% or higher on your first quiz',
                'icon': '🧠',
                'category': 'performance',
                'difficulty': 'beginner',
                'points': 20,
                'color': '#2196F3',
                'criteria': {'quiz_score_min': 80, 'quiz_attempts': 1}
            },
            
            # Intermediate Badges
            {
                'name': 'Chapter Champion',
                'description': 'Complete an entire chapter',
                'icon': '📚',
                'category': 'completion',
                'difficulty': 'intermediate',
                'points': 50,
                'color': '#9C27B0',
                'criteria': {'chapters_completed': 1}
            },
            {
                'name': 'Streak Keeper',
                'description': 'Study for 7 consecutive days',
                'icon': '🔥',
                'category': 'streak',
                'difficulty': 'intermediate',
                'points': 75,
                'color': '#FF5722',
                'criteria': {'study_streak_days': 7}
            },
            {
                'name': 'High Achiever',
                'description': 'Maintain 90% average across 5 quizzes',
                'icon': '⭐',
                'category': 'performance',
                'difficulty': 'intermediate',
                'points': 100,
                'color': '#FFD700',
                'criteria': {'quiz_average_min': 90, 'quiz_count_min': 5}
            },
            
            # Advanced Badges
            {
                'name': 'Course Conqueror',
                'description': 'Complete an entire course with 85% average',
                'icon': '🏆',
                'category': 'completion',
                'difficulty': 'advanced',
                'points': 200,
                'color': '#FFD700',
                'criteria': {'courses_completed': 1, 'course_average_min': 85}
            },
            {
                'name': 'Subject Expert',
                'description': 'Complete 3 courses in the same subject',
                'icon': '🎓',
                'category': 'skill',
                'difficulty': 'advanced',
                'points': 300,
                'color': '#673AB7',
                'criteria': {'same_subject_courses': 3}
            },
            {
                'name': 'Improvement Star',
                'description': 'Improve quiz scores by 30% over 10 attempts',
                'icon': '📈',
                'category': 'improvement',
                'difficulty': 'advanced',
                'points': 250,
                'color': '#4CAF50',
                'criteria': {'score_improvement': 30, 'quiz_attempts_min': 10}
            }
        ]
        
        for badge_data in default_badges:
            Badge.objects.get_or_create(
                name=badge_data['name'],
                defaults=badge_data
            )
    
    @staticmethod
    def check_and_award_badges(student_id, trigger_type, context=None):
        """Check if student qualifies for any badges and award them"""
        if context is None:
            context = {}
            
        student = Student.objects.get(id=student_id)
        newly_earned = []
        
        # Get all active badges student hasn't earned yet
        earned_badge_ids = StudentBadge.objects.filter(student=student).values_list('badge_id', flat=True)
        available_badges = Badge.objects.filter(is_active=True).exclude(id__in=earned_badge_ids)
        
        for badge in available_badges:
            if BadgeService._check_badge_criteria(student, badge, context):
                # Award the badge
                student_badge = StudentBadge.objects.create(
                    student=student,
                    badge=badge,
                    context=context
                )
                newly_earned.append(badge)
                
                # Add activity record
                BadgeService._add_badge_activity(student_id, badge)
                
                # Add notification
                BadgeService._add_badge_notification(student_id, badge)
        
        return newly_earned
    
    @staticmethod
    def _check_badge_criteria(student, badge, context):
        """Check if student meets the criteria for a specific badge"""
        criteria = badge.criteria
        
        # Get student statistics
        stats = BadgeService._get_student_stats(student.id)
        
        # Check each criterion
        for criterion, required_value in criteria.items():
            if criterion == 'lessons_completed':
                if stats.get('total_lessons_completed', 0) < required_value:
                    return False
            elif criterion == 'chapters_completed':
                if stats.get('total_chapters_completed', 0) < required_value:
                    return False
            elif criterion == 'courses_completed':
                if stats.get('total_courses_completed', 0) < required_value:
                    return False
            elif criterion == 'quiz_score_min':
                if context.get('quiz_score', 0) < required_value:
                    return False
            elif criterion == 'quiz_average_min':
                if stats.get('quiz_average', 0) < required_value:
                    return False
            elif criterion == 'quiz_count_min':
                if stats.get('total_quizzes', 0) < required_value:
                    return False
            elif criterion == 'study_streak_days':
                if stats.get('current_streak', 0) < required_value:
                    return False
            elif criterion == 'course_average_min':
                if context.get('course_average', 0) < required_value:
                    return False
            elif criterion == 'lesson_time_under':
                if context.get('lesson_duration_minutes', 999) > required_value:
                    return False
        
        return True
    
    @staticmethod
    def _get_student_stats(student_id):
        """Get comprehensive statistics for a student"""
        cursor = connection.cursor()
        
        stats = {}
        
        try:
            # Total courses completed
            cursor.execute("""
                SELECT COUNT(*) FROM student_enrollments 
                WHERE student_id = %s AND status = 'completed'
            """, [student_id])
            stats['total_courses_completed'] = cursor.fetchone()[0]
            
            # Quiz statistics
            cursor.execute("""
                SELECT AVG(percentage), COUNT(*) FROM quiz_results 
                WHERE student_id = %s
            """, [student_id])
            result = cursor.fetchone()
            stats['quiz_average'] = float(result[0]) if result[0] else 0
            stats['total_quizzes'] = result[1]
            
            # Study streak (simplified - based on activity)
            cursor.execute("""
                SELECT COUNT(DISTINCT DATE(created_at)) as days
                FROM student_activities 
                WHERE student_id = %s 
                AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            """, [student_id])
            result = cursor.fetchone()
            stats['current_streak'] = result[0] if result else 0
            
            # Estimate lessons and chapters (based on video progress and activities)
            cursor.execute("""
                SELECT COUNT(*) FROM video_progress 
                WHERE student_id = %s
            """, [student_id])
            stats['total_lessons_completed'] = cursor.fetchone()[0]
            
            # Estimate chapters completed (every 5 lessons = 1 chapter)
            stats['total_chapters_completed'] = stats['total_lessons_completed'] // 5
            
        except Exception as e:
            print(f"Error getting student stats: {e}")
        
        return stats
    
    @staticmethod
    def _add_badge_activity(student_id, badge):
        """Add activity record for badge earning"""
        try:
            cursor = connection.cursor()
            cursor.execute("""
                INSERT INTO student_activities (student_id, activity_type, action, subject, course_name, created_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, [
                student_id,
                'achievement',
                'Earned badge',
                badge.name,
                f'{badge.difficulty.title()} Badge'
            ])
        except Exception as e:
            print(f"Error adding badge activity: {e}")
    
    @staticmethod
    def _add_badge_notification(student_id, badge):
        """Add notification for badge earning"""
        try:
            cursor = connection.cursor()
            cursor.execute("""
                INSERT INTO student_notifications (student_id, message, is_read, created_at)
                VALUES (%s, %s, %s, NOW())
            """, [
                student_id,
                f"🎉 Congratulations! You've earned the '{badge.name}' badge! {badge.description}",
                False
            ])
        except Exception as e:
            print(f"Error adding badge notification: {e}")
    
    @staticmethod
    def get_student_badges(student_id):
        """Get all badges earned by a student"""
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
        
        return badges
    
    @staticmethod
    def get_available_badges(student_id):
        """Get badges student can still earn"""
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
        
        return badges