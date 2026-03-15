-- Check current feature flags
SELECT * FROM feature_flags;

-- Check feature flag assignments
SELECT * FROM feature_flag_users;

-- Check if student STU20251807 exists and get their ID
SELECT id, student_id, name FROM students WHERE student_id = 'STU20251807';