-- Drop and recreate skill_endorsements table with proper AUTO_INCREMENT
DROP TABLE IF EXISTS skill_endorsements;

CREATE TABLE skill_endorsements (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    endorser_id INT NOT NULL,
    endorser_type ENUM('teacher', 'peer') NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_category VARCHAR(50) NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    evidence_type ENUM('assignment', 'quiz', 'project', 'participation') NULL,
    evidence_id INT NULL,
    evidence_score DECIMAL(5,2) NULL,
    message TEXT NULL,
    is_ai_suggested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_student_skill (student_id, skill_name),
    INDEX idx_endorser (endorser_id, endorser_type),
    INDEX idx_created_at (created_at)
);