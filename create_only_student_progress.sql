-- Create only the student_progress table since video_progress and quiz_results already exist
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