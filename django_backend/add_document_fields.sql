-- Add missing document fields to educators table
ALTER TABLE educators 
ADD COLUMN degree_certificate_file VARCHAR(500) DEFAULT '' AFTER degree_certificate,
ADD COLUMN government_id_file VARCHAR(500) DEFAULT '' AFTER degree_certificate_file;

-- Update existing records to use degree_certificate for degree_certificate_file if empty
UPDATE educators 
SET degree_certificate_file = degree_certificate 
WHERE degree_certificate_file = '' AND degree_certificate != '';

-- Show the updated table structure
DESCRIBE educators;