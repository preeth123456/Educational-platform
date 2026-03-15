-- Eduyata Database Backup
-- Created: 2026-01-28 17:39:31.961740
--
USE `eduyata_db`;

-- Table structure for account_lockout
CREATE TABLE `account_lockout` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `user_type` enum('student','teacher','admin') DEFAULT 'student',
  `failed_attempts` int(11) DEFAULT 0,
  `lockout_until` timestamp NULL DEFAULT NULL,
  `last_failed_attempt` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_lockout` (`user_id`,`user_type`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_lockout_until` (`lockout_until`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for account_lockout
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (1, '11', 'student', 3, 2026-01-21 15:07:51, 2026-01-21 15:05:51, 2026-01-21 12:18:41, 2026-01-21 15:05:51);
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (2, '9', 'student', 3, 2026-01-21 12:46:50, 2026-01-21 12:44:50, 2026-01-21 12:44:37, 2026-01-21 12:44:50);
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (6, '6', 'student', 3, 2026-01-21 15:18:59, 2026-01-21 15:16:59, 2026-01-21 14:51:06, 2026-01-21 15:16:59);
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (15, '0', 'student', 3, 2026-01-21 15:41:43, 2026-01-21 15:39:43, 2026-01-21 15:39:40, 2026-01-21 15:39:43);
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (18, '19', 'student', 3, 2026-01-21 15:56:19, 2026-01-21 15:54:19, 2026-01-21 15:54:12, 2026-01-21 15:54:19);
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (21, '17', 'student', 0, NULL, NULL, 2026-01-21 15:54:35, 2026-01-21 15:54:35);
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (22, '8', 'student', 3, 2026-01-21 16:37:28, 2026-01-21 16:35:28, 2026-01-21 16:34:26, 2026-01-21 16:35:28);
INSERT INTO `account_lockout` (`id`, `user_id`, `user_type`, `failed_attempts`, `lockout_until`, `last_failed_attempt`, `created_at`, `updated_at`) VALUES (25, '18', 'student', 0, NULL, NULL, 2026-01-21 16:36:00, 2026-01-21 16:36:00);

-- Table structure for account_lockouts
CREATE TABLE `account_lockouts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(20) NOT NULL,
  `locked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unlock_at` timestamp NULL DEFAULT NULL,
  `failed_attempts` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for account_lockouts
INSERT INTO `account_lockouts` (`id`, `user_id`, `user_type`, `locked_at`, `unlock_at`, `failed_attempts`, `is_active`) VALUES (1, 1, 'student', 2026-01-22 17:45:45, 2026-01-22 18:00:45, 3, 1);
INSERT INTO `account_lockouts` (`id`, `user_id`, `user_type`, `locked_at`, `unlock_at`, `failed_attempts`, `is_active`) VALUES (2, 4, 'student', 2026-01-22 17:50:31, 2026-01-22 18:05:31, 3, 1);

-- Table structure for active_user_contexts
CREATE TABLE `active_user_contexts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(10) NOT NULL,
  `current_context_id` int(11) NOT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `switched_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_active_user` (`user_id`,`user_type`),
  KEY `current_context_id` (`current_context_id`),
  KEY `idx_session_token` (`session_token`),
  CONSTRAINT `active_user_contexts_ibfk_1` FOREIGN KEY (`current_context_id`) REFERENCES `user_contexts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for active_user_contexts
INSERT INTO `active_user_contexts` (`id`, `user_id`, `user_type`, `current_context_id`, `session_token`, `switched_at`) VALUES (1, 26, 'student', 1, 'fSOEiPaarblgJwQP5maOFUcjE6H3iy9RzTK326fJE4Q', 2026-01-21 09:24:12);
INSERT INTO `active_user_contexts` (`id`, `user_id`, `user_type`, `current_context_id`, `session_token`, `switched_at`) VALUES (2, 1, 'admin', 2, '', 2026-01-23 05:20:22);
INSERT INTO `active_user_contexts` (`id`, `user_id`, `user_type`, `current_context_id`, `session_token`, `switched_at`) VALUES (3, 5, 'student', 4, '6T375ksgqPeLQSxi3uNkXDajglQbMaC9AFTrTbB2lLQ', 2026-01-22 10:17:29);
INSERT INTO `active_user_contexts` (`id`, `user_id`, `user_type`, `current_context_id`, `session_token`, `switched_at`) VALUES (4, 10, 'student', 5, '7BZfhqZ9_uEL8QeZ9nHK_jS8XKbZzrnmZYMpSO166iA', 2026-01-22 12:18:19);
INSERT INTO `active_user_contexts` (`id`, `user_id`, `user_type`, `current_context_id`, `session_token`, `switched_at`) VALUES (5, 3, 'teacher', 6, 'YoPD9QZigEG5C6Ao1mA0VI0fnhhTKuiN20va6auEfRQ', 2026-01-28 07:47:38);
INSERT INTO `active_user_contexts` (`id`, `user_id`, `user_type`, `current_context_id`, `session_token`, `switched_at`) VALUES (6, 1, 'teacher', 9, 'CrPkD87hS7efQ3SuRpeoEnCXw5ilo_YudF84qBdaxrQ', 2026-01-28 09:47:19);

-- Table structure for admin_announcements
CREATE TABLE `admin_announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `target_audience` enum('students','teachers','all') NOT NULL DEFAULT 'all',
  `sent_by` varchar(100) DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('sent','sending','failed') DEFAULT 'sent',
  `recipients_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `integration_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_target_audience` (`target_audience`),
  KEY `idx_sent_at` (`sent_at`),
  KEY `idx_status` (`status`),
  KEY `idx_integration` (`integration_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for admin_announcements
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (1, 'Welcome to EduYata', 'Welcome to our learning platform! We hope you have a great learning experience.', 'all', 'Admin', 2025-11-17 14:51:31, 'sent', 150, 2025-11-17 14:51:31, NULL, 2025-11-17 14:51:31);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (2, 'Holiday Announcement', 'School will be closed for Diwali holidays from November 20-25. Classes will resume on November 26.', 'all', 'Admin', 2025-11-17 14:51:31, 'sent', 150, 2025-11-17 14:51:31, NULL, 2025-11-17 14:51:31);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (3, 'Exam Reminder', 'Final examinations will begin next week. Please check the schedule in your dashboard.', 'students', 'Admin', 2025-11-17 14:51:31, 'sent', 120, 2025-11-17 14:51:31, NULL, 2025-11-17 14:51:31);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (4, 'Exam Reminder', 'next week exams', 'students', 'Admin', 2025-11-17 14:53:45, 'failed', 0, 2025-11-17 14:53:45, NULL, 2025-11-17 14:53:45);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (5, 'exam', 'ready to exams', 'students', 'Admin', 2025-11-18 10:50:54, 'sent', 23, 2025-11-18 10:50:54, NULL, 2025-11-18 10:50:54);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (6, 'Exam ', 'next week', 'students', 'Admin', 2025-11-18 11:12:10, 'sent', 23, 2025-11-18 11:12:10, NULL, 2025-11-18 11:12:10);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (7, 'Holiday', 'Next Monday Holiday', 'all', 'Admin', 2025-11-18 11:26:35, 'sent', 26, 2025-11-18 11:26:35, NULL, 2025-11-18 11:26:39);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (8, 'Holiday', 'Next week Hoilday', 'all', 'Admin', 2025-11-18 12:06:51, 'sent', 26, 2025-11-18 12:06:51, NULL, 2025-11-18 12:06:55);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (9, 'Exam', 'next week', 'all', 'Admin', 2025-11-18 12:25:13, 'sent', 26, 2025-11-18 12:25:13, NULL, 2025-11-18 12:25:16);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (10, 'hoilday', 'enjoy', 'teachers', 'Admin', 2025-11-18 12:30:04, 'sent', 3, 2025-11-18 12:30:04, NULL, 2025-11-18 12:30:17);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (11, 'hoilday', 'work on hoildays', 'teachers', 'Admin', 2025-11-18 12:33:56, 'sent', 3, 2025-11-18 12:33:56, NULL, 2025-11-18 12:34:05);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (12, 'send Announcement Title ', 'send message', 'all', 'Admin', 2025-12-23 10:27:17, 'sent', 26, 2025-12-23 10:27:17, NULL, 2025-12-23 10:27:28);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (13, 'send', 'send', 'all', 'Admin', 2025-12-23 11:21:47, 'sent', 26, 2025-12-23 11:21:47, NULL, 2025-12-23 11:22:00);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (14, 'holiday', 'meet', 'all', 'Admin', 2025-12-23 14:42:22, 'sent', 26, 2025-12-23 14:42:22, NULL, 2025-12-23 14:42:33);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (15, 'exen', 'meet', 'all', 'Admin', 2025-12-23 16:58:02, 'sent', 26, 2025-12-23 16:58:02, NULL, 2025-12-23 16:58:15);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (16, 'exam', 'send', 'all', 'Admin', 2025-12-23 17:54:03, 'sent', 23, 2025-12-23 17:54:03, NULL, 2025-12-23 17:54:03);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (17, 'exam', 'good', 'all', 'Admin', 2025-12-23 17:56:07, 'sent', 23, 2025-12-23 17:56:07, NULL, 2025-12-23 17:56:28);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (18, 'exam', 'good', 'all', 'Admin', 2025-12-24 10:38:24, 'sent', 26, 2025-12-24 10:38:24, NULL, 2025-12-24 10:38:34);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (19, 'urgent meeting', 'urgent meeting', 'all', 'Admin', 2026-01-12 13:07:16, 'sent', 26, 2026-01-12 13:07:16, NULL, 2026-01-12 13:07:25);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `integration_id`, `updated_at`) VALUES (20, 'urgent meeting', 'urgent meeting regarding improvement', 'all', 'Admin', 2026-01-12 13:13:32, 'sent', 26, 2026-01-12 13:13:32, NULL, 2026-01-12 13:13:46);

-- Table structure for admin_notifications
CREATE TABLE `admin_notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `notification_type` varchar(50) NOT NULL,
  `teacher_id` varchar(20) DEFAULT NULL,
  `teacher_name` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `webhook_endpoint_id` int(11) DEFAULT NULL,
  `webhook_event_type` varchar(100) DEFAULT NULL,
  `webhook_event_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`webhook_event_data`)),
  `webhook_status` enum('pending','delivered','failed') DEFAULT NULL,
  `webhook_response_code` int(11) DEFAULT NULL,
  `webhook_retry_count` int(11) DEFAULT 0,
  `webhook_delivered_at` timestamp NULL DEFAULT NULL,
  `job_metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`job_metadata`)),
  PRIMARY KEY (`id`),
  KEY `idx_webhook_status` (`webhook_status`),
  KEY `idx_webhook_endpoint` (`webhook_endpoint_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for admin_notifications
INSERT INTO `admin_notifications` (`id`, `title`, `message`, `notification_type`, `teacher_id`, `teacher_name`, `is_read`, `created_at`, `webhook_endpoint_id`, `webhook_event_type`, `webhook_event_data`, `webhook_status`, `webhook_response_code`, `webhook_retry_count`, `webhook_delivered_at`, `job_metadata`) VALUES (1, 'New Teacher Registration', 'A new teacher has registered and is awaiting approval', 'teacher_registration', NULL, 'Sample Teacher', 0, '0000-00-00 00:00:00.000000', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);
INSERT INTO `admin_notifications` (`id`, `title`, `message`, `notification_type`, `teacher_id`, `teacher_name`, `is_read`, `created_at`, `webhook_endpoint_id`, `webhook_event_type`, `webhook_event_data`, `webhook_status`, `webhook_response_code`, `webhook_retry_count`, `webhook_delivered_at`, `job_metadata`) VALUES (2, 'System Update', 'System maintenance completed successfully', 'system', NULL, NULL, 0, '0000-00-00 00:00:00.000000', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);
INSERT INTO `admin_notifications` (`id`, `title`, `message`, `notification_type`, `teacher_id`, `teacher_name`, `is_read`, `created_at`, `webhook_endpoint_id`, `webhook_event_type`, `webhook_event_data`, `webhook_status`, `webhook_response_code`, `webhook_retry_count`, `webhook_delivered_at`, `job_metadata`) VALUES (3, 'Webhook: webhook.test', 'HTTP 403: <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style global>body{font-family:Arial,Helvetica,sans-serif}.container{align-items:center;display:flex;flex', 'webhook', NULL, NULL, 0, 2026-01-22 12:09:06.721745, 1, 'webhook.test', '{"message": "Test webhook from Eduyata", "endpoint_name": "chatgpt", "timestamp": "2026-01-22T12:09:06.720610"}', 'failed', 403, 0, NULL, NULL);

-- Table structure for admins
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL,
  `assigned_area` varchar(500) DEFAULT NULL,
  `joined_date` datetime(6) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for admins
INSERT INTO `admins` (`id`, `name`, `email`, `password`, `role`, `status`, `assigned_area`, `joined_date`, `last_login`, `created_at`, `updated_at`) VALUES (1, 'chaithra', 'chaithrapoojary777@gmail.com', 'admin809', 'Teacher Admin', 'Active', '', 2026-01-22 12:18:10.780171, NULL, 2026-01-22 12:18:10.780189, 2026-01-22 12:18:10.780193);

-- Table structure for anonymized_data
CREATE TABLE `anonymized_data` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `original_student_id` int(11) NOT NULL,
  `anonymized_id` varchar(50) NOT NULL,
  `data_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data_snapshot`)),
  `anonymized_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `anonymized_id` (`anonymized_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for api_keys
CREATE TABLE `api_keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_value` varchar(64) NOT NULL,
  `name` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `rate_limit_per_hour` int(11) DEFAULT 1000,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `request_count` int(11) DEFAULT 0,
  `allowed_ips` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `oauth_provider` varchar(50) DEFAULT NULL,
  `oauth_client_id` varchar(255) DEFAULT NULL,
  `oauth_redirect_uri` varchar(500) DEFAULT NULL,
  `oauth_scopes` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_key_value` (`key_value`),
  KEY `idx_key_value` (`key_value`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_last_used` (`last_used_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for api_keys
INSERT INTO `api_keys` (`id`, `key_value`, `name`, `user_id`, `is_active`, `rate_limit_per_hour`, `last_used_at`, `request_count`, `allowed_ips`, `created_at`, `oauth_provider`, `oauth_client_id`, `oauth_redirect_uri`, `oauth_scopes`) VALUES (1, 'EDU_SVumm_ecndm353yhUkzMcqOTM-ekrhF-GOl8n-xL2MA', 'chaithra', 1, 1, 100, NULL, 0, '', 2026-01-21 17:32:34, NULL, NULL, NULL, NULL);
INSERT INTO `api_keys` (`id`, `key_value`, `name`, `user_id`, `is_active`, `rate_limit_per_hour`, `last_used_at`, `request_count`, `allowed_ips`, `created_at`, `oauth_provider`, `oauth_client_id`, `oauth_redirect_uri`, `oauth_scopes`) VALUES (2, 'EDU_t6iiyWz5HArxgE2eC93JiNaqd1SNC8gM2Y5D7jwoWLA', 'chaithra', 1, 1, 1000, NULL, 0, '', 2026-01-22 12:10:47, NULL, NULL, NULL, NULL);

-- Table structure for audit_logs
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('student','teacher','admin') DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `resource_type` varchar(50) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_timestamp` (`user_id`,`timestamp`),
  KEY `idx_action` (`action`),
  KEY `idx_resource` (`resource_type`,`resource_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for audit_logs
INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES (1, 26, 'student', 'create_success', 'resource', NULL, '{"method": "POST", "path": "/api/auth/bulk_consent/", "status_code": 200}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 2026-01-21 16:00:27);
INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES (2, 26, 'student', 'create_success', 'resource', NULL, '{"method": "POST", "path": "/api/auth/bulk_consent/", "status_code": 200}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 2026-01-21 16:05:28);
INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES (3, 10, 'student', 'access_course_success', 'course', NULL, '{"method": "POST", "path": "/api/courses/mark_notification_read/", "status_code": 200}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 2026-01-23 04:46:27);
INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES (4, 26, 'student', 'access_course_success', 'course', NULL, '{"method": "POST", "path": "/api/courses/mark_notification_read/", "status_code": 200}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 2026-01-28 07:56:00);
INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES (5, 1, 'teacher', 'create_success', 'resource', NULL, '{"method": "POST", "path": "/api/classrooms/create/", "status_code": 200}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 2026-01-28 09:47:47);
INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES (6, 26, 'student', 'create_failed', 'resource', NULL, '{"method": "POST", "path": "/api/classrooms/join/", "status_code": 404}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 2026-01-28 09:49:12);
INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES (7, 26, 'student', 'create_success', 'resource', NULL, '{"method": "POST", "path": "/api/classrooms/join/", "status_code": 200}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 2026-01-28 09:49:37);

-- Table structure for auth_app_enrollment
CREATE TABLE `auth_app_enrollment` (
  `id` bigint(20) NOT NULL,
  `enrollment_date` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for auth_app_student
CREATE TABLE `auth_app_student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `board` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `address` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for auth_group
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for auth_group_permissions
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for auth_permission
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for auth_permission
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (1, 'Can add log entry', 1, 'add_logentry');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (2, 'Can change log entry', 1, 'change_logentry');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (3, 'Can delete log entry', 1, 'delete_logentry');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (4, 'Can view log entry', 1, 'view_logentry');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (5, 'Can add permission', 2, 'add_permission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (6, 'Can change permission', 2, 'change_permission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (7, 'Can delete permission', 2, 'delete_permission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (8, 'Can view permission', 2, 'view_permission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (9, 'Can add group', 3, 'add_group');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (10, 'Can change group', 3, 'change_group');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (11, 'Can delete group', 3, 'delete_group');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (12, 'Can view group', 3, 'view_group');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (13, 'Can add user', 4, 'add_user');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (14, 'Can change user', 4, 'change_user');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (15, 'Can delete user', 4, 'delete_user');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (16, 'Can view user', 4, 'view_user');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (17, 'Can add content type', 5, 'add_contenttype');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (18, 'Can change content type', 5, 'change_contenttype');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (19, 'Can delete content type', 5, 'delete_contenttype');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (20, 'Can view content type', 5, 'view_contenttype');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (21, 'Can add session', 6, 'add_session');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (22, 'Can change session', 6, 'change_session');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (23, 'Can delete session', 6, 'delete_session');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (24, 'Can view session', 6, 'view_session');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (25, 'Can add course', 7, 'add_course');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (26, 'Can change course', 7, 'change_course');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (27, 'Can delete course', 7, 'delete_course');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (28, 'Can view course', 7, 'view_course');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (29, 'Can add student', 8, 'add_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (30, 'Can change student', 8, 'change_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (31, 'Can delete student', 8, 'delete_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (32, 'Can view student', 8, 'view_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (33, 'Can add enrollment', 9, 'add_enrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (34, 'Can change enrollment', 9, 'change_enrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (35, 'Can delete enrollment', 9, 'delete_enrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (36, 'Can view enrollment', 9, 'view_enrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (37, 'Can add teacher', 10, 'add_teacher');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (38, 'Can change teacher', 10, 'change_teacher');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (39, 'Can delete teacher', 10, 'delete_teacher');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (40, 'Can view teacher', 10, 'view_teacher');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (41, 'Can add lesson content', 24, 'add_lessoncontent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (42, 'Can change lesson content', 24, 'change_lessoncontent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (43, 'Can delete lesson content', 24, 'delete_lessoncontent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (44, 'Can view lesson content', 24, 'view_lessoncontent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (45, 'Can add lesson', 25, 'add_lesson');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (46, 'Can change lesson', 25, 'change_lesson');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (47, 'Can delete lesson', 25, 'delete_lesson');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (48, 'Can view lesson', 25, 'view_lesson');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (49, 'Can add chapter', 26, 'add_chapter');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (50, 'Can change chapter', 26, 'change_chapter');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (51, 'Can delete chapter', 26, 'delete_chapter');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (52, 'Can view chapter', 26, 'view_chapter');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (53, 'Can add educator', 27, 'add_educator');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (54, 'Can change educator', 27, 'change_educator');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (55, 'Can delete educator', 27, 'delete_educator');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (56, 'Can view educator', 27, 'view_educator');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (57, 'Can add encryption key', 28, 'add_encryptionkey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (58, 'Can change encryption key', 28, 'change_encryptionkey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (59, 'Can delete encryption key', 28, 'delete_encryptionkey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (60, 'Can view encryption key', 28, 'view_encryptionkey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (61, 'Can add badge', 29, 'add_badge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (62, 'Can change badge', 29, 'change_badge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (63, 'Can delete badge', 29, 'delete_badge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (64, 'Can view badge', 29, 'view_badge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (65, 'Can add badge progress', 30, 'add_badgeprogress');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (66, 'Can change badge progress', 30, 'change_badgeprogress');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (67, 'Can delete badge progress', 30, 'delete_badgeprogress');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (68, 'Can view badge progress', 30, 'view_badgeprogress');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (69, 'Can add skill endorsement', 31, 'add_skillendorsement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (70, 'Can change skill endorsement', 31, 'change_skillendorsement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (71, 'Can delete skill endorsement', 31, 'delete_skillendorsement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (72, 'Can view skill endorsement', 31, 'view_skillendorsement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (73, 'Can add Student Activity', 32, 'add_studentactivity');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (74, 'Can change Student Activity', 32, 'change_studentactivity');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (75, 'Can delete Student Activity', 32, 'delete_studentactivity');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (76, 'Can view Student Activity', 32, 'view_studentactivity');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (77, 'Can add student badge', 33, 'add_studentbadge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (78, 'Can change student badge', 33, 'change_studentbadge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (79, 'Can delete student badge', 33, 'delete_studentbadge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (80, 'Can view student badge', 33, 'view_studentbadge');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (81, 'Can add consent history', 34, 'add_consenthistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (82, 'Can change consent history', 34, 'change_consenthistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (83, 'Can delete consent history', 34, 'delete_consenthistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (84, 'Can view consent history', 34, 'view_consenthistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (85, 'Can add student consent', 35, 'add_studentconsent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (86, 'Can change student consent', 35, 'change_studentconsent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (87, 'Can delete student consent', 35, 'delete_studentconsent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (88, 'Can view student consent', 35, 'view_studentconsent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (89, 'Can add active user context', 36, 'add_activeusercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (90, 'Can change active user context', 36, 'change_activeusercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (91, 'Can delete active user context', 36, 'delete_activeusercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (92, 'Can view active user context', 36, 'view_activeusercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (93, 'Can add context switch log', 37, 'add_contextswitchlog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (94, 'Can change context switch log', 37, 'change_contextswitchlog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (95, 'Can delete context switch log', 37, 'delete_contextswitchlog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (96, 'Can view context switch log', 37, 'view_contextswitchlog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (97, 'Can add user context', 38, 'add_usercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (98, 'Can change user context', 38, 'change_usercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (99, 'Can delete user context', 38, 'delete_usercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (100, 'Can view user context', 38, 'view_usercontext');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (101, 'Can add admin notification', 39, 'add_adminnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (102, 'Can change admin notification', 39, 'change_adminnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (103, 'Can delete admin notification', 39, 'delete_adminnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (104, 'Can view admin notification', 39, 'view_adminnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (105, 'Can add admin email log', 40, 'add_adminemaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (106, 'Can change admin email log', 40, 'change_adminemaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (107, 'Can delete admin email log', 40, 'delete_adminemaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (108, 'Can view admin email log', 40, 'view_adminemaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (109, 'Can add backup history', 41, 'add_backuphistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (110, 'Can change backup history', 41, 'change_backuphistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (111, 'Can delete backup history', 41, 'delete_backuphistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (112, 'Can view backup history', 41, 'view_backuphistory');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (113, 'Can add student', 11, 'add_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (114, 'Can change student', 11, 'change_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (115, 'Can delete student', 11, 'delete_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (116, 'Can view student', 11, 'view_student');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (117, 'Can add teacher email log', 13, 'add_teacheremaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (118, 'Can change teacher email log', 13, 'change_teacheremaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (119, 'Can delete teacher email log', 13, 'delete_teacheremaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (120, 'Can view teacher email log', 13, 'view_teacheremaillog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (121, 'Can add admin', 42, 'add_admin');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (122, 'Can change admin', 42, 'change_admin');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (123, 'Can delete admin', 42, 'delete_admin');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (124, 'Can view admin', 42, 'view_admin');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (125, 'Can add collaboration group', 43, 'add_collaborationgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (126, 'Can change collaboration group', 43, 'change_collaborationgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (127, 'Can delete collaboration group', 43, 'delete_collaborationgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (128, 'Can view collaboration group', 43, 'view_collaborationgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (129, 'Can add discussion', 44, 'add_discussion');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (130, 'Can change discussion', 44, 'change_discussion');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (131, 'Can delete discussion', 44, 'delete_discussion');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (132, 'Can view discussion', 44, 'view_discussion');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (133, 'Can add shared document', 45, 'add_shareddocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (134, 'Can change shared document', 45, 'change_shareddocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (135, 'Can delete shared document', 45, 'delete_shareddocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (136, 'Can view shared document', 45, 'view_shareddocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (137, 'Can add discussion post', 46, 'add_discussionpost');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (138, 'Can change discussion post', 46, 'change_discussionpost');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (139, 'Can delete discussion post', 46, 'delete_discussionpost');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (140, 'Can view discussion post', 46, 'view_discussionpost');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (141, 'Can add collaboration points', 47, 'add_collaborationpoints');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (142, 'Can change collaboration points', 47, 'change_collaborationpoints');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (143, 'Can delete collaboration points', 47, 'delete_collaborationpoints');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (144, 'Can view collaboration points', 47, 'view_collaborationpoints');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (145, 'Can add chat message', 48, 'add_chatmessage');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (146, 'Can change chat message', 48, 'change_chatmessage');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (147, 'Can delete chat message', 48, 'delete_chatmessage');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (148, 'Can view chat message', 48, 'view_chatmessage');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (149, 'Can add project', 49, 'add_project');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (150, 'Can change project', 49, 'change_project');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (151, 'Can delete project', 49, 'delete_project');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (152, 'Can view project', 49, 'view_project');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (153, 'Can add project group', 50, 'add_projectgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (154, 'Can change project group', 50, 'change_projectgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (155, 'Can delete project group', 50, 'delete_projectgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (156, 'Can view project group', 50, 'view_projectgroup');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (157, 'Can add project submission', 51, 'add_projectsubmission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (158, 'Can change project submission', 51, 'change_projectsubmission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (159, 'Can delete project submission', 51, 'delete_projectsubmission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (160, 'Can view project submission', 51, 'view_projectsubmission');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (161, 'Can add project document', 52, 'add_projectdocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (162, 'Can change project document', 52, 'change_projectdocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (163, 'Can delete project document', 52, 'delete_projectdocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (164, 'Can view project document', 52, 'view_projectdocument');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (165, 'Can add project group member', 53, 'add_projectgroupmember');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (166, 'Can change project group member', 53, 'change_projectgroupmember');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (167, 'Can delete project group member', 53, 'delete_projectgroupmember');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (168, 'Can view project group member', 53, 'view_projectgroupmember');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (169, 'Can add support ticket', 54, 'add_supportticket');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (170, 'Can change support ticket', 54, 'change_supportticket');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (171, 'Can delete support ticket', 54, 'delete_supportticket');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (172, 'Can view support ticket', 54, 'view_supportticket');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (173, 'Can add ticket response', 55, 'add_ticketresponse');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (174, 'Can change ticket response', 55, 'change_ticketresponse');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (175, 'Can delete ticket response', 55, 'delete_ticketresponse');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (176, 'Can view ticket response', 55, 'view_ticketresponse');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (177, 'Can add ticket attachment', 56, 'add_ticketattachment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (178, 'Can change ticket attachment', 56, 'change_ticketattachment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (179, 'Can delete ticket attachment', 56, 'delete_ticketattachment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (180, 'Can view ticket attachment', 56, 'view_ticketattachment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (181, 'Can add grievance case', 57, 'add_grievancecase');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (182, 'Can change grievance case', 57, 'change_grievancecase');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (183, 'Can delete grievance case', 57, 'delete_grievancecase');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (184, 'Can view grievance case', 57, 'view_grievancecase');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (185, 'Can add grievance timeline', 58, 'add_grievancetimeline');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (186, 'Can change grievance timeline', 58, 'change_grievancetimeline');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (187, 'Can delete grievance timeline', 58, 'delete_grievancetimeline');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (188, 'Can view grievance timeline', 58, 'view_grievancetimeline');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (189, 'Can add grievance notification', 59, 'add_grievancenotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (190, 'Can change grievance notification', 59, 'change_grievancenotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (191, 'Can delete grievance notification', 59, 'delete_grievancenotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (192, 'Can view grievance notification', 59, 'view_grievancenotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (193, 'Can add grievance evidence', 60, 'add_grievanceevidence');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (194, 'Can change grievance evidence', 60, 'change_grievanceevidence');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (195, 'Can delete grievance evidence', 60, 'delete_grievanceevidence');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (196, 'Can view grievance evidence', 60, 'view_grievanceevidence');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (197, 'Can add virtual classroom', 61, 'add_virtualclassroom');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (198, 'Can change virtual classroom', 61, 'change_virtualclassroom');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (199, 'Can delete virtual classroom', 61, 'delete_virtualclassroom');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (200, 'Can view virtual classroom', 61, 'view_virtualclassroom');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (201, 'Can add classroom enrollment', 62, 'add_classroomenrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (202, 'Can change classroom enrollment', 62, 'change_classroomenrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (203, 'Can delete classroom enrollment', 62, 'delete_classroomenrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (204, 'Can view classroom enrollment', 62, 'view_classroomenrollment');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (205, 'Can add classroom session', 63, 'add_classroomsession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (206, 'Can change classroom session', 63, 'change_classroomsession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (207, 'Can delete classroom session', 63, 'delete_classroomsession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (208, 'Can view classroom session', 63, 'view_classroomsession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (209, 'Can add classroom announcement', 64, 'add_classroomannouncement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (210, 'Can change classroom announcement', 64, 'change_classroomannouncement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (211, 'Can delete classroom announcement', 64, 'delete_classroomannouncement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (212, 'Can view classroom announcement', 64, 'view_classroomannouncement');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (213, 'Can add classroom resource', 65, 'add_classroomresource');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (214, 'Can change classroom resource', 65, 'change_classroomresource');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (215, 'Can delete classroom resource', 65, 'delete_classroomresource');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (216, 'Can view classroom resource', 65, 'view_classroomresource');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (217, 'Can add session event', 66, 'add_sessionevent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (218, 'Can change session event', 66, 'change_sessionevent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (219, 'Can delete session event', 66, 'delete_sessionevent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (220, 'Can view session event', 66, 'view_sessionevent');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (221, 'Can add session policy', 67, 'add_sessionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (222, 'Can change session policy', 67, 'change_sessionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (223, 'Can delete session policy', 67, 'delete_sessionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (224, 'Can view session policy', 67, 'view_sessionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (225, 'Can add user device', 68, 'add_userdevice');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (226, 'Can change user device', 68, 'change_userdevice');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (227, 'Can delete user device', 68, 'delete_userdevice');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (228, 'Can view user device', 68, 'view_userdevice');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (229, 'Can add user session', 69, 'add_usersession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (230, 'Can change user session', 69, 'change_usersession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (231, 'Can delete user session', 69, 'delete_usersession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (232, 'Can view user session', 69, 'view_usersession');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (233, 'Can add API Key', 70, 'add_apikey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (234, 'Can change API Key', 70, 'change_apikey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (235, 'Can delete API Key', 70, 'delete_apikey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (236, 'Can view API Key', 70, 'view_apikey');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (237, 'Can add Webhook Endpoint', 71, 'add_webhookendpoint');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (238, 'Can change Webhook Endpoint', 71, 'change_webhookendpoint');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (239, 'Can delete Webhook Endpoint', 71, 'delete_webhookendpoint');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (240, 'Can view Webhook Endpoint', 71, 'view_webhookendpoint');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (241, 'Can add Integration', 72, 'add_integration');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (242, 'Can change Integration', 72, 'change_integration');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (243, 'Can delete Integration', 72, 'delete_integration');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (244, 'Can view Integration', 72, 'view_integration');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (245, 'Can add Platform Configuration', 73, 'add_platformconfig');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (246, 'Can change Platform Configuration', 73, 'change_platformconfig');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (247, 'Can delete Platform Configuration', 73, 'delete_platformconfig');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (248, 'Can view Platform Configuration', 73, 'view_platformconfig');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (249, 'Can add Configuration Change Log', 74, 'add_configchangelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (250, 'Can change Configuration Change Log', 74, 'change_configchangelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (251, 'Can delete Configuration Change Log', 74, 'delete_configchangelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (252, 'Can view Configuration Change Log', 74, 'view_configchangelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (253, 'Can add compliance rule', 75, 'add_compliancerule');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (254, 'Can change compliance rule', 75, 'change_compliancerule');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (255, 'Can delete compliance rule', 75, 'delete_compliancerule');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (256, 'Can view compliance rule', 75, 'view_compliancerule');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (257, 'Can add compliance log', 76, 'add_compliancelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (258, 'Can change compliance log', 76, 'change_compliancelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (259, 'Can delete compliance log', 76, 'delete_compliancelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (260, 'Can view compliance log', 76, 'view_compliancelog');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (261, 'Can add account lock', 77, 'add_accountlock');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (262, 'Can change account lock', 77, 'change_accountlock');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (263, 'Can delete account lock', 77, 'delete_accountlock');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (264, 'Can view account lock', 77, 'view_accountlock');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (265, 'Can add login attempt', 78, 'add_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (266, 'Can change login attempt', 78, 'change_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (267, 'Can delete login attempt', 78, 'delete_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (268, 'Can view login attempt', 78, 'view_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (269, 'Can add security incident', 79, 'add_securityincident');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (270, 'Can change security incident', 79, 'change_securityincident');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (271, 'Can delete security incident', 79, 'delete_securityincident');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (272, 'Can view security incident', 79, 'view_securityincident');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (273, 'Can add breach report', 80, 'add_breachreport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (274, 'Can change breach report', 80, 'change_breachreport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (275, 'Can delete breach report', 80, 'delete_breachreport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (276, 'Can view breach report', 80, 'view_breachreport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (277, 'Can add breach notification', 81, 'add_breachnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (278, 'Can change breach notification', 81, 'change_breachnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (279, 'Can delete breach notification', 81, 'delete_breachnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (280, 'Can view breach notification', 81, 'view_breachnotification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (281, 'Can add system metric', 82, 'add_systemmetric');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (282, 'Can change system metric', 82, 'change_systemmetric');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (283, 'Can delete system metric', 82, 'delete_systemmetric');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (284, 'Can view system metric', 82, 'view_systemmetric');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (285, 'Can add fraud score', 83, 'add_fraudscore');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (286, 'Can change fraud score', 83, 'change_fraudscore');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (287, 'Can delete fraud score', 83, 'delete_fraudscore');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (288, 'Can view fraud score', 83, 'view_fraudscore');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (289, 'Can add login attempt', 84, 'add_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (290, 'Can change login attempt', 84, 'change_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (291, 'Can delete login attempt', 84, 'delete_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (292, 'Can view login attempt', 84, 'view_loginattempt');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (293, 'Can add account lockout', 85, 'add_accountlockout');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (294, 'Can change account lockout', 85, 'change_accountlockout');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (295, 'Can delete account lockout', 85, 'delete_accountlockout');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (296, 'Can view account lockout', 85, 'view_accountlockout');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (297, 'Can add anonymized data', 86, 'add_anonymizeddata');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (298, 'Can change anonymized data', 86, 'change_anonymizeddata');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (299, 'Can delete anonymized data', 86, 'delete_anonymizeddata');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (300, 'Can view anonymized data', 86, 'view_anonymizeddata');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (301, 'Can add data retention policy', 87, 'add_dataretentionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (302, 'Can change data retention policy', 87, 'change_dataretentionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (303, 'Can delete data retention policy', 87, 'delete_dataretentionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (304, 'Can view data retention policy', 87, 'view_dataretentionpolicy');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (305, 'Can add deletion request', 88, 'add_deletionrequest');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (306, 'Can change deletion request', 88, 'change_deletionrequest');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (307, 'Can delete deletion request', 88, 'delete_deletionrequest');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (308, 'Can view deletion request', 88, 'view_deletionrequest');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (309, 'Can add data export', 89, 'add_dataexport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (310, 'Can change data export', 89, 'change_dataexport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (311, 'Can delete data export', 89, 'delete_dataexport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (312, 'Can view data export', 89, 'view_dataexport');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (313, 'Can add social account', 90, 'add_socialaccount');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (314, 'Can change social account', 90, 'change_socialaccount');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (315, 'Can delete social account', 90, 'delete_socialaccount');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (316, 'Can view social account', 90, 'view_socialaccount');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (317, 'Can add notification', 91, 'add_notification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (318, 'Can change notification', 91, 'change_notification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (319, 'Can delete notification', 91, 'delete_notification');
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES (320, 'Can view notification', 91, 'view_notification');

-- Table structure for auth_user
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for auth_user
INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES (1, '', NULL, 1, 'admin@eduyata.com', 'Admin', 'User', 'admin@eduyata.com', 1, 1, 2026-01-21 17:26:50.967691);

-- Table structure for auth_user_groups
CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for auth_user_user_permissions
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for backup_history
CREATE TABLE `backup_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `file_size` bigint(20) DEFAULT NULL,
  `status` enum('success','failed') DEFAULT 'success',
  `created_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`),
  KEY `idx_created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for backup_history
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (1, 'eduyata_db_backup_20241118_143000.sql', 2025-11-18 16:50:20, 2457600, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (2, 'eduyata_db_backup_20241118_020000.sql', 2025-11-18 16:50:20, 2359296, 'success', 'system');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (3, 'eduyata_db_backup_20241117_143000.sql', 2025-11-18 16:50:20, 2516582, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (4, 'eduyata_db_backup_20241117_020000.sql', 2025-11-18 16:50:20, 2228224, 'success', 'system');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (5, 'eduyata_db_backup_20241116_020000.sql', 2025-11-18 16:50:20, 2113536, 'failed', 'system');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (6, 'eduyata_db_backup_20241115_143000.sql', 2025-11-18 16:50:20, 2387968, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (7, 'eduyata_db_backup_20251118_165307.sql', 2025-11-18 11:23:08, 385009, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (8, 'eduyata_db_backup_20251118_165743.sql', 2025-11-18 11:27:43, 385211, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (9, 'backup_20251223_124924.sql', 2025-12-23 07:19:24, 0, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (10, 'backup_20251223_144654.sql', 2025-12-23 09:16:54, 0, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (11, 'backup_20260112_131711.sql', 2026-01-12 13:17:11, 89, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (12, 'backup_20260122_122408.sql', 2026-01-22 12:24:08, 89, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (13, 'eduyata_db_backup_20260128_160651.sql', 2026-01-28 10:36:51, 638443, 'success', 'test');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (14, 'eduyata_db_backup_20260128_160754.sql', 2026-01-28 10:37:55, 638645, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (15, 'eduyata_db_backup_20260128_173931.sql', 2026-01-28 12:09:31, 638848, 'success', 'scheduler');

-- Table structure for blocked_entities
CREATE TABLE `blocked_entities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` enum('user','ip') NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `reason` text DEFAULT NULL,
  `blocked_by` varchar(50) DEFAULT NULL,
  `blocked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_blocked_entity` (`entity_type`,`entity_id`),
  KEY `idx_entity_type` (`entity_type`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for blocked_entities
INSERT INTO `blocked_entities` (`id`, `entity_type`, `entity_id`, `reason`, `blocked_by`, `blocked_at`, `expires_at`, `is_active`) VALUES (1, 'user', 'STU654321', 'SQL Injection Attempt', 'ADMIN001', 2026-01-19 12:33:04, 2026-01-26 12:33:04, 1);
INSERT INTO `blocked_entities` (`id`, `entity_type`, `entity_id`, `reason`, `blocked_by`, `blocked_at`, `expires_at`, `is_active`) VALUES (2, 'ip', '203.0.113.45', 'Multiple Security Violations', 'ADMIN001', 2026-01-19 12:33:04, 2026-02-18 12:33:04, 1);
INSERT INTO `blocked_entities` (`id`, `entity_type`, `entity_id`, `reason`, `blocked_by`, `blocked_at`, `expires_at`, `is_active`) VALUES (3, 'user', 'STU20259433', 'High fraud score - Multiple failed login attempts', 'SYSTEM_AUTO', 2026-01-20 16:55:44, 2026-01-21 16:55:44, 1);
INSERT INTO `blocked_entities` (`id`, `entity_type`, `entity_id`, `reason`, `blocked_by`, `blocked_at`, `expires_at`, `is_active`) VALUES (4, 'user', 'S10310967', 'High fraud score - Multiple failed login attempts', 'SYSTEM_AUTO', 2026-01-20 17:57:27, 2026-01-21 17:57:27, 1);

-- Table structure for boards
CREATE TABLE `boards` (
  `board_id` int(11) NOT NULL,
  `board_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for boards
INSERT INTO `boards` (`board_id`, `board_name`) VALUES (1, 'CBSE');
INSERT INTO `boards` (`board_id`, `board_name`) VALUES (2, 'ICSE');
INSERT INTO `boards` (`board_id`, `board_name`) VALUES (3, 'State Board');
INSERT INTO `boards` (`board_id`, `board_name`) VALUES (4, 'NIOS');
INSERT INTO `boards` (`board_id`, `board_name`) VALUES (5, 'IB');
INSERT INTO `boards` (`board_id`, `board_name`) VALUES (6, 'IGCSE');

-- Table structure for breach_notification_breachnotification
CREATE TABLE `breach_notification_breachnotification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `breach_report_id` bigint(20) NOT NULL,
  `recipient_type` varchar(20) NOT NULL,
  `recipient_email` varchar(254) NOT NULL,
  `message_sent` tinyint(1) NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for breach_notification_breachreport
CREATE TABLE `breach_notification_breachreport` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` longtext NOT NULL,
  `data_type` varchar(100) NOT NULL,
  `severity` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `source_board` varchar(50) NOT NULL,
  `source_class` varchar(10) NOT NULL,
  `source_affected_count` int(11) NOT NULL,
  `target_board` varchar(50) NOT NULL,
  `target_class` varchar(10) NOT NULL,
  `target_affected_count` int(11) NOT NULL,
  `total_affected` int(11) NOT NULL,
  `reported_by` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for chapters
CREATE TABLE `chapters` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `chapter_no` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `course_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_chapter` (`course_id`,`chapter_no`),
  KEY `idx_chapters_course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for chapters
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (1, 'Introduction to Chemistry', 1, 2026-01-02 16:21:37, 2026-01-02 16:31:53, 'COURSE0001');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (2, ' Fundamentals of Chemistry', 2, 2026-01-02 16:27:40, 2026-01-02 16:31:53, 'COURSE0001');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (4, ' Introduction to Chemistry', 1, 2026-01-02 17:14:37, 2026-01-02 17:14:37, NULL);
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (5, 'Chapter 1: Introduction to Science', 1, 2026-01-02 17:43:33, 2026-01-02 17:43:33, 'COURSE0003');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (6, 'Vocabulary', 1, 2026-01-03 12:56:34, 2026-01-03 12:56:34, 'COURSE0011');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (7, 'Number System', 1, 2026-01-03 13:06:13, 2026-01-03 15:44:32, 'COURSE0012');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (8, 'Fractions and Decimal', 2, 2026-01-03 14:58:58, 2026-01-03 15:46:12, 'COURSE0012');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (9, 'Algebraic Expressions', 3, 2026-01-03 15:00:40, 2026-01-03 15:46:26, 'COURSE0012');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (10, 'Geometry – Basic Concepts', 4, 2026-01-03 15:01:15, 2026-01-03 15:46:50, 'COURSE0012');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (11, 'Trigonometry', 1, 2026-01-03 17:49:33, 2026-01-03 17:49:33, 'COURSE0013');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (12, 'Probability', 1, 2026-01-05 12:45:27, 2026-01-05 12:45:27, 'COURSE0014');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (13, 'First Day at School (Poem)', 1, 2026-01-12 11:26:15, 2026-01-20 12:47:41, 'COURSE0015');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (14, 'A Smile (Poem)', 2, 2026-01-12 12:45:57, 2026-01-20 12:58:50, 'COURSE0015');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (15, 'grammer', 1, 2026-01-12 12:52:18, 2026-01-12 12:52:18, 'COURSE0017');
INSERT INTO `chapters` (`id`, `title`, `chapter_no`, `created_at`, `updated_at`, `course_id`) VALUES (16, 'Rain (Poem)', 3, 2026-01-20 13:01:10, 2026-01-20 13:01:10, 'COURSE0015');

-- Table structure for class_levels
CREATE TABLE `class_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for class_levels
INSERT INTO `class_levels` (`id`, `name`) VALUES (8, '1');
INSERT INTO `class_levels` (`id`, `name`) VALUES (9, '10');
INSERT INTO `class_levels` (`id`, `name`) VALUES (6, '11');
INSERT INTO `class_levels` (`id`, `name`) VALUES (7, '12');
INSERT INTO `class_levels` (`id`, `name`) VALUES (10, '2');
INSERT INTO `class_levels` (`id`, `name`) VALUES (11, '3');
INSERT INTO `class_levels` (`id`, `name`) VALUES (12, '4');
INSERT INTO `class_levels` (`id`, `name`) VALUES (13, '5');
INSERT INTO `class_levels` (`id`, `name`) VALUES (2, '6');
INSERT INTO `class_levels` (`id`, `name`) VALUES (3, '7');
INSERT INTO `class_levels` (`id`, `name`) VALUES (4, '8');
INSERT INTO `class_levels` (`id`, `name`) VALUES (5, '9');

-- Table structure for classes
CREATE TABLE `classes` (
  `class_id` int(11) NOT NULL,
  `board_id` int(11) DEFAULT NULL,
  `class_name` varchar(50) DEFAULT NULL,
  `level` enum('Primary','Middle','Secondary','Senior Secondary') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for classes
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (1, 1, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (2, 1, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (3, 1, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (4, 1, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (5, 1, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (6, 1, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (7, 1, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (8, 1, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (9, 1, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (10, 1, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (11, 1, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (12, 1, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (13, 2, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (14, 2, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (15, 2, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (16, 2, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (17, 2, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (18, 2, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (19, 2, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (20, 2, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (21, 2, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (22, 2, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (23, 2, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (24, 2, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (25, 3, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (26, 3, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (27, 3, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (28, 3, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (29, 3, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (30, 3, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (31, 3, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (32, 3, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (33, 3, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (34, 3, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (35, 3, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (36, 3, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (37, 4, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (38, 4, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (39, 4, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (40, 4, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (41, 4, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (42, 4, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (43, 4, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (44, 4, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (45, 4, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (46, 4, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (47, 4, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (48, 4, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (49, 5, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (50, 5, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (51, 5, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (52, 5, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (53, 5, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (54, 5, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (55, 5, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (56, 5, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (57, 5, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (58, 5, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (59, 5, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (60, 5, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (61, 6, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (62, 6, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (63, 6, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (64, 6, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (65, 6, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (66, 6, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (67, 6, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (68, 6, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (69, 6, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (70, 6, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (71, 6, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (72, 6, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (73, 1, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (74, 1, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (75, 1, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (76, 1, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (77, 1, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (78, 1, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (79, 1, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (80, 1, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (81, 1, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (82, 1, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (83, 1, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (84, 1, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (85, 2, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (86, 2, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (87, 2, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (88, 2, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (89, 2, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (90, 2, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (91, 2, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (92, 2, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (93, 2, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (94, 2, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (95, 2, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (96, 2, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (97, 3, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (98, 3, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (99, 3, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (100, 3, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (101, 3, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (102, 3, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (103, 3, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (104, 3, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (105, 3, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (106, 3, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (107, 3, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (108, 3, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (109, 4, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (110, 4, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (111, 4, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (112, 4, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (113, 4, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (114, 4, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (115, 4, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (116, 4, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (117, 4, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (118, 4, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (119, 4, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (120, 4, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (121, 5, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (122, 5, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (123, 5, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (124, 5, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (125, 5, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (126, 5, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (127, 5, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (128, 5, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (129, 5, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (130, 5, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (131, 5, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (132, 5, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (133, 6, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (134, 6, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (135, 6, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (136, 6, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (137, 6, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (138, 6, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (139, 6, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (140, 6, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (141, 6, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (142, 6, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (143, 6, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (144, 6, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (145, 1, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (146, 1, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (147, 1, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (148, 1, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (149, 1, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (150, 1, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (151, 1, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (152, 1, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (153, 1, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (154, 1, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (155, 1, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (156, 1, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (157, 2, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (158, 2, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (159, 2, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (160, 2, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (161, 2, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (162, 2, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (163, 2, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (164, 2, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (165, 2, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (166, 2, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (167, 2, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (168, 2, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (169, 3, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (170, 3, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (171, 3, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (172, 3, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (173, 3, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (174, 3, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (175, 3, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (176, 3, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (177, 3, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (178, 3, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (179, 3, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (180, 3, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (181, 4, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (182, 4, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (183, 4, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (184, 4, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (185, 4, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (186, 4, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (187, 4, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (188, 4, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (189, 4, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (190, 4, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (191, 4, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (192, 4, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (193, 5, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (194, 5, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (195, 5, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (196, 5, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (197, 5, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (198, 5, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (199, 5, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (200, 5, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (201, 5, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (202, 5, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (203, 5, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (204, 5, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (205, 6, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (206, 6, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (207, 6, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (208, 6, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (209, 6, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (210, 6, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (211, 6, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (212, 6, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (213, 6, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (214, 6, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (215, 6, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (216, 6, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (217, 1, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (218, 1, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (219, 1, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (220, 1, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (221, 1, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (222, 1, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (223, 1, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (224, 1, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (225, 1, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (226, 1, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (227, 1, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (228, 1, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (229, 2, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (230, 2, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (231, 2, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (232, 2, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (233, 2, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (234, 2, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (235, 2, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (236, 2, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (237, 2, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (238, 2, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (239, 2, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (240, 2, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (241, 3, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (242, 3, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (243, 3, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (244, 3, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (245, 3, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (246, 3, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (247, 3, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (248, 3, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (249, 3, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (250, 3, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (251, 3, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (252, 3, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (253, 4, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (254, 4, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (255, 4, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (256, 4, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (257, 4, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (258, 4, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (259, 4, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (260, 4, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (261, 4, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (262, 4, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (263, 4, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (264, 4, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (265, 5, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (266, 5, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (267, 5, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (268, 5, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (269, 5, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (270, 5, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (271, 5, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (272, 5, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (273, 5, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (274, 5, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (275, 5, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (276, 5, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (277, 6, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (278, 6, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (279, 6, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (280, 6, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (281, 6, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (282, 6, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (283, 6, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (284, 6, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (285, 6, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (286, 6, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (287, 6, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (288, 6, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (289, 1, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (290, 1, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (291, 1, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (292, 1, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (293, 1, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (294, 1, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (295, 1, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (296, 1, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (297, 1, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (298, 1, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (299, 1, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (300, 1, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (301, 2, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (302, 2, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (303, 2, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (304, 2, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (305, 2, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (306, 2, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (307, 2, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (308, 2, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (309, 2, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (310, 2, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (311, 2, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (312, 2, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (313, 3, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (314, 3, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (315, 3, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (316, 3, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (317, 3, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (318, 3, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (319, 3, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (320, 3, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (321, 3, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (322, 3, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (323, 3, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (324, 3, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (325, 4, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (326, 4, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (327, 4, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (328, 4, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (329, 4, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (330, 4, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (331, 4, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (332, 4, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (333, 4, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (334, 4, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (335, 4, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (336, 4, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (337, 5, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (338, 5, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (339, 5, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (340, 5, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (341, 5, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (342, 5, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (343, 5, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (344, 5, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (345, 5, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (346, 5, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (347, 5, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (348, 5, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (349, 6, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (350, 6, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (351, 6, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (352, 6, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (353, 6, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (354, 6, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (355, 6, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (356, 6, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (357, 6, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (358, 6, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (359, 6, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (360, 6, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (361, 1, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (362, 1, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (363, 1, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (364, 1, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (365, 1, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (366, 1, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (367, 1, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (368, 1, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (369, 1, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (370, 1, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (371, 1, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (372, 1, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (373, 2, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (374, 2, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (375, 2, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (376, 2, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (377, 2, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (378, 2, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (379, 2, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (380, 2, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (381, 2, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (382, 2, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (383, 2, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (384, 2, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (385, 3, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (386, 3, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (387, 3, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (388, 3, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (389, 3, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (390, 3, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (391, 3, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (392, 3, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (393, 3, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (394, 3, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (395, 3, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (396, 3, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (397, 4, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (398, 4, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (399, 4, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (400, 4, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (401, 4, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (402, 4, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (403, 4, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (404, 4, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (405, 4, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (406, 4, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (407, 4, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (408, 4, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (409, 5, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (410, 5, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (411, 5, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (412, 5, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (413, 5, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (414, 5, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (415, 5, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (416, 5, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (417, 5, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (418, 5, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (419, 5, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (420, 5, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (421, 6, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (422, 6, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (423, 6, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (424, 6, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (425, 6, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (426, 6, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (427, 6, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (428, 6, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (429, 6, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (430, 6, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (431, 6, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (432, 6, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (433, 1, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (434, 1, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (435, 1, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (436, 1, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (437, 1, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (438, 1, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (439, 1, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (440, 1, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (441, 1, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (442, 1, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (443, 1, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (444, 1, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (445, 2, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (446, 2, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (447, 2, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (448, 2, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (449, 2, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (450, 2, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (451, 2, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (452, 2, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (453, 2, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (454, 2, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (455, 2, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (456, 2, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (457, 3, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (458, 3, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (459, 3, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (460, 3, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (461, 3, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (462, 3, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (463, 3, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (464, 3, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (465, 3, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (466, 3, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (467, 3, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (468, 3, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (469, 4, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (470, 4, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (471, 4, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (472, 4, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (473, 4, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (474, 4, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (475, 4, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (476, 4, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (477, 4, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (478, 4, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (479, 4, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (480, 4, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (481, 5, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (482, 5, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (483, 5, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (484, 5, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (485, 5, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (486, 5, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (487, 5, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (488, 5, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (489, 5, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (490, 5, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (491, 5, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (492, 5, 'Class 12', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (493, 6, 'Class 1', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (494, 6, 'Class 2', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (495, 6, 'Class 3', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (496, 6, 'Class 4', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (497, 6, 'Class 5', 'Primary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (498, 6, 'Class 6', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (499, 6, 'Class 7', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (500, 6, 'Class 8', 'Middle');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (501, 6, 'Class 9', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (502, 6, 'Class 10', 'Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (503, 6, 'Class 11', 'Senior Secondary');
INSERT INTO `classes` (`class_id`, `board_id`, `class_name`, `level`) VALUES (504, 6, 'Class 12', 'Senior Secondary');

-- Table structure for classroom_announcements
CREATE TABLE `classroom_announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_urgent` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `classroom_announcements_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `virtual_classrooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Table structure for classroom_enrollments
CREATE TABLE `classroom_enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `enrolled_at` timestamp NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `last_accessed` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`classroom_id`,`student_id`),
  KEY `idx_student_id` (`student_id`),
  CONSTRAINT `classroom_enrollments_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `virtual_classrooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Data for classroom_enrollments
INSERT INTO `classroom_enrollments` (`id`, `classroom_id`, `student_id`, `enrolled_at`, `is_active`, `last_accessed`) VALUES (1, 1, 7, 2026-01-06 14:55:55, 1, NULL);
INSERT INTO `classroom_enrollments` (`id`, `classroom_id`, `student_id`, `enrolled_at`, `is_active`, `last_accessed`) VALUES (2, 1, 10, 2026-01-07 16:41:13, 1, NULL);
INSERT INTO `classroom_enrollments` (`id`, `classroom_id`, `student_id`, `enrolled_at`, `is_active`, `last_accessed`) VALUES (3, 2, 26, 2026-01-28 15:19:37, 1, NULL);

-- Table structure for classroom_resources
CREATE TABLE `classroom_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `resource_type` enum('document','video','link','image') NOT NULL,
  `file_url` text DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  KEY `idx_resource_type` (`resource_type`),
  CONSTRAINT `classroom_resources_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `virtual_classrooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Data for classroom_resources
INSERT INTO `classroom_resources` (`id`, `classroom_id`, `teacher_id`, `title`, `description`, `resource_type`, `file_url`, `uploaded_at`) VALUES (1, 1, 7, 'asdfghjkl', '', 'video', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', 2026-01-06 14:56:41);

-- Table structure for classroom_sessions
CREATE TABLE `classroom_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `scheduled_date` datetime NOT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `status` enum('scheduled','live','completed','cancelled') DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  KEY `idx_scheduled_date` (`scheduled_date`),
  CONSTRAINT `classroom_sessions_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `virtual_classrooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Data for classroom_sessions
INSERT INTO `classroom_sessions` (`id`, `classroom_id`, `title`, `description`, `scheduled_date`, `duration_minutes`, `status`, `created_at`) VALUES (1, 2, 'english-learning', '', 2026-01-28 15:22:00, 60, 'scheduled', 2026-01-28 15:22:10);

-- Table structure for compliance_compliancelog
CREATE TABLE `compliance_compliancelog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rule_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `action` varchar(200) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `rule_id` (`rule_id`),
  CONSTRAINT `compliance_compliancelog_ibfk_1` FOREIGN KEY (`rule_id`) REFERENCES `compliance_compliancerule` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for compliance_compliancelog
INSERT INTO `compliance_compliancelog` (`id`, `rule_id`, `user_id`, `user_type`, `action`, `ip_address`, `timestamp`) VALUES (1, 1, 26, 'student', 'Accepted', '0.0.0.0', 2026-01-21 09:46:24);

-- Table structure for compliance_compliancerule
CREATE TABLE `compliance_compliancerule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for compliance_compliancerule
INSERT INTO `compliance_compliancerule` (`id`, `name`, `description`, `is_active`, `created_at`) VALUES (1, 'Privacy Policy Acceptance', 'Students must accept privacy policy before using platform', 1, 2026-01-21 15:14:31);

-- Table structure for conference_participants
CREATE TABLE `conference_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conference_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('teacher','student') NOT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  `left_at` timestamp NULL DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_moderator` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_conference_id` (`conference_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `conference_participants_ibfk_1` FOREIGN KEY (`conference_id`) REFERENCES `video_conferences` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Data for conference_participants
INSERT INTO `conference_participants` (`id`, `conference_id`, `user_id`, `user_type`, `joined_at`, `left_at`, `duration_minutes`, `is_active`, `is_moderator`) VALUES (1, 4, 7, 'teacher', 2026-01-07 15:56:37, NULL, 0, 1, 1);
INSERT INTO `conference_participants` (`id`, `conference_id`, `user_id`, `user_type`, `joined_at`, `left_at`, `duration_minutes`, `is_active`, `is_moderator`) VALUES (2, 5, 7, 'teacher', 2026-01-07 15:59:32, NULL, 0, 1, 1);
INSERT INTO `conference_participants` (`id`, `conference_id`, `user_id`, `user_type`, `joined_at`, `left_at`, `duration_minutes`, `is_active`, `is_moderator`) VALUES (3, 6, 7, 'teacher', 2026-01-07 16:01:18, NULL, 0, 1, 1);
INSERT INTO `conference_participants` (`id`, `conference_id`, `user_id`, `user_type`, `joined_at`, `left_at`, `duration_minutes`, `is_active`, `is_moderator`) VALUES (4, 7, 7, 'teacher', 2026-01-07 16:01:54, NULL, 0, 1, 1);
INSERT INTO `conference_participants` (`id`, `conference_id`, `user_id`, `user_type`, `joined_at`, `left_at`, `duration_minutes`, `is_active`, `is_moderator`) VALUES (5, 10, 10, 'student', 2026-01-07 16:41:18, NULL, 0, 1, 0);
INSERT INTO `conference_participants` (`id`, `conference_id`, `user_id`, `user_type`, `joined_at`, `left_at`, `duration_minutes`, `is_active`, `is_moderator`) VALUES (6, 17, 26, 'student', 2026-01-28 15:19:41, NULL, 0, 1, 0);

-- Table structure for conference_recordings
CREATE TABLE `conference_recordings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conference_id` int(11) NOT NULL,
  `recording_url` text DEFAULT NULL,
  `recording_size` bigint(20) DEFAULT 0,
  `duration_minutes` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_available` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_conference_id` (`conference_id`),
  CONSTRAINT `conference_recordings_ibfk_1` FOREIGN KEY (`conference_id`) REFERENCES `video_conferences` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Table structure for config_change_logs
CREATE TABLE `config_change_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(100) NOT NULL,
  `old_value` longtext NOT NULL,
  `new_value` longtext NOT NULL,
  `changed_by` int(11) NOT NULL,
  `changed_by_name` varchar(255) NOT NULL,
  `changed_by_role` varchar(50) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` longtext NOT NULL,
  `changed_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for consent_history
CREATE TABLE `consent_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consent_type` varchar(50) NOT NULL,
  `action` varchar(20) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_student_timestamp` (`timestamp`),
  KEY `idx_consent_type` (`consent_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for context_switch_logs
CREATE TABLE `context_switch_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(10) NOT NULL,
  `from_context_id` varchar(50) DEFAULT NULL,
  `to_context_id` varchar(50) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `success` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_switch_log` (`user_id`,`user_type`),
  KEY `idx_switch_time` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for context_switch_logs
INSERT INTO `context_switch_logs` (`id`, `user_id`, `user_type`, `from_context_id`, `to_context_id`, `ip_address`, `user_agent`, `success`, `created_at`) VALUES (1, 1, 'admin', 'eduyata_main', 'super_admin', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-23 05:20:15);
INSERT INTO `context_switch_logs` (`id`, `user_id`, `user_type`, `from_context_id`, `to_context_id`, `ip_address`, `user_agent`, `success`, `created_at`) VALUES (2, 1, 'admin', 'super_admin', 'eduyata_main', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-23 05:20:22);

-- Table structure for course_categories
CREATE TABLE `course_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for course_categories
INSERT INTO `course_categories` (`id`, `name`, `description`, `icon`, `color`, `created_at`) VALUES (1, 'Mathematics', 'Advanced mathematics courses for all levels', '📐', '#FF6B6B', 2025-08-05 13:00:22);
INSERT INTO `course_categories` (`id`, `name`, `description`, `icon`, `color`, `created_at`) VALUES (2, 'Science', 'Physics, Chemistry, and Biology courses', '🔬', '#4ECDC4', 2025-08-05 13:00:22);
INSERT INTO `course_categories` (`id`, `name`, `description`, `icon`, `color`, `created_at`) VALUES (3, 'English', 'Language and literature courses', '📚', '#45B7D1', 2025-08-05 13:00:22);
INSERT INTO `course_categories` (`id`, `name`, `description`, `icon`, `color`, `created_at`) VALUES (4, 'Computer Science', 'Programming and technology courses', '💻', '#96CEB4', 2025-08-05 13:00:22);
INSERT INTO `course_categories` (`id`, `name`, `description`, `icon`, `color`, `created_at`) VALUES (5, 'History', 'World history and social studies', '🏛️', '#FFEAA7', 2025-08-05 13:00:22);
INSERT INTO `course_categories` (`id`, `name`, `description`, `icon`, `color`, `created_at`) VALUES (6, 'Arts', 'Creative arts and design courses', '🎨', '#DDA0DD', 2025-08-05 13:00:22);

-- Table structure for course_class_board
CREATE TABLE `course_class_board` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `class` varchar(50) NOT NULL,
  `board` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for course_class_board
INSERT INTO `course_class_board` (`id`, `course_id`, `class`, `board`, `created_at`) VALUES (1, 1, '12', 'cbse', 2025-09-08 13:27:00);
INSERT INTO `course_class_board` (`id`, `course_id`, `class`, `board`, `created_at`) VALUES (2, 1, '12', 'icse', 2025-09-08 13:27:00);
INSERT INTO `course_class_board` (`id`, `course_id`, `class`, `board`, `created_at`) VALUES (3, 3, '9', 'cbse', 2025-09-08 13:27:00);

-- Table structure for course_lessons
CREATE TABLE `course_lessons` (
  `id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `video_url` text DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `order_index` int(11) NOT NULL,
  `is_free` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for course_modules
CREATE TABLE `course_modules` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order_index` int(11) NOT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for courses
CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course_id` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') DEFAULT NULL,
  `duration_hours` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `thumbnail_url` text DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for courses
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (1, 'CRS20250001', 'Advanced Calculus & Applications', 'Master calculus concepts with real-world applications. Perfect for students preparing for competitive exams.', 1, 'Mathematics', 'advanced', 40, 299.99, 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-12-23 09:10:19);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (2, 'CRS20250002', 'Web Development Bootcamp', 'Learn modern web development with HTML, CSS, JavaScript, and React. Build real projects from scratch.', 3, 'Computer Science', 'intermediate', 60, 399.99, 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (3, 'CRS20250003', 'Physics Fundamentals', 'Understand the fundamental principles of physics through interactive lessons and practical experiments.', 2, 'Science', 'beginner', 30, 199.99, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-12-31 05:37:21);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (4, 'CRS20250004', 'Creative Writing Workshop', 'Develop your writing skills and unleash your creativity through guided exercises and peer feedback.', 3, 'English', 'intermediate', 25, 149.99, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (5, 'CS1754459540', 'Introduction to Artificial Intelligence', 'Learn the fundamentals of Artificial Intelligence and Machine Learning.', 1, 'Computer Science', 'beginner', 20, 49.99, 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-06 11:22:20, 2025-08-06 11:22:20);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (6, 'BIO121754459752', 'Class 12: Plant Biology', 'Comprehensive study of plant biology for Class 12 students. Covers plant physiology, reproduction, genetics, and biotechnology applications in plants.', 1, 'Science', 'intermediate', 30, 39.99, 'https://images.unsplash.com/photo-1490750967868-88aa4486ec94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-06 11:25:52, 2025-08-06 11:25:52);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (7, 'COURSE0007', 'plantation', 'you can learn about plant', 1, 'biology', 'beginner', 40, 0.00, '', 1, 2025-10-06 06:24:35, 2025-10-06 06:24:35);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (8, 'COURSE0008', 'bio', 'you can learn', 1, 'biology', 'beginner', 40, 0.00, '', 1, 2025-10-06 06:36:45, 2025-10-06 06:36:45);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (9, 'COURSE0009', 'anatomy', 'you can learn about the human anatomy', 1, 'biology', 'beginner', 30, 0.00, '', 1, 2025-10-06 11:16:14, 2025-10-06 11:16:14);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (10, 'COURSE0010', 'geography', 'you can learn about the geography here', 3, 'biology', 'beginner', 40, 0.00, '', 1, 2025-10-07 05:51:40, 2025-10-07 05:51:40);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (11, 'COURSE0011', 'CBSE Class 4 English - Introduction - Getting Started - English Fundamentals', 'Complete course for English - CBSE Class 4', 1, 'CBSE - 4 - English', 'beginner', 1, 0.00, '', 0, 2026-01-03 12:56:11, 2026-01-03 12:56:11);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (12, 'COURSE0012', 'CBSE Class 1 Mathematics - Introduction - Getting Started - Mathematics Fundamentals', 'Complete course for Mathematics - CBSE Class 1', 7, 'CBSE - 1 - Mathematics', 'beginner', 1, 0.00, '', 1, 2026-01-03 13:06:01, 2026-01-03 13:10:01);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (13, 'COURSE0013', 'CBSE Class 2 Mathematics - Introduction - Getting Started - Mathematics Fundamentals', 'Complete course for Mathematics - CBSE Class 2', 7, 'CBSE - 2 - Mathematics', 'beginner', 1, 0.00, '', 0, 2026-01-03 17:49:06, 2026-01-03 17:49:06);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (14, 'COURSE0014', 'CBSE Class 3 Mathematics - Introduction - Getting Started - Mathematics Fundamentals', 'Complete course for Mathematics - CBSE Class 3', 7, 'CBSE - 3 - Mathematics', 'beginner', 1, 0.00, '', 0, 2026-01-05 12:44:50, 2026-01-05 12:44:50);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (15, 'COURSE0015', 'CBSE Class 2 English - Introduction - Getting Started - English Fundamentals', 'Complete course for English - CBSE Class 2', 1, 'CBSE - 2 - English', 'beginner', 1, 0.00, '', 1, 2026-01-12 11:25:44, 2026-01-12 11:33:10);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (16, 'COURSE0016', 'CBSE Class 2 Hindi - Introduction - Getting Started - Hindi Fundamentals', 'Complete course for Hindi - CBSE Class 2', 21, 'CBSE - 2 - Hindi', 'beginner', 1, 0.00, '', 0, 2026-01-12 11:55:03, 2026-01-12 11:55:03);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (17, 'COURSE0017', 'CBSE Class 2 English - Introduction - Getting Started - English Fundamentals', 'Complete course for English - CBSE Class 2', 21, 'CBSE - 2 - English', 'beginner', 1, 0.00, '', 1, 2026-01-12 12:52:04, 2026-01-12 12:56:15);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (18, 'COURSE0018', 'CBSE Class 2 English - Introduction - Getting Started - English Fundamentals', 'Complete course for English - CBSE Class 2', 26, 'CBSE - 2 - English', 'beginner', 1, 0.00, '', 0, 2026-01-20 13:04:01, 2026-01-20 13:04:01);

-- Table structure for courses_course
CREATE TABLE `courses_course` (
  `id` bigint(20) NOT NULL,
  `course_id` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `category` varchar(100) NOT NULL,
  `level` varchar(20) NOT NULL,
  `duration_hours` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `thumbnail_url` longtext NOT NULL,
  `is_published` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for data_exports
CREATE TABLE `data_exports` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `export_format` varchar(10) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for data_retention_policies
CREATE TABLE `data_retention_policies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `data_type` varchar(50) NOT NULL,
  `retention_days` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for deletion_requests
CREATE TABLE `deletion_requests` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `requested_at` datetime(6) NOT NULL,
  `scheduled_deletion_at` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `reason` longtext NOT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `processed_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for django_admin_log
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for django_content_type
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for django_content_type
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (1, 'admin', 'logentry');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (2, 'auth', 'permission');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (3, 'auth', 'group');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (4, 'auth', 'user');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (6, 'sessions', 'session');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (7, 'courses', 'course');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (8, 'auth_app', 'student');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (9, 'auth_app', 'enrollment');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (10, 'auth_app', 'teacher');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (11, 'admin_auth', 'student');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (12, 'admin_auth', 'teacher');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (13, 'admin_auth', 'teacheremaillog');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (24, 'courses', 'lessoncontent');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (25, 'courses', 'lesson');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (26, 'courses', 'chapter');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (27, 'auth_app', 'educator');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (28, 'auth_app', 'encryptionkey');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (29, 'auth_app', 'badge');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (30, 'auth_app', 'badgeprogress');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (31, 'auth_app', 'skillendorsement');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (32, 'auth_app', 'studentactivity');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (33, 'auth_app', 'studentbadge');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (34, 'auth_app', 'consenthistory');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (35, 'auth_app', 'studentconsent');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (36, 'auth_app', 'activeusercontext');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (37, 'auth_app', 'contextswitchlog');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (38, 'auth_app', 'usercontext');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (39, 'admin_auth', 'adminnotification');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (40, 'admin_auth', 'adminemaillog');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (41, 'admin_auth', 'backuphistory');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (42, 'admin_auth', 'admin');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (43, 'collaboration', 'collaborationgroup');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (44, 'collaboration', 'discussion');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (45, 'collaboration', 'shareddocument');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (46, 'collaboration', 'discussionpost');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (47, 'collaboration', 'collaborationpoints');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (48, 'collaboration', 'chatmessage');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (49, 'collaboration', 'project');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (50, 'collaboration', 'projectgroup');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (51, 'collaboration', 'projectsubmission');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (52, 'collaboration', 'projectdocument');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (53, 'collaboration', 'projectgroupmember');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (54, 'collaboration', 'supportticket');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (55, 'collaboration', 'ticketresponse');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (56, 'collaboration', 'ticketattachment');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (57, 'collaboration', 'grievancecase');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (58, 'collaboration', 'grievancetimeline');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (59, 'collaboration', 'grievancenotification');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (60, 'collaboration', 'grievanceevidence');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (61, 'virtual_classrooms', 'virtualclassroom');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (62, 'virtual_classrooms', 'classroomenrollment');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (63, 'virtual_classrooms', 'classroomsession');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (64, 'virtual_classrooms', 'classroomannouncement');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (65, 'virtual_classrooms', 'classroomresource');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (66, 'session_management', 'sessionevent');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (67, 'session_management', 'sessionpolicy');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (68, 'session_management', 'userdevice');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (69, 'session_management', 'usersession');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (70, 'public_api', 'apikey');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (71, 'webhook_system', 'webhookendpoint');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (72, 'integration_marketplace', 'integration');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (73, 'platform_config', 'platformconfig');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (74, 'platform_config', 'configchangelog');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (75, 'compliance', 'compliancerule');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (76, 'compliance', 'compliancelog');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (77, 'incident_response', 'accountlock');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (78, 'incident_response', 'loginattempt');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (79, 'incident_response', 'securityincident');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (80, 'breach_notification', 'breachreport');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (81, 'breach_notification', 'breachnotification');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (82, 'system_monitoring', 'systemmetric');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (83, 'auth_app', 'fraudscore');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (84, 'auth_app', 'loginattempt');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (85, 'auth_app', 'accountlockout');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (86, 'auth_app', 'anonymizeddata');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (87, 'auth_app', 'dataretentionpolicy');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (88, 'auth_app', 'deletionrequest');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (89, 'auth_app', 'dataexport');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (90, 'social_auth', 'socialaccount');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (91, 'notifications', 'notification');

-- Table structure for django_migrations
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for django_migrations
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (1, 'contenttypes', '0001_initial', 2025-09-09 15:52:10.268621);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (2, 'auth', '0001_initial', 2025-09-09 15:52:11.026024);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (3, 'admin', '0001_initial', 2025-09-09 15:52:11.184314);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (4, 'admin', '0002_logentry_remove_auto_add', 2025-09-09 15:52:11.196761);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (5, 'admin', '0003_logentry_add_action_flag_choices', 2025-09-09 15:52:11.204722);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (6, 'contenttypes', '0002_remove_content_type_name', 2025-09-09 15:52:11.328604);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (7, 'auth', '0002_alter_permission_name_max_length', 2025-09-09 15:52:11.421420);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (8, 'auth', '0003_alter_user_email_max_length', 2025-09-09 15:52:11.437671);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (9, 'auth', '0004_alter_user_username_opts', 2025-09-09 15:52:11.450663);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (10, 'auth', '0005_alter_user_last_login_null', 2025-09-09 15:52:11.550921);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (11, 'auth', '0006_require_contenttypes_0002', 2025-09-09 15:52:11.554216);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (12, 'auth', '0007_alter_validators_add_error_messages', 2025-09-09 15:52:11.561883);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (13, 'auth', '0008_alter_user_username_max_length', 2025-09-09 15:52:11.575232);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (14, 'auth', '0009_alter_user_last_name_max_length', 2025-09-09 15:52:11.588194);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (15, 'auth', '0010_alter_group_name_max_length', 2025-09-09 15:52:11.602519);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (16, 'auth', '0011_update_proxy_permissions', 2025-09-09 15:52:11.614247);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (17, 'auth', '0012_alter_user_first_name_max_length', 2025-09-09 15:52:11.629945);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (18, 'sessions', '0001_initial', 2025-09-09 15:52:11.664355);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (19, 'courses', '0001_initial', 2025-09-09 15:52:57.329515);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (20, 'auth_app', '0001_initial', 2025-09-09 15:52:57.479166);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (21, 'auth_app', '0002_rename_password_student_password_hash_and_more', 2025-09-22 17:46:16.473404);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (22, 'auth_app', '0003_alter_student_mobile_self', 2025-10-04 10:56:06.746551);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (23, 'auth_app', '0004_teacher_alter_student_mobile_self_and_more', 2025-10-04 11:38:56.535035);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (24, 'auth_app', '0005_alter_teacher_teacher_id', 2025-10-04 11:39:59.683705);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (25, 'auth_app', '0006_alter_teacher_table', 2025-10-04 11:40:01.230753);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (26, 'admin_auth', '0001_initial', 2025-10-24 09:01:13.490864);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (27, 'auth_app', '0007_create_educator_and_teaching_experience', 2025-10-24 09:01:29.895278);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (28, 'auth_app', '0008_update_educator_file_fields', 2025-10-24 09:01:29.900294);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (29, 'courses', '0002_remove_course_instructor_name_and_more', 2025-10-24 09:01:29.904790);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (30, 'courses', '0003_alter_course_instructor_id_delete_lesson', 2025-10-24 09:01:29.909696);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (31, 'courses', '0004_alter_course_table', 2025-10-24 09:01:29.916311);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (32, 'courses', '0003_state_only_update', 2025-10-24 09:01:29.920822);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (33, 'courses', '0005_merge_0003_state_only_update_0004_alter_course_table', 2025-10-24 09:01:29.928670);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (34, 'auth_app', '0013_add_context_switching_models', 2026-01-20 12:23:59);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (35, 'auth_app', '0012_activeusercontext_contextswitchlog_usercontext_and_more', 2026-01-20 15:34:48);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (36, 'auth_app', '0011_merge_20260120_1109', 2026-01-21 15:09:06);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (37, 'auth_app', '0011_merge_20260120_1810', 2026-01-21 16:19:35);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (38, 'auth_app', '0002_educator_degree_certificate_and_more', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (39, 'auth_app', '0003_schedule', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (40, 'auth_app', '0004_educator_approval_status', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (41, 'auth_app', '0005_add_reminder_tracking', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (42, 'auth_app', '0006_educator_approval_status_educator_government_id_file', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (43, 'auth_app', '0007_add_encryption_fields', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (44, 'auth_app', '0008_add_studentbadge', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (45, 'auth_app', '0008_auditlog_securityevent', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (46, 'auth_app', '0009_merge_20260116_1633', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (47, 'auth_app', '0010_consenthistory_studentconsent_and_more', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (48, 'auth_app', '0011_merge_20260120_1810', 2026-01-21 16:20:58);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (49, 'auth_app', '0010_consenthistory_studentconsent_and_more', 2026-01-21 16:22:55);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (50, 'admin_auth', '0001_initial', 2026-01-21 16:24:33);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (51, 'admin_auth', '0002_adminnotification_delete_admin_delete_adminemaillog_and_more', 2026-01-21 16:24:33);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (77, 'auth_app', '0002_educator_degree_certificate_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (78, 'auth_app', '0003_schedule', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (79, 'auth_app', '0004_educator_approval_status', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (80, 'auth_app', '0005_add_reminder_tracking', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (81, 'auth_app', '0006_educator_approval_status_educator_government_id_file', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (82, 'auth_app', '0007_add_encryption_fields', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (83, 'auth_app', '0008_add_studentbadge', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (84, 'auth_app', '0008_auditlog_securityevent', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (85, 'auth_app', '0009_merge_20260116_1633', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (86, 'auth_app', '0010_consenthistory_studentconsent_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (87, 'auth_app', '0011_merge_20260120_1810', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (88, 'auth_app', '0012_activeusercontext_contextswitchlog_usercontext_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (89, 'admin_auth', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (90, 'admin_auth', '0002_adminnotification_delete_admin_delete_adminemaillog_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (91, 'admin_auth', '0003_adminemaillog_backuphistory_student_teacheremaillog_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (92, 'admin_auth', '0004_adminnotification_webhook_delivered_at_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (93, 'collaboration', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (94, 'collaboration', '0002_project_projectgroup_projectsubmission_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (95, 'collaboration', '0003_support_tickets', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (96, 'collaboration', '0004_alter_supportticket_id_alter_ticketattachment_id_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (97, 'collaboration', '0005_grievancecase_grievancetimeline_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (98, 'compliance', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (99, 'courses', '0002_remove_course_is_published_remove_course_status', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (100, 'courses', '0003_lessoncontent_lesson_chapter', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (101, 'incident_response', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (102, 'integration_marketplace', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (103, 'integration_marketplace', '0002_extend_admin_announcements', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (104, 'integration_marketplace', '0003_rename_integration_install_8d17ec_idx_integration_install_f61e24_idx_and_more', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (105, 'public_api', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (106, 'session_management', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (107, 'system_monitoring', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (108, 'system_monitoring', '0002_clean_migration', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (109, 'webhook_system', '0001_initial', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (110, 'webhook_system', '0002_extend_admin_notifications', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (111, 'webhook_system', '0003_alter_webhookendpoint_created_by', 2026-01-21 16:30:15);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (112, 'breach_notification', '0001_initial', 2026-01-21 16:42:39.467338);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (113, 'platform_config', '0001_initial', 2026-01-21 16:42:46.289083);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (114, 'virtual_classrooms', '0001_initial', 2026-01-22 15:17:46.334022);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (115, 'auth_app', '0009_fraud_detection_tables', 2026-01-22 12:07:57.212572);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (116, 'auth_app', '0013_merge_20260122_1736', 2026-01-22 12:07:57.239969);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (117, 'admin_auth', '0005_feature13_monitoring', 2026-01-28 10:11:05.506526);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (118, 'auth_app', '0011_anonymizeddata_dataretentionpolicy_and_more', 2026-01-28 10:11:06.463175);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (119, 'auth_app', '0013_merge_20260127_1457', 2026-01-28 10:11:06.467954);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (120, 'integration_marketplace', '0004_integration_consolidated', 2026-01-28 10:11:06.497576);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (121, 'integration_marketplace', '0005_feature5_integration_types', 2026-01-28 10:11:06.585233);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (122, 'integration_marketplace', '0006_alter_integration_config_and_more', 2026-01-28 10:11:06.684091);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (123, 'public_api', '0002_feature5_oauth_support', 2026-01-28 10:11:06.748959);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (124, 'social_auth', '0001_initial', 2026-01-28 10:11:06.831121);

-- Table structure for django_session
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for educators
CREATE TABLE `educators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  `experience_years` int(11) NOT NULL DEFAULT 0,
  `profile_completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `highest_qualification` varchar(255) DEFAULT NULL,
  `teaching_experience_institutes` longtext DEFAULT NULL,
  `bio` text DEFAULT '',
  `boards` longtext DEFAULT json_array(),
  `subject_classes` longtext DEFAULT json_object(),
  `languages_known` longtext DEFAULT json_array(),
  `cv_file` varchar(500) DEFAULT NULL,
  `achievements_file` varchar(500) DEFAULT NULL,
  `experience_proof_file` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profile_picture` longtext DEFAULT '',
  `government_id_file` varchar(500) DEFAULT NULL,
  `degree_certificate_file` varchar(500) DEFAULT NULL,
  `approval_status` varchar(20) DEFAULT 'pending',
  `date_of_birth` date DEFAULT NULL,
  `document_status` varchar(20) DEFAULT 'Pending',
  `degree_certificate` varchar(500) DEFAULT '',
  `mobile_encrypted` text DEFAULT NULL,
  `email_encrypted` text DEFAULT NULL,
  `encryption_key_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_educators_encrypted` (`encryption_key_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for educators
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (1, 'TCH202500001', 'chaithraa', 'chaithrapoojary175@gmail.com', '7019934780', 'Female', 'pbkdf2_sha256$1000000$FXgt0VBUMmOb3bjBUMIICD$byVkcIhtLwJIbyR2zAKM3BvTPERvZRBpignhObhqBeM=', 'English', 'B.E', 0, 1, 2025-10-28 09:58:45.600637, 'B.E', '[{"name": "reva", "from_year": "2020", "to_year": "2024"}]', '', '["CBSE"]', '{"English": ["2", "3", "4"]}', '["Tamil", "Telugu", "Hindi"]', 'uploads/teachers/TCH202500001/cv.pdf', '', 'uploads/teachers/TCH202500001/experience.pdf', 1, 2026-01-12 13:04:09, 'uploads/teachers/TCH202500001/profile_picture.jpg', 'uploads/teachers/TCH202500001/government_id.pdf', 'uploads/teachers/TCH202500001/degree_certificate.pdf', 'approved', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (2, 'TCH202500002', 'arunkumargm', 'arunkumargm345@gmail.com', '8970678976', 'Male', 'pbkdf2_sha256$1000000$QqZcZkcAmvjrLMSuivIMe1$5n9AYa4Prl8dOMKYtEEnG3238Dj4YeGqeAvZ5MGsc34=', 'English', 'B.E', 0, 0, 2025-10-28 10:23:46.892328, 'B.E', '[{"name": "vijaya", "from_year": "2020", "to_year": "2022"}]', '', '["CBSE"]', '{"English": ["9", "8"]}', '["Marathi", "Gujarati"]', 'uploads/teachers/TCH202500002/cv.pdf', NULL, 'uploads/teachers/TCH202500002/experience.pdf', 1, 2025-11-11 05:54:51, 'uploads/teachers/TCH202500002/profile_picture.jpg', 'uploads/teachers/TCH202500002/government_id.pdf', 'uploads/teachers/TCH202500002/degree_certificate.pdf', 'rejected', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (3, 'TCH202500003', 'dhanalakshmi', 'dhanalakshmi000002@gmail.com', '76543238765', 'Female', 'pbkdf2_sha256$1000000$Pl6k3YiQd3vovoqVtUiu3a$Y1LV+R87mY97YnG4/Hq4A2lTswTzXTYUnZreQcOu4vQ=', 'English, Mathematics', 'B.E', 0, 0, 2025-10-29 05:21:14.979357, 'B.E', '[{"name": "brundavana institute", "from_year": "2020", "to_year": "2024"}]', '', '["CBSE"]', '{"English": ["1", "2", "3"], "Mathematics": ["1", "2", "3"]}', '["Marathi", "Telugu"]', 'uploads/teachers/TCH202500003/cv.pdf', NULL, 'uploads/teachers/TCH202500003/experience.pdf', 1, 2025-11-11 06:08:11, 'uploads/teachers/TCH202500003/profile_picture.jpg', 'uploads/teachers/TCH202500003/government_id.pdf', 'uploads/teachers/TCH202500003/degree_certificate.pdf', 'rejected', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (4, 'TCH202500004', 'ChaithraPoojary', 'chaithrapoojary0714@gmail.com', '8105815742', 'Female', 'pbkdf2_sha256$1000000$xChwJ8K2ulWucCW8nZ7EwR$yHnVWRuiT6r7j/N7rmFu5SUx5IcunV+6JbB+VGJwO0U=', 'English, Mathematics', 'B.E', 0, 1, 2025-10-29 08:46:19.198498, 'B.E', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"English": [], "Mathematics": ["1", "2", "3"]}', '["Marathi", "Kannada"]', 'uploads/teachers/TCH202500004/cv.pdf', NULL, 'uploads/teachers/TCH202500004/experience.pdf', 1, 2025-10-29 09:25:36, 'uploads/teachers/TCH202500004/profile_picture.jpg', 'uploads/teachers/TCH202500004/government_id.pdf', 'uploads/teachers/TCH202500004/degree_certificate.pdf', 'approved', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (5, 'TCH202500005', 'darshan', 'darshansmdarshansm0@gmail.com', '8765434567', 'Male', 'pbkdf2_sha256$1000000$Ln3mJ8SEzAQtlxOX8ta7By$txk5u9WSX08Kkvz/r8GUnR68zd+XU8kcxqnVKU7/zzk=', 'English', 'B.E', 0, 1, 2025-10-29 09:28:10.615191, 'B.E', '[{"name": "megha institute", "from_year": "2020", "to_year": "2024"}]', '', '["CBSE"]', '{"English": ["1", "2"]}', '["Hindi", "English"]', 'uploads/teachers/TCH202500005/cv.pdf', NULL, 'uploads/teachers/TCH202500005/experience.pdf', 1, 2025-11-10 11:20:32, 'uploads/teachers/TCH202500005/profile_picture.jpg', 'uploads/teachers/TCH202500005/government_id.pdf', 'uploads/teachers/TCH202500005/degree_certificate.pdf', 'approved', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (6, 'TCH202500006', 'chaithra', 'chaithrapoojary987654@gmail.com', '987656789', 'Female', 'pbkdf2_sha256$1000000$pz9Ivz2Lijdtwo9tIAOdUf$CWWmjHZYV6eSKC73NgHXNa88iWmHUsBGWdgMltdOE7E=', 'English', 'B.E', 0, 1, 2025-11-06 09:57:47.966760, 'B.E', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"English": ["9", "8"]}', '["Tamil", "Telugu"]', 'uploads/teachers/TCH202500006/cv.pdf', 'uploads/teachers/TCH202500006/achievements.pdf', 'uploads/teachers/TCH202500006/experience.pdf', 1, 2025-11-06 09:57:48, '', NULL, NULL, 'pending', NULL, 'Pending', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (7, 'TCH202500007', 'chaithra', 'chaithrapoojary777@gmail.com', '98765678977', 'Female', 'pbkdf2_sha256$1000000$BWgZSxbBaBjZP3uPsXoLd2$O0b1FKFDDdIzYfyqNsL26wqok95ygY3BqiDLMwBiXwM=', 'Mathematics', 'B.E', 0, 1, 2025-11-10 09:33:20.517132, 'B.E', '[{"name": "reva", "from_year": "2022", "to_year": "2023"}]', '', '["CBSE"]', '{"Mathematics": ["1", "2", "3"]}', '["Marathi", "Telugu", "Hindi"]', 'uploads/teachers/TCH202500007/cv.pdf', 'uploads/teachers/TCH202500007/achievements.pdf', 'uploads/teachers/TCH202500007/experience.pdf', 1, 2026-01-05 07:12:51, '', NULL, '', 'pending', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (8, 'TCH202500008', 'chaithra', 'chaithrapoojary175559876@gmail.com', '98765678977876', 'Female', 'pbkdf2_sha256$1000000$edyazxSbGXN5TMIoKEUOwi$MDVo8trCwoM6wq0elMbSA7439Qm8uwknmW4taXgVqJM=', 'English', 'B.E', 0, 1, 2025-11-10 09:51:19.733550, 'B.E', '[{"name": "reva", "from_year": "2022", "to_year": "2023"}]', '', '["CBSE"]', '{"English": ["1", "2", "3"]}', '["Telugu", "Marathi"]', 'uploads/teachers/TCH202500008/cv.pdf', '', '', 1, 2025-11-10 09:51:19, '', NULL, NULL, 'pending', NULL, 'Pending', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (9, 'TCH202500009', 'darshan', 'alstosm588@gmail.com', '765456789', 'Male', 'pbkdf2_sha256$1000000$ImbqFuoqhWXqUbig2eL3gg$wyzJMNRSdoSDtbWScsbmjG1XfbXDHTyiwSCIeImzK2c=', 'Art', 'B.E', 0, 1, 2025-11-11 06:01:56.073406, 'B.E', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"Art": ["9", "8"]}', '["Marathi", "Gujarati"]', 'uploads/teachers/TCH202500009/cv.pdf', 'uploads/teachers/TCH202500009/achievements.pdf', 'uploads/teachers/TCH202500009/experience.pdf', 1, 2025-11-11 11:39:14, 'uploads/teachers/TCH202500009/profile_picture.png', NULL, NULL, 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500009/degree_certificate.pdf', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (10, 'TCH202500010', 'darshan sm', 'alstosm58@gmail.com', '98765', 'Male', 'pbkdf2_sha256$1000000$LaNZ5uJ3CjqqbNAd0HCk7m$6vGFzRd8iKST9wSXBdkbw/MacQ/EKKOdh+xqAMF0Uyk=', 'English', 'B.e', 0, 1, 2025-11-11 06:10:49.048806, 'B.e', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"English": ["9", "10"]}', '["Marathi"]', 'uploads/teachers/TCH202500010/cv.pdf', 'uploads/teachers/TCH202500010/achievements.pdf', 'uploads/teachers/TCH202500010/experience.pdf', 1, 2025-11-11 06:20:28, 'uploads/teachers/TCH202500010/profile_picture.png', NULL, NULL, 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500010/degree_certificate.pdf', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (15, 'TCH202500015', 'chat', 'vojat89651@gyknife.com', '8906523456', 'Female', 'pbkdf2_sha256$600000$ZgbBVbvvKPDGfUdLTYNnOr$0rLs633wSXf7gVZRfjAKYKzr6gQWLv3Z3m0Br3UPPeY=', '', 'B.Tech', 0, 1, 2025-11-12 10:24:13.049157, 'B.Tech', '[]', '', '["State Board"]', '{}', '["Hindi"]', 'uploads/teachers/TCH202500015/cv.docx', '', '', 0, 2025-11-12 10:44:58, 'uploads/teachers/TCH202500015/profile_picture.png', NULL, NULL, 'pending', NULL, 'Pending', 'uploads/teachers/TCH202500015/degree_certificate.png', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (16, 'TCH202500016', 'Test Teacher', 'test@teacher.com', '9876543210', 'Male', 'pbkdf2_sha256$600000$opXOSKm8hYnFAPyuKfnCjU$ny0eBNoY+BNBJ+e4qCqnzoVTbGKezcxd8ciudmhZIr0=', 'Physics, Mathematics', 'M.Sc Physics', 0, 1, 2025-11-12 15:13:10.608994, 'M.Sc Physics', '[]', 'Experienced physics teacher', '["CBSE", "ICSE"]', '{"Physics": ["11", "12"], "Mathematics": ["10", "11"]}', '["English", "Hindi"]', '', '', '', 0, 2025-11-12 15:13:10, '', '', '', 'pending', 1990-01-01, 'Pending', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (17, 'TCH202500017', 'yash', 'besad59482@gyknife.com', '7654321897', 'Male', 'pbkdf2_sha256$600000$dtiONQWTGX8SEfxUwkw6s4$T3aPm5rauOZOGk2V/95uTx9chmMcZ2ONtcsB8C+pdcc=', 'English', 'B.Tech', 0, 1, 2025-11-12 15:16:58.889690, 'B.Tech', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["State Board"]', '{"English": ["11"]}', '["Hindi"]', 'uploads/teachers/TCH202500017/cv.docx', '', '', 1, 2025-11-12 15:18:03, 'uploads/teachers/TCH202500017/profile_picture.png', '', 'uploads/teachers/TCH202500017/degree_certificate.png', 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500017/degree_certificate.png', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (18, 'TCH202500018', 'Xagejew', 'xagejew545@gusronk.com', '9009887877', 'Male', 'pbkdf2_sha256$600000$vhTaZbOc5DQx4zu4QsYEoe$//fZ75zUXYRDTnRwJamPBfg3i4M7VS6bvvx1i7R38uA=', 'English', 'M.Ed', 0, 1, 2025-11-12 15:22:08.490285, 'M.Ed', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["State Board"]', '{"English": ["12"]}', '["Hindi"]', 'uploads/teachers/TCH202500018/cv.pdf', '', '', 0, 2025-11-12 15:24:33, 'uploads/teachers/TCH202500018/profile_picture.png', '', 'uploads/teachers/TCH202500018/degree_certificate.jpg', 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500018/degree_certificate.jpg', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (19, 'TCH202500019', 'Bhagya', 'bhagyacs04@gmail.com', '7938736333', 'Female', 'pbkdf2_sha256$600000$81RlQIplbo5Jx3BvnHEQos$ytvmvvwDdDnwPSCsR0cd7U1PTFvJ3ImSbMPiUgwb7JY=', 'English', 'B.Tech', 0, 1, 2025-12-23 07:14:08.128449, 'B.Tech', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["State Board"]', '{"English": ["4", "10"]}', '["Telugu"]', 'uploads/teachers/TCH202500019/cv.pdf', '', '', 1, 2025-12-31 05:20:00, 'uploads/teachers/TCH202500019/profile_picture.png', '', 'uploads/teachers/TCH202500019/degree_certificate.jpg', 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500019/degree_certificate.jpg', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (20, 'TCH202600020', 'chaithra', 'pafiwem975@atinjo.com', '8765678909', 'Female', 'pbkdf2_sha256$600000$rnPGswnXMTDgBDq80gwpxC$WN5cML3kl/wQFNXYV+th0Qv3hoFcyqFiDVUe8fasqAA=', NULL, NULL, 0, 1, 2026-01-12 11:11:38.543495, 'B.E', '[]', '', '["CBSE"]', '{"English": ["1", "2", "3"]}', '["English"]', '', '', '', 1, 2026-01-12 11:17:42, '', NULL, '', 'pending', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (21, 'TCH202600021', 'chaithra1', 'hatov27294@atinjo.com', '7867586876', 'Female', 'pbkdf2_sha256$600000$3WRp8evjMCG8lFgNdo7I9T$fvG3xGIv2r0YgM1I3Us5yKTvSm7S8JCYE5kxoNng1Bo=', '', '', 0, 1, 2026-01-12 11:22:41.622826, 'B.E', '[]', '', '["CBSE", "ICSE"]', '{"English": ["1", "2", "3"], "Hindi": ["2", "3", "1"]}', '["English", "Hindi"]', '', '', '', 1, 2026-01-12 11:56:36, '', NULL, '', 'pending', NULL, 'Verified', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (22, 'TCH202600022', 'chaithra', 'meworen803@atinjo.com', '7867876578', 'Female', 'pbkdf2_sha256$600000$HcTNsCJTefuytJ1J6kWc33$mNNjcvoJMpVvj+WCHsGMpjpQrH1ty05FiMjy2JN20gc=', NULL, NULL, 0, 1, 2026-01-12 12:19:23.909658, 'B.E', '[]', '', '["CBSE"]', '{"Mathematics": ["1", "2", "3"], "Hindi": ["1", "2", "3"]}', '["English"]', '', '', '', 0, 2026-01-12 12:19:23, '', NULL, '', 'pending', NULL, 'Pending Verification', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (23, 'TCH202600023', 'chaithra3', 'voyejij133@akixpres.com', '6567678987', 'Female', 'pbkdf2_sha256$600000$Sva5XFjTehNeT2H7Mn6m5b$dWwrQIFEWs0CfBNCAsrUKGYHt7O/9lY4kupWqlT3y6E=', NULL, NULL, 0, 1, 2026-01-12 12:23:01.417055, 'B.E', '[]', '', '["CBSE"]', '{"Hindi": ["1", "2", "3"], "Mathematics": ["1", "2", "3"]}', '["English"]', '', '', '', 0, 2026-01-12 12:23:01, '', NULL, '', 'pending', NULL, 'Pending Verification', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (24, 'TCH202600024', 'chaithra2', 'bocirok281@atinjo.com', 'STU20251807', 'Female', 'pbkdf2_sha256$600000$Xjo3PIyRBPFPuCPnPNOuqx$DF7+4hpQ2rVKZ6Awy8IIwr6OP/PEu25LNpK9mVZNX2c=', NULL, NULL, 0, 1, 2026-01-12 12:28:26.465437, 'B.E', '[]', '', '["CBSE"]', '{"English": ["1", "2", "3"], "Hindi": ["1", "2", "3"]}', '["English"]', '', '', '', 0, 2026-01-12 12:28:26, '', NULL, '', 'pending', NULL, 'Pending Verification', '', NULL, NULL, NULL);
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`, `mobile_encrypted`, `email_encrypted`, `encryption_key_id`) VALUES (25, 'TCH202600025', 'chaithra3', 'tisilex123@atinjo.com', '5676678988', 'Female', 'pbkdf2_sha256$600000$iIheg4gyCjvtVe7yRwpQ1M$7PQ+QgTsxq9Rog/f530y3zLgRHoMS9+xannaAb3aBR4=', NULL, NULL, 1, 1, 2026-01-12 12:41:01.923416, 'B.E', '[]', '', '["CBSE"]', '{"English": ["1", "2", "3"], "Science": ["1", "2", "3"]}', '["English"]', '', '', '', 1, 2026-01-12 12:43:06, '', NULL, '', 'pending', NULL, 'Verified', '', NULL, NULL, NULL);

-- Table structure for encryption_keys
CREATE TABLE `encryption_keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `rotated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_encryption_keys_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for encryption_keys
INSERT INTO `encryption_keys` (`id`, `key_hash`, `created_at`, `is_active`, `rotated_at`) VALUES (1, 'Tqfsy1lCQ4lppRniIgCy5nZzUmpRc1FKN1NoTTFoS0d5VFBMTUNoRkE2WDlfZ25fOXkyNi0tUy01VXM9', 2026-01-28 10:30:49, 1, NULL);

-- Table structure for fraud_events
CREATE TABLE `fraud_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `user_type` enum('student','teacher','admin') DEFAULT 'student',
  `ip_address` varchar(45) DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `rule_triggered` varchar(200) DEFAULT NULL,
  `severity` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `description` text DEFAULT NULL,
  `action_taken` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_severity` (`severity`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for fraud_events
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (1, 'STU123456', 'student', '192.168.1.100', 'Multiple Login Attempts', 'Failed Login Threshold', 'Medium', 'User attempted to login 15 times in 5 minutes', 'Account Temporarily Locked', 2026-01-19 12:33:04);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (2, 'TCH789012', 'teacher', '10.0.0.50', 'Suspicious File Upload', 'File Type Validation', 'High', 'Attempted to upload executable file as course material', 'Upload Blocked', 2026-01-19 12:33:04);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (3, 'STU654321', 'student', '203.0.113.45', 'Grade Manipulation Attempt', 'Database Integrity Check', 'Critical', 'Attempted SQL injection on grades table', 'Account Suspended', 2026-01-19 12:33:04);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (4, 'STU111222', 'student', '198.51.100.25', 'Rapid Course Access', 'Access Pattern Analysis', 'Low', 'Accessed 20 courses in 2 minutes', 'Rate Limited', 2026-01-19 12:33:04);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (5, 'STU000017', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU000017', 'Logged for review', 2026-01-20 16:10:53);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (6, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:16);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (7, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:18);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (8, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:30);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (9, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:33);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (10, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:43);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (11, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:45);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (12, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:53);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (13, 'TCH2025000', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: TCH2025000', 'Logged for review', 2026-01-20 16:27:55);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (14, 'STU000017', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Manual test fraud event for STU000017', 'Logged for review', 2026-01-20 16:30:36);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (15, 'STU000017', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Manual test fraud event for STU000017', 'Logged for review', 2026-01-20 16:32:56);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (16, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:26);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (17, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:28);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (18, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:35);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (19, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:38);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (20, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:44);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (21, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:46);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (22, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:50);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (23, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:55:53);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (24, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:56:03);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (25, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:56:06);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (26, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:56:34);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (27, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:56:36);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (28, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:56:40);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (29, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 16:56:43);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (30, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:56:47);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (31, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:56:50);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (32, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:56:56);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (33, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:56:58);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (34, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:57:27);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (35, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:57:29);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (36, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:57:37);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (37, 'S10310967', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: S10310967', 'Logged for review', 2026-01-20 17:57:40);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (38, 'STU2025180', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU2025180', 'Logged for review', 2026-01-20 18:09:26);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (39, 'STU2025180', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt detected', 'Logged for review', 2026-01-20 18:09:28);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (40, 'STU2025180', 'student', '127.0.0.1', 'LOGIN_RISK', 'Failed Login Threshold', 'Medium', 'Risk score: 45. Signals: New IP address; New device/browser', 'Logged for review', 2026-01-20 18:09:28);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (41, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 18:18:25);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (42, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt detected', 'Logged for review', 2026-01-20 18:18:28);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (43, 'STU20259433', 'student', '127.0.0.1', 'LOGIN_RISK', 'Failed Login Threshold', 'Medium', 'Risk score: 45. Signals: New IP address; New device/browser', 'Logged for review', 2026-01-20 18:18:28);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (44, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt for student: STU20259433', 'Logged for review', 2026-01-20 18:19:06);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (45, 'STU20259433', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt detected', 'Logged for review', 2026-01-20 18:19:09);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (46, 'STU20259433', 'student', '127.0.0.1', 'LOGIN_RISK', 'Failed Login Threshold', 'Medium', 'Risk score: 45. Signals: New IP address; New device/browser', 'Logged for review', 2026-01-20 18:19:09);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (47, 'unknown', 'student', '127.0.0.1', 'Failed Login Attempt', 'Failed Login Threshold', 'Medium', 'Failed login attempt detected', 'Logged for review', 2026-01-20 18:33:39);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (48, 'S10310967', 'student', '127.0.0.1', 'LOGIN_RISK', 'Failed Login Threshold', 'Medium', 'Risk score: 45. Signals: New IP address; New device/browser', 'Logged for review', 2026-01-20 18:38:35);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (49, 'STU123456', 'student', '192.168.1.100', 'Multiple Login Attempts', 'Failed Login Threshold', 'Medium', 'User attempted to login 15 times in 5 minutes', 'Account Temporarily Locked', 2026-01-20 19:20:58);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (50, 'TCH789012', 'teacher', '10.0.0.50', 'Suspicious File Upload', 'File Type Validation', 'High', 'Attempted to upload executable file as course material', 'Upload Blocked', 2026-01-20 19:20:58);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (51, 'STU654321', 'student', '203.0.113.45', 'Grade Manipulation Attempt', 'Database Integrity Check', 'Critical', 'Attempted SQL injection on grades table', 'Account Suspended', 2026-01-20 19:20:58);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (52, 'STU111222', 'student', '198.51.100.25', 'Rapid Course Access', 'Access Pattern Analysis', 'Low', 'Accessed 20 courses in 2 minutes', 'Rate Limited', 2026-01-20 19:20:58);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (53, 'STU123456', 'student', '192.168.1.100', 'Multiple Login Attempts', 'Failed Login Threshold', 'Medium', 'User attempted to login 15 times in 5 minutes', 'Account Temporarily Locked', 2026-01-21 10:58:43);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (54, 'TCH789012', 'teacher', '10.0.0.50', 'Suspicious File Upload', 'File Type Validation', 'High', 'Attempted to upload executable file as course material', 'Upload Blocked', 2026-01-21 10:58:43);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (55, 'STU654321', 'student', '203.0.113.45', 'Grade Manipulation Attempt', 'Database Integrity Check', 'Critical', 'Attempted SQL injection on grades table', 'Account Suspended', 2026-01-21 10:58:43);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (56, 'STU111222', 'student', '198.51.100.25', 'Rapid Course Access', 'Access Pattern Analysis', 'Low', 'Accessed 20 courses in 2 minutes', 'Rate Limited', 2026-01-21 10:58:43);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (57, '9', 'student', '127.0.0.1', 'BRUTE_FORCE', NULL, 'High', 'Account locked for student STU20252523 due to 3 failed attempts', 'ACCOUNT_LOCKED', 2026-01-21 12:44:50);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (58, '11', 'student', '127.0.0.1', 'BRUTE_FORCE', NULL, 'High', 'Account locked for student STU20259433 due to 3 failed attempts', 'ACCOUNT_LOCKED', 2026-01-21 15:05:51);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (59, '6', 'student', '127.0.0.1', 'BRUTE_FORCE', NULL, 'High', 'Account locked for student STU20257359 due to 3 failed attempts', 'ACCOUNT_LOCKED', 2026-01-21 15:16:59);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (61, '0', 'student', '127.0.0.1', 'BRUTE_FORCE', NULL, 'High', 'Account locked for student TEST123 due to 3 failed attempts', 'ACCOUNT_LOCKED', 2026-01-21 15:39:43);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (62, '19', 'student', '127.0.0.1', 'BRUTE_FORCE', NULL, 'High', 'Account locked for student STU000019 due to 3 failed attempts', 'ACCOUNT_LOCKED', 2026-01-21 15:54:19);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (63, '8', 'student', '127.0.0.1', 'BRUTE_FORCE', NULL, 'High', 'Account locked for student STU20254553 due to 3 failed attempts', 'ACCOUNT_LOCKED', 2026-01-21 16:35:28);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (64, 'STU123456', 'student', '192.168.1.100', 'Multiple Login Attempts', 'Failed Login Threshold', 'Medium', 'User attempted to login 15 times in 5 minutes', 'Account Temporarily Locked', 2026-01-22 14:45:30);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (65, 'TCH789012', 'teacher', '10.0.0.50', 'Suspicious File Upload', 'File Type Validation', 'High', 'Attempted to upload executable file as course material', 'Upload Blocked', 2026-01-22 14:45:30);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (66, 'STU654321', 'student', '203.0.113.45', 'Grade Manipulation Attempt', 'Database Integrity Check', 'Critical', 'Attempted SQL injection on grades table', 'Account Suspended', 2026-01-22 14:45:30);
INSERT INTO `fraud_events` (`id`, `user_id`, `user_type`, `ip_address`, `event_type`, `rule_triggered`, `severity`, `description`, `action_taken`, `created_at`) VALUES (67, 'STU111222', 'student', '198.51.100.25', 'Rapid Course Access', 'Access Pattern Analysis', 'Low', 'Accessed 20 courses in 2 minutes', 'Rate Limited', 2026-01-22 14:45:30);

-- Table structure for fraud_scores
CREATE TABLE `fraud_scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` enum('user','ip') NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `score` int(11) DEFAULT 0,
  `risk_level` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_entity` (`entity_type`,`entity_id`),
  KEY `idx_score` (`score`),
  KEY `idx_risk_level` (`risk_level`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for fraud_scores
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (1, 'user', 'STU123456', 65, 'Medium', 2026-01-19 12:33:04);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (2, 'user', 'STU654321', 95, 'Critical', 2026-01-19 12:33:04);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (3, 'user', 'TCH789012', 75, 'High', 2026-01-19 12:33:04);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (4, 'ip', '203.0.113.45', 90, 'Critical', 2026-01-19 12:33:04);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (5, 'ip', '192.168.1.100', 60, 'Medium', 2026-01-19 12:33:04);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (6, 'user', 'STU20259433', 100, 'Critical', 2026-01-20 18:19:09);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (7, 'ip', '127.0.0.1', 100, 'Critical', 2026-01-20 18:38:35);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (8, 'user', 'S10310967', 100, 'Critical', 2026-01-20 18:38:35);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (9, 'user', 'STU2025180', 55, 'Medium', 2026-01-20 18:09:28);
INSERT INTO `fraud_scores` (`id`, `entity_type`, `entity_id`, `score`, `risk_level`, `last_updated`) VALUES (22, 'user', 'student_1', 25, 'Medium', 2026-01-22 17:45:44);

-- Table structure for grievance_cases
CREATE TABLE `grievance_cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_id` varchar(20) NOT NULL,
  `complainant_id` int(11) NOT NULL,
  `complainant_type` varchar(10) NOT NULL,
  `respondent_id` int(11) DEFAULT NULL,
  `respondent_type` varchar(10) DEFAULT NULL,
  `grievance_type` varchar(20) NOT NULL,
  `priority` varchar(10) DEFAULT 'medium',
  `status` varchar(20) DEFAULT 'submitted',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `incident_date` datetime DEFAULT NULL,
  `assigned_investigator` int(11) DEFAULT NULL,
  `investigation_notes` text DEFAULT NULL,
  `resolution_summary` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `registered_at` datetime DEFAULT NULL,
  `investigation_started_at` datetime DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `case_id` (`case_id`),
  KEY `idx_complainant` (`complainant_id`,`complainant_type`),
  KEY `idx_status` (`status`),
  KEY `idx_case_id` (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for grievance_cases
INSERT INTO `grievance_cases` (`id`, `case_id`, `complainant_id`, `complainant_type`, `respondent_id`, `respondent_type`, `grievance_type`, `priority`, `status`, `title`, `description`, `incident_date`, `assigned_investigator`, `investigation_notes`, `resolution_summary`, `created_at`, `registered_at`, `investigation_started_at`, `resolved_at`, `closed_at`) VALUES (1, 'GRV202614121', 1, 'student', NULL, NULL, 'harassment', 'high', 'submitted', 'student is harrasing', 'maintain this things', 2026-01-13 12:03:00, NULL, '', '', 2026-01-22 12:03:26, NULL, NULL, NULL, NULL);

-- Table structure for grievance_evidence
CREATE TABLE `grievance_evidence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_id` int(11) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_case` (`case_id`),
  CONSTRAINT `grievance_evidence_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `grievance_cases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for grievance_evidence
INSERT INTO `grievance_evidence` (`id`, `case_id`, `file_path`, `file_name`, `file_type`, `uploaded_by`, `uploaded_at`) VALUES (1, 1, 'grievance_evidence/GRV202614121_nal1.png', 'nal1.png', 'image/png', 1, 2026-01-22 12:03:26);

-- Table structure for grievance_notifications
CREATE TABLE `grievance_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `recipient_type` varchar(10) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `case_id` (`case_id`),
  KEY `idx_recipient` (`recipient_id`,`recipient_type`,`is_read`),
  CONSTRAINT `grievance_notifications_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `grievance_cases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for grievance_notifications
INSERT INTO `grievance_notifications` (`id`, `case_id`, `recipient_id`, `recipient_type`, `message`, `is_read`, `created_at`) VALUES (1, 1, 1, 'student', 'Your grievance case GRV202614121 status updated to submitted', 0, 2026-01-22 12:03:59);

-- Table structure for grievance_timeline
CREATE TABLE `grievance_timeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `performed_by` int(11) NOT NULL,
  `performed_by_type` varchar(10) NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_case_timeline` (`case_id`,`timestamp`),
  CONSTRAINT `grievance_timeline_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `grievance_cases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for grievance_timeline
INSERT INTO `grievance_timeline` (`id`, `case_id`, `action`, `description`, `performed_by`, `performed_by_type`, `timestamp`) VALUES (1, 1, 'case_submitted', 'Grievance case submitted by student #1', 1, 'student', 2026-01-22 12:03:26);
INSERT INTO `grievance_timeline` (`id`, `case_id`, `action`, `description`, `performed_by`, `performed_by_type`, `timestamp`) VALUES (2, 1, 'status_updated', 'Status changed from submitted to submitted: i will resolve it', 1, 'admin', 2026-01-22 12:03:59);

-- Table structure for integrations
CREATE TABLE `integrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `integration_type` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config`)),
  `api_key_id` int(11) DEFAULT NULL,
  `webhook_endpoint_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'inactive',
  `installed_by` int(11) NOT NULL,
  `installed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`integration_type`),
  KEY `idx_installed_by` (`installed_by`),
  KEY `idx_api_key` (`api_key_id`),
  KEY `idx_webhook` (`webhook_endpoint_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for lesson_contents
CREATE TABLE `lesson_contents` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content_type` enum('VIDEO','PDF','PPT','DOC','AUDIO') NOT NULL,
  `file_url` text NOT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `content_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `version_number` int(11) DEFAULT 1,
  `parent_template_id` int(11) DEFAULT NULL,
  `is_template` tinyint(1) DEFAULT 0,
  `template_usage_count` int(11) DEFAULT 0,
  `last_modified_by` int(11) DEFAULT NULL,
  `change_summary` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lesson_id` (`lesson_id`,`content_order`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for lesson_contents
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (2, 1, 'abc', 'abc', 'PDF', 'https://drive.google.com/file/d/1menUlZx-sbwI1LgydjfCG-gvpsRLafks/view?usp=drive_link', NULL, 1, 2026-01-02 16:37:56, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (3, 2, 'abc', 'abc', 'PDF', 'https://drive.google.com/file/d/1menUlZx-sbwI1LgydjfCG-gvpsRLafks/view?usp=drive_link', NULL, 1, 2026-01-02 16:40:52, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (4, 3, 'first video', 'video', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 1, 2026-01-02 17:16:58, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (5, 4, 'working', 'working to learn', 'VIDEO', 'https://drive.google.com/file/d/1menUlZx-sbwI1LgydjfCG-gvpsRLafks/view?usp=drive_link', NULL, 1, 2026-01-02 23:30:56, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (6, 2, 'abcd', 'abcd', 'PDF', 'https://drive.google.com/file/d/1menUlZx-sbwI1LgydjfCG-gvpsRLafks/view?usp=drive_link', NULL, 2, 2026-01-03 10:36:22, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (7, 1, 'video', 'video lean', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 2, 2026-01-03 10:49:28, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (8, 1, 'doc', 'docx', 'DOC', 'https://docs.google.com/document/d/1CUjI_6xKi5sDulB-4RSuGCVMqsGS3FRT/edit?usp=sharing&ouid=116936150297850231991&rtpof=true&sd=true', NULL, 3, 2026-01-03 11:09:26, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (9, 2, 'PPT', 'PPT in to view', 'PPT', 'https://docs.google.com/presentation/d/1hK7il5k5gR1UbFv184wO49pRJFsFt_KM/edit?usp=sharing&ouid=116936150297850231991&rtpof=true&sd=true', NULL, 3, 2026-01-03 11:28:23, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (10, 5, 'Basics', 'Hello  everyone', 'PDF', 'https://drive.google.com/file/d/1_LOrS9kBE4ipZkgqniPAh_FPhCq1EVjS/view?usp=sharing', NULL, 1, 2026-01-03 13:00:42, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (11, 6, 'Natural Numbers', 'hello everyone', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 1, 2026-01-03 13:07:15, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (12, 6, 'Whole Numbers', 'Basics of  numerics', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 2, 2026-01-03 15:04:33, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (13, 6, 'fraction Numbers', 'Basics  of  whole numbers', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 3, 2026-01-03 15:24:22, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (14, 7, 'Closure Property', '', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 1, 2026-01-03 15:30:36, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (15, 8, 'Types of Fractions', '', 'PDF', 'https://drive.google.com/file/d/1_LOrS9kBE4ipZkgqniPAh_FPhCq1EVjS/view?usp=drive_link', NULL, 1, 2026-01-03 17:11:08, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (16, 9, 'Variables', '', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 1, 2026-01-03 17:12:27, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (17, 10, 'Basics', '', 'VIDEO', 'https://drive.google.com/file/d/1JCvRqzJYs5THnep4GgZpYsDFLDtIOOtF/view?usp=drive_link', NULL, 1, 2026-01-03 17:13:11, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (18, 11, 'Natural Numbers', 'Introduction to Natural Numbers', 'VIDEO', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', NULL, 1, 2026-01-03 17:23:28, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (19, 12, 'Whole Numbers', 'Understanding Whole Numbers', 'VIDEO', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', NULL, 1, 2026-01-03 17:23:28, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (20, 13, 'Whole Numbers', 'Advanced Whole Numbers Concepts', 'VIDEO', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', NULL, 1, 2026-01-03 17:23:28, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (21, 14, 'Listening and speaking practice', '', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 1, 2026-01-12 11:30:55, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (22, 14, 'New words & meanings', 'feeling about school life', 'PPT', 'https://docs.google.com/presentation/d/1hK7il5k5gR1UbFv184wO49pRJFsFt_KM/edit?usp=sharing&ouid=116936150297850231991&rtpof=true&sd=true', NULL, 2, 2026-01-12 11:36:14, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (23, 14, 'Sentence reading', '', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 3, 2026-01-12 11:41:58, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (24, 15, 'Opposite words', '', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 1, 2026-01-12 12:47:24, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (25, 16, 'pronoun', 'you can learn briefly about pronoun', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 1, 2026-01-12 12:53:28, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (26, 17, 'Expressing feelings', '', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 1, 2026-01-20 12:54:58, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (27, 17, 'Rhyming words', '', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 2, 2026-01-20 12:55:41, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (28, 17, 'Framing simple sentences', '', 'PPT', 'https://docs.google.com/presentation/d/1hK7il5k5gR1UbFv184wO49pRJFsFt_KM/edit?usp=sharing&ouid=116936150297850231991&rtpof=true&sd=true', NULL, 3, 2026-01-20 12:56:35, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (29, 15, 'Reading aloud', '', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 2, 2026-01-20 13:00:12, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (30, 15, 'Short comprehension', '', 'PPT', 'https://docs.google.com/presentation/d/1hK7il5k5gR1UbFv184wO49pRJFsFt_KM/edit?usp=sharing&ouid=116936150297850231991&rtpof=true&sd=true', NULL, 3, 2026-01-20 13:00:38, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (31, 18, 'Nature & seasons', '', 'VIDEO', 'https://drive.google.com/file/d/1dFckQAw8e6dJZcEyUec1S15xNg2oCrgU/view?usp=sharing', NULL, 1, 2026-01-20 13:01:55, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (32, 18, 'Picture-based discussion', '', 'PPT', 'https://docs.google.com/presentation/d/1hK7il5k5gR1UbFv184wO49pRJFsFt_KM/edit?usp=sharing&ouid=116936150297850231991&rtpof=true&sd=true', NULL, 2, 2026-01-20 13:02:14, 1, NULL, 0, 0, NULL, NULL);
INSERT INTO `lesson_contents` (`id`, `lesson_id`, `title`, `description`, `content_type`, `file_url`, `duration_minutes`, `content_order`, `created_at`, `version_number`, `parent_template_id`, `is_template`, `template_usage_count`, `last_modified_by`, `change_summary`) VALUES (33, 18, 'Paragraph reading', '', 'PDF', 'Eduyata.pdf', NULL, 3, 2026-01-20 13:02:45, 1, NULL, 0, 0, NULL, NULL);

-- Table structure for lesson_progress
CREATE TABLE `lesson_progress` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `time_spent_minutes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for lessons
CREATE TABLE `lessons` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chapter_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `lesson_no` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `course_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_chapter_lesson` (`chapter_id`,`lesson_no`),
  KEY `idx_lessons_course_id` (`course_id`),
  CONSTRAINT `fk_lesson_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for lessons
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (2, 2, ' Introduction to  Fundamentals of Chemistry', 1, 2026-01-02 16:27:49, 2026-01-02 16:31:53, 'COURSE0001');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (3, 4, '  Introduction to Chemistry', 1, 2026-01-02 17:14:55, 2026-01-02 17:14:55, NULL);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (4, 5, 'Lesson 1: Introduction to Chapter 1: Introduction to Science', 1, 2026-01-02 23:29:00, 2026-01-02 23:29:00, 'COURSE0003');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (5, 6, 'Very  good topics', 1, 2026-01-03 12:57:21, 2026-01-08 23:50:37, 'COURSE0011');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (6, 7, 'Introduction to Numbers', 1, 2026-01-03 13:06:28, 2026-01-03 15:45:25, 'COURSE0012');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (7, 7, 'Properties of Numbers', 2, 2026-01-03 14:59:35, 2026-01-03 15:45:46, 'COURSE0012');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (8, 8, 'Fractions', 1, 2026-01-03 17:10:37, 2026-01-03 17:10:37, 'COURSE0012');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (9, 9, 'Introduction to  algebra', 1, 2026-01-03 17:12:03, 2026-01-03 17:12:03, 'COURSE0012');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (10, 10, 'Introduction  to Geometry', 1, 2026-01-03 17:12:56, 2026-01-03 17:12:56, 'COURSE0012');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (11, 1, 'Natural Numbers', 1, 2026-01-03 17:23:28, 2026-01-03 17:23:28, 'COURSE0001');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (12, 1, 'Whole Numbers', 2, 2026-01-03 17:23:28, 2026-01-03 17:23:28, 'COURSE0001');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (13, 1, 'Whole Numbers', 3, 2026-01-03 17:23:28, 2026-01-03 17:23:28, 'COURSE0001');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (14, 13, 'School life', 1, 2026-01-12 11:26:28, 2026-01-20 12:48:01, 'COURSE0015');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (15, 14, 'Moral values', 1, 2026-01-12 12:46:12, 2026-01-20 12:59:18, 'COURSE0015');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (16, 15, 'nouns', 1, 2026-01-12 12:52:30, 2026-01-12 12:52:30, 'COURSE0017');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (17, 13, 'Haldi’s Adventure', 2, 2026-01-20 12:48:29, 2026-01-20 12:48:29, 'COURSE0015');
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`, `created_at`, `updated_at`, `course_id`) VALUES (18, 16, 'Storm in the Garden', 1, 2026-01-20 13:01:29, 2026-01-20 13:01:29, 'COURSE0015');

-- Table structure for login_attempts
CREATE TABLE `login_attempts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(20) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `success` tinyint(1) NOT NULL,
  `failure_reason` varchar(100) DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for login_attempts
INSERT INTO `login_attempts` (`id`, `user_id`, `user_type`, `ip_address`, `user_agent`, `success`, `failure_reason`, `timestamp`) VALUES (3, 1, 'student', '192.168.1.100', 'Mozilla/5.0 Test', 0, 'invalid_password', 2026-01-22 17:45:44);
INSERT INTO `login_attempts` (`id`, `user_id`, `user_type`, `ip_address`, `user_agent`, `success`, `failure_reason`, `timestamp`) VALUES (4, 4, 'student', '127.0.0.1', 'Test Browser', 0, 'invalid_password', 2026-01-22 17:50:19);
INSERT INTO `login_attempts` (`id`, `user_id`, `user_type`, `ip_address`, `user_agent`, `success`, `failure_reason`, `timestamp`) VALUES (5, 4, 'student', '127.0.0.1', 'Test Browser', 0, 'invalid_password', 2026-01-22 17:50:31);
INSERT INTO `login_attempts` (`id`, `user_id`, `user_type`, `ip_address`, `user_agent`, `success`, `failure_reason`, `timestamp`) VALUES (6, 4, 'student', '127.0.0.1', 'Test Browser', 0, 'invalid_password', 2026-01-22 17:50:31);

-- Table structure for login_history
CREATE TABLE `login_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `user_type` enum('student','teacher','admin') DEFAULT 'student',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_status` enum('success','failed') DEFAULT 'success',
  `risk_score` int(11) DEFAULT 0,
  `risk_level` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `action_taken` enum('ALLOW','MFA_REQUIRED','BLOCK') DEFAULT 'ALLOW',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_risk_level` (`risk_level`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for login_history
INSERT INTO `login_history` (`id`, `user_id`, `user_type`, `ip_address`, `user_agent`, `login_status`, `risk_score`, `risk_level`, `action_taken`, `created_at`) VALUES (1, 'S10310967', 'student', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', 'success', 45, 'Medium', 'MFA_REQUIRED', 2026-01-20 18:38:35);

-- Table structure for onboarding_steps
CREATE TABLE `onboarding_steps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `step_id` varchar(50) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `what_to_do` text DEFAULT NULL,
  `why_matters` text DEFAULT NULL,
  `where_to_click` varchar(200) DEFAULT NULL,
  `order_num` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `step_id` (`step_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for onboarding_steps
INSERT INTO `onboarding_steps` (`id`, `step_id`, `role`, `title`, `description`, `what_to_do`, `why_matters`, `where_to_click`, `order_num`, `is_active`) VALUES (1, 'student_complete_profile', 'student', 'Complete your profile', 'Fill in your basic details', 'Fill in your basic details so we can personalize your learning experience.', 'This helps us recommend the right courses for you.', 'Click on Profile → Edit Profile', 1, 1);
INSERT INTO `onboarding_steps` (`id`, `step_id`, `role`, `title`, `description`, `what_to_do`, `why_matters`, `where_to_click`, `order_num`, `is_active`) VALUES (2, 'student_browse_courses', 'student', 'Browse Courses', 'Discover courses available for your class and board.', 'Click on "View All Courses" to explore', 'Find courses that match your learning needs', 'Click the "View All Courses" button', 2, 1);
INSERT INTO `onboarding_steps` (`id`, `step_id`, `role`, `title`, `description`, `what_to_do`, `why_matters`, `where_to_click`, `order_num`, `is_active`) VALUES (3, 'student_welcome', 'student', 'Welcome to Eduyata!', 'This is your dashboard where you can track your learning progress and access all features.', 'Get familiar with your dashboard layout', 'Your dashboard is your learning hub', 'Look at the welcome banner at the top', 1, 1);
INSERT INTO `onboarding_steps` (`id`, `step_id`, `role`, `title`, `description`, `what_to_do`, `why_matters`, `where_to_click`, `order_num`, `is_active`) VALUES (4, 'student_navigation', 'student', 'Navigation Menu', 'Use this sidebar to navigate between different sections of the platform.', 'Explore the sidebar menu options', 'Quick access to all platform features', 'Check the left sidebar menu', 2, 1);
INSERT INTO `onboarding_steps` (`id`, `step_id`, `role`, `title`, `description`, `what_to_do`, `why_matters`, `where_to_click`, `order_num`, `is_active`) VALUES (5, 'student_continue_learning', 'student', 'Continue Learning', 'Resume your enrolled courses from where you left off.', 'Click "Continue Learning" on any course', 'Pick up right where you stopped', 'Find the Continue Learning section', 4, 1);
INSERT INTO `onboarding_steps` (`id`, `step_id`, `role`, `title`, `description`, `what_to_do`, `why_matters`, `where_to_click`, `order_num`, `is_active`) VALUES (6, 'student_track_progress', 'student', 'Track Your Progress', 'Monitor your learning statistics, completed courses, and achievements here.', 'Check your progress stats regularly', 'Stay motivated by tracking your growth', 'Look at the stats cards above', 5, 1);
INSERT INTO `onboarding_steps` (`id`, `step_id`, `role`, `title`, `description`, `what_to_do`, `why_matters`, `where_to_click`, `order_num`, `is_active`) VALUES (7, 'student_profile', 'student', 'Your Profile', 'Complete your profile to personalize your learning experience.', 'Click on your profile icon to edit', 'Help us recommend the right courses', 'Click profile icon in top right', 6, 1);

-- Table structure for platform_config
CREATE TABLE `platform_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for platform_config
INSERT INTO `platform_config` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (1, 'timezone', 'Asia/Kolkata', 2026-01-20 16:04:34, 2026-01-20 16:04:34);

-- Table structure for platform_configs
CREATE TABLE `platform_configs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` longtext NOT NULL,
  `value_type` varchar(20) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `is_sensitive` tinyint(1) NOT NULL,
  `is_editable` tinyint(1) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_by_name` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for platform_configs
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (1, 'site_name', 'Eduyata', 'string', 'general', 'Platform name displayed in UI', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (2, 'site_description', 'AI-Powered Learning Platform', 'string', 'general', 'Platform description for SEO', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (3, 'maintenance_mode', 'false', 'boolean', 'general', 'Enable maintenance mode to block user access', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (4, 'default_language', 'en', 'string', 'general', 'Default language for new users', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (5, 'supported_languages', 'en,hi,kn,te', 'string', 'general', 'Comma-separated list of supported language codes (en=English, hi=Hindi, kn=Kannada, te=Telugu)', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (6, 'timezone', 'Asia/Kolkata', 'string', 'general', 'Default timezone for the platform', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (7, 'email_notifications_enabled', 'true', 'boolean', 'email', 'Enable or disable email notifications globally', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (8, 'email_from_name', 'Eduyata', 'string', 'email', 'Sender name for outgoing emails', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (9, 'email_reply_to', 'support@eduyata.com', 'string', 'email', 'Reply-to email address', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (10, 'max_file_upload_size', '10485760', 'integer', 'storage', 'Maximum file upload size in bytes (10MB default)', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (11, 'allowed_file_types', 'pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,png,mp4', 'string', 'storage', 'Comma-separated list of allowed file extensions', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (12, 'max_video_size', '104857600', 'integer', 'storage', 'Maximum video upload size in bytes (100MB default)', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (13, 'session_timeout_minutes', '60', 'integer', 'security', 'Session timeout in minutes', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (14, 'max_login_attempts', '5', 'integer', 'security', 'Maximum failed login attempts before lockout', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (15, 'lockout_duration_minutes', '15', 'integer', 'security', 'Account lockout duration in minutes', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (16, 'allow_user_registration', 'true', 'boolean', 'security', 'Allow new users to register', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (17, 'require_email_verification', 'true', 'boolean', 'security', 'Require email verification for new accounts', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (18, 'password_min_length', '8', 'integer', 'security', 'Minimum password length', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (19, 'api_rate_limit_per_hour', '1000', 'integer', 'api', 'Maximum API requests per hour per user', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (20, 'api_key_expiry_days', '365', 'integer', 'api', 'API key validity in days', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (21, 'enable_public_api', 'true', 'boolean', 'api', 'Enable public API access', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (22, 'push_notifications_enabled', 'true', 'boolean', 'notification', 'Enable push notifications', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (23, 'sms_notifications_enabled', 'false', 'boolean', 'notification', 'Enable SMS notifications', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (24, 'notification_digest_frequency', 'daily', 'string', 'notification', 'Email digest frequency: instant, daily, weekly', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (25, 'primary_color', '#667eea', 'string', 'appearance', 'Primary theme color (hex)', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (26, 'secondary_color', '#764ba2', 'string', 'appearance', 'Secondary theme color (hex)', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (27, 'logo_url', '/logo.png', 'string', 'appearance', 'Platform logo URL', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (28, 'favicon_url', '/favicon.ico', 'string', 'appearance', 'Favicon URL', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (29, 'google_analytics_id', '', 'string', 'integration', 'Google Analytics tracking ID', 1, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (30, 'facebook_pixel_id', '', 'string', 'integration', 'Facebook Pixel ID', 1, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (31, 'stripe_enabled', 'false', 'boolean', 'integration', 'Enable Stripe payment integration', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');
INSERT INTO `platform_configs` (`id`, `key`, `value`, `value_type`, `category`, `description`, `is_sensitive`, `is_editable`, `updated_by`, `updated_by_name`, `updated_at`, `created_at`) VALUES (32, 'razorpay_enabled', 'false', 'boolean', 'integration', 'Enable Razorpay payment integration', 0, 1, 1, 'System', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000');

-- Table structure for project_documents
CREATE TABLE `project_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `file` varchar(100) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_documents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for project_documents
INSERT INTO `project_documents` (`id`, `project_id`, `title`, `file`, `uploaded_at`) VALUES (3, 2, 'ugy', 'project_documents/Performance_Report_3.pdf', 2025-11-17 15:41:41);
INSERT INTO `project_documents` (`id`, `project_id`, `title`, `file`, `uploaded_at`) VALUES (4, 4, 'sdas', 'project_documents/Presentation.pptx', 2025-11-17 15:44:13);
INSERT INTO `project_documents` (`id`, `project_id`, `title`, `file`, `uploaded_at`) VALUES (5, 5, 'efas', 'project_documents/iLoveMerge.docx', 2025-11-17 16:28:19);
INSERT INTO `project_documents` (`id`, `project_id`, `title`, `file`, `uploaded_at`) VALUES (6, 7, 'related files', 'project_documents/Performance_Report.pdf', 2025-11-18 12:13:08);
INSERT INTO `project_documents` (`id`, `project_id`, `title`, `file`, `uploaded_at`) VALUES (7, 8, 'job huduktidivi', 'project_documents/iLoveMerge_WG4Juzr.docx', 2025-11-19 10:19:46);
INSERT INTO `project_documents` (`id`, `project_id`, `title`, `file`, `uploaded_at`) VALUES (8, 9, 'related', 'project_documents/ssp_3rd.pdf', 2025-11-20 12:39:35);
INSERT INTO `project_documents` (`id`, `project_id`, `title`, `file`, `uploaded_at`) VALUES (9, 10, 'aldsd', 'project_documents/photo.jpeg.pdf', 2025-11-20 12:56:40);

-- Table structure for project_group_members
CREATE TABLE `project_group_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_group_student` (`group_id`,`student_id`),
  CONSTRAINT `project_group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `project_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for project_group_members
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (6, 3, 1, 'Alice Johnson', 2025-11-17 15:41:12);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (7, 3, 2, 'Bob Smith', 2025-11-17 15:41:12);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (8, 3, 4, 'Diana Prince', 2025-11-17 15:41:12);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (9, 4, 1, 'Alice Johnson', 2025-11-17 15:44:29);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (10, 4, 2, 'Bob Smith', 2025-11-17 15:44:29);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (11, 4, 3, 'Charlie Brown', 2025-11-17 15:44:29);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (12, 5, 1, 'Alice Johnson', 2025-11-17 16:27:55);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (13, 5, 2, 'Bob Smith', 2025-11-17 16:27:56);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (14, 5, 3, 'Charlie Brown', 2025-11-17 16:27:56);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (15, 5, 4, 'Diana Prince', 2025-11-17 16:27:56);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (16, 6, 1, 'Alice Johnson', 2025-11-18 11:06:47);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (17, 6, 2, 'Bob Smith', 2025-11-18 11:06:47);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (18, 6, 3, 'Charlie Brown', 2025-11-18 11:06:47);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (19, 7, 1, 'Alice Johnson', 2025-11-18 12:12:39);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (20, 7, 2, 'Bob Smith', 2025-11-18 12:12:39);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (21, 7, 3, 'Charlie Brown', 2025-11-18 12:12:39);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (22, 7, 4, 'Diana Prince', 2025-11-18 12:12:39);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (23, 8, 5, 'Eve Wilson', 2025-11-18 12:34:02);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (24, 8, 6, 'Frank Miller', 2025-11-18 12:34:02);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (25, 9, 2, 'Jane Smith', 2025-11-19 10:19:13);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (26, 9, 1, 'John Doe', 2025-11-19 10:19:13);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (27, 9, 3, 'Mike Johnson', 2025-11-19 10:19:13);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (28, 9, 4, 'Sarah Wilson', 2025-11-19 10:19:13);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (29, 10, 1, 'John Doe', 2025-11-20 12:39:07);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (30, 10, 2, 'Jane Smith', 2025-11-20 12:39:07);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (31, 10, 3, 'Mike Johnson', 2025-11-20 12:39:07);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (32, 10, 4, 'Sarah Wilson', 2025-11-20 12:39:07);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (33, 11, 26, 'swathi', 2025-11-20 12:56:06);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (34, 11, 25, 'Virat', 2025-11-20 12:56:06);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (35, 11, 24, 'Darshan', 2025-11-20 12:56:06);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (36, 11, 23, 'Darshan', 2025-11-20 12:56:06);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (37, 12, 11, 'Arun Kumar', 2025-11-24 10:57:32);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (38, 12, 24, 'Darshan', 2025-11-24 10:57:32);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (39, 12, 21, 'Devika', 2025-11-24 10:57:32);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (40, 12, 14, 'Kohli', 2025-11-24 10:57:32);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (41, 13, 15, 'Darshan', 2025-12-23 09:04:57);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (42, 13, 24, 'Darshan', 2025-12-23 09:04:57);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (43, 13, 23, 'Darshan', 2025-12-23 09:04:57);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (44, 13, 21, 'Devika', 2025-12-23 09:04:57);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (45, 13, 19, 'Darshan', 2025-12-23 09:04:57);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (46, 14, 11, 'Arun Kumar', 2025-12-23 09:07:10);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (47, 14, 4, 'd', 2025-12-23 09:07:10);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (48, 15, 26, 'swathi', 2025-12-24 10:49:46);
INSERT INTO `project_group_members` (`id`, `group_id`, `student_id`, `student_name`, `joined_at`) VALUES (49, 15, 22, 'Adisha', 2025-12-24 10:49:46);

-- Table structure for project_groups
CREATE TABLE `project_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_groups_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for project_groups
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (3, 2, 'mnhg', 2025-11-17 15:41:12);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (4, 4, 'asc', 2025-11-17 15:44:29);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (5, 5, 'darshan', 2025-11-17 16:27:55);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (6, 6, 'team alpha', 2025-11-18 11:06:47);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (7, 7, 'Hackathon', 2025-11-18 12:12:39);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (8, 7, 'alpha', 2025-11-18 12:34:02);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (9, 8, 'kaali kuntiv job kodroo', 2025-11-19 10:19:13);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (10, 9, 'Alstonair', 2025-11-20 12:39:07);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (11, 10, 'Alpha', 2025-11-20 12:56:06);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (12, 11, 'RCB', 2025-11-24 10:57:32);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (13, 12, 'Alpa', 2025-12-23 09:04:57);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (14, 12, 'Prohject NAl', 2025-12-23 09:07:10);
INSERT INTO `project_groups` (`id`, `project_id`, `name`, `created_at`) VALUES (15, 13, 'eduyata_Main', 2025-12-24 10:49:46);

-- Table structure for projects
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `due_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for projects
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (2, 'lms', 'learning', 1, 2025-11-17 14:56:43, 2025-11-17 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (4, 'sdac', 'acasd', 1, 2025-11-17 15:43:50, 2025-12-25 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (5, 'Eduyata', 'lms', 1, 2025-11-17 16:27:25, 2025-12-31 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (6, 'eduyata', 'learning management system', 1, 2025-11-18 11:06:12, 2025-12-31 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (7, 'Library management system', 'library managing ', 1, 2025-11-18 12:12:04, 2025-12-25 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (8, 'job search', 'job searching portal', 1, 2025-11-18 17:39:41, 2026-02-12 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (9, 'Web', 'Web design', 1, 2025-11-20 12:38:17, 2025-12-30 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (10, 'hub', 'fimly hub', 1, 2025-11-20 12:47:07, 2025-11-30 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (11, 'Eduayata', 'education learning platform', 11, 2025-11-24 10:56:48, 2026-01-30 00:00:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (12, 'Prohject NAl', 'kjhgfdfgh', 1, 2025-12-23 09:04:30, 2026-01-06 18:30:00, 1);
INSERT INTO `projects` (`id`, `title`, `description`, `teacher_id`, `created_at`, `due_date`, `is_active`) VALUES (13, 'eduyata_Main', 'proejct work', 1, 2025-12-24 10:49:13, 2026-01-07 00:00:00, 1);

-- Table structure for quiz_results
CREATE TABLE `quiz_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `quiz_type` enum('topic_quiz','chapter_quiz','final_quiz','practice_quiz') DEFAULT 'topic_quiz',
  `attempt_number` int(11) DEFAULT 1,
  `score` int(11) NOT NULL,
  `total_questions` int(11) NOT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answers`)),
  `percentage` decimal(5,2) NOT NULL,
  `time_taken` int(11) DEFAULT NULL,
  `is_passed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_quiz_results_student` (`student_id`),
  KEY `idx_quiz_results_course` (`course_id`),
  KEY `idx_quiz_results_topic` (`topic`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for quiz_results
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (1, 11, 5, 'Introduction', 'topic_quiz', 1, 2, 2, '[1, 0]', 100.00, 30, 1, 2025-11-17 15:03:27, 2025-11-17 15:03:27);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (2, 11, 5, 'Introduction', 'topic_quiz', 1, 0, 2, '[2, 1]', 0.00, 30, 0, 2025-11-17 15:11:48, 2025-11-17 15:11:48);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (3, 11, 5, 'What is the Web and Internet', 'topic_quiz', 1, 2, 2, '[0, 1]', 100.00, 30, 1, 2025-11-17 15:12:16, 2025-11-17 15:12:16);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (4, 11, 5, 'What is the Web and Internet', 'topic_quiz', 1, 1, 2, '[1, 1]', 50.00, 30, 0, 2025-11-17 15:12:26, 2025-11-17 15:12:26);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (5, 11, 5, 'What is the Web and Internet', 'topic_quiz', 1, 1, 2, '[0, 0]', 50.00, 30, 0, 2025-11-17 15:12:38, 2025-11-17 15:12:38);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (6, 11, 1, 'Installing web browsers', 'topic_quiz', 1, 2, 2, '[1, 1]', 100.00, 30, 1, 2025-11-17 15:27:00, 2025-11-17 15:27:00);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (7, 11, 1, 'Introduction', 'topic_quiz', 1, 1, 2, '[0, 0]', 50.00, 30, 0, 2025-11-17 15:36:16, 2025-11-17 15:36:16);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (8, 11, 1, 'What is an API', 'topic_quiz', 1, 1, 2, '[0, 0]', 50.00, 30, 0, 2025-11-17 15:36:45, 2025-11-17 15:36:45);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (9, 11, 5, 'Introduction', 'topic_quiz', 1, 1, 2, '[0, 0]', 50.00, 30, 0, 2025-11-17 15:53:04, 2025-11-17 15:53:04);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (10, 11, 1, 'Planning your web project', 'topic_quiz', 1, 0, 2, '[0, 0]', 0.00, 30, 0, 2025-11-17 16:04:09, 2025-11-17 16:04:09);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (11, 11, 1, 'Sketching your website design', 'topic_quiz', 1, 1, 2, '[0, 1]', 50.00, 30, 0, 2025-11-17 16:05:37, 2025-11-17 16:05:37);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (12, 11, 1, 'Choosing Assets', 'topic_quiz', 1, 0, 2, '[0, 0]', 0.00, 30, 0, 2025-11-17 16:06:54, 2025-11-17 16:06:54);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (13, 11, 1, 'Choosing Assets', 'topic_quiz', 1, 2, 2, '[1, 2]', 100.00, 30, 1, 2025-11-17 16:07:03, 2025-11-17 16:07:03);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (14, 11, 1, 'Creating project folder structure', 'topic_quiz', 1, 1, 2, '[0, 1]', 50.00, 30, 0, 2025-11-17 16:08:50, 2025-11-17 16:08:50);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (15, 11, 6, 'Introduction', 'topic_quiz', 1, 1, 2, '[0, 0]', 50.00, 30, 0, 2025-11-17 16:33:53, 2025-11-17 16:33:53);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (16, 11, 5, 'What is the Web and Internet', 'topic_quiz', 1, 1, 2, '[0, 0]', 50.00, 30, 0, 2025-11-17 17:03:18, 2025-11-17 17:03:18);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (17, 11, 5, 'What is HTTP', 'topic_quiz', 1, 2, 2, '[0, 1]', 100.00, 30, 1, 2025-11-17 17:04:02, 2025-11-17 17:04:02);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (18, 11, 5, 'Installing web browsers', 'topic_quiz', 1, 2, 2, '[1, 1]', 100.00, 30, 1, 2025-11-17 17:04:24, 2025-11-17 17:04:24);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (19, 11, 5, 'What is an API', 'topic_quiz', 1, 2, 2, '[0, 1]', 100.00, 30, 1, 2025-11-17 17:05:38, 2025-11-17 17:05:38);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (20, 11, 5, 'Planning your web project', 'topic_quiz', 1, 1, 2, '[1, 0]', 50.00, 30, 0, 2025-11-17 17:06:03, 2025-11-17 17:06:03);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (21, 11, 5, 'Sketching your website design', 'topic_quiz', 1, 2, 2, '[2, 1]', 100.00, 30, 1, 2025-11-17 17:06:50, 2025-11-17 17:06:50);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (22, 11, 5, 'Choosing Assets', 'topic_quiz', 1, 1, 2, '[1, 3]', 50.00, 30, 0, 2025-11-17 17:07:22, 2025-11-17 17:07:22);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (23, 11, 5, 'Creating project folder structure', 'topic_quiz', 1, 2, 2, '[1, 1]', 100.00, 30, 1, 2025-11-17 17:07:50, 2025-11-17 17:07:50);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (24, 11, 6, 'What is the Web and Internet', 'topic_quiz', 1, 2, 2, '[0, 1]', 100.00, 30, 1, 2025-11-17 17:45:19, 2025-11-17 17:45:19);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (25, 11, 6, 'What is HTTP', 'topic_quiz', 1, 2, 2, '[0, 1]', 100.00, 30, 1, 2025-11-17 17:45:55, 2025-11-17 17:45:55);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (26, 11, 6, 'Installing web browsers', 'topic_quiz', 1, 2, 2, '[1, 1]', 100.00, 30, 1, 2025-11-17 17:46:10, 2025-11-17 17:46:10);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (27, 11, 6, 'What is an API', 'topic_quiz', 1, 2, 2, '[0, 1]', 100.00, 30, 1, 2025-11-17 17:46:41, 2025-11-17 17:46:41);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (28, 11, 6, 'Planning your web project', 'topic_quiz', 1, 1, 2, '[2, 1]', 50.00, 30, 0, 2025-11-17 17:47:13, 2025-11-17 17:47:13);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (29, 11, 6, 'Sketching your website design', 'topic_quiz', 1, 2, 2, '[2, 1]', 100.00, 30, 1, 2025-11-17 17:47:47, 2025-11-17 17:47:47);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (30, 11, 6, 'Choosing Assets', 'topic_quiz', 1, 1, 2, '[1, 3]', 50.00, 30, 0, 2025-11-17 17:48:16, 2025-11-17 17:48:16);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (31, 11, 6, 'Creating project folder structure', 'topic_quiz', 1, 2, 2, '[1, 1]', 100.00, 30, 1, 2025-11-17 17:48:54, 2025-11-17 17:48:54);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (32, 6, 1, 'Introduction', 'topic_quiz', 1, 2, 2, '[1, 0]', 100.00, 30, 1, 2026-01-02 12:06:01, 2026-01-02 12:06:01);
INSERT INTO `quiz_results` (`id`, `student_id`, `course_id`, `topic`, `quiz_type`, `attempt_number`, `score`, `total_questions`, `answers`, `percentage`, `time_taken`, `is_passed`, `created_at`, `updated_at`) VALUES (33, 6, 1, 'What is the Web and Internet', 'topic_quiz', 1, 1, 2, '[3, 1]', 50.00, 30, 0, 2026-01-02 12:06:51, 2026-01-02 12:06:51);

-- Table structure for schedules
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) NOT NULL,
  `event_datetime` datetime NOT NULL,
  `event_type` varchar(20) NOT NULL,
  `assigned_to` varchar(20) NOT NULL,
  `reminder_1_day` tinyint(1) DEFAULT 0,
  `reminder_1_hour` tinyint(1) DEFAULT 0,
  `created_by` varchar(100) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reminder_1_day_sent` tinyint(1) DEFAULT 0,
  `reminder_1_hour_sent` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for schedules
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (1, 'Meeting Based on Perfomance ', 2025-11-14 18:51:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-11-14 14:52:32, 2025-11-14 14:52:32, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (2, 'Meeting Based on Perfomance ', 2025-11-22 14:57:00, 'Course', 'Faculty', 1, 1, 'admin', 2025-11-14 14:57:37, 2025-11-14 14:57:37, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (3, 'Meeting Based on Perfomance ', 2025-11-29 19:09:00, 'Course', 'Faculty', 1, 1, 'admin', 2025-11-14 15:05:35, 2025-11-14 15:05:35, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (4, 'Meeting Based on Perfomance ', 2025-11-28 15:17:00, 'Assessment', 'Faculty', 1, 1, 'admin', 2025-11-14 15:13:01, 2025-11-14 15:13:01, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (5, 'Meeting Based on Perfomance ', 2025-11-22 20:20:00, 'Maintenance', 'Faculty', 1, 1, 'admin', 2025-11-14 15:20:21, 2025-11-14 15:20:21, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (6, 'Meeting Based on Perfomance ', 2025-11-28 20:44:00, 'Course', 'Faculty', 1, 1, 'admin', 2025-11-14 15:45:09, 2025-11-14 15:45:09, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (7, 'Meeting Based on Perfomance ', 2025-11-22 19:50:00, 'Course', 'Students', 1, 1, 'admin', 2025-11-14 16:50:38, 2025-11-14 16:50:38, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (8, 'Meeting Based on Perfomance ', 2025-11-22 23:01:00, 'Course', 'Students', 1, 1, 'admin', 2025-11-14 17:02:05, 2025-11-14 17:02:05, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (9, 'Meeting Based on Perfomance ', 2025-11-28 22:10:00, 'Course', 'Students', 1, 1, 'admin', 2025-11-14 17:06:04, 2025-11-14 17:06:04, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (10, 'Meeting Based on Perfomance ', 2025-11-28 23:12:00, 'General', 'Faculty', 1, 1, 'admin', 2025-11-14 17:06:37, 2025-11-14 17:06:37, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (11, 'Meeting Based on Perfomance ', 2025-11-28 22:42:00, 'Maintenance', 'Students', 1, 1, 'admin', 2025-11-14 17:37:19, 2025-11-14 17:37:19, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (12, 'Meeting Based on Perfomance ', 2025-11-28 22:49:00, 'Maintenance', 'Students', 1, 1, 'admin', 2025-11-14 17:44:18, 2025-11-14 17:44:18, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (13, 'Meeting Based on Perfomance ', 2025-11-21 22:47:00, 'General', 'Students', 1, 1, 'admin', 2025-11-14 17:47:20, 2025-11-14 17:47:20, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (14, 'Meeting Based on Perfomance ', 2025-11-28 22:54:00, 'Maintenance', 'Students', 1, 1, 'admin', 2025-11-14 17:49:14, 2025-11-14 17:49:14, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (15, 'Meeting based on courses content', 2025-11-21 14:36:00, 'Course', 'Faculty', 1, 1, 'admin', 2025-11-18 10:33:08, 2025-11-18 10:33:08, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (16, 'meeting based on course content', 2025-11-20 16:09:00, 'Course', 'Faculty', 1, 1, 'admin', 2025-11-18 11:09:49, 2025-11-18 11:09:49, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (17, 'meeting based on course content', 2025-11-20 11:10:00, 'Course', 'Students', 0, 1, 'admin', 2025-11-18 11:10:35, 2025-11-18 11:10:35, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (18, 'Meeting Based on Perfomance ', 2025-11-20 17:01:00, 'Maintenance', 'Everyone', 1, 1, 'admin', 2025-11-18 12:01:40, 2025-11-18 12:01:40, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (19, 'Meeting Based on Perfomance ', 2025-11-20 12:22:00, 'General', 'Everyone', 1, 1, 'admin', 2025-11-18 12:22:17, 2025-11-18 12:22:17, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (20, 'meeting based on course content', 2025-11-28 12:30:00, 'Assessment', 'Faculty', 1, 1, 'admin', 2025-11-18 12:26:02, 2025-11-18 12:26:02, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (21, 'Meeting Based on Perfomance ', 2025-11-20 17:47:00, 'Maintenance', 'Everyone', 1, 1, 'admin', 2025-11-18 12:47:44, 2025-11-18 12:47:44, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (22, 'meeting based on course content', 2025-11-28 12:29:00, 'Assessment', 'Everyone', 1, 1, 'admin', 2025-11-18 07:29:52, 2025-11-18 07:29:52, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (23, 'Meeting Based on Perfomance ', 2025-11-22 11:42:00, 'Maintenance', 'Students', 1, 1, 'admin', 2025-11-18 07:42:48, 2025-11-18 07:42:48, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (24, 'Test Meeting', 2025-11-18 10:50:00, 'General', 'Faculty', 0, 1, 'admin', 2025-11-18 10:03:52, 2025-11-18 10:07:27, 0, 1);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (25, 'meet up ', 2025-11-18 11:31:00, 'Assessment', 'Everyone', 0, 1, 'admin', 2025-11-18 10:06:07, 2025-11-18 10:06:07, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (26, 'Meeting Based on Perfomance ', 2025-12-26 07:18:00, 'Maintenance', 'Students', 0, 1, 'admin', 2025-12-23 07:18:33, 2025-12-23 07:18:33, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (27, 'meeting based on course content', 2025-12-24 09:13:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 09:13:46, 2025-12-23 09:13:46, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (28, 'Meeting Based on Perfomance ', 2025-12-31 17:13:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:13:26, 2025-12-23 17:13:26, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (29, 'meet up ', 2025-12-24 17:26:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:26:10, 2025-12-23 17:26:10, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (30, 'Client meet', 2025-12-31 17:27:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:27:12, 2025-12-23 17:27:12, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (31, 'Client meet', 2026-01-07 17:29:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:29:29, 2025-12-23 17:29:29, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (32, 'meeting based on course content', 2026-01-10 17:32:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:32:59, 2025-12-23 17:32:59, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (33, 'Client meet', 2026-01-05 17:35:00, 'Maintenance', 'Faculty', 0, 1, 'admin', 2025-12-23 17:35:46, 2025-12-23 17:35:46, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (34, 'yes meet', 2025-12-31 17:36:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:37:02, 2025-12-23 17:37:02, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (35, 'yes meet', 2025-12-31 17:38:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:38:14, 2025-12-23 17:38:14, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (36, 'Meeting Based on Perfomance ', 2025-12-27 17:40:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:40:55, 2025-12-23 17:40:55, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (37, 'meeting based on course content', 2025-12-30 17:41:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:41:58, 2025-12-23 17:41:58, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (38, 'Meeting Based on Perfomance ', 2026-01-07 17:44:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-23 17:44:10, 2025-12-23 17:44:10, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (39, 'meeting based on course content', 2025-12-23 17:46:34, 'Course', 'Faculty', 0, 0, 'admin', 2025-12-23 17:46:34, 2025-12-23 17:46:34, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (40, 'Meeting Based on Perfomance ', 2025-12-23 17:48:32, 'Course', 'Faculty', 0, 0, 'admin', 2025-12-23 17:48:32, 2025-12-23 17:48:32, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (41, 'meeting based on course content', 2025-12-23 17:53:35, 'Course', 'Faculty', 0, 0, 'admin', 2025-12-23 17:53:35, 2025-12-23 17:53:35, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (42, 'Client meet', 2025-12-31 10:29:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-24 10:29:19, 2025-12-24 10:29:19, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (43, 'Meeting Based on Perfomance ', 2025-12-25 10:35:00, 'Course', 'Faculty', 0, 1, 'admin', 2025-12-24 10:35:39, 2025-12-24 10:35:39, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (44, 'friends meet', 2025-12-31 10:39:00, 'Course', 'Students', 0, 1, 'admin', 2025-12-24 10:39:26, 2025-12-24 10:39:26, 0, 0);
INSERT INTO `schedules` (`id`, `event_name`, `event_datetime`, `event_type`, `assigned_to`, `reminder_1_day`, `reminder_1_hour`, `created_by`, `created_at`, `updated_at`, `reminder_1_day_sent`, `reminder_1_hour_sent`) VALUES (45, 'meeting', 2026-01-15 13:16:00, 'General', 'Everyone', 0, 0, 'admin', 2026-01-12 13:15:02, 2026-01-12 13:15:02, 0, 0);

-- Table structure for security_events
CREATE TABLE `security_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type` varchar(50) DEFAULT NULL,
  `severity` enum('low','medium','high','critical') DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `resolved` tinyint(1) DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_severity_timestamp` (`severity`,`timestamp`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_resolved` (`resolved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for session_events
CREATE TABLE `session_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('student','teacher','admin') NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `idx_user_events` (`user_id`,`user_type`),
  KEY `idx_event_type` (`event_type`),
  CONSTRAINT `session_events_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `user_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for session_events
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (1, 1, 26, 'student', 'login', '127.0.0.1', '47c3701fbdc69eb04da2fa5529f9171ff21bb90bc42a6ad6b99b24ca6e3c9b6d', '{"new_device": true}', 2026-01-21 09:23:16);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (2, 2, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": true}', 2026-01-21 09:24:12);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (3, 3, 1, 'teacher', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 09:34:03);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (4, 4, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 09:34:10);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (5, 5, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 09:37:12);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (6, 6, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 09:45:21);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (7, 1, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 09:46:06);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (8, 7, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 09:46:06);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (9, 2, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 09:47:21);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (10, 8, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 09:47:21);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (11, 5, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 09:48:11);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (12, 9, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 09:48:11);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (13, 7, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 15:37:04);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (14, 10, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:37:04);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (15, 8, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 15:37:13);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (16, 11, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:37:13);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (17, 9, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 15:38:41);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (18, 12, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:38:41);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (19, 13, 1, 'teacher', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:40:27);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (20, 10, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 15:49:08);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (21, 14, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:49:08);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (22, 11, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 15:49:33);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (23, 15, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:49:33);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (24, 12, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 15:57:43);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (25, 16, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:57:43);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (26, 14, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 15:59:55);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (27, 17, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 15:59:55);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (28, 18, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 16:50:44);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (29, 4, 1, 'admin', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-21 16:56:24);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (30, 19, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-21 16:56:24);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (31, 20, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 10:17:29);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (32, 21, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 10:21:34);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (33, 22, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 11:52:59);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (34, 23, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 11:53:08);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (35, 20, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 11:53:36);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (36, 24, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 11:53:37);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (37, 22, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 11:53:59);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (38, 25, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 11:53:59);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (39, 23, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 11:55:15);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (40, 26, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 11:55:15);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (41, 24, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 12:09:26);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (42, 27, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:09:26);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (43, 25, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 12:09:35);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (44, 28, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:09:35);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (45, 26, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 12:11:28);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (46, 29, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:11:28);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (47, 27, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 12:16:18);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (48, 30, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:16:18);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (49, 31, 10, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:18:19);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (50, 32, 10, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:21:00);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (51, 33, 10, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:24:40);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (52, 15, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 12:25:22);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (53, 34, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:25:22);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (54, 16, 26, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-22 12:26:58);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (55, 35, 26, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-22 12:26:58);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (56, 31, 10, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 04:46:09);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (57, 36, 10, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 04:46:09);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (58, 32, 10, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 04:57:02);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (59, 37, 10, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 04:57:02);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (60, 38, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 04:58:00);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (61, 28, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 04:59:59);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (62, 39, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 04:59:59);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (63, 40, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 05:01:01);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (64, 29, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 05:07:21);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (65, 41, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 05:07:21);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (66, 21, 1, 'admin', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 05:09:49);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (67, 42, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 05:09:49);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (68, 30, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 05:13:30);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (69, 43, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 05:13:30);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (70, 39, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 05:16:54);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (71, 44, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 05:16:54);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (72, 38, 1, 'admin', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 05:19:37);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (73, 45, 1, 'admin', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 05:19:37);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (74, 41, 5, 'student', 'revoked', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"reason": "session_limit_exceeded"}', 2026-01-23 06:13:03);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (75, 46, 5, 'student', 'login', '127.0.0.1', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '{"new_device": false}', 2026-01-23 06:13:03);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (76, 47, 5, 'student', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": true}', 2026-01-28 07:46:26);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (77, 48, 3, 'teacher', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 07:47:38);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (78, 49, 26, 'student', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 07:48:42);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (79, 50, 5, 'student', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 09:44:45);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (80, 51, 5, 'student', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 09:45:24);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (81, 52, 1, 'teacher', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 09:47:19);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (82, 53, 26, 'student', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 09:49:01);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (83, 54, 1, 'teacher', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 09:51:16);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (84, 47, 5, 'student', 'revoked', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"reason": "session_limit_exceeded"}', 2026-01-28 10:03:56);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (85, 55, 5, 'student', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 10:03:56);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (86, 50, 5, 'student', 'revoked', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"reason": "session_limit_exceeded"}', 2026-01-28 10:14:16);
INSERT INTO `session_events` (`id`, `session_id`, `user_id`, `user_type`, `event_type`, `ip_address`, `device_id`, `details`, `created_at`) VALUES (87, 56, 5, 'student', 'login', '127.0.0.1', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '{"new_device": false}', 2026-01-28 10:14:16);

-- Table structure for session_policies
CREATE TABLE `session_policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(100) NOT NULL,
  `max_concurrent_sessions` int(11) DEFAULT 3,
  `session_timeout_minutes` int(11) DEFAULT 1440,
  `max_devices_per_user` int(11) DEFAULT 5,
  `require_device_approval` tinyint(1) DEFAULT 0,
  `auto_logout_inactive` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for session_policies
INSERT INTO `session_policies` (`id`, `policy_name`, `max_concurrent_sessions`, `session_timeout_minutes`, `max_devices_per_user`, `require_device_approval`, `auto_logout_inactive`, `created_at`, `updated_at`) VALUES (1, 'default', 3, 1440, 5, 0, 1, 2026-01-20 15:30:11, 2026-01-20 15:30:11);
INSERT INTO `session_policies` (`id`, `policy_name`, `max_concurrent_sessions`, `session_timeout_minutes`, `max_devices_per_user`, `require_device_approval`, `auto_logout_inactive`, `created_at`, `updated_at`) VALUES (2, 'default', 3, 1440, 5, 0, 1, 2026-01-21 14:48:21, 2026-01-21 14:48:21);

-- Table structure for skill_endorsements
CREATE TABLE `skill_endorsements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `endorser_id` int(11) NOT NULL,
  `endorser_type` enum('teacher','peer') NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  `skill_category` varchar(50) NOT NULL,
  `level` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
  `evidence_type` enum('assignment','quiz','project','participation') DEFAULT NULL,
  `evidence_id` int(11) DEFAULT NULL,
  `evidence_score` decimal(5,2) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_ai_suggested` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_student_skill` (`student_id`,`skill_name`),
  KEY `idx_endorser` (`endorser_id`,`endorser_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for skill_endorsements
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (1, 22, 11, 'teacher', 'Biology', 'Science', 'intermediate', 'participation', NULL, 90.00, 'Excellent work', 0, 2025-11-20 11:00:29);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (2, 22, 11, 'teacher', 'Physics', 'Science', 'beginner', 'quiz', NULL, 60.00, '', 0, 2025-11-20 11:02:08);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (3, 22, 11, 'teacher', 'Physics', 'Science', 'beginner', 'project', NULL, 49.70, '', 0, 2025-11-20 11:06:51);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (4, 22, 11, 'teacher', 'Chemistry', 'Science', 'intermediate', 'project', NULL, 75.80, '', 0, 2025-11-20 11:10:02);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (5, 22, 11, 'teacher', 'Calculus', 'Mathematics', 'intermediate', 'project', NULL, 66.00, '', 0, 2025-11-20 11:14:55);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (6, 12, 11, 'teacher', 'Biology', 'Science', 'beginner', 'assignment', NULL, 34.00, '', 0, 2025-11-20 11:15:19);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (7, 6, 11, 'teacher', 'Leadership', 'Soft Skills', 'intermediate', 'participation', NULL, 49.80, '', 0, 2025-11-20 11:16:44);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (8, 6, 11, 'teacher', 'Statistics', 'Mathematics', 'beginner', 'project', NULL, 55.80, '', 0, 2025-11-20 11:18:17);
INSERT INTO `skill_endorsements` (`id`, `student_id`, `endorser_id`, `endorser_type`, `skill_name`, `skill_category`, `level`, `evidence_type`, `evidence_id`, `evidence_score`, `message`, `is_ai_suggested`, `created_at`) VALUES (9, 17, 14, 'teacher', 'Algebra', 'Mathematics', 'intermediate', 'participation', NULL, 67.00, 'good going, keep it up', 0, 2025-11-21 14:11:16);

-- Table structure for social_accounts
CREATE TABLE `social_accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `provider` varchar(30) NOT NULL,
  `provider_id` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `name` varchar(255) NOT NULL,
  `picture_url` varchar(200) NOT NULL,
  `user_type` varchar(20) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `educator_id` int(11) DEFAULT NULL,
  `access_token` longtext NOT NULL,
  `refresh_token` longtext NOT NULL,
  `token_expires_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_accounts_provider_provider_id_77d8e592_uniq` (`provider`,`provider_id`),
  KEY `social_acco_email_2e8666_idx` (`email`),
  KEY `social_acco_user_ty_b27fff_idx` (`user_type`,`student_id`),
  KEY `social_acco_user_ty_db557d_idx` (`user_type`,`educator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for student_activities
CREATE TABLE `student_activities` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `activity_type` varchar(20) NOT NULL,
  `action` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for student_activities
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (1, 14, 'enrolled', 'Enrolled in course', 'Physics Fundamentals', 'Physics Fundamentals', 2025-09-16 10:50:35);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (2, 14, 'enrolled', 'Enrolled in course', 'Class 12: Plant Biology', 'Class 12: Plant Biology', 2025-09-16 10:56:44);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (3, 15, 'enrolled', 'Enrolled in course', 'Advanced Calculus & Applications', 'Advanced Calculus & Applications', 2025-09-16 11:17:28);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (4, 15, 'enrolled', 'Enrolled in course', 'Physics Fundamentals', 'Physics Fundamentals', 2025-09-16 11:28:56);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (5, 15, 'enrolled', 'Enrolled in course', 'Introduction to Artificial Intelligence', 'Introduction to Artificial Intelligence', 2025-09-16 13:04:57);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (6, 15, 'enrolled', 'Enrolled in course', 'Creative Writing Workshop', 'Creative Writing Workshop', 2025-09-16 13:06:43);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (7, 15, 'enrolled', 'Enrolled in course', 'Web Development Bootcamp', 'Web Development Bootcamp', 2025-09-16 14:50:30);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (8, 13, 'enrolled', 'Enrolled in course', 'Physics Fundamentals', 'Physics Fundamentals', 2025-09-16 15:49:09);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (9, 13, 'enrolled', 'Enrolled in course', 'Creative Writing Workshop', 'Creative Writing Workshop', 2025-09-16 17:28:25);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (10, 19, 'enrolled', 'Enrolled in course', 'Web Development Bootcamp', 'Web Development Bootcamp', 2025-09-18 10:53:04);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (11, 24, 'enrolled', 'Enrolled in course', 'Advanced Calculus & Applications', 'Advanced Calculus & Applications', 2025-09-18 14:36:27);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (12, 23, 'enrolled', 'Enrolled in course', 'Creative Writing Workshop', 'Creative Writing Workshop', 2025-09-18 14:40:55);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (13, 22, 'enrolled', 'Enrolled in course', 'Advanced Calculus & Applications', 'Advanced Calculus & Applications', 2025-09-22 13:25:09);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (14, 22, 'enrolled', 'Enrolled in course', 'Introduction to Artificial Intelligence', 'Introduction to Artificial Intelligence', 2025-09-22 16:35:39);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (15, 22, 'enrolled', 'Enrolled in course', 'Web Development Bootcamp', 'Web Development Bootcamp', 2025-09-22 17:47:26);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (16, 22, 'enrolled', 'Enrolled in course', 'Creative Writing Workshop', 'Creative Writing Workshop', 2025-09-24 12:46:25);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (17, 22, 'enrolled', 'Enrolled in course', 'Physics Fundamentals', 'Physics Fundamentals', 2025-09-24 12:52:46);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (18, 26, 'enrolled', 'Enrolled in course', 'Advanced Calculus & Applications', 'Advanced Calculus & Applications', 2025-10-07 12:47:57);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (0, 23, 'enrolled', 'Enrolled in course', 'Advanced Calculus & Applications', 'Advanced Calculus & Applications', 2025-10-14 17:39:46);
INSERT INTO `student_activities` (`id`, `student_id`, `activity_type`, `action`, `subject`, `course_name`, `created_at`) VALUES (0, 23, 'enrolled', 'Enrolled in course', 'Web Development Bootcamp', 'Web Development Bootcamp', 2025-10-15 17:50:07);

-- Table structure for student_badges
CREATE TABLE `student_badges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL,
  `earned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `context` text DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_badge` (`student_id`,`badge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for student_consent
CREATE TABLE `student_consent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consent_type` varchar(50) NOT NULL,
  `is_granted` tinyint(1) DEFAULT 0,
  `granted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for student_enrollments
CREATE TABLE `student_enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrollment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `completion_date` timestamp NULL DEFAULT NULL,
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `status` enum('enrolled','in_progress','completed','dropped') DEFAULT 'enrolled',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for student_enrollments
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (1, 5, 1, 2025-08-05 13:43:07, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (2, 5, 2, 2025-08-05 14:18:21, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (3, 5, 3, 2025-08-05 15:36:39, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (4, 6, 6, 2025-08-06 11:27:57, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (5, 5, 6, 2025-08-07 10:18:44, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (6, 7, 6, 2025-08-07 10:34:15, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (7, 8, 6, 2025-08-21 10:54:38, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (8, 8, 1, 2025-08-21 11:19:12, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (9, 8, 5, 2025-08-21 11:20:34, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (10, 9, 6, 2025-08-21 16:55:06, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (11, 9, 5, 2025-08-21 16:56:20, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (12, 9, 1, 2025-08-21 17:03:16, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (13, 9, 3, 2025-08-22 09:58:24, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (14, 11, 1, 2025-09-02 11:00:17, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (15, 11, 6, 2025-09-02 11:01:46, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (16, 11, 5, 2025-09-09 10:53:02, NULL, 0.00, 'completed');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (17, 13, 6, 2025-09-09 15:55:34, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (18, 14, 5, 2025-09-09 17:39:49, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (19, 12, 4, 2025-09-10 12:03:13, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (20, 12, 1, 2025-09-10 12:43:14, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (21, 12, 2, 2025-09-10 12:45:34, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (22, 13, 1, 2025-09-11 12:06:42, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (23, 14, 2, 2025-09-15 10:24:35, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (24, 14, 1, 2025-09-15 10:24:58, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (25, 14, 3, 2025-09-16 10:50:35, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (26, 14, 6, 2025-09-16 10:56:44, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (27, 15, 1, 2025-09-16 11:17:28, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (28, 15, 3, 2025-09-16 11:28:56, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (29, 15, 5, 2025-09-16 13:04:57, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (30, 15, 4, 2025-09-16 13:06:43, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (31, 15, 2, 2025-09-16 14:50:30, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (32, 13, 3, 2025-09-16 15:49:09, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (33, 13, 4, 2025-09-16 17:28:25, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (34, 19, 2, 2025-09-18 10:53:04, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (35, 24, 1, 2025-09-18 14:36:27, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (36, 23, 4, 2025-09-18 14:40:55, NULL, 0.00, '');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (37, 22, 1, 2025-09-22 13:25:10, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (38, 22, 5, 2025-09-22 16:35:40, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (39, 22, 2, 2025-09-22 17:47:27, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (40, 22, 4, 2025-09-24 12:46:25, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (41, 22, 3, 2025-09-24 12:52:46, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (42, 26, 1, 2025-10-07 07:17:57, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (43, 23, 1, 2025-10-14 12:09:46, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (44, 23, 2, 2025-10-15 12:20:07, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (87, 25, 2, 2025-11-15 10:40:56, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (88, 26, 3, 2025-11-15 10:42:37, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (89, 7, 5, 2025-11-15 10:43:05, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (90, 7, 4, 2025-11-15 10:43:24, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (91, 11, 4, 2025-12-23 13:25:55, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (92, 11, 9, 2025-12-23 14:31:31, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (93, 6, 2, 2025-12-29 15:28:24, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (94, 6, 1, 2025-12-30 09:59:37, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (95, 6, 5, 2025-12-30 10:02:18, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (96, 6, 3, 2025-12-30 10:51:31, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (97, 10, 12, 2026-01-03 13:11:53, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (98, 26, 15, 2026-01-12 11:33:49, NULL, 0.00, 'enrolled');
INSERT INTO `student_enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `completion_date`, `progress_percentage`, `status`) VALUES (99, 26, 17, 2026-01-12 12:57:31, NULL, 0.00, 'enrolled');

-- Table structure for student_notifications
CREATE TABLE `student_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=561 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for student_notifications
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (1, 23, 'Successfully enrolled in Advanced Calculus & Applications', 0, 2025-10-14 17:39:46);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (2, 23, 'Successfully enrolled in Web Development Bootcamp', 0, 2025-10-15 17:50:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (3, 4, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (4, 5, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (5, 6, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (6, 7, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (7, 8, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (8, 9, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (9, 10, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (10, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 1, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (11, 12, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (12, 13, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (13, 14, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (14, 15, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (15, 16, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (16, 17, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (17, 18, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (18, 19, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (19, 20, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (20, 21, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (21, 22, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (22, 23, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (23, 24, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (24, 25, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (25, 26, 'New Schedule: Meeting Based on Perfomance  - 2025-11-28 22:54 (Maintenance)', 0, 2025-11-14 17:49:14);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (26, 25, 'Successfully enrolled in Web Development Bootcamp', 0, 2025-11-15 10:40:56);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (27, 26, 'Successfully enrolled in Physics Fundamentals', 1, 2025-11-15 10:42:37);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (28, 7, 'Successfully enrolled in Introduction to Artificial Intelligence', 0, 2025-11-15 10:43:05);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (29, 7, 'Successfully enrolled in Creative Writing Workshop', 0, 2025-11-15 10:43:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (30, 4, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (31, 5, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (32, 6, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (33, 7, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (34, 8, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (35, 9, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (36, 10, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (37, 11, 'exam

ready to exams', 1, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (38, 12, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (39, 13, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (40, 14, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (41, 15, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (42, 16, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (43, 17, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (44, 18, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (45, 19, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (46, 20, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (47, 21, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (48, 22, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (49, 23, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (50, 24, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (51, 25, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (52, 26, 'exam

ready to exams', 0, 2025-11-18 10:50:54);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (53, 4, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (54, 5, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (55, 6, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (56, 7, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (57, 8, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (58, 9, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (59, 10, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 1, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (60, 11, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 1, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (61, 12, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (62, 13, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (63, 14, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (64, 15, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (65, 16, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (66, 17, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (67, 18, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (68, 19, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (69, 20, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (70, 21, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (71, 22, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (72, 23, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (73, 24, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (74, 25, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (75, 26, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (76, 4, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (77, 5, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (78, 6, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (79, 7, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (80, 8, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (81, 9, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (82, 10, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (83, 11, 'Exam 

next week', 1, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (84, 12, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (85, 13, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (86, 14, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (87, 15, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (88, 16, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (89, 17, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (90, 18, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (91, 19, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (92, 20, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (93, 21, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (94, 22, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (95, 23, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (96, 24, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (97, 25, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (98, 26, 'Exam 

next week', 0, 2025-11-18 11:12:10);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (99, 4, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (100, 5, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (101, 6, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (102, 7, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (103, 8, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (104, 9, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (105, 10, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (106, 11, 'Holiday

Next Monday Holiday', 1, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (107, 12, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (108, 13, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (109, 14, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (110, 15, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (111, 16, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (112, 17, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (113, 18, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (114, 19, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (115, 20, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (116, 21, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (117, 22, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (118, 23, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (119, 24, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (120, 25, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (121, 26, 'Holiday

Next Monday Holiday', 0, 2025-11-18 11:26:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (122, 4, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (123, 5, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (124, 6, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (125, 7, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (126, 8, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (127, 9, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (128, 10, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (129, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 1, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (130, 12, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (131, 13, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (132, 14, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (133, 15, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (134, 16, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (135, 17, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (136, 18, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (137, 19, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (138, 20, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (139, 21, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (140, 22, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (141, 23, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (142, 24, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (143, 25, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (144, 26, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (145, 4, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (146, 5, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (147, 6, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (148, 7, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (149, 8, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (150, 9, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (151, 10, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (152, 11, 'Holiday

Next week Hoilday', 1, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (153, 12, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (154, 13, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (155, 14, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (156, 15, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (157, 16, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (158, 17, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (159, 18, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (160, 19, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (161, 20, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (162, 21, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (163, 22, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (164, 23, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (165, 24, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (166, 25, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (167, 26, 'Holiday

Next week Hoilday', 0, 2025-11-18 12:06:51);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (168, 4, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (169, 5, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (170, 6, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (171, 7, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (172, 8, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (173, 9, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (174, 10, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (175, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 1, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (176, 12, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (177, 13, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (178, 14, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (179, 15, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (180, 16, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (181, 17, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (182, 18, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (183, 19, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (184, 20, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (185, 21, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (186, 22, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (187, 23, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (188, 24, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (189, 25, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (190, 26, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (191, 4, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (192, 5, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (193, 6, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (194, 7, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (195, 8, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (196, 9, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (197, 10, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (198, 11, 'Exam

next week', 1, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (199, 12, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (200, 13, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (201, 14, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (202, 15, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (203, 16, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (204, 17, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (205, 18, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (206, 19, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (207, 20, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (208, 21, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (209, 22, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (210, 23, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (211, 24, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (212, 25, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (213, 26, 'Exam

next week', 0, 2025-11-18 12:25:13);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (214, 4, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (215, 5, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (216, 6, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (217, 7, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (218, 8, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (219, 9, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (220, 10, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (221, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 1, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (222, 12, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (223, 13, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (224, 14, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (225, 15, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (226, 16, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (227, 17, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (228, 18, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (229, 19, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (230, 20, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (231, 21, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (232, 22, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (233, 23, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (234, 24, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (235, 25, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (236, 26, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (237, 4, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (238, 5, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (239, 6, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (240, 7, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (241, 8, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (242, 9, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (243, 10, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (244, 11, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 1, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (245, 12, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (246, 13, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (247, 14, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (248, 15, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (249, 16, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (250, 17, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (251, 18, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (252, 19, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (253, 20, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (254, 21, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (255, 22, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (256, 23, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (257, 24, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (258, 25, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (259, 26, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (260, 4, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (261, 5, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (262, 6, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (263, 7, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (264, 8, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (265, 9, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (266, 10, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (267, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 1, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (268, 12, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (269, 13, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (270, 14, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (271, 15, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (272, 16, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (273, 17, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (274, 18, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (275, 19, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (276, 20, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (277, 21, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (278, 22, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (279, 23, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (280, 24, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (281, 25, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (282, 26, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (283, 4, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (284, 5, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (285, 6, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (286, 7, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (287, 8, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (288, 9, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (289, 10, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (290, 11, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 1, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (291, 12, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (292, 13, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (293, 14, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (294, 15, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (295, 16, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (296, 17, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (297, 18, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (298, 19, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (299, 20, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (300, 21, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (301, 22, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (302, 23, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (303, 24, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (304, 25, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (305, 26, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (306, 4, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (307, 5, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (308, 6, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (309, 7, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (310, 8, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (311, 9, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (312, 10, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (313, 11, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 1, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (314, 12, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (315, 13, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (316, 14, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (317, 15, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (318, 16, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (319, 17, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (320, 18, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (321, 19, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (322, 20, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (323, 21, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (324, 22, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (325, 23, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (326, 24, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (327, 25, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (328, 26, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (329, 4, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (330, 5, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (331, 6, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (332, 7, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (333, 8, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (334, 9, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (335, 10, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (336, 11, 'send Announcement Title 

send message', 1, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (337, 12, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (338, 13, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (339, 14, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (340, 15, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (341, 16, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (342, 17, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (343, 18, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (344, 19, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (345, 20, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (346, 21, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (347, 22, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (348, 23, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (349, 24, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (350, 25, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (351, 26, 'send Announcement Title 

send message', 0, 2025-12-23 10:27:17);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (352, 4, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (353, 5, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (354, 6, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (355, 7, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (356, 8, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (357, 9, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (358, 10, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (359, 11, 'send

send', 1, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (360, 12, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (361, 13, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (362, 14, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (363, 15, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (364, 16, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (365, 17, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (366, 18, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (367, 19, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (368, 20, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (369, 21, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (370, 22, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (371, 23, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (372, 24, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (373, 25, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (374, 26, 'send

send', 0, 2025-12-23 11:21:47);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (375, 4, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (376, 5, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (377, 6, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (378, 7, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (379, 8, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (380, 9, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (381, 10, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (382, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 1, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (383, 12, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (384, 13, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (385, 14, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (386, 15, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (387, 16, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (388, 17, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (389, 18, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (390, 19, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (391, 20, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (392, 21, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (393, 22, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (394, 23, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (395, 24, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (396, 25, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (397, 26, 'New Schedule: Meeting Based on Perfomance  - 2025-12-26 12:48 (Maintenance)', 0, 2025-12-23 12:48:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (398, 11, 'Successfully enrolled in Creative Writing Workshop', 1, 2025-12-23 13:25:55);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (399, 11, 'Successfully enrolled in anatomy', 1, 2025-12-23 14:31:31);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (400, 4, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (401, 5, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (402, 6, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (403, 7, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (404, 8, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (405, 9, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (406, 10, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (407, 11, 'holiday

meet', 1, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (408, 12, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (409, 13, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (410, 14, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (411, 15, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (412, 16, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (413, 17, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (414, 18, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (415, 19, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (416, 20, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (417, 21, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (418, 22, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (419, 23, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (420, 24, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (421, 25, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (422, 26, 'holiday

meet', 0, 2025-12-23 14:42:22);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (423, 4, 'exen

meet', 0, 2025-12-23 16:58:02);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (424, 5, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (425, 6, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (426, 7, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (427, 8, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (428, 9, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (429, 10, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (430, 11, 'exen

meet', 1, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (431, 12, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (432, 13, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (433, 14, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (434, 15, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (435, 16, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (436, 17, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (437, 18, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (438, 19, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (439, 20, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (440, 21, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (441, 22, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (442, 23, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (443, 24, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (444, 25, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (445, 26, 'exen

meet', 0, 2025-12-23 16:58:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (446, 4, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (447, 5, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (448, 6, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (449, 7, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (450, 8, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (451, 9, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (452, 10, 'exam

send', 1, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (453, 11, 'exam

send', 1, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (454, 12, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (455, 13, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (456, 14, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (457, 15, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (458, 16, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (459, 17, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (460, 18, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (461, 19, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (462, 20, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (463, 21, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (464, 22, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (465, 23, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (466, 24, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (467, 25, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (468, 26, 'exam

send', 0, 2025-12-23 17:54:03);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (469, 4, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (470, 5, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (471, 6, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (472, 7, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (473, 8, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (474, 9, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (475, 10, 'exam

good', 1, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (476, 11, 'exam

good', 1, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (477, 12, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (478, 13, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (479, 14, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (480, 15, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (481, 16, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (482, 17, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (483, 18, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (484, 19, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (485, 20, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (486, 21, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (487, 22, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (488, 23, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (489, 24, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (490, 25, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (491, 26, 'exam

good', 0, 2025-12-23 17:56:07);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (492, 4, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (493, 5, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (494, 6, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (495, 7, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (496, 8, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (497, 9, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (498, 10, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (499, 11, 'exam

good', 1, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (500, 12, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (501, 13, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (502, 14, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (503, 15, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (504, 16, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (505, 17, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (506, 18, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (507, 19, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (508, 20, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (509, 21, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (510, 22, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (511, 23, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (512, 24, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (513, 25, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (514, 26, 'exam

good', 0, 2025-12-24 10:38:24);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (515, 4, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (516, 5, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (517, 6, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (518, 7, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (519, 8, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (520, 9, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (521, 10, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (522, 11, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (523, 12, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (524, 13, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (525, 14, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (526, 15, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (527, 16, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (528, 17, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (529, 18, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (530, 19, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (531, 20, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (532, 21, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (533, 22, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (534, 23, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (535, 24, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (536, 25, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (537, 26, 'urgent meeting

urgent meeting', 0, 2026-01-12 13:07:16);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (538, 4, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (539, 5, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (540, 6, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (541, 7, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (542, 8, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (543, 9, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (544, 10, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (545, 11, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (546, 12, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (547, 13, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (548, 14, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (549, 15, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (550, 16, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (551, 17, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (552, 18, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (553, 19, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (554, 20, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (555, 21, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:32);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (556, 22, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (557, 23, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (558, 24, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (559, 25, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:33);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (560, 26, 'urgent meeting

urgent meeting regarding improvement', 0, 2026-01-12 13:13:33);

-- Table structure for student_progress
CREATE TABLE `student_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `progress` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`progress`)),
  `completed` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`completed`)),
  `quiz_attempts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`quiz_attempts`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_course` (`student_id`,`course_id`),
  KEY `idx_student_progress_student` (`student_id`),
  KEY `idx_student_progress_course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for student_progress
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (1, 11, 5, '{"Introduction": 100, "What is the Web and Internet": 100, "What is HTTP": 100, "Installing web browsers": 100, "What is an API": 100, "Planning your web project": 100, "Sketching your website design": 100, "Choosing Assets": 100, "Creating project folder structure": 100}', '[]', '{}', 2025-11-17 15:11:44, 2025-12-23 13:28:57);
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (3, 11, 1, '{"Introduction": 0, "What is the Web and Internet": 100, "What is HTTP": 0, "Installing web browsers": 72, "What is an API": 100, "Planning your web project": 100, "Sketching your website design": 100, "Choosing Assets": 100, "Creating project folder structure": 100}', '["Introduction", "What is the Web and Internet", "What is HTTP"]', '{}', 2025-11-17 15:23:48, 2025-12-23 14:31:00);
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (4, 11, 6, '{"Introduction": 100}', '[]', '{}', 2025-11-17 17:34:21, 2025-12-23 13:28:57);
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (5, 11, 4, '{"Introduction": 31, "What is the Web and Internet": 0, "What is HTTP": 0, "Installing web browsers": 64, "What is an API": 0, "Planning your web project": 0, "Sketching your website design": 0, "Choosing Assets": 0, "Creating project folder structure": 0}', '[]', '{}', 2025-12-23 13:26:08, 2025-12-23 13:28:57);
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (6, 11, 9, '{"Introduction": 24}', '[]', '{}', 2025-12-23 14:31:41, 2025-12-23 14:32:18);
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (7, 6, 1, '{"Introduction": 100, "What is the Web and Internet": 100, "What is HTTP": 0, "Installing web browsers": 0, "What is an API": 0, "Planning your web project": 0, "Sketching your website design": 0, "Choosing Assets": 0, "Creating project folder structure": 0}', '["Introduction", "What is the Web and Internet", "What is HTTP"]', '{}', 2026-01-02 12:05:31, 2026-01-03 10:38:07);

-- Table structure for students
CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `mobile_self` varchar(15) NOT NULL,
  `class` varchar(255) DEFAULT NULL,
  `board` varchar(255) DEFAULT NULL,
  `profile_picture` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password_hash` varchar(255) NOT NULL DEFAULT '',
  `date_of_birth` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `parent_name` varchar(255) DEFAULT '',
  `parent_phone` varchar(15) DEFAULT '',
  `interests` text DEFAULT NULL,
  `profile_completed` tinyint(1) DEFAULT 0,
  `onboarding_completed` tinyint(1) DEFAULT 0,
  `mobile_self_encrypted` text DEFAULT NULL,
  `address_encrypted` text DEFAULT NULL,
  `parent_phone_encrypted` text DEFAULT NULL,
  `encryption_key_id` int(11) DEFAULT NULL,
  KEY `idx_students_encrypted` (`encryption_key_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for students
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (4, 'STU20258610', 'd', '', '1234567890', '10', 'icse', '', 2025-08-04 17:45:27, 2025-08-05 10:01:43, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (5, 'STU20250284', 'da', 'male', '9113046752', '7', 'cbse', '', 2025-08-05 10:03:37, 2025-08-05 12:18:18, '$2y$10$riCxaTRw6rSBUi.HjOK6TeJ6svcBnRgVzvVIimZJEgMtIT9zlDk0O', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (6, 'STU20257359', 'Adisha', 'female', '9113046752', '12', 'state', '', 2025-08-06 11:13:17, 2025-08-06 11:14:56, '$2y$10$LHQxG4umz287LLaoj/6E.u6.msRaqrxNylYKOmcqFqfgGP/WtAK2G', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (7, 'STU20259176', 'Darshan', 'male', '9111111111', '10', 'icse', '', 2025-08-07 10:32:28, 2025-08-07 10:33:50, '$2y$10$yBmsnlaBymORYIgze/BVKOBGFe87montZMGWlD/PbFwelALVvBhk2', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (8, 'STU20254553', 'Darshan', 'male', '9113046752', '9', 'cbse', '', 2025-08-21 10:49:48, 2025-11-11 07:26:45, '$2y$10$DcmpJief66Outn0/tfmxZOISwij0CBFIJEPmyAaQ7paRvl/AOENTK', NULL, '', '', '', '["Science","Mathematics"]', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (9, 'STU20252523', 'Darshan', 'male', '9113046755', '7', 'icse', '', 2025-08-21 16:53:25, 2025-08-21 16:59:00, '$2y$10$Og0VvFBXQa4mh01iMIn3s.9M1TOc.5UgXNS4mKwWA.W96IR3u9R.W', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (10, 'STU20251807', 'da', '', '9113046752', '1', 'cbse', '', 2025-08-30 11:02:23, 2025-08-30 11:02:23, '$2y$10$vy1uaV7zY.lPJLm5kRBaqeY3R38dNOvOG5tlSzE1Rrdz.KA4udFye', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (11, 'STU20259433', 'Arun Kumar', 'male', '9223637098', '9', 'icse', '', 2025-09-02 10:57:22, 2025-12-23 07:58:22, '$2y$10$k2xJwV6GoPwM5YG74FA52eqGwS0J.ATt4x.XC8ay53D7Vld750VRK', NULL, '', '', '', '["Science","Chemistry"]', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (12, 'STU20259054', 'Darshan', 'male', '9113046755', '12', 'state', '', 2025-09-09 15:43:33, 2025-09-10 13:52:06, '$2y$10$BY5DMrGmWB2cHlRt3bO99ezqLssHrsFSVx6nrHOgHtrVWqxHJ7mOS', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (13, 'STU20255349', 'Virat', '', '9876543210', '6', 'cbse', '', 2025-09-09 15:54:32, 2025-09-09 15:55:18, '$2y$10$a0pciVtd7F4XLfNxi8jfe.nlh/QqTUMTjvvXgzawQHwp.rNVz86PK', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (14, 'STU20256695', 'Kohli', '', '9876543210', '4', 'icse', '', 2025-09-09 16:09:37, 2025-09-09 16:09:37, '$2y$10$R/MJSba0N4Dx.ngw1NK1/.suAt3yoyLDwfYj3jmnjpJUqYVqnoOP2', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (15, 'STU000015', 'Darshan', '', '9113046753', '7', 'icse', '', 2025-09-16 11:11:50, 2025-09-16 11:11:50, 'pbkdf2_sha256$600000$Po6njYtidevH9khCMX7D8f$um74FTNqIkU7wrNHEFgUDGvkUAD/d6ZvePawIIA/JgI=', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (16, 'STU000016', 'ABD', '', '9223637098', '3', 'icse', '', 2025-09-17 16:29:09, 2025-09-17 16:29:09, 'pbkdf2_sha256$600000$Wuqz3zLrbFDMBZpRnj8c2R$+bwrcp1yDz78xd7lBqqAVabGmOqR6f/XfgCtT04Gd1s=', NULL, NULL, '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (17, 'STU000017', 'ABD', 'male', '9223637099', '8', 'igcse', '', 2025-09-17 16:45:04, 2025-09-17 16:45:55, 'pbkdf2_sha256$600000$yVt0gNsKv2Zu2u4WtcCanm$rU8qVUQ688iZYLIjBm6tiQJmEPLX0G2Ou9uq3R7VF1Q=', 2004-02-17, 'Bangalore', 'RCB', '9876543210', '["Mathematics", "Science", "Arts"]', 1, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (18, 'STU000018', 'Virat', 'male', '9223637098', '6', 'icse', '', 2025-09-17 17:14:10, 2025-09-17 17:56:59, 'pbkdf2_sha256$600000$Re3Dwg7ExrP3BMES7EeTwp$lZGLsX/Jujxhtuu06n5HB1wvVAL6ftXHqbQ4MGC3JcM=', 2025-09-11, 'asdfg', 'erfgn', '1234567890', '["Physics","Biology","Economics"]', 1, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (19, 'STU000019', 'Darshan', '', '9113046752', '6', 'icse', '', 2025-09-18 08:27:08, 2025-09-18 08:27:08, 'pbkdf2_sha256$600000$y1FuKGTSJGjtBdjZFCds2g$Jy/tax2U9B5vCMDQR9Gym8fKaLgaCOR90IuknxmAchA=', NULL, '', '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (20, 'STU000020', 'Devika', '', '9380199999', '1', 'icse', '', 2025-09-18 11:04:50, 2025-09-18 11:04:50, 'pbkdf2_sha256$600000$0WxvjOGyuKmrtEPOb8U4Vw$dvWXpgKdYKeCDrdgp3QeLDN81iEzTk18uFs41FUVU/A=', NULL, '', '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (21, 'STU000021', 'Devika', '', '9380199999', '1', 'icse', '', 2025-09-18 11:05:56, 2025-09-18 11:05:56, 'pbkdf2_sha256$600000$fBi7ITRJYjwPGCcc1Tsl8A$TAHEV7hHOMGdf9HPtTeh+OZtHGP4oXJ4jR5aQvPQmuk=', NULL, '', '', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (22, 'STU000022', 'Adisha', 'female', '9113046752', '12', 'state', '', 2025-09-18 11:09:24, 2025-09-22 13:25:39, 'pbkdf2_sha256$600000$3i2fNmpegDkyV6bToLcWbV$xuBA5/Z3VB0PeqHm0rFl4KXI98Sg5fa+Hm8FwuMDVYU=', NULL, '', 'Darshan', '', '', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (23, 'STU000023', 'Darshan', 'male', '9113046752', '10', 'CBSE', '', 2025-09-18 11:13:49, 2025-11-11 05:28:00, 'pbkdf2_sha256$600000$Hfqha8PSM6vbouUWfqeVfD$2FG1amgbG9zX7665hRW6U1+jhaYSPFqa5MF//GbQpXc=', NULL, '', '', '', '["Mathematics","Chemistry"]', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (24, 'STU000024', 'Darshan', '', '9113046752', '4', 'icse', '', 2025-09-18 14:27:06, 2025-09-18 14:27:30, 'pbkdf2_sha256$600000$kpcmGvdsi5sqqy6BPhdJpR$R40RhHLn4MUpXcn1zPLyc9Qys/OpCuuzqsj4/CTNRAQ=', NULL, '', '', '', '', 1, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (25, 'STU000025', 'Virat', 'male', '9223637099', '1', 'igcse', '', 2025-09-22 15:43:12, 2025-09-22 16:05:52, 'pbkdf2_sha256$600000$xXWR6Z7eCFYyOFF3mA7oIK$yT6nkNhHB4mamb/zWpAaidC/MWzzPrD8++QLOvdlxJ0=', 2025-09-12, 'dfghjkl', 'wefgbn', '23456789', '["Science", "Arts"]', 1, 0, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`, `onboarding_completed`, `mobile_self_encrypted`, `address_encrypted`, `parent_phone_encrypted`, `encryption_key_id`) VALUES (26, 'S10310967', 'swathi', NULL, '7096785335', '2', 'cbse', '', 2025-10-07 07:16:35, 2026-01-12 13:00:24, 'pbkdf2_sha256$1000000$cypdAvGElb12z1WTePYfWh$V1wjhioO2+wDn91FoJQDuWj/HQnFTOtMmf5ewLUiYTo=', 2026-01-15, '', '', '', '["Mathematics"]', 0, 0, NULL, NULL, NULL, NULL);

-- Table structure for subjects
CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for subjects
INSERT INTO `subjects` (`id`, `name`) VALUES (2, 'Computer Science');
INSERT INTO `subjects` (`id`, `name`) VALUES (3, 'Economics');
INSERT INTO `subjects` (`id`, `name`) VALUES (4, 'English');
INSERT INTO `subjects` (`id`, `name`) VALUES (5, 'Environmental Science');
INSERT INTO `subjects` (`id`, `name`) VALUES (6, 'General Knowledge');
INSERT INTO `subjects` (`id`, `name`) VALUES (7, 'Hindi');
INSERT INTO `subjects` (`id`, `name`) VALUES (8, 'Mathematics');
INSERT INTO `subjects` (`id`, `name`) VALUES (9, 'Physics');
INSERT INTO `subjects` (`id`, `name`) VALUES (10, 'Sanskrit');

-- Table structure for support_tickets
CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('student','teacher') NOT NULL,
  `category` enum('technical','course','payment','account','general') NOT NULL,
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `assigned_to_admin` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_id` (`ticket_id`),
  KEY `idx_user` (`user_id`,`user_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for support_tickets
INSERT INTO `support_tickets` (`id`, `ticket_id`, `user_id`, `user_type`, `category`, `priority`, `status`, `subject`, `description`, `assigned_to_admin`, `created_at`, `updated_at`, `resolved_at`) VALUES (1, 'TKT202665873', 1, 'student', 'payment', 'medium', 'in_progress', 'my payment stuck', 'check y its stuck', NULL, 2026-01-22 12:02:13, 2026-01-22 12:04:40, NULL);

-- Table structure for system_metrics
CREATE TABLE `system_metrics` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `metric_type` varchar(50) NOT NULL,
  `value` float NOT NULL,
  `unit` varchar(20) DEFAULT '%',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `server_name` varchar(100) DEFAULT 'main',
  PRIMARY KEY (`id`),
  KEY `system_metr_metric__ef2754_idx` (`metric_type`,`timestamp`),
  KEY `system_metr_timesta_206ca6_idx` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for system_metrics
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (1, 'cpu_usage', 14.1, '%', 2026-01-22 12:48:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (2, 'memory_usage', 73.2, '%', 2026-01-22 12:48:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (3, 'disk_usage', 51.2, '%', 2026-01-22 12:48:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (4, 'response_time', 0.231743, 'ms', 2026-01-22 12:48:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (5, 'cpu_usage', 15.1, '%', 2026-01-22 12:48:46, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (6, 'memory_usage', 72.2, '%', 2026-01-22 12:48:46, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (7, 'disk_usage', 51.2, '%', 2026-01-22 12:48:46, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (8, 'response_time', 0.334501, 'ms', 2026-01-22 12:48:46, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (9, 'cpu_usage', 7.6, '%', 2026-01-22 12:49:15, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (10, 'memory_usage', 71.5, '%', 2026-01-22 12:49:15, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (11, 'disk_usage', 51.2, '%', 2026-01-22 12:49:15, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (12, 'response_time', 0.224113, 'ms', 2026-01-22 12:49:15, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (13, 'cpu_usage', 9.1, '%', 2026-01-22 12:49:34, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (14, 'memory_usage', 72.0, '%', 2026-01-22 12:49:34, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (15, 'disk_usage', 51.2, '%', 2026-01-22 12:49:34, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (16, 'response_time', 0.326157, 'ms', 2026-01-22 12:49:34, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (17, 'cpu_usage', 13.8, '%', 2026-01-22 12:49:51, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (18, 'memory_usage', 69.4, '%', 2026-01-22 12:49:51, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (19, 'disk_usage', 51.2, '%', 2026-01-22 12:49:51, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (20, 'response_time', 0.235081, 'ms', 2026-01-22 12:49:51, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (21, 'cpu_usage', 8.2, '%', 2026-01-22 12:50:02, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (22, 'memory_usage', 69.5, '%', 2026-01-22 12:50:02, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (23, 'disk_usage', 51.2, '%', 2026-01-22 12:50:02, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (24, 'response_time', 0.48089, 'ms', 2026-01-22 12:50:02, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (25, 'cpu_usage', 13.2, '%', 2026-01-22 12:50:06, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (26, 'memory_usage', 69.7, '%', 2026-01-22 12:50:06, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (27, 'disk_usage', 51.2, '%', 2026-01-22 12:50:06, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (28, 'response_time', 0.259399, 'ms', 2026-01-22 12:50:06, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (29, 'cpu_usage', 44.5, '%', 2026-01-22 13:21:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (30, 'memory_usage', 67.3, '%', 2026-01-22 13:21:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (31, 'disk_usage', 51.2, '%', 2026-01-22 13:21:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (32, 'response_time', 0.368357, 'ms', 2026-01-22 13:21:35, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (33, 'cpu_usage', 19.3, '%', 2026-01-22 13:21:54, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (34, 'memory_usage', 65.8, '%', 2026-01-22 13:21:54, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (35, 'disk_usage', 51.2, '%', 2026-01-22 13:21:54, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (36, 'response_time', 0.566959, 'ms', 2026-01-22 13:21:54, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (37, 'cpu_usage', 33.1, '%', 2026-01-22 16:14:00, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (38, 'memory_usage', 71.5, '%', 2026-01-22 16:14:00, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (39, 'disk_usage', 51.1, '%', 2026-01-22 16:14:00, 'main');
INSERT INTO `system_metrics` (`id`, `metric_type`, `value`, `unit`, `timestamp`, `server_name`) VALUES (40, 'response_time', 0.608921, 'ms', 2026-01-22 16:14:00, 'main');

-- Table structure for teacher_email_logs
CREATE TABLE `teacher_email_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) DEFAULT NULL,
  `email_subject` varchar(255) DEFAULT NULL,
  `email_body` text DEFAULT NULL,
  `sent_status` varchar(20) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for teacher_email_logs
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (1, 1, 'Eduyata Teacher Application Approved', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations! Your Application is Approved!</h1>
        </div>
        <div class="content">
            <h2>Dear chaithra,</h2>
            
            <p>We are delighted to inform you that your teacher application for Eduyata has been <strong>approved</strong>!</p>
            
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3>📝 Admin Notes:</h3>
                <p>Welcome to Eduyata! Your application has been approved.</p>
            </div>
            
            
            <p><strong>What''s Next?</strong></p>
            <ul>
                <li>You can now access the teacher portal</li>
                <li>Start creating and managing your courses</li>
                <li>Connect with students and track their progress</li>
                <li>Access teaching resources and tools</li>
            </ul>
            
            <a href="http://localhost:5173/teacher-dashboard" class="button">Access Teacher Portal</a>
            
            <p><strong>Your Teaching Journey Begins Now!</strong></p>
            <p>We''re excited to have you as part of the Eduyata teaching community. Your expertise and dedication will help shape the future of education.</p>
            
            <p>If you have any questions or need assistance getting started, please don''t hesitate to contact our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 05:52:47);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (2, 2, 'Eduyata Teacher Application Rejected', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Application Status Update</h1>
        </div>
        <div class="content">
            <h2>Dear arunkumargm,</h2>
            
            <p>Thank you for your interest in joining Eduyata as a teacher. After careful review of your application, we regret to inform you that we cannot proceed with your application at this time.</p>
            
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h3>📝 Feedback:</h3>
                <p>Your documents need to be updated. Please resubmit with clearer images.</p>
            </div>
            
            
            <p><strong>This is not the end!</strong></p>
            <p>We encourage you to:</p>
            <ul>
                <li>Review the feedback provided above</li>
                <li>Consider additional training or certifications</li>
                <li>Reapply in the future when you meet our requirements</li>
                <li>Stay connected with our educational community</li>
            </ul>
            
            <p>We appreciate the time and effort you put into your application. While we cannot offer you a position at this time, we recognize your passion for education.</p>
            
            <a href="http://localhost:5173/teacher-registration" class="button">Apply Again in Future</a>
            
            <p>If you have any questions about this decision or would like guidance on how to strengthen your application for the future, please feel free to contact our support team.</p>
            
            <p>Thank you for your understanding.<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 05:52:58);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (3, 2, 'Eduyata Teacher Application Approved', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations! Your Application is Approved!</h1>
        </div>
        <div class="content">
            <h2>Dear arunkumargm,</h2>
            
            <p>We are delighted to inform you that your teacher application for Eduyata has been <strong>approved</strong>!</p>
            
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3>📝 Admin Notes:</h3>
                <p>try to speak</p>
            </div>
            
            
            <p><strong>What''s Next?</strong></p>
            <ul>
                <li>You can now access the teacher portal</li>
                <li>Start creating and managing your courses</li>
                <li>Connect with students and track their progress</li>
                <li>Access teaching resources and tools</li>
            </ul>
            
            <a href="http://localhost:5173/teacher-dashboard" class="button">Access Teacher Portal</a>
            
            <p><strong>Your Teaching Journey Begins Now!</strong></p>
            <p>We''re excited to have you as part of the Eduyata teaching community. Your expertise and dedication will help shape the future of education.</p>
            
            <p>If you have any questions or need assistance getting started, please don''t hesitate to contact our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 05:54:56);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (4, 3, 'Eduyata Teacher Application Rejected', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Application Status Update</h1>
        </div>
        <div class="content">
            <h2>Dear dhanalakshmi,</h2>
            
            <p>Thank you for your interest in joining Eduyata as a teacher. After careful review of your application, we regret to inform you that we cannot proceed with your application at this time.</p>
            
            
            
            <p><strong>This is not the end!</strong></p>
            <p>We encourage you to:</p>
            <ul>
                <li>Review the feedback provided above</li>
                <li>Consider additional training or certifications</li>
                <li>Reapply in the future when you meet our requirements</li>
                <li>Stay connected with our educational community</li>
            </ul>
            
            <p>We appreciate the time and effort you put into your application. While we cannot offer you a position at this time, we recognize your passion for education.</p>
            
            <a href="http://localhost:5173/teacher-registration" class="button">Apply Again in Future</a>
            
            <p>If you have any questions about this decision or would like guidance on how to strengthen your application for the future, please feel free to contact our support team.</p>
            
            <p>Thank you for your understanding.<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 05:56:11);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (5, 3, 'Eduyata Teacher Application Rejected', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Application Status Update</h1>
        </div>
        <div class="content">
            <h2>Dear dhanalakshmi,</h2>
            
            <p>Thank you for your interest in joining Eduyata as a teacher. After careful review of your application, we regret to inform you that we cannot proceed with your application at this time.</p>
            
            
            
            <p><strong>This is not the end!</strong></p>
            <p>We encourage you to:</p>
            <ul>
                <li>Review the feedback provided above</li>
                <li>Consider additional training or certifications</li>
                <li>Reapply in the future when you meet our requirements</li>
                <li>Stay connected with our educational community</li>
            </ul>
            
            <p>We appreciate the time and effort you put into your application. While we cannot offer you a position at this time, we recognize your passion for education.</p>
            
            <a href="http://localhost:5173/teacher-registration" class="button">Apply Again in Future</a>
            
            <p>If you have any questions about this decision or would like guidance on how to strengthen your application for the future, please feel free to contact our support team.</p>
            
            <p>Thank you for your understanding.<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 05:58:59);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (6, 3, 'Eduyata Teacher Application Approved', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations! Your Application is Approved!</h1>
        </div>
        <div class="content">
            <h2>Dear dhanalakshmi,</h2>
            
            <p>We are delighted to inform you that your teacher application for Eduyata has been <strong>approved</strong>!</p>
            
            
            
            <p><strong>What''s Next?</strong></p>
            <ul>
                <li>You can now access the teacher portal</li>
                <li>Start creating and managing your courses</li>
                <li>Connect with students and track their progress</li>
                <li>Access teaching resources and tools</li>
            </ul>
            
            <a href="http://localhost:5173/teacher-dashboard" class="button">Access Teacher Portal</a>
            
            <p><strong>Your Teaching Journey Begins Now!</strong></p>
            <p>We''re excited to have you as part of the Eduyata teaching community. Your expertise and dedication will help shape the future of education.</p>
            
            <p>If you have any questions or need assistance getting started, please don''t hesitate to contact our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 05:59:29);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (7, 9, 'Eduyata - Documents Verified', '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Documents Verified - Eduyata</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Documents Verified!</h1>
            <p>Your teaching application is moving forward</p>
        </div>
        <div class="content">
            <p>Dear darshan,</p>
            
            <div class="success">
                <strong>Great news!</strong> Your submitted documents have been successfully verified by our admin team.
            </div>
            
            <p>Your application is now in the <strong>pending approval</strong> stage. Our team will review your profile and make a final decision soon.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Wait for final approval notification</li>
                <li>Once approved, you''ll receive login credentials</li>
                <li>You can then start creating and managing courses</li>
            </ul>
            
            
            
            <p>Thank you for your patience during the verification process.</p>
            
            <p>Best regards,<br>
            <strong>Eduyata Admin Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:02:24);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (8, 9, 'Eduyata Teacher Application Approved', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations! Your Application is Approved!</h1>
        </div>
        <div class="content">
            <h2>Dear darshan,</h2>
            
            <p>We are delighted to inform you that your teacher application for Eduyata has been <strong>approved</strong>!</p>
            
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3>📝 Admin Notes:</h3>
                <p>igfdfghj</p>
            </div>
            
            
            <p><strong>What''s Next?</strong></p>
            <ul>
                <li>You can now access the teacher portal</li>
                <li>Start creating and managing your courses</li>
                <li>Connect with students and track their progress</li>
                <li>Access teaching resources and tools</li>
            </ul>
            
            <a href="http://localhost:5173/teacher-dashboard" class="button">Access Teacher Portal</a>
            
            <p><strong>Your Teaching Journey Begins Now!</strong></p>
            <p>We''re excited to have you as part of the Eduyata teaching community. Your expertise and dedication will help shape the future of education.</p>
            
            <p>If you have any questions or need assistance getting started, please don''t hesitate to contact our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:06:20);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (9, 3, 'Eduyata Teacher Application Approved', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations! Your Application is Approved!</h1>
        </div>
        <div class="content">
            <h2>Dear dhanalakshmi,</h2>
            
            <p>We are delighted to inform you that your teacher application for Eduyata has been <strong>approved</strong>!</p>
            
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3>📝 Admin Notes:</h3>
                <p>Test email from new sender address</p>
            </div>
            
            
            <p><strong>What''s Next?</strong></p>
            <ul>
                <li>You can now access the teacher portal</li>
                <li>Start creating and managing your courses</li>
                <li>Connect with students and track their progress</li>
                <li>Access teaching resources and tools</li>
            </ul>
            
            <a href="http://localhost:5173/teacher-dashboard" class="button">Access Teacher Portal</a>
            
            <p><strong>Your Teaching Journey Begins Now!</strong></p>
            <p>We''re excited to have you as part of the Eduyata teaching community. Your expertise and dedication will help shape the future of education.</p>
            
            <p>If you have any questions or need assistance getting started, please don''t hesitate to contact our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:08:14);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (10, 10, 'Eduyata - Documents Verified', '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Documents Verified - Eduyata</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Documents Verified!</h1>
            <p>Your teaching application is moving forward</p>
        </div>
        <div class="content">
            <p>Dear darshan sm,</p>
            
            <div class="success">
                <strong>Great news!</strong> Your submitted documents have been successfully verified by our admin team.
            </div>
            
            <p>Your application is now in the <strong>pending approval</strong> stage. Our team will review your profile and make a final decision soon.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Wait for final approval notification</li>
                <li>Once approved, you''ll receive login credentials</li>
                <li>You can then start creating and managing courses</li>
            </ul>
            
            
            
            <p>Thank you for your patience during the verification process.</p>
            
            <p>Best regards,<br>
            <strong>Eduyata Admin Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:11:15);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (11, 10, 'Eduyata - Documents Verified', '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Documents Verified - Eduyata</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Documents Verified!</h1>
            <p>Your teaching application is moving forward</p>
        </div>
        <div class="content">
            <p>Dear darshan sm,</p>
            
            <div class="success">
                <strong>Great news!</strong> Your submitted documents have been successfully verified by our admin team.
            </div>
            
            <p>Your application is now in the <strong>pending approval</strong> stage. Our team will review your profile and make a final decision soon.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Wait for final approval notification</li>
                <li>Once approved, you''ll receive login credentials</li>
                <li>You can then start creating and managing courses</li>
            </ul>
            
            
            
            <p>Thank you for your patience during the verification process.</p>
            
            <p>Best regards,<br>
            <strong>Eduyata Admin Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:18:26);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (12, 10, 'Eduyata Teacher Application Rejected', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Application Status Update</h1>
        </div>
        <div class="content">
            <h2>Dear darshan sm,</h2>
            
            <p>Thank you for your interest in joining Eduyata as a teacher. After careful review of your application, we regret to inform you that we cannot proceed with your application at this time.</p>
            
            
            
            <p><strong>This is not the end!</strong></p>
            <p>We encourage you to:</p>
            <ul>
                <li>Review the feedback provided above</li>
                <li>Consider additional training or certifications</li>
                <li>Reapply in the future when you meet our requirements</li>
                <li>Stay connected with our educational community</li>
            </ul>
            
            <p>We appreciate the time and effort you put into your application. While we cannot offer you a position at this time, we recognize your passion for education.</p>
            
            <a href="http://localhost:5173/teacher-registration" class="button">Apply Again in Future</a>
            
            <p>If you have any questions about this decision or would like guidance on how to strengthen your application for the future, please feel free to contact our support team.</p>
            
            <p>Thank you for your understanding.<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:19:05);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (13, 10, 'Eduyata Teacher Application Rejected', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Application Status Update</h1>
        </div>
        <div class="content">
            <h2>Dear darshan sm,</h2>
            
            <p>Thank you for your interest in joining Eduyata as a teacher. After careful review of your application, we regret to inform you that we cannot proceed with your application at this time.</p>
            
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h3>📝 Feedback:</h3>
                <p>iugfgh</p>
            </div>
            
            
            <p><strong>This is not the end!</strong></p>
            <p>We encourage you to:</p>
            <ul>
                <li>Review the feedback provided above</li>
                <li>Consider additional training or certifications</li>
                <li>Reapply in the future when you meet our requirements</li>
                <li>Stay connected with our educational community</li>
            </ul>
            
            <p>We appreciate the time and effort you put into your application. While we cannot offer you a position at this time, we recognize your passion for education.</p>
            
            <a href="http://localhost:5173/teacher-registration" class="button">Apply Again in Future</a>
            
            <p>If you have any questions about this decision or would like guidance on how to strengthen your application for the future, please feel free to contact our support team.</p>
            
            <p>Thank you for your understanding.<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:19:17);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (14, 10, 'Eduyata Teacher Application Rejected', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Application Status Update</h1>
        </div>
        <div class="content">
            <h2>Dear darshan sm,</h2>
            
            <p>Thank you for your interest in joining Eduyata as a teacher. After careful review of your application, we regret to inform you that we cannot proceed with your application at this time.</p>
            
            
            
            <p><strong>This is not the end!</strong></p>
            <p>We encourage you to:</p>
            <ul>
                <li>Review the feedback provided above</li>
                <li>Consider additional training or certifications</li>
                <li>Reapply in the future when you meet our requirements</li>
                <li>Stay connected with our educational community</li>
            </ul>
            
            <p>We appreciate the time and effort you put into your application. While we cannot offer you a position at this time, we recognize your passion for education.</p>
            
            <a href="http://localhost:5173/teacher-registration" class="button">Apply Again in Future</a>
            
            <p>If you have any questions about this decision or would like guidance on how to strengthen your application for the future, please feel free to contact our support team.</p>
            
            <p>Thank you for your understanding.<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:19:50);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (15, 10, 'Eduyata Teacher Application Approved', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations! Your Application is Approved!</h1>
        </div>
        <div class="content">
            <h2>Dear darshan sm,</h2>
            
            <p>We are delighted to inform you that your teacher application for Eduyata has been <strong>approved</strong>!</p>
            
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3>📝 Admin Notes:</h3>
                <p>iuy</p>
            </div>
            
            
            <p><strong>What''s Next?</strong></p>
            <ul>
                <li>You can now access the teacher portal</li>
                <li>Start creating and managing your courses</li>
                <li>Connect with students and track their progress</li>
                <li>Access teaching resources and tools</li>
            </ul>
            
            <a href="http://localhost:5173/teacher-dashboard" class="button">Access Teacher Portal</a>
            
            <p><strong>Your Teaching Journey Begins Now!</strong></p>
            <p>We''re excited to have you as part of the Eduyata teaching community. Your expertise and dedication will help shape the future of education.</p>
            
            <p>If you have any questions or need assistance getting started, please don''t hesitate to contact our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-11-11 06:20:32);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (16, 17, 'Eduyata - Documents Verified', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 D...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2025-11-12 15:17:54);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (17, 17, 'Eduyata Teacher Application Approved', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 C...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2025-11-12 15:18:06);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (18, 18, 'Eduyata - Documents Need Attention', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x93\\x8B D...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2025-11-12 15:23:43);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (19, 18, 'Eduyata - Documents Verified', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 D...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2025-11-12 15:24:25);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (20, 18, 'Eduyata Teacher Application Rejected', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x93\\x8B A...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2025-11-12 15:24:36);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (21, 19, 'Eduyata - Documents Verified', '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Documents Verified - Eduyata</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Documents Verified!</h1>
            <p>Your teaching application is moving forward</p>
        </div>
        <div class="content">
            <p>Dear Bhagya,</p>
            
            <div class="success">
                <strong>Great news!</strong> Your submitted documents have been successfully verified by our admin team.
            </div>
            
            <p>Your application is now in the <strong>pending approval</strong> stage. Our team will review your profile and make a final decision soon.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Wait for final approval notification</li>
                <li>Once approved, you''ll receive login credentials</li>
                <li>You can then start creating and managing courses</li>
            </ul>
            
            
            
            <p>Thank you for your patience during the verification process.</p>
            
            <p>Best regards,<br>
            <strong>Eduyata Admin Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-12-31 05:19:31);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (22, 19, 'Eduyata Teacher Application Approved', '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Teacher Application Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations! Your Application is Approved!</h1>
        </div>
        <div class="content">
            <h2>Dear Bhagya,</h2>
            
            <p>We are delighted to inform you that your teacher application for Eduyata has been <strong>approved</strong>!</p>
            
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3>📝 Admin Notes:</h3>
                <p>Congratulations</p>
            </div>
            
            
            <p><strong>What''s Next?</strong></p>
            <ul>
                <li>You can now access the teacher portal</li>
                <li>Start creating and managing your courses</li>
                <li>Connect with students and track their progress</li>
                <li>Access teaching resources and tools</li>
            </ul>
            
            <a href="http://localhost:5173/teacher-dashboard" class="button">Access Teacher Portal</a>
            
            <p><strong>Your Teaching Journey Begins Now!</strong></p>
            <p>We''re excited to have you as part of the Eduyata teaching community. Your expertise and dedication will help shape the future of education.</p>
            
            <p>If you have any questions or need assistance getting started, please don''t hesitate to contact our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Eduyata Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Eduyata. All rights reserved.</p>
        </div>
    </div>
</body>
</html>', 'Success', 2025-12-31 05:20:04);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (23, 20, 'Eduyata - Documents Verified', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 D...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2026-01-12 11:17:20);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (24, 20, 'Eduyata Teacher Application Approved', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 C...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2026-01-12 11:17:45);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (25, 21, 'Eduyata - Documents Verified', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 D...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2026-01-12 11:53:54);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (26, 21, 'Eduyata Teacher Application Approved', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 C...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2026-01-12 11:54:12);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (27, 25, 'Eduyata - Documents Verified', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 D...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2026-01-12 12:42:43);
INSERT INTO `teacher_email_logs` (`id`, `teacher_id`, `email_subject`, `email_body`, `sent_status`, `timestamp`) VALUES (28, 25, 'Eduyata Teacher Application Approved', 'Failed to send email: (1366, "Incorrect string value: ''\\xF0\\x9F\\x8E\\x89 C...'' for column `eduyata_db`.`teacher_email_logs`.`email_body` at row 1")', 'Failed', 2026-01-12 12:43:09);

-- Table structure for teachers
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `teacher_id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `profile_picture` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for teachers
INSERT INTO `teachers` (`id`, `teacher_id`, `name`, `email`, `password_hash`, `is_active`, `last_login`, `phone`, `subject`, `qualification`, `experience_years`, `profile_picture`, `created_at`, `updated_at`) VALUES (1, 'TCH20250001', 'Dr. Sarah Johnson', 'sarah.johnson@eduyata.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, '9876543210', 'Mathematics', 'PhD Mathematics', 8, NULL, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `teachers` (`id`, `teacher_id`, `name`, `email`, `password_hash`, `is_active`, `last_login`, `phone`, `subject`, `qualification`, `experience_years`, `profile_picture`, `created_at`, `updated_at`) VALUES (2, 'TCH20250002', 'Prof. Michael Chen', 'michael.chen@eduyata.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NULL, '9876543211', 'Physics', 'PhD Physics', 10, NULL, 2025-08-05 13:00:22, 2025-11-11 05:49:53);
INSERT INTO `teachers` (`id`, `teacher_id`, `name`, `email`, `password_hash`, `is_active`, `last_login`, `phone`, `subject`, `qualification`, `experience_years`, `profile_picture`, `created_at`, `updated_at`) VALUES (3, 'TCH20250003', 'Ms. Emily Rodriguez', 'emily.rodriguez@eduyata.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, '9876543212', 'English', 'MA English Literature', 5, NULL, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `teachers` (`id`, `teacher_id`, `name`, `email`, `password_hash`, `is_active`, `last_login`, `phone`, `subject`, `qualification`, `experience_years`, `profile_picture`, `created_at`, `updated_at`) VALUES (4, 'T001', 'Demo Teacher', 'teacher@eduyata.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, '9876543210', 'Mathematics', 'M.Sc in Mathematics', NULL, NULL, 2025-08-06 15:54:37, 2025-08-06 15:54:37);

-- Table structure for ticket_attachments
CREATE TABLE `ticket_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ticket_attachments_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for ticket_attachments
INSERT INTO `ticket_attachments` (`id`, `ticket_id`, `file_path`, `file_name`, `uploaded_by`, `uploaded_at`) VALUES (1, 1, 'ticket_attachments/TKT202665873_dark_mode.png', 'dark_mode.png', 1, 2026-01-22 12:02:13);

-- Table structure for ticket_responses
CREATE TABLE `ticket_responses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `responder_id` int(11) NOT NULL,
  `responder_type` enum('student','teacher','admin') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ticket_responses_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for ticket_responses
INSERT INTO `ticket_responses` (`id`, `ticket_id`, `responder_id`, `responder_type`, `message`, `created_at`) VALUES (1, 1, 1, 'admin', 'we are looking on this', 2026-01-22 12:04:40);

-- Table structure for user_contexts
CREATE TABLE `user_contexts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(10) NOT NULL,
  `context_type` varchar(20) NOT NULL,
  `context_id` varchar(50) NOT NULL,
  `context_name` varchar(255) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_context` (`user_id`,`user_type`,`context_type`,`context_id`),
  KEY `idx_user_context` (`user_id`,`user_type`),
  KEY `idx_context_type` (`context_type`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for user_contexts
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (1, 26, 'student', 'role', 'student', 'Student', '{"view_courses": true, "submit_assignments": true}', 1, 2026-01-21 09:24:12);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (2, 1, 'admin', 'organization', 'eduyata_main', 'EduYata Main', '{"manage_teachers": true, "manage_students": true, "manage_courses": true}', 1, 2026-01-21 16:56:24);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (3, 1, 'admin', 'role', 'super_admin', 'Super Admin', '{"full_access": true}', 1, 2026-01-21 16:56:24);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (4, 5, 'student', 'role', 'student', 'Student', '{"view_courses": true, "submit_assignments": true}', 1, 2026-01-22 10:17:29);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (5, 10, 'student', 'role', 'student', 'Student', '{"view_courses": true, "submit_assignments": true}', 1, 2026-01-22 12:18:19);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (6, 3, 'teacher', 'role', 'teacher', 'Teacher', '{"manage_classes": true, "create_assignments": true}', 1, 2026-01-28 07:47:38);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (7, 3, 'teacher', 'course', 'course_english', 'English Course', '{"manage_course": true, "grade_assignments": true}', 1, 2026-01-28 07:47:38);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (8, 3, 'teacher', 'course', 'course_mathematics', 'Mathematics Course', '{"manage_course": true, "grade_assignments": true}', 1, 2026-01-28 07:47:38);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (9, 1, 'teacher', 'role', 'teacher', 'Teacher', '{"manage_classes": true, "create_assignments": true}', 1, 2026-01-28 09:47:19);
INSERT INTO `user_contexts` (`id`, `user_id`, `user_type`, `context_type`, `context_id`, `context_name`, `permissions`, `is_active`, `created_at`) VALUES (10, 1, 'teacher', 'course', 'course_english', 'English Course', '{"manage_course": true, "grade_assignments": true}', 1, 2026-01-28 09:47:19);

-- Table structure for user_devices
CREATE TABLE `user_devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` enum('student','teacher','admin') NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `is_trusted` tinyint(1) DEFAULT 0,
  `last_used` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_id` (`device_id`),
  KEY `idx_user_device` (`user_id`,`user_type`),
  KEY `idx_device_id` (`device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for user_devices
INSERT INTO `user_devices` (`id`, `user_id`, `user_type`, `device_id`, `device_name`, `device_type`, `browser`, `os`, `ip_address`, `is_trusted`, `last_used`, `created_at`) VALUES (10, 26, 'student', '47c3701fbdc69eb04da2fa5529f9171ff21bb90bc42a6ad6b99b24ca6e3c9b6d', 'Unknown on Unknown', 'desktop', 'Unknown', 'Unknown', '127.0.0.1', 0, 2026-01-21 09:23:16, 2026-01-21 09:23:16);
INSERT INTO `user_devices` (`id`, `user_id`, `user_type`, `device_id`, `device_name`, `device_type`, `browser`, `os`, `ip_address`, `is_trusted`, `last_used`, `created_at`) VALUES (11, 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', 'Chrome on Windows', 'desktop', 'Chrome', 'Windows', '127.0.0.1', 0, 2026-01-23 06:13:03, 2026-01-21 09:24:12);
INSERT INTO `user_devices` (`id`, `user_id`, `user_type`, `device_id`, `device_name`, `device_type`, `browser`, `os`, `ip_address`, `is_trusted`, `last_used`, `created_at`) VALUES (12, 5, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', 'Chrome on Windows', 'desktop', 'Chrome', 'Windows', '127.0.0.1', 0, 2026-01-28 10:14:16, 2026-01-28 07:46:26);

-- Table structure for user_sessions
CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_token` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('student','teacher','admin') NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `current_context_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `device_id` (`device_id`),
  KEY `idx_session_token` (`session_token`),
  KEY `idx_user_session` (`user_id`,`user_type`),
  KEY `idx_active_sessions` (`is_active`,`expires_at`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `user_devices` (`device_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for user_sessions
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (1, '7399NRV_izQmaI_YfQaa5_YUOxwK3Bbp0nsl4E-2wAI', 26, 'student', '47c3701fbdc69eb04da2fa5529f9171ff21bb90bc42a6ad6b99b24ca6e3c9b6d', '127.0.0.1', 'python-requests/2.31.0', 0, 2026-01-21 09:46:06, 2026-01-22 09:23:16, 2026-01-21 09:23:16, NULL);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (2, 'fSOEiPaarblgJwQP5maOFUcjE6H3iy9RzTK326fJE4Q', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 09:47:21, 2026-01-22 09:24:12, 2026-01-21 09:24:12, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (3, '1Ra6e2RHC9flV_gQKUg4f7t2PwjC9ZvLn3fkHTQh52I', 1, 'teacher', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 15:17:19, 2026-01-22 09:34:03, 2026-01-21 09:34:03, NULL);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (4, 'G9XcGiQ75eqmWCw7fyotDYAA_Z9ddVDSJW5aqtVaJow', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 16:56:24, 2026-01-22 09:34:10, 2026-01-21 09:34:10, NULL);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (5, '0n69Hs8BI6f3_DY4RRqe3c5ZcQtrJxJlPU1XgC9YQVc', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 09:48:11, 2026-01-22 09:37:12, 2026-01-21 09:37:12, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (6, 'C0wesNSDrsHQWEKLqdFhxTcGgG6ZNx37lLdT3IMCRCU', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 10:21:34, 2026-01-22 09:45:21, 2026-01-21 09:45:21, NULL);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (7, 'dPIfuJ12pDzckwd_0otIdYiNtNZZ3EMYNog2ygYBZEQ', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 15:37:04, 2026-01-22 09:46:06, 2026-01-21 09:46:06, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (8, 'JLNzdyyyhtUUIQ463j99vkR6iYEJ047Gt-mM6qnzuhU', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 15:37:13, 2026-01-22 09:47:21, 2026-01-21 09:47:21, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (9, 'ooJHcS4IZ-u913Q4OG-23XIKDpRk2A3pRRc7WqegupM', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 15:38:41, 2026-01-22 09:48:11, 2026-01-21 09:48:11, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (10, 'rsm1MGmmVVVo8wJIp_ek2tm2j-2mEfGKCa2LHyA-da0', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 15:49:08, 2026-01-22 15:37:04, 2026-01-21 15:37:04, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (11, 'lz1IVNdZlLtncoM6zJhAEvzl97JpKZ8j7HxuuzgS-cQ', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 15:49:33, 2026-01-22 15:37:13, 2026-01-21 15:37:13, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (12, 'hQzjnVl-9AietIwonFEY23keDMK4zHbL8oeLWpUtznM', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 15:57:43, 2026-01-22 15:38:41, 2026-01-21 15:38:41, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (13, 'vgUaICRRIAonMz_heZNMTikRFHxzcIMa2pTE-8_hm9E', 1, 'teacher', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 15:17:19, 2026-01-22 15:40:27, 2026-01-21 15:40:27, NULL);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (14, 'tWLfLOB6Y9runSGpaJqLdGsFr6zf5OSBjQt6gNE1CvE', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-21 15:59:55, 2026-01-22 15:49:08, 2026-01-21 15:49:08, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (15, 'Gbe9vUyLLF4jwxGbn999u5FOzVkDeH9i38rRye1Ib0A', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 12:25:22, 2026-01-22 15:49:33, 2026-01-21 15:49:33, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (16, 'p0WyMbNgM_57pKtkAEpWAW78wG7VcNUQ54oCYnotaKQ', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 12:26:58, 2026-01-22 15:57:43, 2026-01-21 15:57:43, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (17, 'WJm9ivqs9_HYiOUI8KfTlJuGFGeqc4ne91yCyg1ZF3w', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 13:18:42, 2026-01-22 15:59:55, 2026-01-21 15:59:55, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (18, 'Icw9cX3I-mrDocfKHW1atmxCSLSxcS5J_sxlrzHu-_0', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 10:28:00, 2026-01-22 16:50:44, 2026-01-21 16:50:44, NULL);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (19, 'siq3kTkW8gUlN0N2DJM6e3iVpH7orVijfE7JPkftxH0', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 10:28:00, 2026-01-22 16:56:24, 2026-01-21 16:56:24, 2);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (20, '6T375ksgqPeLQSxi3uNkXDajglQbMaC9AFTrTbB2lLQ', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 11:53:36, 2026-01-23 10:17:29, 2026-01-22 10:17:29, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (21, 'sshVeoet1HK_YKMzQUxjZnfGZMyfdt-qBaeAAt1Vhiw', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 05:09:49, 2026-01-23 10:21:34, 2026-01-22 10:21:34, 2);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (22, 'DJ9OibSJpkaiUEYCrzUJpspfRmq8AiytKf4OxsatGck', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 11:53:59, 2026-01-23 11:52:59, 2026-01-22 11:52:59, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (23, 'WwBTzCwCwDq3eDXjZHdkgLTedAvybu5Sr9ts6jMzHVs', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 11:55:15, 2026-01-23 11:53:08, 2026-01-22 11:53:08, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (24, 'J7JhgtA-Po5aB5pKMCSXbwcjRn8JoiHz5bzdgIPkqYw', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 12:09:26, 2026-01-23 11:53:37, 2026-01-22 11:53:37, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (25, 'Dr9jPBV_zOFyhliQB7octClygJxHtld-Yo5JSdMClmI', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 12:09:35, 2026-01-23 11:53:59, 2026-01-22 11:53:59, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (26, 'r9ZkimeJU5ejaQJ1DFc_x8P7jZ0rlvZg8Afhv7Z-tE4', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 12:11:28, 2026-01-23 11:55:15, 2026-01-22 11:55:15, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (27, '9Z6UG3g2erMgTmJFwX63XkXX3XMYTZRg3HXAGA4_MvQ', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-22 12:16:18, 2026-01-23 12:09:26, 2026-01-22 12:09:26, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (28, 'MX9juxjvJRPbkE4WQdhLvb9C6VtBEGaJ2FlN-T83Ua8', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 04:59:59, 2026-01-23 12:09:35, 2026-01-22 12:09:35, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (29, 'JjyBgfWCSzTYbrzgnJl_XOMEPvEIKeqN3FAoFpLPgoo', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 05:07:21, 2026-01-23 12:11:28, 2026-01-22 12:11:28, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (30, 'SAac-6iIsRmswi-CpURWJQ_n4kcWWGaCwaYp_htcszI', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 05:13:30, 2026-01-23 12:16:18, 2026-01-22 12:16:18, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (31, '7BZfhqZ9_uEL8QeZ9nHK_jS8XKbZzrnmZYMpSO166iA', 10, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 04:46:09, 2026-01-23 12:18:19, 2026-01-22 12:18:19, 5);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (32, 'fxm4DAvrA1FsILqvKKULEVfVdjJ0txAwJJuXDODnVZQ', 10, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 04:57:02, 2026-01-23 12:21:00, 2026-01-22 12:21:00, 5);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (33, 'ANeDOikezwrp-5dDt4GV122Q-7fBKlhNB052N_aIb-Y', 10, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-22 12:24:40, 2026-01-23 12:24:40, 2026-01-22 12:24:40, 5);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (34, 'KR5hDbWwVuWsTSl2nglQEvzHGl6N5c4s02mCx3yMuxI', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 13:18:42, 2026-01-23 12:25:22, 2026-01-22 12:25:22, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (35, 'sF5SSQMYNI6Ogsll0YTT_xFqZeFHbIQdkejgz7sVkJI', 26, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 13:18:42, 2026-01-23 12:26:58, 2026-01-22 12:26:58, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (36, 'e4vuQFliWp9oOcZ1TxgxIttdN9eCjbdl6vsDVzS4Tp0', 10, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-23 04:46:09, 2026-01-24 04:46:09, 2026-01-23 04:46:09, 5);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (37, 'aMRYBIYNGXT7UDuddPUiEsQmZJHbOtPABJEbX4jwr7c', 10, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-23 04:57:02, 2026-01-24 04:57:02, 2026-01-23 04:57:02, 5);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (38, 'XrkSb5OhOQf5btUB60wxwLKwTpIkZKmzuwuNNnn6YCI', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 05:19:37, 2026-01-24 04:58:00, 2026-01-23 04:58:00, 2);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (39, 'tpLXYxlcXzaXwgBUNBhcWA_xb8lR38zfiMpLwPzOPK8', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 05:16:54, 2026-01-24 04:59:59, 2026-01-23 04:59:59, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (40, 'aiyiEkyfTJG74fb7lt_iTtlfYCKet7vhSJE3sex1aTY', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-23 05:01:01, 2026-01-24 05:01:01, 2026-01-23 05:01:01, 2);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (41, 'abRSr3lTxfcb5vAyCKiIZSkF4YOZ_quuPsbk3ferg0c', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-23 06:13:03, 2026-01-24 05:07:21, 2026-01-23 05:07:21, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (42, '2IG-zyWUrJC_BJJ6IpFuxxHa1ZrQFpKQbhl-omJsr7g', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-23 05:11:48, 2026-01-24 05:09:49, 2026-01-23 05:09:49, 2);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (43, 'ntJ4bRUtVMnA5kzsrml0oceprA6An_66O0JkLk53BEM', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 13:16:26, 2026-01-24 05:13:30, 2026-01-23 05:13:30, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (44, '-E9yxfPB1DZzxWPbL2hsv52QTc3VrUNCMyDfkwwyjEQ', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 13:16:26, 2026-01-24 05:16:54, 2026-01-23 05:16:54, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (45, 'S-kxcz-I3MCUqQaeIq14lY8A3si2Jydk5FTWkE0Rjh8', 1, 'admin', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 2026-01-23 05:20:23, 2026-01-24 05:19:37, 2026-01-23 05:19:37, 2);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (46, 'vUjipsIVNtZDAN_HDo_P6V1ZYFVYH05o6LbXIy4-XSY', 5, 'student', 'cb1518e2cf3e5d2f9d6fafc98575cda46b4bfa4d0837d70949f1c11792591f3a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 2026-01-28 13:16:26, 2026-01-24 06:13:03, 2026-01-23 06:13:03, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (47, 'w614BIE3mHSnlTZncfnwI9QWjmHiA6_u8p9-u_vY4dM', 5, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 0, 2026-01-28 10:03:56, 2026-01-29 07:46:26, 2026-01-28 07:46:26, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (48, 'YoPD9QZigEG5C6Ao1mA0VI0fnhhTKuiN20va6auEfRQ', 3, 'teacher', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 07:47:38, 2026-01-29 07:47:38, 2026-01-28 07:47:38, 6);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (49, 'wa4_8YMYbBTnGm7rd6QetNEwcBLkkxQXA3w0pMRtpEk', 26, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 07:48:42, 2026-01-29 07:48:42, 2026-01-28 07:48:42, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (50, 'lnPz2XbC0Jtm1y5PjDQKuJm1ZemjInAf6h57uG5760Q', 5, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 0, 2026-01-28 10:14:16, 2026-01-29 09:44:45, 2026-01-28 09:44:45, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (51, 'zpU2adTZbc89kQh_kR2sGmo3fl20yXlSytSyGMEfQJw', 5, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 09:45:24, 2026-01-29 09:45:24, 2026-01-28 09:45:24, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (52, 'CrPkD87hS7efQ3SuRpeoEnCXw5ilo_YudF84qBdaxrQ', 1, 'teacher', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 09:47:19, 2026-01-29 09:47:19, 2026-01-28 09:47:19, 9);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (53, 'dquhk2ysaPU84hdWW36Zg7R_Cv3EvaBPz6zjjfKXtaw', 26, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 09:49:01, 2026-01-29 09:49:01, 2026-01-28 09:49:01, 1);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (54, 'NpdwLO6eKtMhdCwTki7HcUBhHwanZX98CdKyuzVFM5Y', 1, 'teacher', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 09:51:16, 2026-01-29 09:51:16, 2026-01-28 09:51:16, 9);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (55, 'pXZsI3SrDyu5mPSLQ58mHds1kHc_khZySmFMmSgyUcc', 5, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 10:03:56, 2026-01-29 10:03:56, 2026-01-28 10:03:56, 4);
INSERT INTO `user_sessions` (`id`, `session_token`, `user_id`, `user_type`, `device_id`, `ip_address`, `user_agent`, `is_active`, `last_activity`, `expires_at`, `created_at`, `current_context_id`) VALUES (56, 'DjBOGm8QLCa-4FOYreBc-Ru1hLnnhljR4sxqMFWbqIs', 5, 'student', '19cc0708bd0840a5fe68c924f1fd7fa7301c552f0c17430a90a78953356f4ce2', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 2026-01-28 10:14:16, 2026-01-29 10:14:16, 2026-01-28 10:14:16, 4);

-- Table structure for video_conferences
CREATE TABLE `video_conferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `meeting_url` text NOT NULL,
  `meeting_id` varchar(100) NOT NULL,
  `host_key` varchar(50) DEFAULT NULL,
  `participant_key` varchar(50) DEFAULT NULL,
  `status` enum('scheduled','live','ended','cancelled') DEFAULT 'scheduled',
  `scheduled_start` datetime DEFAULT NULL,
  `actual_start` datetime DEFAULT NULL,
  `actual_end` datetime DEFAULT NULL,
  `max_participants` int(11) DEFAULT 50,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `host_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `meeting_id` (`meeting_id`),
  KEY `idx_classroom_id` (`classroom_id`),
  KEY `idx_meeting_id` (`meeting_id`),
  KEY `idx_status` (`status`),
  KEY `idx_host_id` (`host_id`),
  CONSTRAINT `video_conferences_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `virtual_classrooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Data for video_conferences
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (1, 1, NULL, 'https://meet.jit.si/eduyata-107e6a86', 'eduyata-107e6a86', '3521f219d069', NULL, 'live', 2026-01-06 06:58:57, 2026-01-06 12:28:57, NULL, 50, 2026-01-06 12:28:57, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (2, 1, NULL, 'https://meet.jit.si/eduyata-a52abbcd', 'eduyata-a52abbcd', '4aaecc52abb2', NULL, 'live', 2026-01-07 05:29:06, 2026-01-07 10:59:06, NULL, 50, 2026-01-07 10:59:06, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (3, 1, NULL, 'https://meet.jit.si/eduyata-7eedaa38', 'eduyata-7eedaa38', '7ad3905e56f4', NULL, 'live', 2026-01-07 10:11:20, 2026-01-07 15:41:20, NULL, 50, 2026-01-07 15:41:20, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (4, 1, NULL, 'https://meet.jit.si/eduyata-5e944aa1', 'eduyata-5e944aa1', '18b0fb96a76d', NULL, 'live', 2026-01-07 10:26:37, 2026-01-07 15:56:37, NULL, 50, 2026-01-07 15:56:37, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (5, 1, NULL, 'https://meet.jit.si/edu1767781772bf1f9b', 'edu1767781772bf1f9b', 'b4246afe8a78', NULL, 'live', 2026-01-07 10:29:32, 2026-01-07 15:59:32, NULL, 50, 2026-01-07 15:59:32, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (6, 1, NULL, 'https://meet.jit.si/roomcfb7fffa', 'roomcfb7fffa', '5d5bb9842c9c', NULL, 'live', 2026-01-07 10:31:18, 2026-01-07 16:01:18, NULL, 50, 2026-01-07 16:01:18, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (7, 1, NULL, 'https://meet.jit.si/roome5300321', 'roome5300321', '56b532a1ac7b', NULL, 'live', 2026-01-07 10:31:54, 2026-01-07 16:01:54, NULL, 50, 2026-01-07 16:01:54, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (8, 1, NULL, 'https://meet.jit.si/roomc1e2200b', 'roomc1e2200b', 'd37f0aa93b2a', NULL, 'live', 2026-01-07 10:34:02, 2026-01-07 16:04:02, NULL, 50, 2026-01-07 16:04:02, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (9, 1, NULL, 'https://meet.jit.si/tw2dvyc6rqfi', 'tw2dvyc6rqfi', '22fd31b51488', NULL, 'live', 2026-01-07 10:54:02, 2026-01-07 16:24:02, NULL, 50, 2026-01-07 16:24:02, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (10, 1, NULL, 'https://meet.jit.si/es0x1gujwk8z', 'es0x1gujwk8z', 'a4cda1bb8087', NULL, 'live', 2026-01-07 11:01:08, 2026-01-07 16:31:08, NULL, 50, 2026-01-07 16:31:08, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (11, 1, NULL, 'https://meet.jit.si/o6vr3ucv3ezl', 'o6vr3ucv3ezl', '340241f47508', NULL, 'live', 2026-01-08 05:59:28, 2026-01-08 11:29:29, NULL, 50, 2026-01-08 11:29:29, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (12, 1, NULL, 'https://meet.jit.si/cyshqrk8s7rc', 'cyshqrk8s7rc', '910a87fabce1', NULL, 'live', 2026-01-08 06:03:12, 2026-01-08 11:33:12, NULL, 50, 2026-01-08 11:33:12, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (13, 1, NULL, 'https://meet.jit.si/ug5bao4hysvy', 'ug5bao4hysvy', '4d335be1c1fe', NULL, 'live', 2026-01-08 06:04:03, 2026-01-08 11:34:03, NULL, 50, 2026-01-08 11:34:03, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (14, 1, NULL, 'https://meet.jit.si/69rktxz6swg2', '69rktxz6swg2', '8f7e1b28886a', NULL, 'live', 2026-01-08 06:04:57, 2026-01-08 11:34:57, NULL, 50, 2026-01-08 11:34:57, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (15, 1, NULL, 'https://meet.jit.si/odzogd9a1790', 'odzogd9a1790', 'e18cff1a11eb', NULL, 'live', 2026-01-08 06:13:32, 2026-01-08 11:43:32, NULL, 50, 2026-01-08 11:43:32, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (16, 1, NULL, 'https://meet.jit.si/vg69h5nadv77', 'vg69h5nadv77', '01efdb91209a', NULL, 'live', 2026-01-08 06:32:34, 2026-01-08 12:02:34, NULL, 50, 2026-01-08 12:02:34, 7);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (17, 2, NULL, 'https://meet.jit.si/eduyata-639995d1', 'eduyata-639995d1', '4fb21f747390', NULL, 'live', 2026-01-28 09:47:59, 2026-01-28 15:18:00, NULL, 50, 2026-01-28 15:17:59, NULL);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (18, 2, NULL, 'https://meet.jit.si/eduyata-eb215a8f', 'eduyata-eb215a8f', '978d6170be8c', NULL, 'live', 2026-01-28 09:49:56, 2026-01-28 15:19:56, NULL, 50, 2026-01-28 15:19:56, NULL);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (19, 2, NULL, 'https://meet.jit.si/eduyata-9429865b', 'eduyata-9429865b', '67855ce765cc', NULL, 'live', 2026-01-28 09:50:24, 2026-01-28 15:20:24, NULL, 50, 2026-01-28 15:20:24, NULL);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (20, 2, NULL, 'https://meet.jit.si/eduyata-35b9e557', 'eduyata-35b9e557', 'e3b85f9ce045', NULL, 'live', 2026-01-28 09:51:28, 2026-01-28 15:21:28, NULL, 50, 2026-01-28 15:21:28, NULL);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (21, 2, NULL, 'https://meet.jit.si/eduyata-572acc94', 'eduyata-572acc94', '06617195c2ee', NULL, 'live', 2026-01-28 09:52:36, 2026-01-28 15:22:36, NULL, 50, 2026-01-28 15:22:36, NULL);
INSERT INTO `video_conferences` (`id`, `classroom_id`, `session_id`, `meeting_url`, `meeting_id`, `host_key`, `participant_key`, `status`, `scheduled_start`, `actual_start`, `actual_end`, `max_participants`, `created_at`, `host_id`) VALUES (22, 2, NULL, 'https://meet.jit.si/eduyata-015df2b5', 'eduyata-015df2b5', '78449d704dc2', NULL, 'live', 2026-01-28 09:53:03, 2026-01-28 15:23:03, NULL, 50, 2026-01-28 15:23:03, NULL);

-- Table structure for video_progress
CREATE TABLE `video_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `video_id` varchar(100) NOT NULL,
  `video_time` decimal(10,2) DEFAULT 0.00,
  `video_duration` decimal(10,2) DEFAULT NULL,
  `watched_duration` int(11) DEFAULT 0,
  `last_position` int(11) DEFAULT 0,
  `completed` tinyint(1) DEFAULT 0,
  `watch_count` int(11) DEFAULT 0,
  `last_watched` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_video_progress_student` (`student_id`),
  KEY `idx_video_progress_course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for video_progress
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (1, 12, 2, NULL, 'Introduction', 6.67, 80.11, 0, 0, 0, 0, 2025-11-06 16:16:54);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (2, 8, 1, NULL, 'Introduction', 1.72, 80.11, 0, 0, 0, 0, 2025-11-11 13:04:02);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (3, 11, 5, NULL, 'Introduction', 80.11, 80.11, 0, 0, 0, 0, 2025-11-17 17:56:41);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (4, 11, 5, NULL, 'What is the Web and Internet', 305.11, 305.11, 0, 0, 0, 0, 2025-11-17 17:03:12);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (5, 11, 5, NULL, 'What is HTTP', 380.11, 380.11, 0, 0, 0, 0, 2025-11-17 17:03:55);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (6, 11, 5, NULL, 'What is an API', 357.37, 357.37, 0, 0, 0, 0, 2025-11-17 17:05:32);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (7, 11, 5, NULL, 'Planning your web project', 104.00, 104.00, 0, 0, 0, 0, 2025-11-17 17:05:56);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (8, 11, 1, NULL, 'Introduction', 0.00, 80.11, 0, 0, 0, 0, 2025-11-17 17:56:15);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (9, 11, 1, NULL, 'What is HTTP', 0.00, NULL, 0, 0, 0, 0, 2025-11-17 15:26:12);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (10, 11, 1, NULL, 'Installing web browsers', 117.87, 164.61, 0, 0, 0, 0, 2025-12-23 14:31:00);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (11, 11, 1, NULL, 'What is the Web and Internet', 305.11, 305.11, 0, 0, 0, 0, 2025-11-17 15:27:57);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (12, 11, 1, NULL, 'What is an API', 357.37, 357.37, 0, 0, 0, 0, 2025-11-17 17:55:57);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (13, 11, 1, NULL, 'Sketching your website design', 110.37, 110.37, 0, 0, 0, 0, 2025-11-17 16:05:25);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (14, 11, 1, NULL, 'Planning your web project', 104.00, 104.00, 0, 0, 0, 0, 2025-11-17 16:04:00);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (15, 11, 1, NULL, 'Choosing Assets', 246.92, 246.92, 0, 0, 0, 0, 2025-11-17 16:06:47);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (16, 11, 5, NULL, 'Installing web browsers', 164.61, 164.61, 0, 0, 0, 0, 2025-11-17 17:04:18);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (17, 11, 5, NULL, 'Choosing Assets', 246.92, 246.92, 0, 0, 0, 0, 2025-11-17 17:07:14);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (18, 11, 1, NULL, 'Creating project folder structure', 454.87, 454.87, 0, 0, 0, 0, 2025-11-17 16:08:54);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (19, 11, 6, NULL, 'Introduction', 80.11, 80.11, 0, 0, 0, 0, 2025-11-17 16:33:47);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (20, 11, 6, NULL, 'What is the Web and Internet', 305.11, 305.11, 0, 0, 0, 0, 2025-11-17 17:45:15);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (21, 11, 6, NULL, 'Installing web browsers', 164.61, 164.61, 0, 0, 0, 0, 2025-11-17 17:46:03);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (22, 11, 5, NULL, 'Sketching your website design', 110.37, 110.37, 0, 0, 0, 0, 2025-11-17 17:06:40);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (23, 11, 5, NULL, 'Creating project folder structure', 454.87, 454.87, 0, 0, 0, 0, 2025-11-17 17:07:44);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (24, 11, 6, NULL, 'What is HTTP', 380.11, 380.11, 0, 0, 0, 0, 2025-11-17 17:45:51);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (25, 11, 6, NULL, 'What is an API', 357.37, 357.37, 0, 0, 0, 0, 2025-11-17 17:46:35);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (26, 11, 6, NULL, 'Planning your web project', 104.00, 104.00, 0, 0, 0, 0, 2025-11-17 17:47:05);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (27, 11, 6, NULL, 'Sketching your website design', 110.37, 110.37, 0, 0, 0, 0, 2025-11-17 17:47:41);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (28, 11, 6, NULL, 'Choosing Assets', 246.92, 246.92, 0, 0, 0, 0, 2025-11-17 17:48:11);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (29, 11, 6, NULL, 'Creating project folder structure', 454.87, 454.87, 0, 0, 0, 0, 2025-11-17 17:48:57);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (30, 11, 4, NULL, 'Introduction', 24.76, 80.11, 0, 0, 0, 0, 2025-12-23 13:26:21);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (31, 11, 4, NULL, 'Installing web browsers', 104.70, 164.61, 0, 0, 0, 0, 2025-12-23 13:26:44);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (32, 11, 9, NULL, 'Introduction', 19.35, 80.11, 0, 0, 0, 0, 2025-12-23 14:32:18);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (33, 6, 1, NULL, 'Introduction', 80.11, 80.11, 0, 0, 0, 0, 2026-01-02 12:05:37);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (34, 6, 1, NULL, 'What is the Web and Internet', 305.11, 305.11, 0, 0, 0, 0, 2026-01-02 12:06:30);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (35, 10, 12, NULL, '11', 0.00, NULL, 0, 0, 0, 0, 2026-01-03 16:44:30);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (36, 26, 15, NULL, '14-21', 0.00, NULL, 0, 0, 0, 0, 2026-01-12 11:42:32);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `lesson_id`, `video_id`, `video_time`, `video_duration`, `watched_duration`, `last_position`, `completed`, `watch_count`, `last_watched`) VALUES (37, 1, 1, 1, 'lesson_1', 0.00, 300.00, 120, 120, 0, 1, 2026-01-19 13:03:35);

-- Table structure for virtual_classrooms
CREATE TABLE `virtual_classrooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_id` varchar(20) NOT NULL,
  `course_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `classroom_code` varchar(10) NOT NULL,
  `max_students` int(11) DEFAULT 50,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `classroom_id` (`classroom_id`),
  UNIQUE KEY `classroom_code` (`classroom_code`),
  KEY `idx_teacher_id` (`teacher_id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_classroom_code` (`classroom_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Data for virtual_classrooms
INSERT INTO `virtual_classrooms` (`id`, `classroom_id`, `course_id`, `teacher_id`, `title`, `description`, `classroom_code`, `max_students`, `is_active`, `created_at`) VALUES (1, 'VC_14_7757', 14, 7, 'etrfgyh', 'sedtrfygu', 'IFES6AOM', 50, 1, 2026-01-06 12:25:44);
INSERT INTO `virtual_classrooms` (`id`, `classroom_id`, `course_id`, `teacher_id`, `title`, `description`, `classroom_code`, `max_students`, `is_active`, `created_at`) VALUES (2, 'VC_15_4372', 15, 1, 'english', 'you will learn', '7N6P2O31', 50, 1, 2026-01-28 15:17:47);

-- Table structure for virtual_classrooms_classroomannouncement
CREATE TABLE `virtual_classrooms_classroomannouncement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `classroom_id` bigint(20) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` longtext NOT NULL,
  `is_urgent` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for virtual_classrooms_classroomenrollment
CREATE TABLE `virtual_classrooms_classroomenrollment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `classroom_id` bigint(20) NOT NULL,
  `student_id` int(11) NOT NULL,
  `enrolled_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `last_accessed` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for virtual_classrooms_classroomresource
CREATE TABLE `virtual_classrooms_classroomresource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `classroom_id` bigint(20) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `resource_type` varchar(20) NOT NULL,
  `file_url` varchar(200) NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for virtual_classrooms_classroomsession
CREATE TABLE `virtual_classrooms_classroomsession` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `classroom_id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `scheduled_date` datetime(6) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for webhook_endpoints
CREATE TABLE `webhook_endpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `url` text NOT NULL,
  `event_types` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for webhook_endpoints
INSERT INTO `webhook_endpoints` (`id`, `name`, `url`, `event_types`, `is_active`, `created_by`, `created_at`) VALUES (1, 'chatgpt', 'https://chatgpt.com/c/6971b018-c034-8322-a9e3-be71f1945e54', 'student.enrolled', 1, 1, 2026-01-22 12:08:20);
