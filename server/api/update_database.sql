-- Update existing students table to add password_hash field
USE eduyata_db;

-- Add password_hash column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL DEFAULT '';

-- Update existing records to have a default password (you should change this in production)
-- This is just for testing purposes
UPDATE students SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE password_hash = '';
-- The above hash corresponds to the password 'password'

-- Add index for student_id for faster login lookups
CREATE INDEX IF NOT EXISTS idx_student_id_login ON students(student_id); 