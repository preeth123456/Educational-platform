"""
Event Bus - Signal Definitions

This module defines Django signals for system-wide events.
These signals are emitted when specific actions occur (e.g., student registration,
course enrollment) and are handled by the handlers module to create notifications.

Usage:
    from core.events import student_enrolled
    student_enrolled.send(
        sender=None,
        student_id=123,
        course_id=456,
        course_title='Python Basics'
    )
"""

from django.dispatch import Signal


# ==========================================
# STUDENT EVENTS
# ==========================================

# Emitted when a new student registers
student_registered = Signal()

# Emitted when a student enrolls in a course
student_enrolled = Signal()

# Emitted when a student completes a course
course_completed = Signal()

# Emitted when a student completes a quiz
quiz_completed = Signal()

# Emitted when student learning progress is updated
progress_updated = Signal()


# ==========================================
# ACHIEVEMENT EVENTS
# ==========================================

# Emitted when a student earns a badge
badge_earned = Signal()


# ==========================================
# TEACHER EVENTS
# ==========================================

# Emitted when a new teacher registers
teacher_registered = Signal()

# Emitted when a teacher creates a new course
course_created = Signal()

# Emitted when a teacher's course is approved
course_approved = Signal()

# Emitted when a teacher profile is verified/approved
teacher_approved = Signal()
