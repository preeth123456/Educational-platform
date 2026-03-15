-- Add sample teacher assignments to test LMS

-- First check if we have teachers
SELECT * FROM educator LIMIT 5;

-- Add sample teacher assignments (adjust teacher_id based on your data)
INSERT INTO teacher_class_subjects (teacher_id, class_id, subject_id, is_primary_teacher) VALUES
(1, 10, 26, TRUE),  -- Teacher 1 teaches CBSE Class 10 Mathematics
(1, 9, 21, FALSE),  -- Teacher 1 also teaches CBSE Class 9 Mathematics
(1, 11, 32, TRUE);  -- Teacher 1 teaches CBSE Class 11 Mathematics

-- Check what we inserted
SELECT 
    tcs.*,
    b.board_name,
    c.class_name,
    s.subject_name
FROM teacher_class_subjects tcs
JOIN classes c ON tcs.class_id = c.class_id
JOIN boards b ON c.board_id = b.board_id
JOIN subjects s ON tcs.subject_id = s.subject_id
WHERE tcs.teacher_id = 1;