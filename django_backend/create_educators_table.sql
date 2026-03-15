CREATE TABLE IF NOT EXISTS `educators` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `teacher_id` varchar(20) NOT NULL UNIQUE,
    `name` varchar(255) NOT NULL,
    `email` varchar(254) NOT NULL UNIQUE,
    `mobile` varchar(15) NOT NULL UNIQUE,
    `password_hash` varchar(255) NOT NULL,
    `subject` varchar(100) DEFAULT NULL,
    `qualification` varchar(100) DEFAULT NULL,
    `experience_years` int(11) NOT NULL DEFAULT 0,
    `profile_picture` longtext DEFAULT '',
    `profile_completed` tinyint(1) NOT NULL DEFAULT 0,
    `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `teacher_id` (`teacher_id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;