-- Feature 2: Product & Tenant Configuration Management
-- Database schema for multi-tenant configuration system

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    board_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    contact_email VARCHAR(254) NOT NULL,
    subscription_type VARCHAR(50) DEFAULT 'basic',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Configurations Table
CREATE TABLE IF NOT EXISTS product_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(20) DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_by_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_key (product_id, `key`),
    INDEX idx_product_configs_key (`key`),
    INDEX idx_product_configs_category (category)
);

-- Tenant Configurations Table
CREATE TABLE IF NOT EXISTS tenant_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50),
    `key` VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(20) DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_by_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_product_key (tenant_id, product_id, `key`),
    INDEX idx_tenant_configs_key (`key`),
    INDEX idx_tenant_configs_category (category)
);

-- Insert sample products
INSERT IGNORE INTO products (product_id, name, description, board_type) VALUES
('cbse-standard', 'CBSE Standard', 'Standard CBSE curriculum for all classes', 'CBSE'),
('icse-premium', 'ICSE Premium', 'Premium ICSE curriculum with advanced features', 'ICSE'),
('state-basic', 'State Board Basic', 'Basic state board curriculum', 'STATE');

-- Insert sample tenants
INSERT IGNORE INTO tenants (tenant_id, name, domain, contact_email, subscription_type) VALUES
('dps-delhi', 'Delhi Public School', 'dps.eduyata.com', 'admin@dps.edu', 'premium'),
('st-marys', 'St. Mary\'s Convent', 'stmarys.eduyata.com', 'admin@stmarys.edu', 'standard'),
('kendriya-001', 'Kendriya Vidyalaya No.1', 'kv001.eduyata.com', 'admin@kv001.edu', 'basic');

-- Insert sample product configurations
INSERT IGNORE INTO product_configs (product_id, `key`, value, value_type, category, description) VALUES
('cbse-standard', 'theme_primary_color', '#28a745', 'string', 'appearance', 'CBSE brand green color'),
('cbse-standard', 'grading_system', '["A+", "A", "B+", "B", "C+", "C", "D", "F"]', 'json', 'grading', 'CBSE grading system'),
('icse-premium', 'theme_primary_color', '#007bff', 'string', 'appearance', 'ICSE brand blue color'),
('icse-premium', 'grading_system', '["Distinction", "Merit", "Credit", "Pass", "Fail"]', 'json', 'grading', 'ICSE grading system');

-- Insert sample tenant configurations
INSERT IGNORE INTO tenant_configs (tenant_id, `key`, value, value_type, category, description) VALUES
('dps-delhi', 'theme_primary_color', '#dc3545', 'string', 'appearance', 'DPS school red color'),
('dps-delhi', 'school_logo_url', '/logos/dps-logo.png', 'string', 'appearance', 'DPS school logo'),
('dps-delhi', 'enable_advanced_analytics', 'true', 'boolean', 'features', 'Enable advanced analytics for premium subscribers'),
('st-marys', 'theme_primary_color', '#17a2b8', 'string', 'appearance', 'St. Marys school cyan color'),
('st-marys', 'school_logo_url', '/logos/stmarys-logo.png', 'string', 'appearance', 'St. Marys school logo'),
('st-marys', 'grading_system', '["Excellent", "Very Good", "Good", "Satisfactory", "Needs Improvement"]', 'json', 'grading', 'St. Marys custom grading system');

-- Insert default platform configurations if they don't exist
INSERT IGNORE INTO platform_configs (`key`, value, value_type, category, description) VALUES
('theme_primary_color', '#007bff', 'string', 'appearance', 'Default platform primary color'),
('site_name', 'Eduyata', 'string', 'general', 'Platform name'),
('enable_multi_tenant', 'true', 'boolean', 'features', 'Enable multi-tenant functionality');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_board_type ON products(board_type);
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription ON tenants(subscription_type);