-- Consent & Privacy Management Database Setup
-- Run this script to create the necessary tables for consent tracking

-- Create student_consent table
CREATE TABLE IF NOT EXISTS student_consent (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    consent_type VARCHAR(50) NOT NULL,
    is_granted BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_consent (student_id, consent_type)
);

-- Create consent_history table
CREATE TABLE IF NOT EXISTS consent_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    consent_type VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'granted', 'revoked', 'updated'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_timestamp (student_id, timestamp),
    INDEX idx_consent_type (consent_type)
);

-- Insert default privacy-friendly consent settings for existing students
INSERT IGNORE INTO student_consent (student_id, consent_type, is_granted)
SELECT 
    id as student_id,
    'data_collection' as consent_type,
    FALSE as is_granted
FROM students;

INSERT IGNORE INTO student_consent (student_id, consent_type, is_granted)
SELECT 
    id as student_id,
    'progress_sharing' as consent_type,
    FALSE as is_granted
FROM students;

INSERT IGNORE INTO student_consent (student_id, consent_type, is_granted)
SELECT 
    id as student_id,
    'achievement_visibility' as consent_type,
    FALSE as is_granted
FROM students;

INSERT IGNORE INTO student_consent (student_id, consent_type, is_granted)
SELECT 
    id as student_id,
    'parent_notifications' as consent_type,
    TRUE as is_granted  -- Default to true for safety
FROM students;

INSERT IGNORE INTO student_consent (student_id, consent_type, is_granted)
SELECT 
    id as student_id,
    'marketing_communications' as consent_type,
    FALSE as is_granted
FROM students