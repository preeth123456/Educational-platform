from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import BreachReport, BreachNotification
from .serializers import BreachReportSerializer, BreachNotificationSerializer
import pymysql

class BreachReportViewSet(viewsets.ModelViewSet):
    queryset = BreachReport.objects.all()
    serializer_class = BreachReportSerializer

class BreachNotificationViewSet(viewsets.ModelViewSet):
    queryset = BreachNotification.objects.all()
    serializer_class = BreachNotificationSerializer

@csrf_exempt
@api_view(['POST'])
def create_breach_report(request):
    """Create breach report with notifications and email"""
    try:
        # Use Django's timezone (should be set to IST in settings)
        from datetime import datetime, timedelta
        current_time = timezone.now() + timedelta(hours=5, minutes=30)  # IST offset
        
        # Add current timestamp to data
        data = request.data.copy()
        data['created_at'] = current_time
        
        serializer = BreachReportSerializer(data=data)
        if serializer.is_valid():
            breach_report = serializer.save()
            
            # Update affected counts with actual student counts
            try:
                conn = pymysql.connect(
                    host='localhost',
                    port=3306,
                    user='root',
                    password='',
                    database='eduyata_db'
                )
                
                cursor = conn.cursor()
                
                # Count actual students in source group
                cursor.execute("""
                    SELECT COUNT(*) FROM students 
                    WHERE board = %s AND class = %s
                """, (breach_report.source_board, breach_report.source_class))
                actual_source_count = cursor.fetchone()[0]
                
                # Count actual students in target group
                cursor.execute("""
                    SELECT COUNT(*) FROM students 
                    WHERE board = %s AND class = %s
                """, (breach_report.target_board, breach_report.target_class))
                actual_target_count = cursor.fetchone()[0]
                
                # Update breach report with actual counts
                breach_report.source_affected_count = actual_source_count
                breach_report.target_affected_count = actual_target_count
                breach_report.total_affected = actual_source_count + actual_target_count
                breach_report.save()
                
                conn.close()
            except Exception as e:
                print(f"Error updating affected counts: {e}")
            
            # Create notifications and send emails
            try:
                # Get admin emails
                conn = pymysql.connect(
                    host='localhost',
                    port=3306,
                    user='root',
                    password='',
                    database='eduyata_db'
                )
                
                cursor = conn.cursor()
                
                # Get admin emails
                cursor.execute("SELECT email FROM auth_user WHERE is_superuser = 1")
                admin_emails = [row[0] for row in cursor.fetchall() if row[0]]
                
                # Get source group emails (students from source board/class)
                cursor.execute("""
                    SELECT email FROM students 
                    WHERE board = %s AND class = %s AND email IS NOT NULL AND email != ''
                """, (breach_report.source_board, breach_report.source_class))
                source_emails = [row[0] for row in cursor.fetchall() if row[0] and '@' in row[0]]
                
                # Get target group emails (students from target board/class)
                cursor.execute("""
                    SELECT email FROM students 
                    WHERE board = %s AND class = %s AND email IS NOT NULL AND email != ''
                """, (breach_report.target_board, breach_report.target_class))
                target_emails = [row[0] for row in cursor.fetchall() if row[0] and '@' in row[0]]
                
                print(f"Found {len(source_emails)} source emails: {source_emails}")
                print(f"Found {len(target_emails)} target emails: {target_emails}")
                
                conn.close()
                
                # Send to admins
                for email in admin_emails or ['admin@eduyata.com']:
                    try:
                        notification = BreachNotification.objects.create(
                            breach_report=breach_report,
                            recipient_type='admin',
                            recipient_email=email,
                            message_sent=True,
                            sent_at=current_time
                        )
                        print(f"Created notification {notification.id} for admin {email}")
                    except Exception as e:
                        print(f"Error creating admin notification: {e}")
                    
                    send_mail(
                        f"URGENT: Data Breach Report #{breach_report.id}",
                        f"""Data Breach Alert - EduYata

A data breach has been reported:

Breach ID: {breach_report.id}
Reported by: {breach_report.reported_by}
Time: {current_time.strftime('%B %d, %Y at %I:%M %p IST')}
Severity: {breach_report.severity.upper()}

Description: {breach_report.description}
Data Type: {breach_report.data_type}

Source Group: {breach_report.source_board} Class {breach_report.source_class} ({breach_report.source_affected_count} affected)
Target Group: {breach_report.target_board} Class {breach_report.target_class} ({breach_report.target_affected_count} received wrong data)

Total Affected: {breach_report.total_affected}

Please take immediate action.

EduYata Security Team""",
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        fail_silently=True
                    )
                
                # Send to source group (whose data was leaked)
                for email in source_emails:
                    try:
                        notification = BreachNotification.objects.create(
                            breach_report=breach_report,
                            recipient_type='affected_student',
                            recipient_email=email,
                            message_sent=True,
                            sent_at=current_time
                        )
                        print(f"Created notification {notification.id} for source {email}")
                    except Exception as e:
                        print(f"Error creating source notification: {e}")
                    
                    send_mail(
                        f"IMPORTANT: Your Data Privacy Notice - Breach Report #{breach_report.id}",
                        f"""Dear Student/Parent,

We are writing to inform you of a data privacy incident that may have affected your personal information.

Incident Details:
Date: {current_time.strftime('%B %d, %Y at %I:%M %p IST')}
Your Group: {breach_report.source_board} Class {breach_report.source_class}
Data Type Affected: {breach_report.data_type}

What Happened:
{breach_report.description}

Your personal information may have been inadvertently shared with {breach_report.target_board} Class {breach_report.target_class} students/parents.

What We're Doing:
- Immediate investigation has been launched
- All affected parties have been notified
- Additional security measures are being implemented

What You Should Do:
- Monitor your accounts for any unusual activity
- Contact us immediately if you notice anything suspicious
- Update your passwords as a precautionary measure

We sincerely apologize for this incident and are taking all necessary steps to prevent future occurrences.

For questions, contact: support@eduyata.com

EduYata Security Team""",
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        fail_silently=True
                    )
                
                # Send to target group (who received wrong data)
                for email in target_emails:
                    try:
                        notification = BreachNotification.objects.create(
                            breach_report=breach_report,
                            recipient_type='recipient_student',
                            recipient_email=email,
                            message_sent=True,
                            sent_at=current_time
                        )
                        print(f"Created notification {notification.id} for target {email}")
                    except Exception as e:
                        print(f"Error creating target notification: {e}")
                    
                    send_mail(
                        f"IMPORTANT: Data Privacy Notice - Please Delete Received Information",
                        f"""Dear Student/Parent,

We are writing to inform you that you may have received personal information that was not intended for you.

Incident Details:
Date: {current_time.strftime('%B %d, %Y at %I:%M %p IST')}
Your Group: {breach_report.target_board} Class {breach_report.target_class}
Data Type: {breach_report.data_type}

What Happened:
{breach_report.description}

You may have received personal information belonging to {breach_report.source_board} Class {breach_report.source_class} students.

IMPORTANT - Please Take These Actions Immediately:
1. DO NOT share, forward, or discuss this information with anyone
2. DELETE any messages, files, or information you may have received
3. If you have printed any materials, please destroy them securely
4. Contact us immediately to confirm you have taken these steps

This information is confidential and protected by privacy laws. Unauthorized use or disclosure may have legal consequences.

We apologize for this incident and appreciate your cooperation in protecting the privacy of other students.

For questions or to confirm deletion, contact: support@eduyata.com

EduYata Security Team""",
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        fail_silently=True
                    )
                    
            except Exception as e:
                print(f"Error sending notifications: {e}")
            
            return Response({
                'status': 'success',
                'message': 'Breach reported successfully and notifications sent',
                'id': breach_report.id
            }, status=201)
        else:
            return Response({
                'status': 'error',
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=400)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)
