-- Course Management System Setup
-- This script adds course-related tables and sample data

USE eduyata_db;

-- Create teachers table (if not exists)
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    subject VARCHAR(255),
    qualification VARCHAR(255),
    experience_years INT,
    profile_picture TEXT,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create courses table (if not exists)
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INT,
    category VARCHAR(100),
    level ENUM('beginner', 'intermediate', 'advanced'),
    duration_hours INT,
    price DECIMAL(10,2) DEFAULT 0.00,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- Create course modules table (if not exists)
CREATE TABLE IF NOT EXISTS course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    duration_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create course lessons table (if not exists)
CREATE TABLE IF NOT EXISTS course_lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url TEXT,
    duration_minutes INT,
    order_index INT NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

-- Create student enrollments table (if not exists)
CREATE TABLE IF NOT EXISTS student_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('enrolled', 'in_progress', 'completed', 'dropped') DEFAULT 'enrolled',
    UNIQUE KEY unique_enrollment (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create lesson progress table (if not exists)
CREATE TABLE IF NOT EXISTS lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    lesson_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    time_spent_minutes INT DEFAULT 0,
    UNIQUE KEY unique_lesson_progress (student_id, lesson_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE
);

-- Create course categories table (if not exists)
CREATE TABLE IF NOT EXISTS course_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_course_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_enrollment_student ON student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON student_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);

-- Insert sample course categories (only if table is empty)
INSERT IGNORE INTO course_categories (name, description, icon, color) VALUES
('Mathematics', 'Advanced mathematics courses for all levels', '📐', '#FF6B6B'),
('Science', 'Physics, Chemistry, and Biology courses', '🔬', '#4ECDC4'),
('English', 'Language and literature courses', '📚', '#45B7D1'),
('Computer Science', 'Programming and technology courses', '💻', '#96CEB4'),
('History', 'World history and social studies', '🏛️', '#FFEAA7'),
('Arts', 'Creative arts and design courses', '🎨', '#DDA0DD');

-- Insert sample teachers (only if table is empty)
INSERT IGNORE INTO teachers (teacher_id, name, email, phone, subject, qualification, experience_years, password_hash) VALUES
('TCH20250001', 'Dr. Sarah Johnson', 'sarah.johnson@eduyata.com', '9876543210', 'Mathematics', 'PhD Mathematics', 8, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('TCH20250002', 'Prof. Michael Chen', 'michael.chen@eduyata.com', '9876543211', 'Physics', 'PhD Physics', 10, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('TCH20250003', 'Ms. Emily Rodriguez', 'emily.rodriguez@eduyata.com', '9876543212', 'English', 'MA English Literature', 5, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample courses (only if table is empty)
INSERT IGNORE INTO courses (course_id, title, description, instructor_id, category, level, duration_hours, price, thumbnail_url, is_published) VALUES
('CRS20250001', 'Advanced Calculus & Applications', 'Master calculus concepts with real-world applications. Perfect for students preparing for competitive exams.', 1, 'Mathematics', 'advanced', 40, 299.99, 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', TRUE),
('CRS20250002', 'Web Development Bootcamp', 'Learn modern web development with HTML, CSS, JavaScript, and React. Build real projects from scratch.', 3, 'Computer Science', 'intermediate', 60, 399.99, 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', TRUE),
('CRS20250003', 'Physics Fundamentals', 'Understand the fundamental principles of physics through interactive lessons and practical experiments.', 2, 'Science', 'beginner', 30, 199.99, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', TRUE),
('CRS20250004', 'Creative Writing Workshop', 'Develop your writing skills and unleash your creativity through guided exercises and peer feedback.', 3, 'English', 'intermediate', 25, 149.99, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', TRUE);

-- Show summary
SELECT 'Course Management System Setup Complete!' as status;
SELECT COUNT(*) as total_categories FROM course_categories;
SELECT COUNT(*) as total_teachers FROM teachers;
SELECT COUNT(*) as total_courses FROM courses; 