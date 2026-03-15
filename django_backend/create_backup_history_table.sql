-- Create backup_history table for storing database backup metadata
CREATE TABLE IF NOT EXISTS backup_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_size BIGINT,
    status ENUM('success', 'failed') DEFAULT 'success',
    created_by VARCHAR(100)
);

-- Create index for better performance
CREATE INDEX idx_created_at ON backup_history(created_at);
CREATE INDEX idx_status ON backup_history(status);
CREATE INDEX idx_created_by ON backup_history(created_by);

-- Insert sample data for testing
INSERT INTO backup_history (filename, file_size, status, created_by) VALUES
('eduyata_db_backup_20241118_143000.sql', 2457600, 'success', 'admin'),
('eduyata_db_backup_20241118_020000.sql', 2359296, 'success', 'system'),
('eduyata_db_backup_20241117_143000.sql', 2516582, 'success', 'admin'),
('eduyata_db_backup_20241117_020000.sql', 2228224, 'success', 'system'),
('eduyata_db_backup_20241116_020000.sql', 2113536, 'failed', 'system'),
('eduyata_db_backup_20241115_143000.sql', 2387968, 'success', 'admin');