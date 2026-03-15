-- Grievance Management Tables

CREATE TABLE grievance_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(20) UNIQUE NOT NULL,
    complainant_id INT NOT NULL,
    complainant_type VARCHAR(10) NOT NULL,
    respondent_id INT NULL,
    respondent_type VARCHAR(10) NULL,
    grievance_type VARCHAR(20) NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'submitted',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATETIME NULL,
    assigned_investigator INT NULL,
    investigation_notes TEXT,
    resolution_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    registered_at DATETIME NULL,
    investigation_started_at DATETIME NULL,
    resolved_at DATETIME NULL,
    closed_at DATETIME NULL,
    INDEX idx_complainant (complainant_id, complainant_type),
    INDEX idx_status (status),
    INDEX idx_case_id (case_id)
);

CREATE TABLE grievance_evidence (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_by INT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES grievance_cases(id) ON DELETE CASCADE,
    INDEX idx_case (case_id)
);

CREATE TABLE grievance_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    performed_by INT NOT NULL,
    performed_by_type VARCHAR(10) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES grievance_cases(id) ON DELETE CASCADE,
    INDEX idx_case_timeline (case_id, timestamp)
);

CREATE TABLE grievance_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    recipient_id INT NOT NULL,
    recipient_type VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES grievance_cases(id) ON DELETE CASCADE,
    INDEX idx_recipient (recipient_id, recipient_type, is_read)
);