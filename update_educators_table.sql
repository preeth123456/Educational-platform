-- Update educators table structure
USE eduyata_db;

-- Make ID auto increment
ALTER TABLE educators MODIFY COLUMN id BIGINT AUTO_INCREMENT;

-- Remove last_institute column
ALTER TABLE educators DROP COLUMN last_institute;

-- Add institutes field to store teaching experience
ALTER TABLE educators ADD COLUMN institutes JSON DEFAULT '[]';

-- Verify the changes
DESCRIBE educators;