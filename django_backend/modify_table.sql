-- Modify the user_id column to support string IDs like STU20251807
ALTER TABLE feature_flag_users MODIFY COLUMN user_id VARCHAR(50) NOT NULL;

-- Clear existing assignments
DELETE FROM feature_flag_users;

-- Add correct assignments
INSERT INTO feature_flag_users (flag_name, user_id, user_type) 
VALUES ('Theme button', 'STU20251807', 'student');

INSERT INTO feature_flag_users (flag_name, user_id, user_type) 
VALUES ('Theme button', 'STU20258610', 'student');