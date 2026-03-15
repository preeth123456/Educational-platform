-- ============================================================================
-- FEATURE 1: API KEYS
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_keys (
    id INT(11) NOT NULL AUTO_INCREMENT,
    key_value VARCHAR(64) NOT NULL,
    name VARCHAR(200) NOT NULL,
    user_id INT(11) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rate_limit_per_hour INT(11) DEFAULT 1000,
    last_used_at TIMESTAMP NULL,
    request_count INT(11) DEFAULT 0,
    allowed_ips TEXT,
    PRIMARY KEY (id),
    UNIQUE KEY unique_key_value (key_value),
    KEY idx_key_value (key_value),
    KEY idx_is_active (is_active),
    KEY idx_user_id (user_id),
    KEY idx_last_used (last_used_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- FEATURE 3: WEBHOOK FRAMEWORK
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    url TEXT NOT NULL,
    event_types VARCHAR(500) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_by INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_is_active (is_active),
    KEY idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Extend admin_notifications for webhook delivery logs
ALTER TABLE admin_notifications
ADD COLUMN IF NOT EXISTS webhook_endpoint_id INT(11) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS webhook_event_type VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS webhook_event_data JSON DEFAULT NULL,
ADD COLUMN IF NOT EXISTS webhook_status ENUM('pending', 'delivered', 'failed') DEFAULT NULL,
ADD COLUMN IF NOT EXISTS webhook_response_code INT(11) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS webhook_retry_count INT(11) DEFAULT 0,
ADD COLUMN IF NOT EXISTS webhook_delivered_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE admin_notifications
ADD KEY IF NOT EXISTS idx_webhook_status (webhook_status),
ADD KEY IF NOT EXISTS idx_webhook_endpoint (webhook_endpoint_id);

-- ============================================================================
-- FEATURE 4: INTEGRATION MARKETPLACE
-- ============================================================================

CREATE TABLE IF NOT EXISTS integrations (
    id INT(11) NOT NULL AUTO_INCREMENT,
    integration_type ENUM('zoom', 'slack') NOT NULL,
    name VARCHAR(200) NOT NULL,
    config JSON NOT NULL,
    api_key_id INT(11) DEFAULT NULL,
    webhook_endpoint_id INT(11) DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'inactive',
    installed_by INT(11) NOT NULL,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_status (status),
    KEY idx_type (integration_type),
    KEY idx_installed_by (installed_by),
    KEY idx_api_key (api_key_id),
    KEY idx_webhook (webhook_endpoint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Extend admin_announcements for integration notifications
ALTER TABLE admin_announcements
ADD COLUMN IF NOT EXISTS integration_id INT(11) DEFAULT NULL;

ALTER TABLE admin_announcements
ADD KEY IF NOT EXISTS idx_integration (integration_id);

-- ============================================================================
-- FEATURE FLAGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_flags (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_enabled TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_name (name),
    KEY idx_enabled (is_enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS feature_flag_users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    flag_name VARCHAR(100) NOT NULL,
    user_id INT(11) NOT NULL,
    user_type ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_flag_user (flag_name, user_id, user_type),
    KEY idx_flag_name (flag_name),
    KEY idx_user_id (user_id),
    KEY idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS feature_flag_logs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    flag_name VARCHAR(100) NOT NULL,
    user_id INT(11) NOT NULL,
    user_type ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_flag_name (flag_name),
    KEY idx_user_id (user_id),
    KEY idx_used_at (used_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;