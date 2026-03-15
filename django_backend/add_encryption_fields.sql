-- Add encrypted fields to students table
ALTER TABLE students 
ADD COLUMN mobile_self_encrypted TEXT,
ADD COLUMN address_encrypted TEXT,
ADD COLUMN parent_phone_encrypted TEXT,
ADD COLUMN encryption_key_id INT;

-- Add encrypted fields to educators table
ALTER TABLE educators
ADD COLUMN mobile_encrypted TEXT,
ADD COLUMN email_encrypted TEXT,
ADD COLUMN encryption_key_id INT;

-- Create encryption_keys table
CREATE TABLE IF NOT EXISTS encryption_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    rotated_at TIMESTAMP NULL
);

-- Create index for faster lookups
CREATE INDEX idx_encryption_keys_active ON encryption_keys(is_active);
CREATE INDEX idx_students_encrypted ON students(encryption_key_id);
CREATE INDEX idx_educators_encrypted ON educators(encryption_key_id);
