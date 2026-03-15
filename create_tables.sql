-- Create tables for progress tracking and quiz system

-- Student progress table
CREATE TABLE IF NOT EXISTS student_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    progress JSON,
    completed JSON,
    quiz_attempts JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_course (student_id, course_id)
);

-- Video progress table
CREATE TABLE IF NOT EXISTS video_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0,
    current_time DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_video (student_id, course_id, video_id)
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    answers JSON,
    percentage INT NOT NULL,
    quiz_type VARCHAR(50) DEFAULT 'topic_quiz',
    time_taken INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_student_progress_course ON student_progress(course_id);
CREATE INDEX idx_video_progress_student ON video_progress(student_id);
CREATE INDEX idx_video_progress_course ON video_progress(course_id);
CREATE INDEX idx_quiz_results_student ON quiz_results(student_id);
CREATE INDEX idx_quiz_results_course ON quiz_results(course_id);
CREATE INDEX idx_quiz_results_topic ON quiz_results(topic);