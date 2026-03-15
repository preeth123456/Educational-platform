-- Create teaching experience table
USE eduyata_db;

CREATE TABLE teaching_experience (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id VARCHAR(20) NOT NULL,
    institute_name VARCHAR(255) NOT NULL,
    from_year VARCHAR(4) NOT NULL,
    to_year VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES educators(teacher_id) ON DELETE CASCADE
);

-- Remove last_institute column from educators table
ALTER TABLE educators DROP COLUMN last_institute;