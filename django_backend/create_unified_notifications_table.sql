-- Create unified notifications table for Students and Teachers
-- Run this script in your MySQL database

USE eduyata_db;

-- Drop existing student_notifications if you want to migrate to unified table
-- (Keep it if you want backward compatibility)

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
    type VARCHAR(50) DEFAULT 'message',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_type, user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);

-- Insert some sample notifications for testing
INSERT INTO notifications (user_id, user_type, type, title, message, priority, is_read) VALUES
(1, 'student', 'message', '📢 Welcome to AIEduPro!', 'Welcome to our AI-powered learning platform! Start exploring courses and track your progress.', 'high', FALSE),
(1, 'student', 'badge', '🏆 Badge Earned!', 'Congratulations! You earned the "Fast Learner" badge for quick progress.', 'medium', FALSE),
(1, 'student', 'course_update', '📚 New Course Available', 'Check out our new Advanced React Development course!', 'medium', FALSE),
(1, 'teacher', 'message', '👋 Welcome Teacher!', 'Welcome to AIEduPro! You can now create courses and manage students.', 'high', FALSE),
(1, 'teacher', 'course_update', '✅ Course Approved', 'Your course "Python Basics" has been approved and is now live!', 'high', FALSE);

SELECT 'Notifications table created successfully!' as Status;
