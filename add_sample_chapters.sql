-- Add sample chapters and lessons to test the API

-- First, let's see what subjects exist
SELECT s.subject_id, s.subject_name, c.class_name, b.board_name 
FROM subjects s 
JOIN classes c ON s.class_id = c.class_id 
JOIN boards b ON c.board_id = b.board_id;

-- Add chapters for existing subjects (adjust subject_id based on your data)
INSERT INTO chapters (subject_id, chapter_number, chapter_name, description) VALUES
(1, 1, 'Introduction to English', 'Basic English concepts'),
(1, 2, 'Grammar Basics', 'Fundamental grammar rules'),
(2, 1, 'Numbers and Counting', 'Basic number concepts'),
(2, 2, 'Addition and Subtraction', 'Basic arithmetic operations'),
(3, 1, 'Our Environment', 'Understanding our surroundings'),
(3, 2, 'Plants and Animals', 'Living things around us');

-- Add lessons for the chapters
INSERT INTO lessons (chapter_id, lesson_number, lesson_name, description) VALUES
(1, 1, 'Alphabets', 'Learning A to Z'),
(1, 2, 'Simple Words', 'Basic vocabulary'),
(2, 1, 'Nouns', 'Understanding nouns'),
(2, 2, 'Verbs', 'Action words'),
(3, 1, 'Counting 1-10', 'Basic counting'),
(3, 2, 'Number Recognition', 'Identifying numbers'),
(4, 1, 'Simple Addition', 'Adding numbers'),
(4, 2, 'Simple Subtraction', 'Subtracting numbers');

-- Check if data was inserted
SELECT * FROM chapters;
SELECT * FROM lessons;