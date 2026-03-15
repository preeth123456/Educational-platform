-- Fix student_notifications table to support UTF-8 characters (emojis, special characters)
ALTER TABLE student_notifications
MODIFY COLUMN message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- Also ensure the table itself uses utf8mb4
ALTER TABLE student_notifications
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


