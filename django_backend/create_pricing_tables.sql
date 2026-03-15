-- Product Catalog & Pricing Plans Database Setup
-- Run this script in your MySQL database

-- Create pricing_products table
CREATE TABLE IF NOT EXISTS pricing_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    product_type VARCHAR(20) NOT NULL,
    audience_role VARCHAR(20) NOT NULL,
    description TEXT,
    features_json JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create pricing_plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    discount_percent DECIMAL(5,2) DEFAULT 0,
    duration_days INT DEFAULT 30,
    limits_json JSON,
    is_default BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES pricing_products(id) ON DELETE CASCADE
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES pricing_plans(id) ON DELETE CASCADE
);

-- Insert sample products
INSERT INTO pricing_products (name, code, product_type, audience_role, description, features_json, is_active) VALUES
('Eduyata Student Basic', 'EDU_STU_BASIC', 'Subscription', 'student', 'Basic plan for students with essential features', '["Access to basic courses", "AI assistance", "Progress tracking", "Mobile app access"]', TRUE),
('Eduyata Student Premium', 'EDU_STU_PREMIUM', 'Subscription', 'student', 'Premium plan for students with advanced features', '["Access to all courses", "Unlimited AI assistance", "Advanced analytics", "Priority support", "Downloadable content"]', TRUE),
('Eduyata Teacher Pro', 'EDU_TCH_PRO', 'Subscription', 'teacher', 'Professional plan for teachers', '["Course creation tools", "Student management", "Analytics dashboard", "Assignment grading", "Virtual classroom"]', TRUE),
('Institution License', 'EDU_INST_LIC', 'Subscription', 'institution', 'Enterprise solution for educational institutions', '["Unlimited users", "Custom branding", "Advanced reporting", "API access", "Dedicated support"]', TRUE);

-- Insert sample pricing plans
INSERT INTO pricing_plans (product_id, name, billing_cycle, price, currency, discount_percent, duration_days, limits_json, is_default, is_recommended, is_active) VALUES
(1, 'Basic Monthly', 'Monthly', 299.00, 'INR', 0, 30, '{"max_ai_requests_per_day": 50, "max_courses_access": 3, "max_mock_tests": 5, "downloadable_materials": false}', TRUE, FALSE, TRUE),
(1, 'Basic Yearly', 'Yearly', 2990.00, 'INR', 17, 365, '{"max_ai_requests_per_day": 50, "max_courses_access": 3, "max_mock_tests": 5, "downloadable_materials": false}', FALSE, FALSE, TRUE),
(2, 'Premium Monthly', 'Monthly', 599.00, 'INR', 0, 30, '{"max_ai_requests_per_day": 200, "max_courses_access": 999, "max_mock_tests": 999, "downloadable_materials": true}', FALSE, TRUE, TRUE),
(2, 'Premium Yearly', 'Yearly', 5990.00, 'INR', 17, 365, '{"max_ai_requests_per_day": 200, "max_courses_access": 999, "max_mock_tests": 999, "downloadable_materials": true}', FALSE, FALSE, TRUE),
(3, 'Teacher Pro Monthly', 'Monthly', 999.00, 'INR', 0, 30, '{"max_students": 100, "max_courses_created": 10, "analytics_retention_days": 90, "api_calls_per_day": 1000}', TRUE, TRUE, TRUE),
(3, 'Teacher Pro Yearly', 'Yearly', 9990.00, 'INR', 17, 365, '{"max_students": 100, "max_courses_created": 10, "analytics_retention_days": 90, "api_calls_per_day": 1000}', FALSE, FALSE, TRUE),
(4, 'Institution Basic', 'Yearly', 99999.00, 'INR', 0, 365, '{"max_users": 1000, "max_courses": 100, "storage_gb": 500, "api_calls_per_day": 10000}', TRUE, FALSE, TRUE),
(4, 'Institution Enterprise', 'Yearly', 199999.00, 'INR', 0, 365, '{"max_users": 9999, "max_courses": 999, "storage_gb": 2000, "api_calls_per_day": 50000}', FALSE, TRUE, TRUE);

-- Insert sample user subscription (for testing)
INSERT INTO user_subscriptions (user_id, user_type, plan_id, start_date, end_date, status) VALUES
(1, 'student', 1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active'),
(2, 'student', 3, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active'),
(1, 'teacher', 5, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active');

-- Create indexes for better performance
CREATE INDEX idx_pricing_products_code ON pricing_products(code);
CREATE INDEX idx_pricing_products_audience ON pricing_products(audience_role);
CREATE INDEX idx_pricing_plans_product ON pricing_plans(product_id);
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id, user_type);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

COMMIT;