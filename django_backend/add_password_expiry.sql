-- Add password_created_at field to both tables
ALTER TABLE students ADD COLUMN password_created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE educators ADD COLUMN password_created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Set existing passwords to 95 days old (to trigger expiry)
UPDATE students SET password_created_at = DATE_SUB(NOW(), INTERVAL 95 DAY);
UPDATE educators SET password_created_at = DATE_SUB(NOW(), INTERVAL 95 DAY);