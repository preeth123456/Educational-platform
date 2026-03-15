from django.core.management.base import BaseCommand
from django.db import connection, transaction
from django.apps import apps


class Command(BaseCommand):
    help = 'Seed chapters and lessons only for subjects/classes present in Educator.subject_classes'

    def handle(self, *args, **options):
        Educator = apps.get_model('auth_app', 'Educator')

        # gather subject-class pairs from educators
        pairs = set()
        for e in Educator.objects.all():
            sc = e.subject_classes or {}
            if isinstance(sc, dict):
                for subj, classes in sc.items():
                    # classes may be list of numbers as strings
                    try:
                        for c in classes:
                            pairs.add((subj.strip(), str(c).strip()))
                    except Exception:
                        continue

        if not pairs:
            self.stdout.write(self.style.WARNING('No subject-class pairs found in educators'))
            return

        inserted_chapters = 0
        inserted_lessons = 0
        inserted_subjects = 0
        inserted_classes = 0

        with transaction.atomic():
            with connection.cursor() as cur:
                # ensure base tables exist (similar to seed_curriculum)
                cur.execute('''
                CREATE TABLE IF NOT EXISTS subjects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) UNIQUE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ''')
                cur.execute('''
                CREATE TABLE IF NOT EXISTS class_levels (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50) UNIQUE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ''')
                cur.execute('''
                CREATE TABLE IF NOT EXISTS chapters (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    subject_id INT,
                    class_level_id INT,
                    chapter_no INT,
                    title VARCHAR(255),
                    UNIQUE KEY subj_class_chapter (subject_id, class_level_id, chapter_no)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ''')
                cur.execute('''
                CREATE TABLE IF NOT EXISTS lessons (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    chapter_id INT,
                    lesson_no INT,
                    title VARCHAR(255),
                    UNIQUE KEY chapter_lesson (chapter_id, lesson_no)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ''')

                # Fix legacy schema where chapters used (chapter_id, chapter_name)
                try:
                    cur.execute("SHOW COLUMNS FROM chapters")
                    cols = [r[0] for r in cur.fetchall()]
                    if 'id' not in cols and 'chapter_id' in cols:
                        # rename chapter_id -> id and make it AUTO_INCREMENT PRIMARY KEY
                        cur.execute('ALTER TABLE chapters CHANGE COLUMN chapter_id id INT NOT NULL AUTO_INCREMENT PRIMARY KEY')
                        # rename chapter_name to title if present
                        if 'chapter_name' in cols:
                            cur.execute('ALTER TABLE chapters CHANGE COLUMN chapter_name title VARCHAR(255) DEFAULT NULL')
                        # add class_level_id and chapter_no if missing
                        if 'class_level_id' not in cols:
                            cur.execute('ALTER TABLE chapters ADD COLUMN class_level_id INT DEFAULT NULL')
                        if 'chapter_no' not in cols:
                            cur.execute('ALTER TABLE chapters ADD COLUMN chapter_no INT DEFAULT NULL')
                except Exception:
                    pass

                try:
                    cur.execute("SHOW COLUMNS FROM lessons")
                    lcols = [r[0] for r in cur.fetchall()]
                    if 'id' not in lcols and 'lesson_id' in lcols:
                        cur.execute('ALTER TABLE lessons CHANGE COLUMN lesson_id id INT NOT NULL AUTO_INCREMENT PRIMARY KEY')
                        if 'lesson_name' in lcols:
                            cur.execute('ALTER TABLE lessons CHANGE COLUMN lesson_name title VARCHAR(255) DEFAULT NULL')
                        if 'lesson_no' not in lcols:
                            cur.execute('ALTER TABLE lessons ADD COLUMN lesson_no INT DEFAULT NULL')
                except Exception:
                    pass

                # upsert subjects and class_levels for pairs
                for subj, class_name in sorted(pairs):
                    # subject
                    cur.execute('SELECT id FROM subjects WHERE name=%s', [subj])
                    row = cur.fetchone()
                    if row is None:
                        cur.execute('INSERT INTO subjects (name) VALUES (%s)', [subj])
                        subj_id = cur.lastrowid
                        inserted_subjects += 1
                    else:
                        subj_id = row[0]

                    # class level
                    cur.execute('SELECT id FROM class_levels WHERE name=%s', [class_name])
                    row = cur.fetchone()
                    if row is None:
                        cur.execute('INSERT INTO class_levels (name) VALUES (%s)', [class_name])
                        class_id = cur.lastrowid
                        inserted_classes += 1
                    else:
                        class_id = row[0]

                    # chapters (5) and lessons (4) per chapter
                    for ch_no in range(1, 6):
                        cur.execute('SELECT id FROM chapters WHERE subject_id=%s AND class_level_id=%s AND chapter_no=%s', [subj_id, class_id, ch_no])
                        row = cur.fetchone()
                        if row is None:
                            title = f'Chapter {ch_no}: {subj} - Class {class_name}'
                            cur.execute('INSERT INTO chapters (subject_id, class_level_id, chapter_no, title) VALUES (%s,%s,%s,%s)', [subj_id, class_id, ch_no, title])
                            chapter_id = cur.lastrowid
                            inserted_chapters += 1
                        else:
                            chapter_id = row[0]

                        for les_no in range(1, 5):
                            cur.execute('SELECT id FROM lessons WHERE chapter_id=%s AND lesson_no=%s', [chapter_id, les_no])
                            if cur.fetchone() is None:
                                ltitle = f'Lesson {les_no}: {subj} Ch{ch_no} - Class {class_name}'
                                cur.execute('INSERT INTO lessons (chapter_id, lesson_no, title) VALUES (%s,%s,%s)', [chapter_id, les_no, ltitle])
                                inserted_lessons += 1

        self.stdout.write(self.style.SUCCESS(f'Processed pairs={len(pairs)}, subjects_added={inserted_subjects}, classes_added={inserted_classes}, chapters_added={inserted_chapters}, lessons_added={inserted_lessons}'))