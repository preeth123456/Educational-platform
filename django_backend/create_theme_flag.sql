-- Create theme toggle feature flag
INSERT INTO feature_flags (name, description, is_enabled) VALUES ('theme_toggle', 'Allow students to toggle between light and dark themes', 1);

-- Assign theme flag to student STU20251807
INSERT INTO feature_flag_users (flag_name, user_id, user_type) VALUES ('theme_toggle', 20251807, 'student');