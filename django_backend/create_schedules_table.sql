USE eduyata_db;

CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_datetime DATETIME NOT NULL,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('Assessment', 'Course', 'Maintenance', 'General')),
    assigned_to VARCHAR(20) NOT NULL CHECK (assigned_to IN ('Admin team', 'Faculty', 'Students', 'Everyone')),
    reminder_1_day BOOLEAN DEFAULT FALSE,
    reminder_1_hour BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);