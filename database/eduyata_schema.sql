-- EduYata Multi-Board Educational Database Schema
-- Compatible with PHP/MySQL integration

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS teacher_class_subjects;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS boards;

-- Boards Table
CREATE TABLE boards (
    board_id INT AUTO_INCREMENT PRIMARY KEY,
    board_name VARCHAR(100) NOT NULL UNIQUE,
    board_code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes Table
CREATE TABLE classes (
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
CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20),
    is_core BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Chapters Table
CREATE TABLE chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    chapter_number INT NOT NULL,
    chapter_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- Lessons Table
CREATE TABLE lessons (
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
CREATE TABLE topics (
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
CREATE TABLE teacher_class_subjects (
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

-- Insert Boards Data
INSERT INTO boards (board_name, board_code, description) VALUES
('Central Board of Secondary Education', 'CBSE', 'National board under Government of India'),
('Indian Certificate of Secondary Education', 'ICSE', 'Private board conducted by CISCE'),
('State Board', 'STATE', 'State government education boards'),
('National Institute of Open Schooling', 'NIOS', 'Open schooling system in India'),
('International Baccalaureate', 'IB', 'International education program'),
('International General Certificate of Secondary Education', 'IGCSE', 'International qualification for 14-16 year olds');

-- Insert Classes Data for all boards
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

-- Insert Subjects Data (Sample for CBSE Classes 1-12)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
-- Class 1 CBSE
(1, 'English', 'ENG1', TRUE), (1, 'Mathematics', 'MATH1', TRUE), (1, 'Environmental Studies', 'EVS1', TRUE),
-- Class 2 CBSE
(2, 'English', 'ENG2', TRUE), (2, 'Mathematics', 'MATH2', TRUE), (2, 'Environmental Studies', 'EVS2', TRUE),
-- Class 3 CBSE
(3, 'English', 'ENG3', TRUE), (3, 'Mathematics', 'MATH3', TRUE), (3, 'Environmental Studies', 'EVS3', TRUE),
-- Class 4 CBSE
(4, 'English', 'ENG4', TRUE), (4, 'Mathematics', 'MATH4', TRUE), (4, 'Environmental Studies', 'EVS4', TRUE),
-- Class 5 CBSE
(5, 'English', 'ENG5', TRUE), (5, 'Mathematics', 'MATH5', TRUE), (5, 'Environmental Studies', 'EVS5', TRUE),
-- Class 6 CBSE
(6, 'English', 'ENG6', TRUE), (6, 'Mathematics', 'MATH6', TRUE), (6, 'Science', 'SCI6', TRUE), (6, 'Social Science', 'SST6', TRUE), (6, 'Hindi', 'HIN6', TRUE),
-- Class 7 CBSE
(7, 'English', 'ENG7', TRUE), (7, 'Mathematics', 'MATH7', TRUE), (7, 'Science', 'SCI7', TRUE), (7, 'Social Science', 'SST7', TRUE), (7, 'Hindi', 'HIN7', TRUE),
-- Class 8 CBSE
(8, 'English', 'ENG8', TRUE), (8, 'Mathematics', 'MATH8', TRUE), (8, 'Science', 'SCI8', TRUE), (8, 'Social Science', 'SST8', TRUE), (8, 'Hindi', 'HIN8', TRUE),
-- Class 9 CBSE
(9, 'English', 'ENG9', TRUE), (9, 'Mathematics', 'MATH9', TRUE), (9, 'Science', 'SCI9', TRUE), (9, 'Social Science', 'SST9', TRUE), (9, 'Hindi', 'HIN9', TRUE),
-- Class 10 CBSE
(10, 'English', 'ENG10', TRUE), (10, 'Mathematics', 'MATH10', TRUE), (10, 'Science', 'SCI10', TRUE), (10, 'Social Science', 'SST10', TRUE), (10, 'Hindi', 'HIN10', TRUE),
-- Class 11 CBSE
(11, 'English Core', 'ENG11', TRUE), (11, 'Mathematics', 'MATH11', FALSE), (11, 'Physics', 'PHY11', FALSE), (11, 'Chemistry', 'CHEM11', FALSE), (11, 'Biology', 'BIO11', FALSE), (11, 'Computer Science', 'CS11', FALSE),
-- Class 12 CBSE
(12, 'English Core', 'ENG12', TRUE), (12, 'Mathematics', 'MATH12', FALSE), (12, 'Physics', 'PHY12', FALSE), (12, 'Chemistry', 'CHEM12', FALSE), (12, 'Biology', 'BIO12', FALSE), (12, 'Computer Science', 'CS12', FALSE);

-- Insert Sample Chapters (for Class 10 Mathematics CBSE)
INSERT INTO chapters (subject_id, chapter_number, chapter_name, description) VALUES
(26, 1, 'Real Numbers', 'Introduction to real numbers and their properties'),
(26, 2, 'Polynomials', 'Understanding polynomials and their operations'),
(26, 3, 'Pair of Linear Equations in Two Variables', 'Solving systems of linear equations');

-- Insert Sample Lessons
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

-- Insert Sample Topics
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

-- Create indexes for better performance
CREATE INDEX idx_classes_board ON classes(board_id);
CREATE INDEX idx_subjects_class ON subjects(class_id);
CREATE INDEX idx_chapters_subject ON chapters(subject_id);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_topics_lesson ON topics(lesson_id);
CREATE INDEX idx_topics_teacher ON topics(teacher_id);
CREATE INDEX idx_teacher_mapping ON teacher_class_subjects(teacher_id, class_id, subject_id);