USE eduyata_db;

-- Fix the student_notifications table id field to be AUTO_INCREMENT
ALTER TABLE student_notifications MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY;