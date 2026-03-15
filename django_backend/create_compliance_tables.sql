-- Create compliance tables manually
CREATE TABLE IF NOT EXISTS compliance_compliancerule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_compliancelog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    action VARCHAR(200) NOT NULL,
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rule_id) REFERENCES compliance_compliancerule(id)
);

-- Insert sample rule
INSERT INTO compliance_compliancerule (name, description, is_active) 
VALUES ('Privacy Policy Acceptance', 'Students must accept privacy policy before using platform', 1);
