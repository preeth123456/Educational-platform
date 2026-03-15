from django.core.management.base import BaseCommand
from django.apps import apps
from django.utils import timezone

Educator = apps.get_model('auth_app', 'Educator')


class Command(BaseCommand):
    help = 'Backfill teacher_id for Educator rows that are missing or invalid (e.g., T0) using format TCH<year><id:05d>'

    def handle(self, *args, **options):
        year = timezone.now().year
        qs = Educator.objects.all()
        updated = 0
        for e in qs:
            valid = False
            if e.teacher_id and isinstance(e.teacher_id, str):
                # valid format: TCHYYYYNNNNN
                if e.teacher_id.startswith('TCH') and len(e.teacher_id) >= 8:
                    valid = True
            if not valid:
                seq = f"{int(e.id):05d}"
                e.teacher_id = f"TCH{year}{seq}"
                e.save(update_fields=['teacher_id'])
                updated += 1
                self.stdout.write(f'Updated id={e.id} -> teacher_id={e.teacher_id}')

        self.stdout.write(self.style.SUCCESS(f'Backfilled {updated} educator records'))
