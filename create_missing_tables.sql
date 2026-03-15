-- Create missing tables for enrollment system

-- Student enrollments table
CREATE TABLE IF NOT EXISTS student_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'enrolled',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    INDEX idx_student_enrollments_student (student_id),
    INDEX idx_student_enrollments_course (course_id)
);

-- Student progress table (if not exists)
CREATE TABLE IF NOT EXISTS student_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    progress JSON,
    completed JSON,
    quiz_attempts JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_course (student_id, course_id),
    INDEX idx_student_progress_student (student_id),
    INDEX idx_student_progress_course (course_id)
);

-- Optional: Student activities table (for activity tracking)
CREATE TABLE IF NOT EXISTS student_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    activity_type VARCHAR(50),
    action VARCHAR(255),
    subject VARCHAR(255),
    course_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activities_student (student_id)
);

-- Optional: Student notifications table
CREATE TABLE IF NOT EXISTS student_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_student (student_id)
);