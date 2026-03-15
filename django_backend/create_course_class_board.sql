-- Create course_class_board table to map courses to specific class and board combinations
USE eduyata_db;

CREATE TABLE IF NOT EXISTS course_class_board (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    `class` VARCHAR(20) NOT NULL,
    board VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_class_board (course_id, `class`, board)
);

-- Insert sample data for existing courses
INSERT INTO course_class_board (course_id, `class`, board) VALUES
(1, '10th', 'CBSE'),
(2, '9th', 'CBSE'),
(3, '11th', 'ICSE'),
(4, '12th', 'Karnataka State Board');
