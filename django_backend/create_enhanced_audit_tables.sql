-- Enhanced Forensic-Grade Audit System Schema

-- Enhanced audit_logs table with immutability features
CREATE TABLE audit_logs_enhanced (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    actor_id INT NOT NULL,
    actor_type ENUM('student', 'teacher', 'admin', 'system') NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100),
    before_state JSON,
    after_state JSON,
    metadata JSON,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    hash_chain VARCHAR(64),
    INDEX idx_actor_timestamp (actor_id, timestamp),
    INDEX idx_action (action),
    INDEX idx_target (target_type, target_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_hash_chain (hash_chain)
) ENGINE=InnoDB;

-- Data access logs for GDPR/compliance
CREATE TABLE data_access_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    actor_id INT NOT NULL,
    actor_type ENUM('student', 'teacher', 'admin', 'system') NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    data_subject_id INT,
    access_method VARCHAR(50),
    purpose VARCHAR(100),
    legal_basis VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_actor_timestamp (actor_id, timestamp),
    INDEX idx_data_subject (data_subject_id),
    INDEX idx_data_type (data_type)
) ENGINE=InnoDB;

-- Admin actions log
CREATE TABLE admin_actions_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(100),
    description TEXT,
    risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    approval_required BOOLEAN DEFAULT FALSE,
    approved_by INT,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_admin_timestamp (admin_id, timestamp),
    INDEX idx_action_type (action_type),
    INDEX idx_risk_level (risk_level)
) ENGINE=InnoDB;

-- Policy and role changes
CREATE TABLE policy_changes_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    changed_by INT NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    policy_name VARCHAR(100) NOT NULL,
    change_type ENUM('create', 'update', 'delete') NOT NULL,
    old_value JSON,
    new_value JSON,
    reason TEXT,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_changed_by_timestamp (changed_by, timestamp),
    INDEX idx_policy_type (policy_type)
) ENGINE=InnoDB;

-- Data exports log
CREATE TABLE data_exports_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exported_by INT NOT NULL,
    export_type VARCHAR(50) NOT NULL,
    data_types JSON NOT NULL,
    filters JSON,
    record_count INT,
    file_hash VARCHAR(64),
    retention_period INT,
    purpose VARCHAR(200),
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_exported_by_timestamp (exported_by, timestamp),
    INDEX idx_export_type (export_type)
) ENGINE=InnoDB;

-- Incident response log
CREATE TABLE incident_response_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    incident_id VARCHAR(50) NOT NULL,
    responder_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    evidence JSON,
    impact_assessment TEXT,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_incident_id (incident_id),
    INDEX idx_responder_timestamp (responder_id, timestamp)
) ENGINE=InnoDB;

-- Audit log integrity table for tamper detection
CREATE TABLE audit_integrity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_count BIGINT NOT NULL,
    hash_chain_head VARCHAR(64) NOT NULL,
    last_verified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_table (table_name)
) ENGINE=InnoDB;

-- Create triggers to prevent modifications (append-only)
DELIMITER //

CREATE TRIGGER prevent_audit_update 
BEFORE UPDATE ON audit_logs_enhanced
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit logs cannot be modified';
END//

CREATE TRIGGER prevent_audit_delete 
BEFORE DELETE ON audit_logs_enhanced
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit logs cannot be deleted';
END//

DELIMITER ;