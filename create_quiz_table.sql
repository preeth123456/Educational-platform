USE eduyata_db;

CREATE TABLE quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    topic VARCHAR(100) NOT NULL,
    quiz_type ENUM('topic_quiz', 'chapter_quiz', 'final_quiz', 'practice_quiz') DEFAULT 'topic_quiz',
    attempt_number INT DEFAULT 1,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    answers JSON,
    percentage DECIMAL(5,2) NOT NULL,
    time_taken INT,
    is_passed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_course (student_id, course_id),
    INDEX idx_topic_quiz (course_id, topic, quiz_type),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_attempt (student_id, course_id, topic, quiz_type, attempt_number)
);