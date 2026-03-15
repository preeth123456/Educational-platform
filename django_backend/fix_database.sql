-- Fix database for teacher document storage
USE eduyata_db;

-- Add missing document fields if they don't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'educators' 
     AND table_schema = 'eduyata_db' 
     AND column_name = 'degree_certificate_file') > 0,
    'SELECT "degree_certificate_file already exists"',
    'ALTER TABLE educators ADD COLUMN degree_certificate_file VARCHAR(500) DEFAULT ""'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'educators' 
     AND table_schema = 'eduyata_db' 
     AND column_name = 'government_id_file') > 0,
    'SELECT "government_id_file already exists"',
    'ALTER TABLE educators ADD COLUMN government_id_file VARCHAR(500) DEFAULT ""'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update degree_certificate_file with degree_certificate values where empty
UPDATE educators 
SET degree_certificate_file = degree_certificate 
WHERE (degree_certificate_file = '' OR degree_certificate_file IS NULL) 
AND degree_certificate != '' 
AND degree_certificate IS NOT NULL;

-- Show current document fields for verification
SELECT 
    teacher_id,
    name,
    profile_picture,
    cv_file,
    degree_certificate,
    degree_certificate_file,
    achievements_file,
    experience_proof_file,
    government_id_file,
    document_status,
    is_active
FROM educators 
ORDER BY id DESC 
LIMIT 5;