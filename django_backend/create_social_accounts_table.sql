-- SSO Social Accounts Table
-- Stores links between external OAuth providers and internal users

CREATE TABLE IF NOT EXISTS social_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(30) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL,
    name VARCHAR(255) DEFAULT '',
    picture_url VARCHAR(500) DEFAULT '',
    user_type VARCHAR(20) NOT NULL,
    student_id INT NULL,
    educator_id INT NULL,
    access_token TEXT DEFAULT '',
    refresh_token TEXT DEFAULT '',
    token_expires_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_provider_account (provider, provider_id),
    INDEX idx_email (email),
    INDEX idx_student (user_type, student_id),
    INDEX idx_educator (user_type, educator_id),
    
    CONSTRAINT chk_user_type CHECK (user_type IN ('student', 'educator')),
    CONSTRAINT chk_provider CHECK (provider IN ('google', 'microsoft'))
);
