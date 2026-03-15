-- Quiz Results Table for Multiple Quizzes per Course
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
    time_taken INT, -- in seconds
    is_passed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_student_course (student_id, course_id),
    INDEX idx_topic_quiz (course_id, topic, quiz_type),
    INDEX idx_created_at (created_at),
    
    -- Unique constraint to prevent duplicate attempts (optional)
    UNIQUE KEY unique_attempt (student_id, course_id, topic, quiz_type, attempt_number)
);

-- Optional: Create a view for latest quiz attempts
CREATE VIEW latest_quiz_results AS
SELECT qr.*
FROM quiz_results qr
INNER JOIN (
    SELECT student_id, course_id, topic, quiz_type, MAX(attempt_number) as max_attempt
    FROM quiz_results
    GROUP BY student_id, course_id, topic, quiz_type
) latest ON qr.student_id = latest.student_id 
    AND qr.course_id = latest.course_id 
    AND qr.topic = latest.topic 
    AND qr.quiz_type = latest.quiz_type 
    AND qr.attempt_number = latest.max_attempt;