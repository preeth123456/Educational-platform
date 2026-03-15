from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import transaction
from django.db.models import Q, ForeignKey
from django.conf import settings
import csv
import os
import re

Educator = apps.get_model('auth_app', 'Educator')


def normalize_email(email):
    if not email:
        return ''
    return email.strip().lower()


def normalize_mobile(mobile):
    if not mobile:
        return ''
    # keep digits only
    digits = re.sub(r"\D", "", str(mobile))
    return digits


class Command(BaseCommand):
    help = 'Report and optionally deduplicate Educator rows by email/mobile. Defaults to dry-run.'

    def add_arguments(self, parser):
        parser.add_argument('--apply', action='store_true', help='Apply fixes (reassign FKs and delete duplicates)')
        parser.add_argument('--report-file', type=str, default='educator_duplicates_report.csv', help='CSV report filename')

    def handle(self, *args, **options):
        apply_changes = options['apply']
        report_file = options['report_file']

        self.stdout.write('Starting educator dedupe analysis...')

        # Build groups by normalized email and normalized mobile
        educators = Educator.objects.all().order_by('id')

        groups = {}

        for e in educators:
            key_email = normalize_email(getattr(e, 'email', ''))
            key_mobile = normalize_mobile(getattr(e, 'mobile', ''))

            # prefer grouping by email if present, else by mobile, else by name
            key = key_email or key_mobile or f"name:{(e.name or '').strip().lower()}"

            groups.setdefault(key, []).append(e)

        duplicates = {k: v for k, v in groups.items() if len(v) > 1}

        if not duplicates:
            self.stdout.write('No duplicate groups detected. Still will fix any missing teacher_id values.')

        # Prepare report rows
        report_rows = []

        for key, group in duplicates.items():
            self.stdout.write(f"Found {len(group)} items for key: {key}")
            for e in group:
                report_rows.append({
                    'group_key': key,
                    'id': e.id,
                    'teacher_id': e.teacher_id,
                    'name': e.name,
                    'email': e.email,
                    'mobile': e.mobile,
                    'created_at': getattr(e, 'created_at', None),
                })

        # Also add any educators missing teacher_id or with invalid T0
        for e in educators:
            if not e.teacher_id or str(e.teacher_id).strip() in ['', 'T0', '0']:
                report_rows.append({
                    'group_key': 'MISSING_TEACHER_ID',
                    'id': e.id,
                    'teacher_id': e.teacher_id,
                    'name': e.name,
                    'email': e.email,
                    'mobile': e.mobile,
                    'created_at': getattr(e, 'created_at', None),
                })

        # Write CSV report
        report_path = os.path.join(settings.BASE_DIR, report_file) if hasattr(settings, 'BASE_DIR') else report_file
        try:
            with open(report_path, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['group_key', 'id', 'teacher_id', 'name', 'email', 'mobile', 'created_at']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for r in report_rows:
                    writer.writerow(r)
            self.stdout.write(self.style.SUCCESS(f'Report written to {report_path} ({len(report_rows)} rows)'))
        except Exception as e:
            self.stderr.write(f'Failed to write report: {e}')

        if not apply_changes:
            self.stdout.write('Dry run complete. To apply fixes (reassign FKs, delete duplicates, fix teacher_id), re-run with --apply')
            return

        # Backup recommendation
        self.stdout.write('Applying changes. Ensure you have a backup (e.g. dumpdata) before proceeding.')

        # Gather all models with ForeignKey to Educator
        fk_relations = []
        for model in apps.get_models():
            for field in model._meta.get_fields():
                if getattr(field, 'related_model', None) is Educator and isinstance(field, ForeignKey):
                    fk_relations.append((model, field.name))

        self.stdout.write(f'Found {len(fk_relations)} foreign key relations to Educator to reassign.')

        # Process each duplicate group: pick a keeper and merge
        for key, group in duplicates.items():
            # choose keeper: prefer with valid teacher_id and id>0, else highest id
            keeper = None
            for e in group:
                if e.id and e.teacher_id and str(e.teacher_id).strip() not in ['', 'T0', '0']:
                    keeper = e
                    break
            if not keeper:
                keeper = max(group, key=lambda x: (x.id or 0))

            others = [x for x in group if x.id != keeper.id]

            self.stdout.write(f'Keeper for group {key} => id={keeper.id} teacher_id={keeper.teacher_id}')

            # Reassign foreign keys from others to keeper
            for other in others:
                self.stdout.write(f' - Merging id={other.id} into keeper id={keeper.id}')
                for model, field_name in fk_relations:
                    try:
                        qs = model.objects.filter(**{field_name: other.id})
                        if qs.exists():
                            updated = qs.update(**{field_name: keeper.id})
                            self.stdout.write(f'   reassigned {updated} {model._meta.label} rows')
                    except Exception as e:
                        self.stderr.write(f'   failed to reassign on {model._meta.label}.{field_name}: {e}')

                # After reassigning, delete the duplicate record
                try:
                    other.delete()
                    self.stdout.write(f'   deleted duplicate id={other.id}')
                except Exception as e:
                    self.stderr.write(f'   failed to delete duplicate id={other.id}: {e}')

            # Ensure keeper has a proper teacher_id
            if not keeper.teacher_id or str(keeper.teacher_id).strip() in ['', 'T0', '0']:
                keeper.teacher_id = f"T{keeper.id}"
                keeper.save(update_fields=['teacher_id'])
                self.stdout.write(f'   updated keeper.teacher_id => {keeper.teacher_id}')

        # Next, fix any remaining educators missing teacher_id
        for e in Educator.objects.filter(Q(teacher_id__isnull=True) | Q(teacher_id='') | Q(teacher_id='T0') | Q(teacher_id='0')):
            e.teacher_id = f"T{e.id}"
            e.save(update_fields=['teacher_id'])
            self.stdout.write(f'Fixed teacher_id for id={e.id} => {e.teacher_id}')

        self.stdout.write(self.style.SUCCESS('Deduplication and teacher_id fix complete.'))
