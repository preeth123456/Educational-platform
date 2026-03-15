-- Migration script to update column names from college/location to class/board
USE eduyata_db;

-- Check if the old columns exist and rename them
-- First, check if college column exists and rename it to class
SET @college_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_SCHEMA = 'eduyata_db' 
                      AND TABLE_NAME = 'students' 
                      AND COLUMN_NAME = 'college');

SET @location_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                       WHERE TABLE_SCHEMA = 'eduyata_db' 
                       AND TABLE_NAME = 'students' 
                       AND COLUMN_NAME = 'location');

-- Rename college to class if it exists
SET @sql = IF(@college_exists > 0, 
    'ALTER TABLE students CHANGE COLUMN college class VARCHAR(255)', 
    'SELECT "college column does not exist, skipping" as message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Rename location to board if it exists
SET @sql = IF(@location_exists > 0, 
    'ALTER TABLE students CHANGE COLUMN location board VARCHAR(255)', 
    'SELECT "location column does not exist, skipping" as message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add the columns if they don't exist (for new installations)
ALTER TABLE students ADD COLUMN IF NOT EXISTS class VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS board VARCHAR(255);

-- Show the final table structure
DESCRIBE students; 