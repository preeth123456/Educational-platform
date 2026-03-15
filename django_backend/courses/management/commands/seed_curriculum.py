from django.core.management.base import BaseCommand
from django.db import connection, transaction


class Command(BaseCommand):
    help = 'Create curriculum tables (subjects, class_levels, chapters, lessons) and seed sample data for subjects/classes'

    SUBJECTS = [
        'Mathematics',
        'English',
        'Science',
        'Social Science',
        'Hindi',
        'Computer Science',
        'Sanskrit'
    ]

    def handle(self, *args, **options):
        with connection.cursor() as cur:
            # Create tables if not exist
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

        # Seed subjects and class levels
        inserted_subjects = 0
        inserted_classes = 0
        inserted_chapters = 0
        inserted_lessons = 0

        with transaction.atomic():
            with connection.cursor() as cur:
                # insert subjects
                for s in self.SUBJECTS:
                    cur.execute('SELECT id FROM subjects WHERE name=%s', [s])
                    if cur.fetchone() is None:
                        cur.execute('INSERT INTO subjects (name) VALUES (%s)', [s])
                        inserted_subjects += 1

                # insert class levels 1..12
                for i in range(1, 13):
                    name = str(i)
                    cur.execute('SELECT id FROM class_levels WHERE name=%s', [name])
                    if cur.fetchone() is None:
                        cur.execute('INSERT INTO class_levels (name) VALUES (%s)', [name])
                        inserted_classes += 1

                # fetch ids
                cur.execute('SELECT id, name FROM subjects')
                subjects = cur.fetchall()
                cur.execute('SELECT id, name FROM class_levels')
                class_levels = cur.fetchall()

                # create 5 chapters per subject-class and 4 lessons per chapter
                for subj_id, subj_name in subjects:
                    for class_id, class_name in class_levels:
                        for ch_no in range(1, 6):
                            title = f'Chapter {ch_no}: {subj_name} - Class {class_name}'
                            # check exists
                            cur.execute('SELECT id FROM chapters WHERE subject_id=%s AND class_level_id=%s AND chapter_no=%s', [subj_id, class_id, ch_no])
                            row = cur.fetchone()
                            if row is None:
                                cur.execute('INSERT INTO chapters (subject_id, class_level_id, chapter_no, title) VALUES (%s,%s,%s,%s)', [subj_id, class_id, ch_no, title])
                                chapter_id = cur.lastrowid
                                inserted_chapters += 1
                            else:
                                chapter_id = row[0]

                            # lessons
                            for les_no in range(1, 5):
                                ltitle = f'Lesson {les_no}: {subj_name} Ch{ch_no} - Class {class_name}'
                                cur.execute('SELECT id FROM lessons WHERE chapter_id=%s AND lesson_no=%s', [chapter_id, les_no])
                                if cur.fetchone() is None:
                                    cur.execute('INSERT INTO lessons (chapter_id, lesson_no, title) VALUES (%s,%s,%s)', [chapter_id, les_no, ltitle])
                                    inserted_lessons += 1

        self.stdout.write(self.style.SUCCESS(f'Inserted subjects={inserted_subjects}, classes={inserted_classes}, chapters={inserted_chapters}, lessons={inserted_lessons}'))