-- Virtual Classrooms Database Schema

-- Virtual Classrooms Table
CREATE TABLE IF NOT EXISTS virtual_classrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id VARCHAR(20) UNIQUE NOT NULL,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    classroom_code VARCHAR(10) UNIQUE NOT NULL,
    max_students INT DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_course_id (course_id),
    INDEX idx_classroom_code (classroom_code)
);

-- Classroom Enrollments Table
CREATE TABLE IF NOT EXISTS classroom_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    student_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_accessed TIMESTAMP NULL,
    FOREIGN KEY (classroom_id) REFERENCES virtual_classrooms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (classroom_id, student_id),
    INDEX idx_student_id (student_id)
);

-- Classroom Sessions Table
CREATE TABLE IF NOT EXISTS classroom_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    status ENUM('scheduled', 'live', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES virtual_classrooms(id) ON DELETE CASCADE,
    INDEX idx_scheduled_date (scheduled_date)
);

-- Classroom Announcements Table
CREATE TABLE IF NOT EXISTS classroom_announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES virtual_classrooms(id) ON DELETE CASCADE,
    INDEX idx_created_at (created_at)
);

-- Classroom Resources Table
CREATE TABLE IF NOT EXISTS classroom_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type ENUM('document', 'video', 'link', 'image') NOT NULL,
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES virtual_classrooms(id) ON DELETE CASCADE,
    INDEX idx_resource_type (resource_type)
);