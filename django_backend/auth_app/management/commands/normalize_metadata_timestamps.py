from django.core.management.base import BaseCommand
import os
import json
from django.conf import settings
from django.utils import timezone


class Command(BaseCommand):
    help = 'Normalize upload_date fields in teacher metadata files to localized ISO-like timestamps'

    def handle(self, *args, **options):
        base = os.path.join(settings.MEDIA_ROOT, 'uploads', 'teachers')
        if not os.path.exists(base):
            self.stdout.write(self.style.WARNING(f'No teachers upload dir at {base}'))
            return

        updated = 0
        backed_up = 0
        for teacher_dir in os.listdir(base):
            teacher_path = os.path.join(base, teacher_dir)
            if not os.path.isdir(teacher_path):
                continue
            for fname in os.listdir(teacher_path):
                if not fname.endswith('_metadata.json'):
                    continue
                fpath = os.path.join(teacher_path, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8') as fh:
                        data = json.load(fh)

                    old_ts = data.get('upload_date')
                    # parse existing naive/UTC string if possible - otherwise set to now
                    parsed = None
                    if old_ts:
                        try:
                            # try stdlib parsing first
                            from datetime import datetime
                            parsed = datetime.fromisoformat(old_ts)
                        except Exception:
                            try:
                                from dateutil import parser
                                parsed = parser.isoparse(old_ts)
                            except Exception:
                                parsed = None
                    if parsed is None:
                        parsed = timezone.now()

                    try:
                        from zoneinfo import ZoneInfo
                        local = timezone.localtime(parsed, ZoneInfo('Asia/Kolkata'))
                        local_ts = local.isoformat().replace('T', ' ')
                    except Exception:
                        local_ts = timezone.localtime(parsed).isoformat().replace('T', ' ')
                    if data.get('upload_date') != local_ts:
                        # backup
                        bak = fpath + '.bak'
                        if not os.path.exists(bak):
                            with open(bak, 'w', encoding='utf-8') as bf:
                                json.dump(data, bf, indent=2)
                            backed_up += 1

                        data['upload_date'] = local_ts
                        with open(fpath, 'w', encoding='utf-8') as fh:
                            json.dump(data, fh, indent=2)
                        updated += 1
                        self.stdout.write(f'Updated {fpath}: {old_ts} -> {local_ts}')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed {fpath}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Normalized {updated} metadata files, backed up {backed_up} originals'))
