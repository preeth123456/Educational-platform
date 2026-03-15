-- Feature Flags Tables
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
    KEY idx_user_type (user_type),
    FOREIGN KEY (flag_name) REFERENCES feature_flags(name) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;