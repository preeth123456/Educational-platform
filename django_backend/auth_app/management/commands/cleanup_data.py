from django.core.management.base import BaseCommand
from django.utils import timezone
from auth_app.data_retention import DataRetentionManager
from auth_app.tasks import cleanup_old_data, process_pending_deletions, cleanup_expired_exports

class Command(BaseCommand):
    help = 'Clean up old data based on retention policies'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be cleaned without actually deleting',
        )
        parser.add_argument(
            '--process-deletions',
            action='store_true',
            help='Process pending deletion requests',
        )
        parser.add_argument(
            '--cleanup-exports',
            action='store_true',
            help='Clean up expired export files',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS(f'Starting data cleanup at {timezone.now()}')
        )

        if options['dry_run']:
            self.stdout.write('DRY RUN MODE - No data will be deleted')
            return

        # Clean up old data based on retention policies
        try:
            results = DataRetentionManager.cleanup_old_data()
            for result in results:
                self.stdout.write(self.style.SUCCESS(result))
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error during data cleanup: {str(e)}')
            )

        # Process pending deletions if requested
        if options['process_deletions']:
            try:
                pending_deletions = DataRetentionManager.get_pending_deletions()
                self.stdout.write(f'Found {len(pending_deletions)} pending deletion requests')
                
                for deletion_request in pending_deletions:
                    result = DataRetentionManager.process_account_deletion(deletion_request.id)
                    if result['success']:
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'Processed deletion for student {deletion_request.student_id}'
                            )
                        )
                    else:
                        self.stdout.write(
                            self.style.ERROR(
                                f'Failed to process deletion for student {deletion_request.student_id}: {result["message"]}'
                            )
                        )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error processing deletions: {str(e)}')
                )

        # Clean up expired exports if requested
        if options['cleanup_exports']:
            try:
                from auth_app.data_retention_models import DataExport
                import os
                
                expired_exports = DataExport.objects.filter(
                    expires_at__lt=timezone.now(),
                    status='completed'
                )
                
                cleaned_count = 0
                for export in expired_exports:
                    if export.file_path and os.path.exists(export.file_path):
                        try:
                            os.remove(export.file_path)
                            cleaned_count += 1
                        except OSError:
                            pass
                    export.delete()
                
                self.stdout.write(
                    self.style.SUCCESS(f'Cleaned up {cleaned_count} expired export files')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error cleaning up exports: {str(e)}')
                )

        # Show retention statistics
        try:
            stats = DataRetentionManager.get_retention_stats()
            self.stdout.write('\n--- Retention Statistics ---')
            self.stdout.write(f'Total students: {stats["total_students"]}')
            self.stdout.write(f'Pending deletions: {stats["pending_deletions"]}')
            self.stdout.write(f'Anonymized records: {stats["anonymized_records"]}')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error getting statistics: {str(e)}')
            )

        self.stdout.write(
            self.style.SUCCESS(f'Data cleanup completed at {timezone.now()}')
        )