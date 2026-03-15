-- Delete existing assignments
DELETE FROM feature_flag_users WHERE flag_name = 'Theme button';

-- Add correct assignment using student_id string format
INSERT INTO feature_flag_users (flag_name, user_id, user_type) 
VALUES ('Theme button', 'STU20251807', 'student');

INSERT INTO feature_flag_users (flag_name, user_id, user_type) 
VALUES ('Theme button', 'STU20258610', 'student');