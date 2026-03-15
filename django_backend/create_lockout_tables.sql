-- Create account lockout tables manually
USE eduyata_db;

-- Create account_lockout table
CREATE TABLE IF NOT EXISTS account_lockout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    username VARCHAR(255) NOT NULL,
    failed_attempts INT DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE,
    lockout_until DATETIME NULL,
    last_failed_ip VARCHAR(45) NULL,
    last_failed_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_lockout (user_id, user_type)
);

-- Create login_history table
CREATE TABLE IF NOT EXISTS login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    username VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    failure_reason VARCHAR(100) NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create blocked_entities table
CREATE TABLE IF NOT EXISTS blocked_entities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL,
    entity_value VARCHAR(255) NOT NULL,
    reason TEXT NULL,
    blocked_until DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create fraud_events table
CREATE TABLE IF NOT EXISTS fraud_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    details JSON NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create fraud_scores table
CREATE TABLE IF NOT EXISTS fraud_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    score INT DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'low',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_score (user_id, user_type)
);