-- Add profile completion fields to students table in eduyata_db
USE eduyata_db;

ALTER TABLE students 
ADD COLUMN date_of_birth DATE NULL,
ADD COLUMN address TEXT,
ADD COLUMN parent_name VARCHAR(255) DEFAULT '',
ADD COLUMN parent_phone VARCHAR(15) DEFAULT '',
ADD COLUMN interests TEXT DEFAULT '',
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;