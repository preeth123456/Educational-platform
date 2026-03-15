-- EduYata Multi-Board Educational Database Schema
-- Compatible with existing educators table

-- 1. Create New Tables
-- ============================

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

-- 2. Insert Board Data
-- ============================
INSERT INTO boards (board_name, board_code) VALUES
('Central Board of Secondary Education', 'CBSE'),
('Indian Certificate of Secondary Education', 'ICSE'),
('State Board', 'STATE'),
('National Institute of Open Schooling', 'NIOS'),
('International Baccalaureate', 'IB'),
('International General Certificate of Secondary Education', 'IGCSE');

-- 3. Insert Classes Data (1-12 for all boards)
-- ============================
INSERT INTO classes (board_id, class_number, class_name, level) VALUES
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

-- 4. Insert Realistic Subjects Data
-- ============================

-- CBSE Primary Classes (1-5)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(1, 'English', 'ENG1', TRUE), (1, 'Mathematics', 'MATH1', TRUE), (1, 'Environmental Studies', 'EVS1', TRUE),
(2, 'English', 'ENG2', TRUE), (2, 'Mathematics', 'MATH2', TRUE), (2, 'Environmental Studies', 'EVS2', TRUE),
(3, 'English', 'ENG3', TRUE), (3, 'Mathematics', 'MATH3', TRUE), (3, 'Environmental Studies', 'EVS3', TRUE),
(4, 'English', 'ENG4', TRUE), (4, 'Mathematics', 'MATH4', TRUE), (4, 'Environmental Studies', 'EVS4', TRUE),
(5, 'English', 'ENG5', TRUE), (5, 'Mathematics', 'MATH5', TRUE), (5, 'Environmental Studies', 'EVS5', TRUE);

-- CBSE Middle Classes (6-8)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(6, 'English', 'ENG6', TRUE), (6, 'Mathematics', 'MATH6', TRUE), (6, 'Science', 'SCI6', TRUE), (6, 'Social Science', 'SST6', TRUE), (6, 'Hindi', 'HIN6', TRUE),
(7, 'English', 'ENG7', TRUE), (7, 'Mathematics', 'MATH7', TRUE), (7, 'Science', 'SCI7', TRUE), (7, 'Social Science', 'SST7', TRUE), (7, 'Hindi', 'HIN7', TRUE),
(8, 'English', 'ENG8', TRUE), (8, 'Mathematics', 'MATH8', TRUE), (8, 'Science', 'SCI8', TRUE), (8, 'Social Science', 'SST8', TRUE), (8, 'Hindi', 'HIN8', TRUE);

-- CBSE Secondary Classes (9-10)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(9, 'English', 'ENG9', TRUE), (9, 'Mathematics', 'MATH9', TRUE), (9, 'Science', 'SCI9', TRUE), (9, 'Social Science', 'SST9', TRUE), (9, 'Hindi', 'HIN9', TRUE),
(10, 'English', 'ENG10', TRUE), (10, 'Mathematics', 'MATH10', TRUE), (10, 'Science', 'SCI10', TRUE), (10, 'Social Science', 'SST10', TRUE), (10, 'Hindi', 'HIN10', TRUE);

-- CBSE Senior Secondary (11-12)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(11, 'English Core', 'ENG11', TRUE), (11, 'Mathematics', 'MATH11', FALSE), (11, 'Physics', 'PHY11', FALSE), (11, 'Chemistry', 'CHEM11', FALSE), (11, 'Biology', 'BIO11', FALSE), (11, 'Computer Science', 'CS11', FALSE), (11, 'Economics', 'ECO11', FALSE), (11, 'Business Studies', 'BS11', FALSE),
(12, 'English Core', 'ENG12', TRUE), (12, 'Mathematics', 'MATH12', FALSE), (12, 'Physics', 'PHY12', FALSE), (12, 'Chemistry', 'CHEM12', FALSE), (12, 'Biology', 'BIO12', FALSE), (12, 'Computer Science', 'CS12', FALSE), (12, 'Economics', 'ECO12', FALSE), (12, 'Business Studies', 'BS12', FALSE);

-- ICSE Class 10 Sample
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(22, 'English Language', 'ENGL10', TRUE), (22, 'English Literature', 'ENGLIT10', TRUE), (22, 'Mathematics', 'MATH10I', TRUE), (22, 'Physics', 'PHY10I', TRUE), (22, 'Chemistry', 'CHEM10I', TRUE), (22, 'Biology', 'BIO10I', TRUE), (22, 'History', 'HIST10I', TRUE), (22, 'Geography', 'GEO10I', TRUE);

-- IB Grade 11 Sample
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(59, 'English A: Language and Literature', 'ENGIB11', TRUE), (59, 'Mathematics: Analysis and Approaches', 'MATHIB11', FALSE), (59, 'Physics', 'PHYIB11', FALSE), (59, 'Chemistry', 'CHEMIB11', FALSE), (59, 'Biology', 'BIOIB11', FALSE), (59, 'History', 'HISTIB11', FALSE), (59, 'Economics', 'ECONIB11', FALSE);

-- 5. Sample Chapters (CBSE Class 10 Mathematics)
-- ============================
INSERT INTO chapters (subject_id, chapter_number, chapter_name, description) VALUES
(26, 1, 'Real Numbers', 'Introduction to real numbers and their properties'),
(26, 2, 'Polynomials', 'Understanding polynomials and their operations'),
(26, 3, 'Pair of Linear Equations in Two Variables', 'Solving systems of linear equations'),
(26, 4, 'Quadratic Equations', 'Methods to solve quadratic equations'),
(26, 5, 'Arithmetic Progressions', 'Sequences and series in arithmetic progression');

-- 6. Sample Lessons
-- ============================
INSERT INTO lessons (chapter_id, lesson_number, lesson_name, description, duration_minutes) VALUES
-- Real Numbers Chapter
(1, 1, 'Introduction to Real Numbers', 'Basic concepts of real numbers', 45),
(1, 2, 'Euclids Division Lemma', 'Understanding Euclids division algorithm', 50),
(1, 3, 'Fundamental Theorem of Arithmetic', 'Prime factorization and its applications', 45),
-- Polynomials Chapter
(2, 1, 'Introduction to Polynomials', 'Definition and types of polynomials', 40),
(2, 2, 'Zeros of Polynomials', 'Finding zeros and their relationship with coefficients', 50),
(2, 3, 'Division Algorithm for Polynomials', 'Polynomial division methods', 45),
-- Linear Equations Chapter
(3, 1, 'Pair of Linear Equations', 'Introduction to systems of equations', 45),
(3, 2, 'Graphical Method', 'Solving equations using graphs', 50),
(3, 3, 'Algebraic Methods', 'Substitution and elimination methods', 55);

-- 7. Sample Topics
-- ============================
INSERT INTO topics (lesson_id, topic_name, video_url, description, content_type) VALUES
-- Real Numbers Topics
(1, 'What are Real Numbers?', 'https://youtube.com/watch?v=sample1', 'Introduction to the concept of real numbers and number line', 'video'),
(1, 'Properties of Real Numbers', 'https://youtube.com/watch?v=sample2', 'Commutative, associative and distributive properties', 'video'),
(2, 'Euclids Division Algorithm', 'https://youtube.com/watch?v=sample3', 'Step by step explanation of the algorithm', 'video'),
(2, 'Applications of Division Lemma', 'https://youtube.com/watch?v=sample4', 'Practical problems using division lemma', 'video'),
(3, 'Prime Factorization', 'https://youtube.com/watch?v=sample5', 'Methods to find prime factors', 'video'),
(3, 'HCF and LCM using Prime Factorization', 'https://youtube.com/watch?v=sample6', 'Finding HCF and LCM using fundamental theorem', 'video'),
-- Polynomials Topics
(4, 'Definition of Polynomials', 'https://youtube.com/watch?v=sample7', 'Understanding polynomial expressions', 'video'),
(4, 'Types of Polynomials', 'https://youtube.com/watch?v=sample8', 'Linear, quadratic, cubic polynomials', 'video'),
(5, 'Finding Zeros Graphically', 'https://youtube.com/watch?v=sample9', 'Using graphs to find polynomial zeros', 'video'),
(5, 'Relationship between Zeros and Coefficients', 'https://youtube.com/watch?v=sample10', 'Sum and product of zeros', 'video');

-- 8. Create Performance Indexes
-- ============================
CREATE INDEX idx_classes_board ON classes(board_id);
CREATE INDEX idx_subjects_class ON subjects(class_id);
CREATE INDEX idx_chapters_subject ON chapters(subject_id);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_topics_lesson ON topics(lesson_id);
CREATE INDEX idx_topics_teacher ON topics(teacher_id);
CREATE INDEX idx_teacher_mapping ON teacher_class_subjects(teacher_id, class_id, subject_id);

-- 9. Sample Teacher Assignments (assuming educator IDs 1-5 exist)
-- ============================
INSERT INTO teacher_class_subjects (teacher_id, class_id, subject_id, is_primary_teacher) VALUES
(1, 10, 26, TRUE),  -- Teacher 1 teaches CBSE Class 10 Mathematics
(1, 9, 21, FALSE),  -- Teacher 1 also teaches CBSE Class 9 Mathematics
(2, 10, 27, TRUE),  -- Teacher 2 teaches CBSE Class 10 Science
(3, 22, 62, TRUE),  -- Teacher 3 teaches ICSE Class 10 English Literature
(4, 59, 63, TRUE);  -- Teacher 4 teaches IB Grade 11 Physics