-- Fix student_enrollments table to add AUTO_INCREMENT to id field
-- This resolves the "Field 'id' doesn't have a default value" error

USE eduyata_db;

-- First, check current table structure
DESCRIBE student_enrollments;

-- Alter the id column to add AUTO_INCREMENT
ALTER TABLE student_enrollments MODIFY COLUMN id INT AUTO_INCREMENT;

-- Verify the change
DESCRIBE student_enrollments;