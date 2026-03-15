USE eduyata_db;

CREATE TABLE IF NOT EXISTS student_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    activity_type VARCHAR(20) NOT NULL,
    action VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    course_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);