from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
from admin_auth.models import BackupHistory
import os
import subprocess
from datetime import datetime
import pymysql

class Command(BaseCommand):
    help = 'Create database backup using mysqldump'

    def add_arguments(self, parser):
        parser.add_argument(
            '--created-by',
            type=str,
            default='system',
            help='Who created this backup'
        )

    def handle(self, *args, **options):
        try:
            # Create backups directory if it doesn't exist
            backup_dir = os.path.join(settings.MEDIA_ROOT, 'backups')
            os.makedirs(backup_dir, exist_ok=True)

            # Generate filename with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'eduyata_db_backup_{timestamp}.sql'
            filepath = os.path.join(backup_dir, filename)

            # Database configuration
            db_config = settings.DATABASES['default']

            self.stdout.write(f'Creating backup: {filename}')

            # Create SQL dump using pymysql (works with XAMPP)
            sql_dump = self.create_sql_dump(db_config)

            # Write to file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(sql_dump)

            # Get file size
            file_size = os.path.getsize(filepath)

            # Save to database
            backup = BackupHistory.objects.create(
                filename=filename,
                file_size=file_size,
                status='success',
                created_by=options['created_by']
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created backup: {filename} ({file_size} bytes)'
                )
            )

        except Exception as e:
            # Log failure
            try:
                BackupHistory.objects.create(
                    filename=filename if 'filename' in locals() else f'backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.sql',
                    status='failed',
                    created_by=options['created_by']
                )
            except:
                pass

            self.stdout.write(
                self.style.ERROR(f'Error creating backup: {str(e)}')
            )

    def create_sql_dump(self, db_config):
        """Create SQL dump using pymysql (compatible with XAMPP)"""
        dump_content = []

        # Connect to database
        connection = pymysql.connect(
            host=db_config['HOST'],
            user=db_config['USER'],
            password=db_config['PASSWORD'],
            database=db_config['NAME'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                # Get all tables
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()

                # Add header
                dump_content.append("-- Eduyata Database Backup")
                dump_content.append(f"-- Created: {datetime.now()}")
                dump_content.append("--")
                dump_content.append(f"USE `{db_config['NAME']}`;")
                dump_content.append("")

                for table_row in tables:
                    table_name = list(table_row.values())[0]

                    # Get table structure
                    cursor.execute(f"SHOW CREATE TABLE `{table_name}`")
                    create_result = cursor.fetchone()
                    create_sql = create_result[f'Create Table']

                    dump_content.append(f"-- Table structure for {table_name}")
                    dump_content.append(create_sql + ";")
                    dump_content.append("")

                    # Get table data
                    cursor.execute(f"SELECT * FROM `{table_name}`")
                    rows = cursor.fetchall()

                    if rows:
                        dump_content.append(f"-- Data for {table_name}")
                        columns = list(rows[0].keys())

                        for row in rows:
                            values = []
                            for col in columns:
                                value = row[col]
                                if value is None:
                                    values.append('NULL')
                                elif isinstance(value, str):
                                    # Escape single quotes and wrap in quotes
                                    escaped_value = value.replace("'", "''")
                                    values.append(f"'{escaped_value}'")
                                else:
                                    values.append(str(value))

                            dump_content.append(f"INSERT INTO `{table_name}` ({', '.join([f'`{col}`' for col in columns])}) VALUES ({', '.join(values)});")

                        dump_content.append("")

        finally:
            connection.close()

        return "\n".join(dump_content)