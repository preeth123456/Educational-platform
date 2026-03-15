-- Add course_id column to chapters table
ALTER TABLE chapters ADD COLUMN course_id INT NULL;

-- Add course_id column to lessons table  
ALTER TABLE lessons ADD COLUMN course_id INT NULL;

-- Update existing chapters to have NULL course_id (they will be global)
-- New chapters created through the course builder will have specific course_ids

-- Add index for better performance
CREATE INDEX idx_chapters_course_id ON chapters(course_id);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);