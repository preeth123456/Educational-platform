"""
Notification utility functions for easy notification creation.

Usage:
    from notifications.utils import send_notification
    
    # Send to a student
    send_notification(
        user_id=student.id,
        user_type='student',
        title='Badge Earned!',
        message='You earned the Quick Learner badge'
    )
    
    # Send to a teacher
    send_notification(
        user_id=teacher.id,
        user_type='teacher',
        title='New Enrollment',
        message='3 students enrolled in your course'
    )
"""

from notifications.models import Notification


def send_notification(user_id, user_type, title, message, 
                      notification_type='message', priority='medium'):
    """
    Create and send a notification to a user.
    
    Args:
        user_id: The ID of the user (student or teacher)
        user_type: Either 'student' or 'teacher'
        title: Notification title
        message: Notification message body
        notification_type: Type of notification (assessment, course_update, badge, message, announcement, reminder)
        priority: Priority level (high, medium, low)
    
    Returns:
        Notification: The created notification object
    """
    return Notification.objects.create(
        user_id=user_id,
        user_type=user_type,
        type=notification_type,
        title=title,
        message=message,
        priority=priority
    )


def send_to_all_students(title, message, notification_type='announcement', priority='medium'):
    """
    Send a notification to all students.
    
    Args:
        title: Notification title
        message: Notification message body
        notification_type: Type of notification
        priority: Priority level
    
    Returns:
        int: Number of notifications created
    """
    from auth_app.models import Student
    
    students = Student.objects.all()
    notifications = []
    
    for student in students:
        notifications.append(
            Notification(
                user_id=student.id,
                user_type='student',
                type=notification_type,
                title=title,
                message=message,
                priority=priority
            )
        )
    
    Notification.objects.bulk_create(notifications)
    return len(notifications)


def send_to_all_teachers(title, message, notification_type='announcement', priority='medium'):
    """
    Send a notification to all teachers.
    
    Args:
        title: Notification title
        message: Notification message body
        notification_type: Type of notification
        priority: Priority level
    
    Returns:
        int: Number of notifications created
    """
    from auth_app.models import Educator
    
    teachers = Educator.objects.all()
    notifications = []
    
    for teacher in teachers:
        notifications.append(
            Notification(
                user_id=teacher.id,
                user_type='teacher',
                type=notification_type,
                title=title,
                message=message,
                priority=priority
            )
        )
    
    Notification.objects.bulk_create(notifications)
    return len(notifications)


def mark_all_as_read(user_id, user_type):
    """
    Mark all notifications as read for a user.
    
    Args:
        user_id: The ID of the user
        user_type: Either 'student' or 'teacher'
    
    Returns:
        int: Number of notifications marked as read
    """
    return Notification.objects.filter(
        user_id=user_id,
        user_type=user_type,
        is_read=False
    ).update(is_read=True)
