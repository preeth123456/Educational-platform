CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('Teacher Admin', 'Course Admin', 'Both') NOT NULL,
    assigned_area VARCHAR(500),
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample admin data
INSERT INTO admins (name, email, role, assigned_area, password_hash, status, created_at, last_login) VALUES
('John Doe', 'john@eduyata.com', 'Teacher Admin', 'Teacher Verification & Approval', '$2b$12$example_hash_1', 'Active', '2024-01-15 10:00:00', '2024-01-20 14:30:00'),
('Jane Smith', 'jane@eduyata.com', 'Course Admin', 'Course Content Management', '$2b$12$example_hash_2', 'Active', '2024-01-10 09:00:00', '2024-01-19 16:45:00'),
('Mike Johnson', 'mike@eduyata.com', 'Both', 'General Administration', '$2b$12$example_hash_3', 'Inactive', '2024-01-05 11:00:00', '2024-01-18 12:15:00');