CREATE TABLE IF NOT EXISTS data_exports (
    id int AUTO_INCREMENT PRIMARY KEY,
    student_id int NOT NULL,
    export_format varchar(10) DEFAULT 'pdf',
    file_path varchar(500) DEFAULT '',
    status varchar(20) DEFAULT 'pending',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    expires_at datetime DEFAULT (CURRENT_TIMESTAMP + INTERVAL 7 DAY)
);