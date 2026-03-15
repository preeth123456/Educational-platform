CREATE TABLE IF NOT EXISTS teacher_email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    email_subject VARCHAR(255) NOT NULL,
    email_body TEXT NOT NULL,
    sent_status VARCHAR(20) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);