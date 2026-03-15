-- Summary of Course-Class-Board Mappings
-- This shows which courses are available for which class and board combinations

-- View all mappings
SELECT 
    c.title as course_name,
    c.category,
    c.level,
    ccb.class,
    ccb.board
FROM course_class_board ccb
JOIN courses c ON c.id = ccb.course_id
ORDER BY ccb.class, ccb.board, c.category, c.title;

-- Count courses by class and board
SELECT 
    ccb.class,
    ccb.board,
    COUNT(*) as total_courses
FROM course_class_board ccb
GROUP BY ccb.class, ccb.board
ORDER BY ccb.class, ccb.board;

-- Courses available for Class 10 ICSE students
SELECT 
    c.title,
    c.category,
    c.level,
    c.instructor_id
FROM courses c
WHERE c.is_published = 1
AND (
    EXISTS (
        SELECT 1 FROM course_class_board ccb
        WHERE ccb.course_id = c.id
        AND ccb.class = '10'
        AND ccb.board = 'icse'
    )
    OR NOT EXISTS (
        SELECT 1 FROM course_class_board ccb2
        WHERE ccb2.course_id = c.id
    )
)
ORDER BY c.category, c.title;