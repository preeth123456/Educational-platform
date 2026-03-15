from django.core.management.base import BaseCommand
from django.utils import timezone
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.db import connection
from datetime import timedelta
from ...models import Schedule, Educator, Student


class Command(BaseCommand):
    help = 'Send reminder notifications for upcoming scheduled events'

    def handle(self, *args, **options):
        now = timezone.now()
        self.stdout.write(f'Starting reminder check at {now}')

        # Check for 1-day reminders
        one_day_from_now = now + timedelta(days=1)
        self.send_1_day_reminders(one_day_from_now)

        # Check for 1-hour reminders
        one_hour_from_now = now + timedelta(hours=1)
        self.send_1_hour_reminders(one_hour_from_now)

        self.stdout.write('Reminder check completed')

    def send_1_day_reminders(self, target_time):
        """Send 1-day reminders for events happening tomorrow"""
        # Find schedules that need 1-day reminders and haven't been sent yet
        schedules = Schedule.objects.filter(
            reminder_1_day=True,
            reminder_1_day_sent=False,
            event_datetime__gte=target_time - timedelta(minutes=30),  # Within 30 minutes
            event_datetime__lte=target_time + timedelta(minutes=30)   # Within 30 minutes
        )

        self.stdout.write(f'Found {schedules.count()} schedules needing 1-day reminders')

        for schedule in schedules:
            self.send_reminder(schedule, '1_day')
            schedule.reminder_1_day_sent = True
            schedule.save()

    def send_1_hour_reminders(self, target_time):
        """Send 1-hour reminders for events happening in 1 hour"""
        # Find schedules that need 1-hour reminders and haven't been sent yet
        schedules = Schedule.objects.filter(
            reminder_1_hour=True,
            reminder_1_hour_sent=False,
            event_datetime__gte=target_time - timedelta(minutes=30),  # Within 30 minutes
            event_datetime__lte=target_time + timedelta(minutes=30)   # Within 30 minutes
        )

        self.stdout.write(f'Found {schedules.count()} schedules needing 1-hour reminders')

        for schedule in schedules:
            self.send_reminder(schedule, '1_hour')
            schedule.reminder_1_hour_sent = True
            schedule.save()

    def send_reminder(self, schedule, reminder_type):
        """Send reminder for a specific schedule"""
        reminder_text = "1 day" if reminder_type == '1_day' else "1 hour"

        # Format datetime for display
        formatted_datetime = schedule.event_datetime.strftime('%B %d, %Y at %I:%M %p')

        # Send based on assigned_to
        if schedule.assigned_to == 'Faculty':
            self.send_faculty_reminder(schedule, reminder_text, formatted_datetime)
        elif schedule.assigned_to == 'Students':
            self.send_student_reminder(schedule, reminder_text, formatted_datetime)
        elif schedule.assigned_to == 'Everyone':
            self.send_faculty_reminder(schedule, reminder_text, formatted_datetime)
            self.send_student_reminder(schedule, reminder_text, formatted_datetime)

        self.stdout.write(f'Sent {reminder_text} reminder for: {schedule.event_name}')

    def send_faculty_reminder(self, schedule, reminder_text, formatted_datetime):
        """Send reminder emails to faculty"""
        educators = Educator.objects.filter(is_active=True, approval_status='approved')

        for educator in educators:
            if educator.email:
                try:
                    email_body = render_to_string('emails/notification_email.html', {
                        'notification_title': f'Reminder: {schedule.event_name}',
                        'notification_message': f'Dear {educator.name}, this is a {reminder_text} reminder for an upcoming event.',
                        'event_name': schedule.event_name,
                        'event_datetime': formatted_datetime,
                        'event_type': schedule.event_type,
                        'meeting_link': 'https://meet.google.com/qrs-rmac-ndm'
                    })

                    email = EmailMessage(
                        subject=f'Eduyata Reminder: {schedule.event_name} - {reminder_text} away',
                        body=email_body,
                        from_email='noreply@eduyata.com',
                        to=[educator.email]
                    )
                    email.content_subtype = 'html'
                    email.send()

                except Exception as e:
                    self.stdout.write(f'Failed to send email to {educator.email}: {e}')

    def send_student_reminder(self, schedule, reminder_text, formatted_datetime):
        """Send reminder notifications to students"""
        students = Student.objects.all()
        message = f"⏰ REMINDER: {schedule.event_name} is {reminder_text} away! Scheduled for {formatted_datetime}"

        try:
            with connection.cursor() as cursor:
                for student in students:
                    cursor.execute("""
                        INSERT INTO student_notifications (student_id, message, is_read, created_at)
                        VALUES (%s, %s, %s, NOW())
                    """, [student.id, message, False])

            self.stdout.write(f'Sent {reminder_text} reminders to {students.count()} students')

        except Exception as e:
            self.stdout.write(f'Failed to send student notifications: {e}')