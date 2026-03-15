-- Extended Sample Data for All Boards
-- Run this after the main schema

-- Insert subjects for ICSE Class 10 (as example)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(22, 'English Language', 'ENGL10', TRUE),
(22, 'English Literature', 'ENGLIT10', TRUE),
(22, 'Mathematics', 'MATH10', TRUE),
(22, 'Physics', 'PHY10', TRUE),
(22, 'Chemistry', 'CHEM10', TRUE),
(22, 'Biology', 'BIO10', TRUE),
(22, 'History', 'HIST10', TRUE),
(22, 'Geography', 'GEO10', TRUE),
(22, 'Computer Applications', 'COMP10', FALSE);

-- Insert subjects for State Board Class 9 (as example)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(33, 'English', 'ENG9', TRUE),
(33, 'Mathematics', 'MATH9', TRUE),
(33, 'Science', 'SCI9', TRUE),
(33, 'Social Science', 'SST9', TRUE),
(33, 'Regional Language', 'REG9', TRUE);

-- Insert subjects for IB Grade 11 (as example)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(59, 'English A: Language and Literature', 'ENGIB11', TRUE),
(59, 'Mathematics: Analysis and Approaches', 'MATHIB11', FALSE),
(59, 'Physics', 'PHYIB11', FALSE),
(59, 'Chemistry', 'CHEMIB11', FALSE),
(59, 'Biology', 'BIOIB11', FALSE),
(59, 'History', 'HISTIB11', FALSE),
(59, 'Economics', 'ECONIB11', FALSE);

-- Insert subjects for IGCSE Year 10 (as example)
INSERT INTO subjects (class_id, subject_name, subject_code, is_core) VALUES
(70, 'English as a Second Language', 'ESLIGS10', TRUE),
(70, 'Mathematics', 'MATHIGS10', TRUE),
(70, 'Physics', 'PHYIGS10', FALSE),
(70, 'Chemistry', 'CHEMIGS10', FALSE),
(70, 'Biology', 'BIOIGS10', FALSE),
(70, 'Business Studies', 'BUSIGS10', FALSE),
(70, 'Computer Science', 'CSIGS10', FALSE);

-- Sample chapters for ICSE English Literature Class 10
INSERT INTO chapters (subject_id, chapter_number, chapter_name, description) VALUES
(62, 1, 'Poetry Collection', 'Selected poems from various poets'),
(62, 2, 'Drama - The Merchant of Venice', 'Shakespeare play analysis'),
(62, 3, 'Short Stories', 'Collection of short stories');

-- Sample chapters for IB Physics Grade 11
INSERT INTO chapters (subject_id, chapter_number, chapter_name, description) VALUES
(63, 1, 'Measurements and Uncertainties', 'Introduction to physics measurements'),
(63, 2, 'Mechanics', 'Motion, forces and energy'),
(63, 3, 'Thermal Physics', 'Heat and temperature concepts');

-- Sample lessons for ICSE Poetry
INSERT INTO lessons (chapter_id, lesson_number, lesson_name, description, duration_minutes) VALUES
(4, 1, 'The Heart of the Tree', 'Analysis of Henry Bunner poem', 45),
(4, 2, 'The Cold Within', 'Understanding James Patrick Kinney poem', 50),
(4, 3, 'The Bangle Sellers', 'Sarojini Naidu poetry analysis', 45);

-- Sample lessons for IB Mechanics
INSERT INTO lessons (chapter_id, lesson_number, lesson_name, description, duration_minutes) VALUES
(5, 1, 'Motion in One Dimension', 'Linear motion concepts', 60),
(5, 2, 'Forces and Newton Laws', 'Understanding fundamental laws', 60),
(5, 3, 'Work, Energy and Power', 'Energy transformations', 55);

-- Sample topics for ICSE Poetry lessons
INSERT INTO topics (lesson_id, topic_name, video_url, description, content_type) VALUES
(10, 'Poem Structure Analysis', 'https://youtube.com/watch?v=icse1', 'Breaking down the poem structure', 'video'),
(10, 'Theme and Message', 'https://youtube.com/watch?v=icse2', 'Understanding the central theme', 'video'),
(11, 'Literary Devices', 'https://youtube.com/watch?v=icse3', 'Metaphors and symbolism in the poem', 'video'),
(11, 'Social Commentary', 'https://youtube.com/watch?v=icse4', 'The poems social message', 'video');

-- Sample topics for IB Physics lessons
INSERT INTO topics (lesson_id, topic_name, video_url, description, content_type) VALUES
(13, 'Displacement vs Distance', 'https://youtube.com/watch?v=ib1', 'Understanding the difference', 'video'),
(13, 'Velocity and Acceleration', 'https://youtube.com/watch?v=ib2', 'Rate of change concepts', 'video'),
(14, 'Newton First Law', 'https://youtube.com/watch?v=ib3', 'Law of inertia explained', 'video'),
(14, 'Newton Second Law', 'https://youtube.com/watch?v=ib4', 'F = ma applications', 'video');

-- Sample teacher assignments (assuming some teacher IDs exist)
INSERT INTO teacher_class_subjects (teacher_id, class_id, subject_id, is_primary_teacher) VALUES
(1, 10, 26, TRUE),  -- Teacher 1 teaches Class 10 CBSE Mathematics
(1, 9, 21, FALSE),  -- Teacher 1 also teaches Class 9 CBSE Mathematics
(2, 10, 27, TRUE),  -- Teacher 2 teaches Class 10 CBSE Science
(3, 22, 62, TRUE),  -- Teacher 3 teaches ICSE Class 10 English Literature
(4, 59, 63, TRUE);  -- Teacher 4 teaches IB Grade 11 Physics