"""
Event Bus - Event Handlers

This module contains handlers that respond to system events.
Handlers are automatically registered when Django starts (via apps.py ready()).

Handlers create notifications in the database for the appropriate users.
"""

from django.dispatch import receiver
from datetime import datetime

from .events import (
    student_registered,
    student_enrolled,
    course_completed,
    quiz_completed,
    progress_updated,
    badge_earned,
    teacher_registered,
    course_created,
    course_approved,
    teacher_approved,
)


def log_event(event_name, **data):
    """Helper to log events consistently"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    data_str = ', '.join(f'{k}={v}' for k, v in data.items())
    print(f"[{timestamp}] [EVENT] {event_name}: {data_str}")


def create_notification(user_id, user_type, title, message, 
                        notification_type='message', priority='medium'):
    """Helper to create a notification in the database"""
    try:
        from notifications.models import Notification
        return Notification.objects.create(
            user_id=user_id,
            user_type=user_type,
            type=notification_type,
            title=title,
            message=message,
            priority=priority
        )
    except Exception as e:
        print(f"[ERROR] Failed to create notification: {e}")
        return None


def create_admin_notification(title, message, notification_type='teacher_registration',
                              teacher_id=None, teacher_name=None):
    """Helper to create an admin notification"""
    try:
        from admin_auth.models import AdminNotification
        return AdminNotification.objects.create(
            title=title,
            message=message,
            notification_type=notification_type,
            teacher_id=teacher_id,
            teacher_name=teacher_name
        )
    except Exception as e:
        print(f"[ERROR] Failed to create admin notification: {e}")
        return None


# ==========================================
# STUDENT EVENT HANDLERS
# ==========================================

@receiver(student_registered)
def on_student_registered(sender, student_id, email, name=None, **kwargs):
    """Handle new student registration"""
    log_event('student_registered', student_id=student_id, email=email, name=name)
    
    # Send welcome notification to student
    create_notification(
        user_id=student_id,
        user_type='student',
        title='🎉 Welcome to Eduyata!',
        message=f'Welcome {name or "Student"}! Start exploring courses and track your learning progress.',
        notification_type='message',
        priority='high'
    )
    
    # Notify admin about new student registration
    create_admin_notification(
        title='📚 New Student Registration',
        message=f'New student "{name or email}" has registered on the platform.',
        notification_type='student_registration'
    )


@receiver(student_enrolled)
def on_student_enrolled(sender, student_id, course_id, course_title=None, teacher_id=None, **kwargs):
    """Handle student course enrollment"""
    log_event('student_enrolled', student_id=student_id, course_id=course_id, course_title=course_title)
    
    # Notify student about successful enrollment
    create_notification(
        user_id=student_id,
        user_type='student',
        title='✅ Enrollment Successful!',
        message=f'You have been enrolled in "{course_title or "the course"}". Start learning now!',
        notification_type='course_update',
        priority='high'
    )
    
    # Notify teacher about new enrollment (if teacher_id provided)
    if teacher_id:
        create_notification(
            user_id=teacher_id,
            user_type='teacher',
            title='👨‍🎓 New Student Enrolled',
            message=f'A new student has enrolled in your course "{course_title or ""}". ',
            notification_type='course_update',
            priority='medium'
        )
    
    # Notify admin about enrollment
    create_admin_notification(
        title='📊 New Course Enrollment',
        message=f'Student ID {student_id} enrolled in course "{course_title or course_id}".',
        notification_type='enrollment'
    )


# ==========================================
# LEARNING EVENT HANDLERS
# ==========================================

@receiver(course_completed)
def on_course_completed(sender, student_id, course_id, completion_percentage=100, course_title=None, **kwargs):
    """Handle course completion"""
    log_event('course_completed', student_id=student_id, course_id=course_id, completion=completion_percentage)
    
    # Notify student about course completion
    create_notification(
        user_id=student_id,
        user_type='student',
        title='🎓 Course Completed!',
        message=f'Congratulations! You have completed "{course_title or "the course"}". Check out your achievements!',
        notification_type='badge',
        priority='high'
    )


@receiver(quiz_completed)
def on_quiz_completed(sender, student_id, course_id=None, quiz_id=None, score=None, percentage=None, **kwargs):
    """Handle quiz submission"""
    log_event('quiz_completed', student_id=student_id, course_id=course_id, quiz_id=quiz_id, score=score, percentage=percentage)
    
    # Notify student about quiz result
    message = f'You completed a quiz with a score of {percentage or score or "N/A"}%.'
    if percentage and percentage >= 80:
        message += ' Great job! 🌟'
    
    create_notification(
        user_id=student_id,
        user_type='student',
        title='📝 Quiz Completed',
        message=message,
        notification_type='assessment',
        priority='medium'
    )


@receiver(progress_updated)
def on_progress_updated(sender, student_id, course_id, progress_data=None, **kwargs):
    """Handle learning progress update"""
    log_event('progress_updated', student_id=student_id, course_id=course_id)
    # Progress updates are logged but don't generate notifications (too frequent)


# ==========================================
# ACHIEVEMENT EVENT HANDLERS
# ==========================================

@receiver(badge_earned)
def on_badge_earned(sender, student_id, badge_id, badge_name=None, **kwargs):
    """Handle badge earning"""
    log_event('badge_earned', student_id=student_id, badge_id=badge_id, badge_name=badge_name)
    
    # Notify student about badge earned
    create_notification(
        user_id=student_id,
        user_type='student',
        title='🏆 Badge Earned!',
        message=f'Congratulations! You earned the "{badge_name or "Achievement"}" badge!',
        notification_type='badge',
        priority='high'
    )


# ==========================================
# TEACHER EVENT HANDLERS
# ==========================================

@receiver(teacher_registered)
def on_teacher_registered(sender, teacher_id, email, name=None, **kwargs):
    """Handle new teacher registration"""
    log_event('teacher_registered', teacher_id=teacher_id, email=email, name=name)
    
    # Send welcome notification to teacher
    create_notification(
        user_id=teacher_id,
        user_type='teacher',
        title='👋 Welcome to Eduyata!',
        message=f'Welcome {name or "Teacher"}! Your account is pending admin approval. You will be notified once approved.',
        notification_type='message',
        priority='high'
    )
    
    # Notify admin about new teacher registration
    create_admin_notification(
        title='🆕 New Teacher Registration',
        message=f'New teacher "{name or email}" has registered and is pending approval.',
        notification_type='teacher_registration',
        teacher_id=str(teacher_id),
        teacher_name=name
    )


@receiver(course_created)
def on_course_created(sender, teacher_id, course_id, course_title=None, **kwargs):
    """Handle new course creation"""
    log_event('course_created', teacher_id=teacher_id, course_id=course_id, course_title=course_title)
    
    # Notify teacher about course creation
    create_notification(
        user_id=teacher_id,
        user_type='teacher',
        title='📚 Course Created',
        message=f'Your course "{course_title or "New Course"}" has been created and is pending approval.',
        notification_type='course_update',
        priority='medium'
    )
    
    # Notify admin about new course
    create_admin_notification(
        title='📖 New Course Created',
        message=f'Teacher ID {teacher_id} created a new course: "{course_title or course_id}".',
        notification_type='course_created',
        teacher_id=str(teacher_id)
    )


@receiver(course_approved)
def on_course_approved(sender, teacher_id, course_id, course_title=None, **kwargs):
    """Handle course approval"""
    log_event('course_approved', teacher_id=teacher_id, course_id=course_id, course_title=course_title)
    
    # Notify teacher about course approval
    create_notification(
        user_id=teacher_id,
        user_type='teacher',
        title='✅ Course Approved!',
        message=f'Your course "{course_title or "Course"}" has been approved and is now live!',
        notification_type='course_update',
        priority='high'
    )


@receiver(teacher_approved)
def on_teacher_approved(sender, teacher_id, name=None, **kwargs):
    """Handle teacher approval"""
    log_event('teacher_approved', teacher_id=teacher_id, name=name)
    
    # Notify teacher about approval
    create_notification(
        user_id=teacher_id,
        user_type='teacher',
        title='🎉 Account Approved!',
        message=f'Congratulations {name or "Teacher"}! Your account has been approved. You can now create courses.',
        notification_type='message',
        priority='high'
    )
