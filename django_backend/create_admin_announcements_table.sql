-- Create admin_announcements table
CREATE TABLE IF NOT EXISTS admin_announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_audience ENUM('students', 'teachers', 'all') NOT NULL DEFAULT 'all',
    sent_by VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('sent', 'sending', 'failed') DEFAULT 'sent',
    recipients_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_target_audience ON admin_announcements(target_audience);
CREATE INDEX idx_sent_at ON admin_announcements(sent_at);
CREATE INDEX idx_status ON admin_announcements(status);

-- Insert sample data
INSERT INTO admin_announcements (title, message, target_audience, sent_by, status, recipients_count) VALUES
('Welcome to EduYata', 'Welcome to our learning platform! We hope you have a great learning experience.', 'all', 'Admin', 'sent', 150),
('Holiday Announcement', 'School will be closed for Diwali holidays from November 20-25. Classes will resume on November 26.', 'all', 'Admin', 'sent', 150),
('Exam Reminder', 'Final examinations will begin next week. Please check the schedule in your dashboard.', 'students', 'Admin', 'sent', 120);