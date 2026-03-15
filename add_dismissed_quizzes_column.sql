-- Add dismissed_quizzes column to student_progress table
ALTER TABLE student_progress ADD COLUMN dismissed_quizzes JSON DEFAULT NULL;

-- Update existing records to have empty object for dismissed_quizzes
UPDATE student_progress SET dismissed_quizzes = '{}' WHERE dismissed_quizzes IS NULL;