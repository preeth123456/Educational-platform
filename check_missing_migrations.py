import os
import re
import glob

# Database tables from your list
db_tables = [
    'active_user_contexts', 'admins', 'admin_announcements', 'admin_notifications', 'api_keys',
    'audit_logs', 'auth_app_enrollment', 'auth_app_student', 'auth_group', 'auth_group_permissions',
    'auth_permission', 'auth_user', 'auth_user_groups', 'auth_user_user_permissions', 'backup_history',
    'boards', 'breach_notification_breachnotification', 'breach_notification_breachreport', 'chapters',
    'classes', 'classroom_announcements', 'classroom_enrollments', 'classroom_resources', 'classroom_sessions',
    'class_levels', 'compliance_compliancelog', 'compliance_compliancerule', 'conference_participants',
    'conference_recordings', 'config_change_logs', 'consent_history', 'context_switch_logs', 'courses',
    'courses_course', 'course_categories', 'course_class_board', 'course_lessons', 'course_modules',
    'django_admin_log', 'django_content_type', 'django_migrations', 'django_session', 'educators',
    'encryption_keys', 'grievance_cases', 'grievance_evidence', 'grievance_notifications', 'grievance_timeline',
    'incident_response_accountlock', 'incident_response_loginattempt', 'incident_response_securityincident',
    'integrations', 'lessons', 'lesson_contents', 'lesson_progress', 'onboarding_steps', 'platform_config',
    'platform_configs', 'projects', 'project_documents', 'project_groups', 'project_group_members',
    'quiz_results', 'schedules', 'security_events', 'session_events', 'session_policies', 'skill_endorsements',
    'students', 'student_activities', 'student_badges', 'student_consent', 'student_enrollments',
    'student_notifications', 'student_progress', 'subjects', 'support_tickets', 'system_metrics',
    'teachers', 'teacher_email_logs', 'ticket_attachments', 'ticket_responses', 'user_contexts',
    'user_devices', 'user_sessions', 'video_conferences', 'video_progress', 'virtual_classrooms',
    'virtual_classrooms_classroomannouncement', 'virtual_classrooms_classroomenrollment',
    'virtual_classrooms_classroomresource', 'virtual_classrooms_classroomsession', 'webhook_endpoints'
]

def find_tables_without_migrations():
    """Find tables that don't have Django migrations"""
    
    base_path = "django_backend"
    apps = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d)) and not d.startswith('__')]
    
    # Tables created by Django migrations
    django_tables = set()
    
    # Standard Django tables
    django_system_tables = {
        'auth_group', 'auth_group_permissions', 'auth_permission', 'auth_user', 
        'auth_user_groups', 'auth_user_user_permissions', 'django_admin_log',
        'django_content_type', 'django_migrations', 'django_session'
    }
    
    for app in apps:
        migrations_path = os.path.join(base_path, app, "migrations")
        if not os.path.exists(migrations_path):
            continue
            
        migration_files = glob.glob(os.path.join(migrations_path, "*.py"))
        migration_files = [f for f in migration_files if not f.endswith("__init__.py")]
        
        for migration_file in migration_files:
            with open(migration_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Find CreateModel operations
            create_model_pattern = r'migrations\.CreateModel\(\s*name=[\'"](\w+)[\'"],(.*?)options=\{(.*?)\}'
            matches = re.findall(create_model_pattern, content, re.DOTALL)
            
            for model_name, fields_section, options_section in matches:
                # Extract db_table name
                db_table_match = re.search(r'[\'"]db_table[\'"]:\s*[\'"](\w+)[\'"]', options_section)
                table_name = db_table_match.group(1) if db_table_match else f"{app}_{model_name.lower()}"
                django_tables.add(table_name)
    
    # Add Django system tables
    django_tables.update(django_system_tables)
    
    # Find tables without migrations
    tables_without_migrations = []
    sql_only_tables = []
    
    for table in db_tables:
        if table not in django_tables:
            tables_without_migrations.append(table)
    
    # Check SQL files for these tables
    sql_files = glob.glob("*.sql") + glob.glob("database/*.sql") + glob.glob("django_backend/*.sql")
    
    for sql_file in sql_files:
        if os.path.exists(sql_file):
            with open(sql_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            for table in tables_without_migrations:
                if f"CREATE TABLE" in content.upper() and table in content:
                    if table not in sql_only_tables:
                        sql_only_tables.append(table)
    
    print(f"TOTAL DATABASE TABLES: {len(db_tables)}")
    print(f"TABLES WITH DJANGO MIGRATIONS: {len(django_tables)}")
    print(f"TABLES WITHOUT MIGRATIONS: {len(tables_without_migrations)}")
    
    if tables_without_migrations:
        print(f"\nTABLES WITHOUT DJANGO MIGRATIONS:")
        for table in sorted(tables_without_migrations):
            source = "SQL file" if table in sql_only_tables else "Unknown"
            print(f"  - {table} ({source})")
    
    print(f"\nSQL-ONLY TABLES (need Django migrations): {len(sql_only_tables)}")
    for table in sorted(sql_only_tables):
        print(f"  - {table}")

if __name__ == "__main__":
    find_tables_without_migrations()