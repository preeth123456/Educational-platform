CREATE TABLE IF NOT EXISTS student_consent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    consent_type VARCHAR(50) NOT NULL,
    is_granted BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_consent (student_id, consent_type)
);

CREATE TABLE IF NOT EXISTS consent_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    consent_type VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);