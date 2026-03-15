-- Session & Device Management Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS session_events;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS user_devices;
DROP TABLE IF EXISTS session_policies;

-- Session Policies Table
CREATE TABLE session_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_name VARCHAR(100) NOT NULL,
    max_concurrent_sessions INT DEFAULT 3,
    session_timeout_minutes INT DEFAULT 1440, -- 24 hours
    max_devices_per_user INT DEFAULT 5,
    require_device_approval BOOLEAN DEFAULT FALSE,
    auto_logout_inactive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Devices Table
CREATE TABLE user_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type ENUM('student', 'teacher', 'admin') NOT NULL,
    device_id VARCHAR(255) NOT NULL UNIQUE,
    device_name VARCHAR(255),
    device_type VARCHAR(50), -- mobile, desktop, tablet
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address VARCHAR(45),
    is_trusted BOOLEAN DEFAULT FALSE,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_device (user_id, user_type),
    INDEX idx_device_id (device_id)
);

-- User Sessions Table
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    user_type ENUM('student', 'teacher', 'admin') NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES user_devices(device_id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_session (user_id, user_type),
    INDEX idx_active_sessions (is_active, expires_at)
);

-- Session Events Table
CREATE TABLE session_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    user_id INT NOT NULL,
    user_type ENUM('student', 'teacher', 'admin') NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- login, logout, timeout, revoked
    ip_address VARCHAR(45),
    device_id VARCHAR(255),
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE SET NULL,
    INDEX idx_user_events (user_id, user_type),
    INDEX idx_event_type (event_type)
);

-- Insert default policy
INSERT INTO session_policies (policy_name, max_concurrent_sessions, session_timeout_minutes, max_devices_per_user) 
VALUES ('default', 3, 1440, 5);