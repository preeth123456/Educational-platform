-- Add new tables to existing database (preserves existing data)

-- Boards Table
CREATE TABLE IF NOT EXISTS boards (
    board_id INT AUTO_INCREMENT PRIMARY KEY,
    board_name VARCHAR(100) NOT NULL UNIQUE,
    board_code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT NOT NULL,
    class_number INT NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    level ENUM('Primary', 'Middle', 'Secondary', 'Senior Secondary') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(board_id) ON DELETE CASCADE,
    UNIQUE KEY unique_board_class (board_id, class_number)
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20),
    is_core BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    chapter_number INT NOT NULL,
    chapter_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    lesson_number INT NOT NULL,
    lesson_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 45,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE
);

-- Topics Table
CREATE TABLE IF NOT EXISTS topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    teacher_id INT,
    topic_name VARCHAR(255) NOT NULL,
    video_url VARCHAR(500),
    description TEXT,
    content_type ENUM('video', 'document', 'interactive', 'quiz') DEFAULT 'video',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES educator(teacher_id) ON DELETE SET NULL
);

-- Teacher to Class-Subject Mapping Table
CREATE TABLE IF NOT EXISTS teacher_class_subjects (
    mapping_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    is_primary_teacher BOOLEAN DEFAULT FALSE,
    assigned_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES educator(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_class_subject (teacher_id, class_id, subject_id)
);

-- Insert Board Data
INSERT IGNORE INTO boards (board_name, board_code) VALUES
('Central Board of Secondary Education', 'CBSE'),
('Indian Certificate of Secondary Education', 'ICSE'),
('State Board', 'STATE'),
('National Institute of Open Schooling', 'NIOS'),
('International Baccalaureate', 'IB'),
('International General Certificate of Secondary Education', 'IGCSE');

-- Insert Classes Data
INSERT IGNORE INTO classes (board_id, class_number, class_name, level) VALUES
-- CBSE Classes
(1, 1, 'Class 1', 'Primary'), (1, 2, 'Class 2', 'Primary'), (1, 3, 'Class 3', 'Primary'),
(1, 4, 'Class 4', 'Primary'), (1, 5, 'Class 5', 'Primary'), (1, 6, 'Class 6', 'Middle'),
(1, 7, 'Class 7', 'Middle'), (1, 8, 'Class 8', 'Middle'), (1, 9, 'Class 9', 'Secondary'),
(1, 10, 'Class 10', 'Secondary'), (1, 11, 'Class 11', 'Senior Secondary'), (1, 12, 'Class 12', 'Senior Secondary'),
-- ICSE Classes
(2, 1, 'Class 1', 'Primary'), (2, 2, 'Class 2', 'Primary'), (2, 3, 'Class 3', 'Primary'),
(2, 4, 'Class 4', 'Primary'), (2, 5, 'Class 5', 'Primary'), (2, 6, 'Class 6', 'Middle'),
(2, 7, 'Class 7', 'Middle'), (2, 8, 'Class 8', 'Middle'), (2, 9, 'Class 9', 'Secondary'),
(2, 10, 'Class 10', 'Secondary'), (2, 11, 'Class 11', 'Senior Secondary'), (2, 12, 'Class 12', 'Senior Secondary'),
-- State Board Classes
(3, 1, 'Class 1', 'Primary'), (3, 2, 'Class 2', 'Primary'), (3, 3, 'Class 3', 'Primary'),
(3, 4, 'Class 4', 'Primary'), (3, 5, 'Class 5', 'Primary'), (3, 6, 'Class 6', 'Middle'),
(3, 7, 'Class 7', 'Middle'), (3, 8, 'Class 8', 'Middle'), (3, 9, 'Class 9', 'Secondary'),
(3, 10, 'Class 10', 'Secondary'), (3, 11, 'Class 11', 'Senior Secondary'), (3, 12, 'Class 12', 'Senior Secondary'),
-- NIOS Classes
(4, 1, 'Class 1', 'Primary'), (4, 2, 'Class 2', 'Primary'), (4, 3, 'Class 3', 'Primary'),
(4, 4, 'Class 4', 'Primary'), (4, 5, 'Class 5', 'Primary'), (4, 6, 'Class 6', 'Middle'),
(4, 7, 'Class 7', 'Middle'), (4, 8, 'Class 8', 'Middle'), (4, 9, 'Class 9', 'Secondary'),
(4, 10, 'Class 10', 'Secondary'), (4, 11, 'Class 11', 'Senior Secondary'), (4, 12, 'Class 12', 'Senior Secondary'),
-- IB Classes
(5, 1, 'Grade 1', 'Primary'), (5, 2, 'Grade 2', 'Primary'), (5, 3, 'Grade 3', 'Primary'),
(5, 4, 'Grade 4', 'Primary'), (5, 5, 'Grade 5', 'Primary'), (5, 6, 'Grade 6', 'Middle'),
(5, 7, 'Grade 7', 'Middle'), (5, 8, 'Grade 8', 'Middle'), (5, 9, 'Grade 9', 'Secondary'),
(5, 10, 'Grade 10', 'Secondary'), (5, 11, 'Grade 11', 'Senior Secondary'), (5, 12, 'Grade 12', 'Senior Secondary'),
-- IGCSE Classes
(6, 1, 'Year 1', 'Primary'), (6, 2, 'Year 2', 'Primary'), (6, 3, 'Year 3', 'Primary'),
(6, 4, 'Year 4', 'Primary'), (6, 5, 'Year 5', 'Primary'), (6, 6, 'Year 6', 'Middle'),
(6, 7, 'Year 7', 'Middle'), (6, 8, 'Year 8', 'Middle'), (6, 9, 'Year 9', 'Secondary'),
(6, 10, 'Year 10', 'Secondary'), (6, 11, 'Year 11', 'Senior Secondary'), (6, 12, 'Year 12', 'Senior Secondary');

-- Insert Sample Subjects
INSERT IGNORE INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(1, 'English', 'ENG1', TRUE), (1, 'Mathematics', 'MATH1', TRUE), (1, 'Environmental Studies', 'EVS1', TRUE),
(10, 'English', 'ENG10', TRUE), (10, 'Mathematics', 'MATH10', TRUE), (10, 'Science', 'SCI10', TRUE), (10, 'Social Science', 'SST10', TRUE), (10, 'Hindi', 'HIN10', TRUE);

-- Sample Chapters
INSERT IGNORE INTO chapters (subject_id, chapter_number, chapter_name, description) VALUES
(26, 1, 'Real Numbers', 'Introduction to real numbers and their properties'),
(26, 2, 'Polynomials', 'Understanding polynomials and their operations');

-- Sample Lessons
INSERT IGNORE INTO lessons (chapter_id, lesson_number, lesson_name, description, duration_minutes) VALUES
(1, 1, 'Introduction to Real Numbers', 'Basic concepts of real numbers', 45),
(1, 2, 'Euclids Division Lemma', 'Understanding Euclids division algorithm', 50);

-- Sample Topics
INSERT IGNORE INTO topics (lesson_id, topic_name, video_url, description, content_type) VALUES
(1, 'What are Real Numbers?', 'https://youtube.com/watch?v=sample1', 'Introduction to the concept of real numbers', 'video'),
(2, 'Euclids Division Algorithm', 'https://youtube.com/watch?v=sample2', 'Step by step explanation', 'video');

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_classes_board ON classes(board_id);
CREATE INDEX IF NOT EXISTS idx_subjects_class ON subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_topics_lesson ON topics(lesson_id);