-- Create data_exports table for PDF export functionality
CREATE TABLE IF NOT EXISTS `data_exports` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `exported_by` int(11) NOT NULL,
    `export_type` varchar(50) NOT NULL,
    `data_types` json DEFAULT NULL,
    `filters` json DEFAULT NULL,
    `record_count` int(11) DEFAULT NULL,
    `file_hash` varchar(64) DEFAULT NULL,
    `retention_period` int(11) DEFAULT NULL,
    `purpose` varchar(200) NOT NULL,
    `ip_address` varchar(45) NOT NULL,
    `timestamp` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_exported_by_timestamp` (`exported_by`, `timestamp`),
    KEY `idx_export_type` (`export_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;