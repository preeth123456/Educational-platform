-- Sample data to populate courses with class and board information
USE eduyata_db;

-- Update existing courses with class and board information
UPDATE courses SET class_level = '10th', board = 'CBSE' WHERE title LIKE '%Mathematics%' OR title LIKE '%Math%';
UPDATE courses SET class_level = '9th', board = 'CBSE' WHERE title LIKE '%Science%' OR title LIKE '%Physics%';
UPDATE courses SET class_level = '11th', board = 'ICSE' WHERE title LIKE '%English%' OR title LIKE '%Literature%';
UPDATE courses SET class_level = '12th', board = 'Karnataka State Board' WHERE title LIKE '%Computer%' OR title LIKE '%Programming%';
UPDATE courses SET class_level = '8th', board = 'CBSE' WHERE title LIKE '%History%' OR title LIKE '%Social%';