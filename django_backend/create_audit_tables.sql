-- Audit Logs & Security Trails Database Schema

CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_type ENUM('student', 'teacher', 'admin'),
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id)
);

CREATE TABLE security_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(50),
    severity ENUM('low', 'medium', 'high', 'critical'),
    user_id INT,
    description TEXT,
    metadata JSON,
    ip_address VARCHAR(45),
    resolved BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_severity_timestamp (severity, timestamp),
    INDEX idx_user_id (user_id),
    INDEX idx_resolved (resolved)
);