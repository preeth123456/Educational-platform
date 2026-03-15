import os
from datetime import datetime
from django.conf import settings
from django.db import connection
from .models import Student, DataExport
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT

class DataExporter:
    """Handle data export functionality"""
    
    def __init__(self, student_id):
        self.student_id = student_id
        try:
            self.student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            raise ValueError(f"Student with ID {student_id} not found")
        
    def export_all_data(self, format='pdf'):
        """Export all user data"""
        data = self._collect_all_data()
        
        if format == 'pdf':
            return self._export_pdf(data)
        else:
            raise ValueError("Only PDF format is supported")
    
    def _collect_all_data(self):
        """Collect all user data from database"""
        print(f"Collecting data for student ID: {self.student_id}")
        data = {
            'export_info': {
                'student_id': self.student_id,
                'export_date': datetime.now().isoformat(),
                'data_types': []
            },
            'profile': self._get_profile_data(),
            'enrollments': self._get_enrollment_data(),
            'progress': self._get_progress_data(),
            'quiz_results': self._get_quiz_data(),
            'badges': self._get_badge_data(),
            'endorsements': self._get_endorsement_data(),
            'activities': self._get_activity_data(),
            'preferences': self._get_preferences_data(),
            'consent_history': self._get_consent_data()
        }
        
        data['export_info']['data_types'] = list(data.keys())[1:]
        print(f"Activities found: {len(data['activities'])}")
        return data
    
    def _get_profile_data(self):
        """Get student profile data"""
        return {
            'student_id': self.student.student_id,
            'name': self.student.name,
            'gender': self.student.gender,
            'mobile_self': self.student.get_mobile_self(),
            'class_level': self.student.class_level,
            'board': self.student.board,
            'date_of_birth': str(self.student.date_of_birth) if self.student.date_of_birth else None,
            'address': self.student.get_address(),
            'parent_name': self.student.parent_name,
            'parent_phone': self.student.get_parent_phone(),
            'interests': self.student.interests,
            'profile_completed': self.student.profile_completed,
            'created_at': self.student.created_at.isoformat(),
            'updated_at': self.student.updated_at.isoformat()
        }
    
    def _get_enrollment_data(self):
        """Get course enrollment data"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT c.course_name, c.subject, c.class_level, c.board,
                           se.enrollment_date, se.status
                    FROM student_enrollments se
                    JOIN courses c ON se.course_id = c.id
                    WHERE se.student_id = %s
                """, [self.student_id])
                
                return [dict(zip([col[0] for col in cursor.description], row)) 
                       for row in cursor.fetchall()]
        except Exception as e:
            print(f"Enrollment data not available: {e}")
            return []
    
    def _get_progress_data(self):
        """Get learning progress data"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT course_name, subject, chapter, lesson, progress_percentage,
                           completed, last_accessed
                    FROM student_progress
                    WHERE student_id = %s
                """, [self.student_id])
                
                return [dict(zip([col[0] for col in cursor.description], row)) 
                       for row in cursor.fetchall()]
        except Exception as e:
            print(f"Progress data not available: {e}")
            return []
    
    def _get_quiz_data(self):
        """Get quiz results data"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT course_name, subject, chapter, lesson, quiz_type,
                           score, total_questions, correct_answers, completed_at
                    FROM quiz_results
                    WHERE student_id = %s
                """, [self.student_id])
                
                return [dict(zip([col[0] for col in cursor.description], row)) 
                       for row in cursor.fetchall()]
        except Exception as e:
            print(f"Quiz data not available: {e}")
            return []
    
    def _get_badge_data(self):
        """Get badge data"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT b.name, b.description, b.category, sb.earned_at
                    FROM student_badges sb
                    JOIN badges b ON sb.badge_id = b.id
                    WHERE sb.student_id = %s
                """, [self.student_id])
                
                return [dict(zip([col[0] for col in cursor.description], row)) 
                       for row in cursor.fetchall()]
        except Exception as e:
            print(f"Badge data not available: {e}")
            return []
    
    def _get_endorsement_data(self):
        """Get endorsement data"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT skill_name, endorser_name, endorser_type, level,
                           comments, created_at
                    FROM skill_endorsements
                    WHERE student_id = %s
                """, [self.student_id])
                
                return [dict(zip([col[0] for col in cursor.description], row)) 
                       for row in cursor.fetchall()]
        except Exception as e:
            print(f"Endorsement data not available: {e}")
            return []
    
    def _get_activity_data(self):
        """Get activity history"""
        try:
            print(f"Fetching activities for student_id: {self.student_id}")
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT activity_type, action, subject, course_name, created_at
                    FROM student_activities
                    WHERE student_id = %s
                    ORDER BY created_at DESC
                    LIMIT 1000
                """, [self.student_id])
                
                results = [dict(zip([col[0] for col in cursor.description], row)) 
                          for row in cursor.fetchall()]
                print(f"Found {len(results)} activities for student {self.student_id}")
                if results:
                    print(f"Sample activity: {results[0]}")
                return results
        except Exception as e:
            print(f"Activity data error: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _get_preferences_data(self):
        """Get user preferences"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT email_notifications, push_notifications, assignment_reminders,
                           course_updates, achievement_alerts, theme, language,
                           timezone, dashboard_layout
                    FROM user_preferences
                    WHERE student_id = %s
                """, [self.student_id])
                
                row = cursor.fetchone()
                if row:
                    return dict(zip([col[0] for col in cursor.description], row))
                return {}
        except Exception as e:
            print(f"Preferences data not available: {e}")
            return {}
    
    def _get_consent_data(self):
        """Get consent history"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT consent_type, action, timestamp, ip_address
                    FROM consent_history
                    WHERE student_id = %s
                    ORDER BY timestamp DESC
                """, [self.student_id])
                
                return [dict(zip([col[0] for col in cursor.description], row)) 
                       for row in cursor.fetchall()]
        except Exception as e:
            print(f"Consent data not available: {e}")
            return []
    
    def _export_pdf(self, data):
        """Export data as PDF"""
        try:
            filename = f"student_data_{self.student_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(settings.MEDIA_ROOT, 'exports', filename)
            
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            styles = getSampleStyleSheet()
            story = []
            
            # Title
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                spaceAfter=30,
                alignment=TA_CENTER
            )
            story.append(Paragraph("Complete Student Data Export", title_style))
            story.append(Spacer(1, 12))
            
            # Export Info
            story.append(Paragraph("Export Information", styles['Heading2']))
            export_info = data['export_info']
            
            # Format data types in multiple lines within the same cell
            data_types_text = "<br/>".join(export_info['data_types'])
            
            info_data = [
                ['Field', 'Value'],
                ['Student ID', str(export_info['student_id'])],
                ['Export Date', export_info['export_date']],
                [Paragraph('Data Types<br/>Included', styles['Normal']), Paragraph(data_types_text, styles['Normal'])]
            ]
            info_table = Table(info_data, colWidths=[2*inch, 4*inch])
            info_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('VALIGN', (0, 0), (-1, -1), 'TOP')
            ]))
            story.append(info_table)
            story.append(Spacer(1, 20))
            
            # Profile Data
            if data['profile']:
                story.append(Paragraph("Student Profile", styles['Heading2']))
                profile = data['profile']
                profile_data = [['Field', 'Value']]
                
                for field, value in [
                    ('Student ID', profile.get('student_id', 'N/A')),
                    ('Name', profile.get('name', 'N/A')),
                    ('Gender', profile.get('gender', 'N/A')),
                    ('Mobile', profile.get('mobile_self', 'N/A')),
                    ('Class Level', profile.get('class_level', 'N/A')),
                    ('Board', profile.get('board', 'N/A')),
                    ('Date of Birth', profile.get('date_of_birth', 'N/A')),
                    ('Address', profile.get('address', 'N/A')),
                    ('Parent Name', profile.get('parent_name', 'N/A')),
                    ('Parent Phone', profile.get('parent_phone', 'N/A')),
                    ('Interests', profile.get('interests', 'N/A')),
                    ('Profile Completed', str(profile.get('profile_completed', False))),
                    ('Created At', str(profile.get('created_at', 'N/A'))),
                    ('Updated At', str(profile.get('updated_at', 'N/A')))
                ]:
                    profile_data.append([field, Paragraph(str(value), styles['Normal'])])
                
                profile_table = Table(profile_data, colWidths=[2*inch, 4*inch])
                profile_table.setStyle(self._get_table_style())
                story.append(profile_table)
                story.append(PageBreak())
            
            # Activities
            story.append(Paragraph("Activity History", styles['Heading2']))
            activities = data['activities']
            activity_data = [['Type', 'Action', 'Subject', 'Course', 'Date']]
            if activities:
                for activity in activities:
                    activity_data.append([
                        Paragraph(str(activity.get('activity_type', 'N/A')), styles['Normal']),
                        Paragraph(str(activity.get('action', 'N/A')), styles['Normal']),
                        Paragraph(str(activity.get('subject', 'N/A')), styles['Normal']),
                        Paragraph(str(activity.get('course_name', 'N/A')), styles['Normal']),
                        Paragraph(str(activity.get('created_at', 'N/A')), styles['Normal'])
                    ])
            else:
                activity_data.append(['No Data', 'No Data', 'No Data', 'No Data', 'No Data'])
            activity_table = Table(activity_data, colWidths=[1*inch, 1.3*inch, 1.2*inch, 1.3*inch, 1.2*inch])
            activity_table.setStyle(self._get_table_style())
            story.append(activity_table)
            story.append(PageBreak())
            
            # Enrollments
            story.append(Paragraph("Course Enrollments", styles['Heading2']))
            enrollments = data['enrollments']
            enroll_data = [['Course', 'Subject', 'Class', 'Board', 'Date', 'Status']]
            if enrollments:
                for enrollment in enrollments:
                    enroll_data.append([
                        Paragraph(str(enrollment.get('course_name', 'N/A')), styles['Normal']),
                        Paragraph(str(enrollment.get('subject', 'N/A')), styles['Normal']),
                        Paragraph(str(enrollment.get('class_level', 'N/A')), styles['Normal']),
                        Paragraph(str(enrollment.get('board', 'N/A')), styles['Normal']),
                        Paragraph(str(enrollment.get('enrollment_date', 'N/A')), styles['Normal']),
                        Paragraph(str(enrollment.get('status', 'N/A')), styles['Normal'])
                    ])
            else:
                enroll_data.append(['No Data', 'No Data', 'No Data', 'No Data', 'No Data', 'No Data'])
            enroll_table = Table(enroll_data, colWidths=[1.2*inch, 1.2*inch, 0.8*inch, 0.8*inch, 1.2*inch, 0.8*inch])
            enroll_table.setStyle(self._get_table_style())
            story.append(enroll_table)
            story.append(PageBreak())
            
            # Progress
            story.append(Paragraph("Learning Progress", styles['Heading2']))
            progress = data['progress']
            prog_data = [['Course', 'Subject', 'Chapter', 'Lesson', 'Progress %', 'Completed']]
            if progress:
                for prog in progress:
                    prog_data.append([
                        Paragraph(str(prog.get('course_name', 'N/A')), styles['Normal']),
                        Paragraph(str(prog.get('subject', 'N/A')), styles['Normal']),
                        Paragraph(str(prog.get('chapter', 'N/A')), styles['Normal']),
                        Paragraph(str(prog.get('lesson', 'N/A')), styles['Normal']),
                        Paragraph(str(prog.get('progress_percentage', 'N/A')), styles['Normal']),
                        Paragraph(str(prog.get('completed', 'N/A')), styles['Normal'])
                    ])
            else:
                prog_data.append(['No Data', 'No Data', 'No Data', 'No Data', 'No Data', 'No Data'])
            prog_table = Table(prog_data, colWidths=[1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch, 0.8*inch, 0.8*inch])
            prog_table.setStyle(self._get_table_style())
            story.append(prog_table)
            story.append(PageBreak())
            
            # Quiz Results
            story.append(Paragraph("Quiz Results", styles['Heading2']))
            quizzes = data['quiz_results']
            quiz_data = [['Course', 'Subject', 'Chapter', 'Quiz Type', 'Score', 'Total', 'Correct']]
            if quizzes:
                for quiz in quizzes:
                    quiz_data.append([
                        Paragraph(str(quiz.get('course_name', 'N/A')), styles['Normal']),
                        Paragraph(str(quiz.get('subject', 'N/A')), styles['Normal']),
                        Paragraph(str(quiz.get('chapter', 'N/A')), styles['Normal']),
                        Paragraph(str(quiz.get('quiz_type', 'N/A')), styles['Normal']),
                        Paragraph(str(quiz.get('score', 'N/A')), styles['Normal']),
                        Paragraph(str(quiz.get('total_questions', 'N/A')), styles['Normal']),
                        Paragraph(str(quiz.get('correct_answers', 'N/A')), styles['Normal'])
                    ])
            else:
                quiz_data.append(['No Data', 'No Data', 'No Data', 'No Data', 'No Data', 'No Data', 'No Data'])
            quiz_table = Table(quiz_data, colWidths=[1*inch, 1*inch, 1*inch, 1*inch, 0.7*inch, 0.7*inch, 0.7*inch])
            quiz_table.setStyle(self._get_table_style())
            story.append(quiz_table)
            story.append(PageBreak())
            
            # Badges
            story.append(Paragraph("Badges Earned", styles['Heading2']))
            badges = data['badges']
            badge_data = [['Badge Name', 'Description', 'Category', 'Earned At']]
            if badges:
                for badge in badges:
                    badge_data.append([
                        Paragraph(str(badge.get('name', 'N/A')), styles['Normal']),
                        Paragraph(str(badge.get('description', 'N/A')), styles['Normal']),
                        Paragraph(str(badge.get('category', 'N/A')), styles['Normal']),
                        Paragraph(str(badge.get('earned_at', 'N/A')), styles['Normal'])
                    ])
            else:
                badge_data.append(['No Data', 'No Data', 'No Data', 'No Data'])
            badge_table = Table(badge_data, colWidths=[1.5*inch, 2.5*inch, 1.2*inch, 1.3*inch])
            badge_table.setStyle(self._get_table_style())
            story.append(badge_table)
            story.append(PageBreak())
            
            # Endorsements
            story.append(Paragraph("Skill Endorsements", styles['Heading2']))
            endorsements = data['endorsements']
            endorse_data = [['Skill', 'Endorser', 'Type', 'Level', 'Comments', 'Date']]
            if endorsements:
                for endorse in endorsements:
                    endorse_data.append([
                        Paragraph(str(endorse.get('skill_name', 'N/A')), styles['Normal']),
                        Paragraph(str(endorse.get('endorser_name', 'N/A')), styles['Normal']),
                        Paragraph(str(endorse.get('endorser_type', 'N/A')), styles['Normal']),
                        Paragraph(str(endorse.get('level', 'N/A')), styles['Normal']),
                        Paragraph(str(endorse.get('comments', 'N/A')), styles['Normal']),
                        Paragraph(str(endorse.get('created_at', 'N/A')), styles['Normal'])
                    ])
            else:
                endorse_data.append(['No Data', 'No Data', 'No Data', 'No Data', 'No Data', 'No Data'])
            endorse_table = Table(endorse_data, colWidths=[1*inch, 1*inch, 0.8*inch, 0.8*inch, 1.5*inch, 1.4*inch])
            endorse_table.setStyle(self._get_table_style())
            story.append(endorse_table)
            story.append(PageBreak())
            
            # Preferences
            story.append(Paragraph("User Preferences", styles['Heading2']))
            preferences = data['preferences']
            pref_data = [['Setting', 'Value']]
            if preferences:
                for key, value in preferences.items():
                    pref_data.append([
                        Paragraph(key.replace('_', ' ').title(), styles['Normal']),
                        Paragraph(str(value), styles['Normal'])
                    ])
            else:
                pref_data.append(['No Data', 'No Data'])
            pref_table = Table(pref_data, colWidths=[2*inch, 4*inch])
            pref_table.setStyle(self._get_table_style())
            story.append(pref_table)
            story.append(PageBreak())
            
            # Consent History
            story.append(Paragraph("Consent History", styles['Heading2']))
            consents = data['consent_history']
            consent_data = [['Consent Type', 'Action', 'Timestamp', 'IP Address']]
            if consents:
                for consent in consents:
                    consent_data.append([
                        Paragraph(str(consent.get('consent_type', 'N/A')), styles['Normal']),
                        Paragraph(str(consent.get('action', 'N/A')), styles['Normal']),
                        Paragraph(str(consent.get('timestamp', 'N/A')), styles['Normal']),
                        Paragraph(str(consent.get('ip_address', 'N/A')), styles['Normal'])
                    ])
            else:
                consent_data.append(['No Data', 'No Data', 'No Data', 'No Data'])
            consent_table = Table(consent_data, colWidths=[1.5*inch, 1.2*inch, 1.8*inch, 1.5*inch])
            consent_table.setStyle(self._get_table_style())
            story.append(consent_table)
            
            # Add other sections as needed
            story.append(Spacer(1, 20))
            story.append(Paragraph("Export completed successfully.", styles['Normal']))
            
            doc.build(story)
            print(f"PDF generated successfully at: {filepath}")
            
            # Log the export to audit system
            try:
                from .forensic_audit import ForensicAuditLogger
                ForensicAuditLogger.log_data_export(
                    exported_by=self.student_id,
                    export_type='student_data_pdf',
                    data_types=data['export_info']['data_types'],
                    purpose='student_data_export',
                    record_count=1,
                    ip_address='127.0.0.1'  # This should come from request in real usage
                )
            except Exception as e:
                print(f"Failed to log export to audit system: {e}")
            
            return filepath
            
        except Exception as e:
            print(f"Error generating PDF: {str(e)}")
            import traceback
            traceback.print_exc()
            raise e
    
    def _get_table_style(self):
        """Get standard table style with proper text wrapping"""
        return TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 7),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 3),
            ('RIGHTPADDING', (0, 0), (-1, -1), 3),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 3)
        ])