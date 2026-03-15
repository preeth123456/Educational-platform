-- Eduyata Database Backup
-- Created: 2025-11-18 16:57:43.124148
--
USE `eduyata_db`;

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_target_audience` (`target_audience`),
  KEY `idx_sent_at` (`sent_at`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for admin_announcements
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (1, 'Welcome to EduYata', 'Welcome to our learning platform! We hope you have a great learning experience.', 'all', 'Admin', 2025-11-17 14:51:31, 'sent', 150, 2025-11-17 14:51:31, 2025-11-17 14:51:31);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (2, 'Holiday Announcement', 'School will be closed for Diwali holidays from November 20-25. Classes will resume on November 26.', 'all', 'Admin', 2025-11-17 14:51:31, 'sent', 150, 2025-11-17 14:51:31, 2025-11-17 14:51:31);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (3, 'Exam Reminder', 'Final examinations will begin next week. Please check the schedule in your dashboard.', 'students', 'Admin', 2025-11-17 14:51:31, 'sent', 120, 2025-11-17 14:51:31, 2025-11-17 14:51:31);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (4, 'Exam Reminder', 'next week exams', 'students', 'Admin', 2025-11-17 14:53:45, 'failed', 0, 2025-11-17 14:53:45, 2025-11-17 14:53:45);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (5, 'exam', 'ready to exams', 'students', 'Admin', 2025-11-18 10:50:54, 'sent', 23, 2025-11-18 10:50:54, 2025-11-18 10:50:54);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (6, 'Exam ', 'next week', 'students', 'Admin', 2025-11-18 11:12:10, 'sent', 23, 2025-11-18 11:12:10, 2025-11-18 11:12:10);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (7, 'Holiday', 'Next Monday Holiday', 'all', 'Admin', 2025-11-18 11:26:35, 'sent', 26, 2025-11-18 11:26:35, 2025-11-18 11:26:39);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (8, 'Holiday', 'Next week Hoilday', 'all', 'Admin', 2025-11-18 12:06:51, 'sent', 26, 2025-11-18 12:06:51, 2025-11-18 12:06:55);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (9, 'Exam', 'next week', 'all', 'Admin', 2025-11-18 12:25:13, 'sent', 26, 2025-11-18 12:25:13, 2025-11-18 12:25:16);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (10, 'hoilday', 'enjoy', 'teachers', 'Admin', 2025-11-18 12:30:04, 'sent', 3, 2025-11-18 12:30:04, 2025-11-18 12:30:17);
INSERT INTO `admin_announcements` (`id`, `title`, `message`, `target_audience`, `sent_by`, `sent_at`, `status`, `recipients_count`, `created_at`, `updated_at`) VALUES (11, 'hoilday', 'work on hoildays', 'teachers', 'Admin', 2025-11-18 12:33:56, 'sent', 3, 2025-11-18 12:33:56, 2025-11-18 12:34:05);

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
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for auth_group_permissions
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for auth_permission
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- Table structure for auth_user
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for backup_history
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (1, 'eduyata_db_backup_20241118_143000.sql', 2025-11-18 16:50:20, 2457600, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (2, 'eduyata_db_backup_20241118_020000.sql', 2025-11-18 16:50:20, 2359296, 'success', 'system');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (3, 'eduyata_db_backup_20241117_143000.sql', 2025-11-18 16:50:20, 2516582, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (4, 'eduyata_db_backup_20241117_020000.sql', 2025-11-18 16:50:20, 2228224, 'success', 'system');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (5, 'eduyata_db_backup_20241116_020000.sql', 2025-11-18 16:50:20, 2113536, 'failed', 'system');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (6, 'eduyata_db_backup_20241115_143000.sql', 2025-11-18 16:50:20, 2387968, 'success', 'admin');
INSERT INTO `backup_history` (`id`, `filename`, `created_at`, `file_size`, `status`, `created_by`) VALUES (7, 'eduyata_db_backup_20251118_165307.sql', 2025-11-18 11:23:08, 385009, 'success', 'admin');

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

-- Table structure for chapters
CREATE TABLE `chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `class_level_id` int(11) DEFAULT NULL,
  `chapter_no` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for chapters
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (1, 1, 'Chapter 1: My Family', NULL, NULL);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (2, 1, 'Chapter 2: Our School', NULL, NULL);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (3, 2, 'Chapter 1: Computer Science - Class 6', 2, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (4, 2, 'Chapter 2: Computer Science - Class 6', 2, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (5, 2, 'Chapter 3: Computer Science - Class 6', 2, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (6, 2, 'Chapter 4: Computer Science - Class 6', 2, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (7, 2, 'Chapter 5: Computer Science - Class 6', 2, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (8, 2, 'Chapter 1: Computer Science - Class 7', 3, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (9, 2, 'Chapter 2: Computer Science - Class 7', 3, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (10, 2, 'Chapter 3: Computer Science - Class 7', 3, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (11, 2, 'Chapter 4: Computer Science - Class 7', 3, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (12, 2, 'Chapter 5: Computer Science - Class 7', 3, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (13, 2, 'Chapter 1: Computer Science - Class 8', 4, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (14, 2, 'Chapter 2: Computer Science - Class 8', 4, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (15, 2, 'Chapter 3: Computer Science - Class 8', 4, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (16, 2, 'Chapter 4: Computer Science - Class 8', 4, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (17, 2, 'Chapter 5: Computer Science - Class 8', 4, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (18, 2, 'Chapter 1: Computer Science - Class 9', 5, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (19, 2, 'Chapter 2: Computer Science - Class 9', 5, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (20, 2, 'Chapter 3: Computer Science - Class 9', 5, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (21, 2, 'Chapter 4: Computer Science - Class 9', 5, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (22, 2, 'Chapter 5: Computer Science - Class 9', 5, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (23, 3, 'Chapter 1: Economics - Class 11', 6, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (24, 3, 'Chapter 2: Economics - Class 11', 6, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (25, 3, 'Chapter 3: Economics - Class 11', 6, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (26, 3, 'Chapter 4: Economics - Class 11', 6, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (27, 3, 'Chapter 5: Economics - Class 11', 6, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (28, 3, 'Chapter 1: Economics - Class 12', 7, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (29, 3, 'Chapter 2: Economics - Class 12', 7, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (30, 3, 'Chapter 3: Economics - Class 12', 7, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (31, 3, 'Chapter 4: Economics - Class 12', 7, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (32, 3, 'Chapter 5: Economics - Class 12', 7, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (33, 4, 'Chapter 1: English - Class 1', 8, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (34, 4, 'Chapter 2: English - Class 1', 8, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (35, 4, 'Chapter 3: English - Class 1', 8, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (36, 4, 'Chapter 4: English - Class 1', 8, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (37, 4, 'Chapter 5: English - Class 1', 8, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (38, 4, 'Chapter 1: English - Class 10', 9, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (39, 4, 'Chapter 2: English - Class 10', 9, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (40, 4, 'Chapter 3: English - Class 10', 9, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (41, 4, 'Chapter 4: English - Class 10', 9, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (42, 4, 'Chapter 5: English - Class 10', 9, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (43, 4, 'Chapter 1: English - Class 11', 6, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (44, 4, 'Chapter 2: English - Class 11', 6, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (45, 4, 'Chapter 3: English - Class 11', 6, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (46, 4, 'Chapter 4: English - Class 11', 6, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (47, 4, 'Chapter 5: English - Class 11', 6, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (48, 4, 'Chapter 1: English - Class 12', 7, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (49, 4, 'Chapter 2: English - Class 12', 7, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (50, 4, 'Chapter 3: English - Class 12', 7, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (51, 4, 'Chapter 4: English - Class 12', 7, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (52, 4, 'Chapter 5: English - Class 12', 7, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (53, 4, 'Chapter 1: English - Class 2', 10, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (54, 4, 'Chapter 2: English - Class 2', 10, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (55, 4, 'Chapter 3: English - Class 2', 10, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (56, 4, 'Chapter 4: English - Class 2', 10, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (57, 4, 'Chapter 5: English - Class 2', 10, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (58, 4, 'Chapter 1: English - Class 3', 11, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (59, 4, 'Chapter 2: English - Class 3', 11, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (60, 4, 'Chapter 3: English - Class 3', 11, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (61, 4, 'Chapter 4: English - Class 3', 11, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (62, 4, 'Chapter 5: English - Class 3', 11, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (63, 4, 'Chapter 1: English - Class 4', 12, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (64, 4, 'Chapter 2: English - Class 4', 12, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (65, 4, 'Chapter 3: English - Class 4', 12, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (66, 4, 'Chapter 4: English - Class 4', 12, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (67, 4, 'Chapter 5: English - Class 4', 12, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (68, 4, 'Chapter 1: English - Class 5', 13, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (69, 4, 'Chapter 2: English - Class 5', 13, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (70, 4, 'Chapter 3: English - Class 5', 13, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (71, 4, 'Chapter 4: English - Class 5', 13, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (72, 4, 'Chapter 5: English - Class 5', 13, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (73, 4, 'Chapter 1: English - Class 8', 4, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (74, 4, 'Chapter 2: English - Class 8', 4, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (75, 4, 'Chapter 3: English - Class 8', 4, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (76, 4, 'Chapter 4: English - Class 8', 4, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (77, 4, 'Chapter 5: English - Class 8', 4, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (78, 4, 'Chapter 1: English - Class 9', 5, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (79, 4, 'Chapter 2: English - Class 9', 5, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (80, 4, 'Chapter 3: English - Class 9', 5, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (81, 4, 'Chapter 4: English - Class 9', 5, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (82, 4, 'Chapter 5: English - Class 9', 5, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (83, 5, 'Chapter 1: Environmental Science - Class 1', 8, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (84, 5, 'Chapter 2: Environmental Science - Class 1', 8, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (85, 5, 'Chapter 3: Environmental Science - Class 1', 8, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (86, 5, 'Chapter 4: Environmental Science - Class 1', 8, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (87, 5, 'Chapter 5: Environmental Science - Class 1', 8, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (88, 5, 'Chapter 1: Environmental Science - Class 2', 10, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (89, 5, 'Chapter 2: Environmental Science - Class 2', 10, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (90, 5, 'Chapter 3: Environmental Science - Class 2', 10, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (91, 5, 'Chapter 4: Environmental Science - Class 2', 10, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (92, 5, 'Chapter 5: Environmental Science - Class 2', 10, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (93, 5, 'Chapter 1: Environmental Science - Class 3', 11, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (94, 5, 'Chapter 2: Environmental Science - Class 3', 11, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (95, 5, 'Chapter 3: Environmental Science - Class 3', 11, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (96, 5, 'Chapter 4: Environmental Science - Class 3', 11, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (97, 5, 'Chapter 5: Environmental Science - Class 3', 11, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (98, 6, 'Chapter 1: General Knowledge - Class 1', 8, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (99, 6, 'Chapter 2: General Knowledge - Class 1', 8, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (100, 6, 'Chapter 3: General Knowledge - Class 1', 8, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (101, 6, 'Chapter 4: General Knowledge - Class 1', 8, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (102, 6, 'Chapter 5: General Knowledge - Class 1', 8, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (103, 6, 'Chapter 1: General Knowledge - Class 2', 10, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (104, 6, 'Chapter 2: General Knowledge - Class 2', 10, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (105, 6, 'Chapter 3: General Knowledge - Class 2', 10, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (106, 6, 'Chapter 4: General Knowledge - Class 2', 10, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (107, 6, 'Chapter 5: General Knowledge - Class 2', 10, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (108, 7, 'Chapter 1: Hindi - Class 1', 8, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (109, 7, 'Chapter 2: Hindi - Class 1', 8, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (110, 7, 'Chapter 3: Hindi - Class 1', 8, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (111, 7, 'Chapter 4: Hindi - Class 1', 8, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (112, 7, 'Chapter 5: Hindi - Class 1', 8, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (113, 7, 'Chapter 1: Hindi - Class 2', 10, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (114, 7, 'Chapter 2: Hindi - Class 2', 10, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (115, 7, 'Chapter 3: Hindi - Class 2', 10, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (116, 7, 'Chapter 4: Hindi - Class 2', 10, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (117, 7, 'Chapter 5: Hindi - Class 2', 10, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (118, 7, 'Chapter 1: Hindi - Class 3', 11, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (119, 7, 'Chapter 2: Hindi - Class 3', 11, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (120, 7, 'Chapter 3: Hindi - Class 3', 11, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (121, 7, 'Chapter 4: Hindi - Class 3', 11, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (122, 7, 'Chapter 5: Hindi - Class 3', 11, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (123, 8, 'Chapter 1: Mathematics - Class 1', 8, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (124, 8, 'Chapter 2: Mathematics - Class 1', 8, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (125, 8, 'Chapter 3: Mathematics - Class 1', 8, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (126, 8, 'Chapter 4: Mathematics - Class 1', 8, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (127, 8, 'Chapter 5: Mathematics - Class 1', 8, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (128, 8, 'Chapter 1: Mathematics - Class 11', 6, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (129, 8, 'Chapter 2: Mathematics - Class 11', 6, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (130, 8, 'Chapter 3: Mathematics - Class 11', 6, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (131, 8, 'Chapter 4: Mathematics - Class 11', 6, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (132, 8, 'Chapter 5: Mathematics - Class 11', 6, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (133, 8, 'Chapter 1: Mathematics - Class 12', 7, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (134, 8, 'Chapter 2: Mathematics - Class 12', 7, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (135, 8, 'Chapter 3: Mathematics - Class 12', 7, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (136, 8, 'Chapter 4: Mathematics - Class 12', 7, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (137, 8, 'Chapter 5: Mathematics - Class 12', 7, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (138, 8, 'Chapter 1: Mathematics - Class 2', 10, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (139, 8, 'Chapter 2: Mathematics - Class 2', 10, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (140, 8, 'Chapter 3: Mathematics - Class 2', 10, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (141, 8, 'Chapter 4: Mathematics - Class 2', 10, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (142, 8, 'Chapter 5: Mathematics - Class 2', 10, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (143, 8, 'Chapter 1: Mathematics - Class 3', 11, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (144, 8, 'Chapter 2: Mathematics - Class 3', 11, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (145, 8, 'Chapter 3: Mathematics - Class 3', 11, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (146, 8, 'Chapter 4: Mathematics - Class 3', 11, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (147, 8, 'Chapter 5: Mathematics - Class 3', 11, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (148, 9, 'Chapter 1: Physics - Class 11', 6, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (149, 9, 'Chapter 2: Physics - Class 11', 6, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (150, 9, 'Chapter 3: Physics - Class 11', 6, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (151, 9, 'Chapter 4: Physics - Class 11', 6, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (152, 9, 'Chapter 5: Physics - Class 11', 6, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (153, 9, 'Chapter 1: Physics - Class 12', 7, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (154, 9, 'Chapter 2: Physics - Class 12', 7, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (155, 9, 'Chapter 3: Physics - Class 12', 7, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (156, 9, 'Chapter 4: Physics - Class 12', 7, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (157, 9, 'Chapter 5: Physics - Class 12', 7, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (158, 10, 'Chapter 1: Sanskrit - Class 6', 2, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (159, 10, 'Chapter 2: Sanskrit - Class 6', 2, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (160, 10, 'Chapter 3: Sanskrit - Class 6', 2, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (161, 10, 'Chapter 4: Sanskrit - Class 6', 2, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (162, 10, 'Chapter 5: Sanskrit - Class 6', 2, 5);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (163, 10, 'Chapter 1: Sanskrit - Class 8', 4, 1);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (164, 10, 'Chapter 2: Sanskrit - Class 8', 4, 2);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (165, 10, 'Chapter 3: Sanskrit - Class 8', 4, 3);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (166, 10, 'Chapter 4: Sanskrit - Class 8', 4, 4);
INSERT INTO `chapters` (`id`, `subject_id`, `title`, `class_level_id`, `chapter_no`) VALUES (167, 10, 'Chapter 5: Sanskrit - Class 8', 4, 5);

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
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (1, 'CRS20250001', 'Advanced Calculus & Applications', 'Master calculus concepts with real-world applications. Perfect for students preparing for competitive exams.', 1, 'Mathematics', 'advanced', 40, 299.99, 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (2, 'CRS20250002', 'Web Development Bootcamp', 'Learn modern web development with HTML, CSS, JavaScript, and React. Build real projects from scratch.', 3, 'Computer Science', 'intermediate', 60, 399.99, 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (3, 'CRS20250003', 'Physics Fundamentals', 'Understand the fundamental principles of physics through interactive lessons and practical experiments.', 2, 'Science', 'beginner', 30, 199.99, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (4, 'CRS20250004', 'Creative Writing Workshop', 'Develop your writing skills and unleash your creativity through guided exercises and peer feedback.', 3, 'English', 'intermediate', 25, 149.99, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-05 13:00:22, 2025-08-05 13:00:22);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (5, 'CS1754459540', 'Introduction to Artificial Intelligence', 'Learn the fundamentals of Artificial Intelligence and Machine Learning.', 1, 'Computer Science', 'beginner', 20, 49.99, 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-06 11:22:20, 2025-08-06 11:22:20);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (6, 'BIO121754459752', 'Class 12: Plant Biology', 'Comprehensive study of plant biology for Class 12 students. Covers plant physiology, reproduction, genetics, and biotechnology applications in plants.', 1, 'Science', 'intermediate', 30, 39.99, 'https://images.unsplash.com/photo-1490750967868-88aa4486ec94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500', 1, 2025-08-06 11:25:52, 2025-08-06 11:25:52);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (7, 'COURSE0007', 'plantation', 'you can learn about plant', 1, 'biology', 'beginner', 40, 0.00, '', 1, 2025-10-06 06:24:35, 2025-10-06 06:24:35);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (8, 'COURSE0008', 'bio', 'you can learn', 1, 'biology', 'beginner', 40, 0.00, '', 1, 2025-10-06 06:36:45, 2025-10-06 06:36:45);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (9, 'COURSE0009', 'anatomy', 'you can learn about the human anatomy', 1, 'biology', 'beginner', 30, 0.00, '', 1, 2025-10-06 11:16:14, 2025-10-06 11:16:14);
INSERT INTO `courses` (`id`, `course_id`, `title`, `description`, `instructor_id`, `category`, `level`, `duration_hours`, `price`, `thumbnail_url`, `is_published`, `created_at`, `updated_at`) VALUES (10, 'COURSE0010', 'geography', 'you can learn about the geography here', 3, 'biology', 'beginner', 40, 0.00, '', 1, 2025-10-07 05:51:40, 2025-10-07 05:51:40);

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
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for django_content_type
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (1, 'admin', 'logentry');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (3, 'auth', 'group');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (2, 'auth', 'permission');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (4, 'auth', 'user');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (9, 'auth_app', 'enrollment');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (8, 'auth_app', 'student');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (10, 'auth_app', 'teacher');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (7, 'courses', 'course');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (6, 'sessions', 'session');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (0, 'admin_auth', 'student');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (0, 'admin_auth', 'teacher');
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES (0, 'admin_auth', 'teacheremaillog');

-- Table structure for django_migrations
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'admin_auth', '0001_initial', 2025-10-24 09:01:13.490864);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'auth_app', '0007_create_educator_and_teaching_experience', 2025-10-24 09:01:29.895278);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'auth_app', '0008_update_educator_file_fields', 2025-10-24 09:01:29.900294);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'courses', '0002_remove_course_instructor_name_and_more', 2025-10-24 09:01:29.904790);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'courses', '0003_alter_course_instructor_id_delete_lesson', 2025-10-24 09:01:29.909696);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'courses', '0004_alter_course_table', 2025-10-24 09:01:29.916311);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'courses', '0003_state_only_update', 2025-10-24 09:01:29.920822);
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES (0, 'courses', '0005_merge_0003_state_only_update_0004_alter_course_table', 2025-10-24 09:01:29.928670);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for educators
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (1, 'TCH202500001', 'chaithra', 'chaithrapoojary175@gmail.com', '7019934780', 'Female', 'pbkdf2_sha256$1000000$FXgt0VBUMmOb3bjBUMIICD$byVkcIhtLwJIbyR2zAKM3BvTPERvZRBpignhObhqBeM=', 'English', 'B.E', 0, 1, 2025-10-28 09:58:45.600637, 'B.E', '[{"name": "reva", "from_year": "2020", "to_year": "2024"}]', '', '["CBSE"]', '{"English": ["2", "3", "4"]}', '["Tamil", "Telugu"]', 'uploads/teachers/TCH202500001/cv.pdf', NULL, 'uploads/teachers/TCH202500001/experience.pdf', 1, 2025-11-14 15:03:55, 'uploads/teachers/TCH202500001/profile_picture.jpg', 'uploads/teachers/TCH202500001/government_id.pdf', 'uploads/teachers/TCH202500001/degree_certificate.pdf', 'approved', NULL, 'Verified', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (2, 'TCH202500002', 'arunkumargm', 'arunkumargm345@gmail.com', '8970678976', 'Male', 'pbkdf2_sha256$1000000$QqZcZkcAmvjrLMSuivIMe1$5n9AYa4Prl8dOMKYtEEnG3238Dj4YeGqeAvZ5MGsc34=', 'English', 'B.E', 0, 0, 2025-10-28 10:23:46.892328, 'B.E', '[{"name": "vijaya", "from_year": "2020", "to_year": "2022"}]', '', '["CBSE"]', '{"English": ["9", "8"]}', '["Marathi", "Gujarati"]', 'uploads/teachers/TCH202500002/cv.pdf', NULL, 'uploads/teachers/TCH202500002/experience.pdf', 1, 2025-11-11 05:54:51, 'uploads/teachers/TCH202500002/profile_picture.jpg', 'uploads/teachers/TCH202500002/government_id.pdf', 'uploads/teachers/TCH202500002/degree_certificate.pdf', 'rejected', NULL, 'Verified', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (3, 'TCH202500003', 'dhanalakshmi', 'dhanalakshmi000002@gmail.com', '76543238765', 'Female', 'pbkdf2_sha256$1000000$Pl6k3YiQd3vovoqVtUiu3a$Y1LV+R87mY97YnG4/Hq4A2lTswTzXTYUnZreQcOu4vQ=', 'English, Mathematics', 'B.E', 0, 0, 2025-10-29 05:21:14.979357, 'B.E', '[{"name": "brundavana institute", "from_year": "2020", "to_year": "2024"}]', '', '["CBSE"]', '{"English": ["1", "2", "3"], "Mathematics": ["1", "2", "3"]}', '["Marathi", "Telugu"]', 'uploads/teachers/TCH202500003/cv.pdf', NULL, 'uploads/teachers/TCH202500003/experience.pdf', 1, 2025-11-11 06:08:11, 'uploads/teachers/TCH202500003/profile_picture.jpg', 'uploads/teachers/TCH202500003/government_id.pdf', 'uploads/teachers/TCH202500003/degree_certificate.pdf', 'rejected', NULL, 'Verified', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (4, 'TCH202500004', 'ChaithraPoojary', 'chaithrapoojary0714@gmail.com', '8105815742', 'Female', 'pbkdf2_sha256$1000000$xChwJ8K2ulWucCW8nZ7EwR$yHnVWRuiT6r7j/N7rmFu5SUx5IcunV+6JbB+VGJwO0U=', 'English, Mathematics', 'B.E', 0, 1, 2025-10-29 08:46:19.198498, 'B.E', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"English": [], "Mathematics": ["1", "2", "3"]}', '["Marathi", "Kannada"]', 'uploads/teachers/TCH202500004/cv.pdf', NULL, 'uploads/teachers/TCH202500004/experience.pdf', 1, 2025-10-29 09:25:36, 'uploads/teachers/TCH202500004/profile_picture.jpg', 'uploads/teachers/TCH202500004/government_id.pdf', 'uploads/teachers/TCH202500004/degree_certificate.pdf', 'approved', NULL, 'Verified', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (5, 'TCH202500005', 'darshan', 'darshansmdarshansm0@gmail.com', '8765434567', 'Male', 'pbkdf2_sha256$1000000$Ln3mJ8SEzAQtlxOX8ta7By$txk5u9WSX08Kkvz/r8GUnR68zd+XU8kcxqnVKU7/zzk=', 'English', 'B.E', 0, 1, 2025-10-29 09:28:10.615191, 'B.E', '[{"name": "megha institute", "from_year": "2020", "to_year": "2024"}]', '', '["CBSE"]', '{"English": ["1", "2"]}', '["Hindi", "English"]', 'uploads/teachers/TCH202500005/cv.pdf', NULL, 'uploads/teachers/TCH202500005/experience.pdf', 1, 2025-11-10 11:20:32, 'uploads/teachers/TCH202500005/profile_picture.jpg', 'uploads/teachers/TCH202500005/government_id.pdf', 'uploads/teachers/TCH202500005/degree_certificate.pdf', 'approved', NULL, 'Verified', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (6, 'TCH202500006', 'chaithra', 'chaithrapoojary987654@gmail.com', '987656789', 'Female', 'pbkdf2_sha256$1000000$pz9Ivz2Lijdtwo9tIAOdUf$CWWmjHZYV6eSKC73NgHXNa88iWmHUsBGWdgMltdOE7E=', 'English', 'B.E', 0, 1, 2025-11-06 09:57:47.966760, 'B.E', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"English": ["9", "8"]}', '["Tamil", "Telugu"]', 'uploads/teachers/TCH202500006/cv.pdf', 'uploads/teachers/TCH202500006/achievements.pdf', 'uploads/teachers/TCH202500006/experience.pdf', 1, 2025-11-06 09:57:48, '', NULL, NULL, 'pending', NULL, 'Pending', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (7, 'TCH202500007', 'chaithra', 'chaithrapoojary777@gmail.com', '98765678977', 'Female', 'pbkdf2_sha256$1000000$BWgZSxbBaBjZP3uPsXoLd2$O0b1FKFDDdIzYfyqNsL26wqok95ygY3BqiDLMwBiXwM=', 'Mathematics', 'B.E', 0, 1, 2025-11-10 09:33:20.517132, 'B.E', '[{"name": "reva", "from_year": "2022", "to_year": "2023"}]', '', '["CBSE"]', '{"Mathematics": ["1", "2"]}', '["Marathi", "Telugu"]', 'uploads/teachers/TCH202500007/cv.pdf', 'uploads/teachers/TCH202500007/achievements.pdf', 'uploads/teachers/TCH202500007/experience.pdf', 1, 2025-11-10 11:23:03, '', NULL, NULL, 'pending', NULL, 'Verified', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (8, 'TCH202500008', 'chaithra', 'chaithrapoojary175559876@gmail.com', '98765678977876', 'Female', 'pbkdf2_sha256$1000000$edyazxSbGXN5TMIoKEUOwi$MDVo8trCwoM6wq0elMbSA7439Qm8uwknmW4taXgVqJM=', 'English', 'B.E', 0, 1, 2025-11-10 09:51:19.733550, 'B.E', '[{"name": "reva", "from_year": "2022", "to_year": "2023"}]', '', '["CBSE"]', '{"English": ["1", "2", "3"]}', '["Telugu", "Marathi"]', 'uploads/teachers/TCH202500008/cv.pdf', '', '', 1, 2025-11-10 09:51:19, '', NULL, NULL, 'pending', NULL, 'Pending', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (9, 'TCH202500009', 'darshan', 'alstosm588@gmail.com', '765456789', 'Male', 'pbkdf2_sha256$1000000$ImbqFuoqhWXqUbig2eL3gg$wyzJMNRSdoSDtbWScsbmjG1XfbXDHTyiwSCIeImzK2c=', 'Art', 'B.E', 0, 1, 2025-11-11 06:01:56.073406, 'B.E', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"Art": ["9", "8"]}', '["Marathi", "Gujarati"]', 'uploads/teachers/TCH202500009/cv.pdf', 'uploads/teachers/TCH202500009/achievements.pdf', 'uploads/teachers/TCH202500009/experience.pdf', 1, 2025-11-11 11:39:14, 'uploads/teachers/TCH202500009/profile_picture.png', NULL, NULL, 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500009/degree_certificate.pdf');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (10, 'TCH202500010', 'darshan sm', 'alstosm58@gmail.com', '98765', 'Male', 'pbkdf2_sha256$1000000$LaNZ5uJ3CjqqbNAd0HCk7m$6vGFzRd8iKST9wSXBdkbw/MacQ/EKKOdh+xqAMF0Uyk=', 'English', 'B.e', 0, 1, 2025-11-11 06:10:49.048806, 'B.e', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["CBSE"]', '{"English": ["9", "10"]}', '["Marathi"]', 'uploads/teachers/TCH202500010/cv.pdf', 'uploads/teachers/TCH202500010/achievements.pdf', 'uploads/teachers/TCH202500010/experience.pdf', 1, 2025-11-11 06:20:28, 'uploads/teachers/TCH202500010/profile_picture.png', NULL, NULL, 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500010/degree_certificate.pdf');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (15, 'TCH202500015', 'chat', 'vojat89651@gyknife.com', '8906523456', 'Female', 'pbkdf2_sha256$600000$ZgbBVbvvKPDGfUdLTYNnOr$0rLs633wSXf7gVZRfjAKYKzr6gQWLv3Z3m0Br3UPPeY=', '', 'B.Tech', 0, 1, 2025-11-12 10:24:13.049157, 'B.Tech', '[]', '', '["State Board"]', '{}', '["Hindi"]', 'uploads/teachers/TCH202500015/cv.docx', '', '', 0, 2025-11-12 10:44:58, 'uploads/teachers/TCH202500015/profile_picture.png', NULL, NULL, 'pending', NULL, 'Pending', 'uploads/teachers/TCH202500015/degree_certificate.png');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (16, 'TCH202500016', 'Test Teacher', 'test@teacher.com', '9876543210', 'Male', 'pbkdf2_sha256$600000$opXOSKm8hYnFAPyuKfnCjU$ny0eBNoY+BNBJ+e4qCqnzoVTbGKezcxd8ciudmhZIr0=', 'Physics, Mathematics', 'M.Sc Physics', 0, 1, 2025-11-12 15:13:10.608994, 'M.Sc Physics', '[]', 'Experienced physics teacher', '["CBSE", "ICSE"]', '{"Physics": ["11", "12"], "Mathematics": ["10", "11"]}', '["English", "Hindi"]', '', '', '', 0, 2025-11-12 15:13:10, '', '', '', 'pending', 1990-01-01, 'Pending', '');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (17, 'TCH202500017', 'yash', 'besad59482@gyknife.com', '7654321897', 'Male', 'pbkdf2_sha256$600000$dtiONQWTGX8SEfxUwkw6s4$T3aPm5rauOZOGk2V/95uTx9chmMcZ2ONtcsB8C+pdcc=', 'English', 'B.Tech', 0, 1, 2025-11-12 15:16:58.889690, 'B.Tech', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["State Board"]', '{"English": ["11"]}', '["Hindi"]', 'uploads/teachers/TCH202500017/cv.docx', '', '', 1, 2025-11-12 15:18:03, 'uploads/teachers/TCH202500017/profile_picture.png', '', 'uploads/teachers/TCH202500017/degree_certificate.png', 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500017/degree_certificate.png');
INSERT INTO `educators` (`id`, `teacher_id`, `name`, `email`, `mobile`, `gender`, `password_hash`, `subject`, `qualification`, `experience_years`, `profile_completed`, `created_at`, `highest_qualification`, `teaching_experience_institutes`, `bio`, `boards`, `subject_classes`, `languages_known`, `cv_file`, `achievements_file`, `experience_proof_file`, `is_active`, `updated_at`, `profile_picture`, `government_id_file`, `degree_certificate_file`, `approval_status`, `date_of_birth`, `document_status`, `degree_certificate`) VALUES (18, 'TCH202500018', 'Xagejew', 'xagejew545@gusronk.com', '9009887877', 'Male', 'pbkdf2_sha256$600000$vhTaZbOc5DQx4zu4QsYEoe$//fZ75zUXYRDTnRwJamPBfg3i4M7VS6bvvx1i7R38uA=', 'English', 'M.Ed', 0, 1, 2025-11-12 15:22:08.490285, 'M.Ed', '[{"name": "", "from_year": "", "to_year": ""}]', '', '["State Board"]', '{"English": ["12"]}', '["Hindi"]', 'uploads/teachers/TCH202500018/cv.pdf', '', '', 0, 2025-11-12 15:24:33, 'uploads/teachers/TCH202500018/profile_picture.png', '', 'uploads/teachers/TCH202500018/degree_certificate.jpg', 'pending', NULL, 'Verified', 'uploads/teachers/TCH202500018/degree_certificate.jpg');

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `lesson_no` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=665 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for lessons
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (1, 1, 'Lesson 1: Introduction to My Family', NULL);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (2, 1, 'Lesson 2: Family Members', NULL);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (3, 2, 'Lesson 1: School Activities', NULL);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (4, 2, 'Lesson 2: Teachers and Friends', NULL);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (5, 3, 'Lesson 1: Computer Science Ch1 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (6, 3, 'Lesson 2: Computer Science Ch1 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (7, 3, 'Lesson 3: Computer Science Ch1 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (8, 3, 'Lesson 4: Computer Science Ch1 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (9, 4, 'Lesson 1: Computer Science Ch2 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (10, 4, 'Lesson 2: Computer Science Ch2 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (11, 4, 'Lesson 3: Computer Science Ch2 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (12, 4, 'Lesson 4: Computer Science Ch2 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (13, 5, 'Lesson 1: Computer Science Ch3 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (14, 5, 'Lesson 2: Computer Science Ch3 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (15, 5, 'Lesson 3: Computer Science Ch3 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (16, 5, 'Lesson 4: Computer Science Ch3 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (17, 6, 'Lesson 1: Computer Science Ch4 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (18, 6, 'Lesson 2: Computer Science Ch4 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (19, 6, 'Lesson 3: Computer Science Ch4 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (20, 6, 'Lesson 4: Computer Science Ch4 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (21, 7, 'Lesson 1: Computer Science Ch5 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (22, 7, 'Lesson 2: Computer Science Ch5 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (23, 7, 'Lesson 3: Computer Science Ch5 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (24, 7, 'Lesson 4: Computer Science Ch5 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (25, 8, 'Lesson 1: Computer Science Ch1 - Class 7', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (26, 8, 'Lesson 2: Computer Science Ch1 - Class 7', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (27, 8, 'Lesson 3: Computer Science Ch1 - Class 7', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (28, 8, 'Lesson 4: Computer Science Ch1 - Class 7', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (29, 9, 'Lesson 1: Computer Science Ch2 - Class 7', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (30, 9, 'Lesson 2: Computer Science Ch2 - Class 7', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (31, 9, 'Lesson 3: Computer Science Ch2 - Class 7', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (32, 9, 'Lesson 4: Computer Science Ch2 - Class 7', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (33, 10, 'Lesson 1: Computer Science Ch3 - Class 7', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (34, 10, 'Lesson 2: Computer Science Ch3 - Class 7', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (35, 10, 'Lesson 3: Computer Science Ch3 - Class 7', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (36, 10, 'Lesson 4: Computer Science Ch3 - Class 7', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (37, 11, 'Lesson 1: Computer Science Ch4 - Class 7', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (38, 11, 'Lesson 2: Computer Science Ch4 - Class 7', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (39, 11, 'Lesson 3: Computer Science Ch4 - Class 7', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (40, 11, 'Lesson 4: Computer Science Ch4 - Class 7', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (41, 12, 'Lesson 1: Computer Science Ch5 - Class 7', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (42, 12, 'Lesson 2: Computer Science Ch5 - Class 7', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (43, 12, 'Lesson 3: Computer Science Ch5 - Class 7', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (44, 12, 'Lesson 4: Computer Science Ch5 - Class 7', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (45, 13, 'Lesson 1: Computer Science Ch1 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (46, 13, 'Lesson 2: Computer Science Ch1 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (47, 13, 'Lesson 3: Computer Science Ch1 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (48, 13, 'Lesson 4: Computer Science Ch1 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (49, 14, 'Lesson 1: Computer Science Ch2 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (50, 14, 'Lesson 2: Computer Science Ch2 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (51, 14, 'Lesson 3: Computer Science Ch2 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (52, 14, 'Lesson 4: Computer Science Ch2 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (53, 15, 'Lesson 1: Computer Science Ch3 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (54, 15, 'Lesson 2: Computer Science Ch3 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (55, 15, 'Lesson 3: Computer Science Ch3 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (56, 15, 'Lesson 4: Computer Science Ch3 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (57, 16, 'Lesson 1: Computer Science Ch4 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (58, 16, 'Lesson 2: Computer Science Ch4 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (59, 16, 'Lesson 3: Computer Science Ch4 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (60, 16, 'Lesson 4: Computer Science Ch4 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (61, 17, 'Lesson 1: Computer Science Ch5 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (62, 17, 'Lesson 2: Computer Science Ch5 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (63, 17, 'Lesson 3: Computer Science Ch5 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (64, 17, 'Lesson 4: Computer Science Ch5 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (65, 18, 'Lesson 1: Computer Science Ch1 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (66, 18, 'Lesson 2: Computer Science Ch1 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (67, 18, 'Lesson 3: Computer Science Ch1 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (68, 18, 'Lesson 4: Computer Science Ch1 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (69, 19, 'Lesson 1: Computer Science Ch2 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (70, 19, 'Lesson 2: Computer Science Ch2 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (71, 19, 'Lesson 3: Computer Science Ch2 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (72, 19, 'Lesson 4: Computer Science Ch2 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (73, 20, 'Lesson 1: Computer Science Ch3 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (74, 20, 'Lesson 2: Computer Science Ch3 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (75, 20, 'Lesson 3: Computer Science Ch3 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (76, 20, 'Lesson 4: Computer Science Ch3 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (77, 21, 'Lesson 1: Computer Science Ch4 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (78, 21, 'Lesson 2: Computer Science Ch4 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (79, 21, 'Lesson 3: Computer Science Ch4 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (80, 21, 'Lesson 4: Computer Science Ch4 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (81, 22, 'Lesson 1: Computer Science Ch5 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (82, 22, 'Lesson 2: Computer Science Ch5 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (83, 22, 'Lesson 3: Computer Science Ch5 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (84, 22, 'Lesson 4: Computer Science Ch5 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (85, 23, 'Lesson 1: Economics Ch1 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (86, 23, 'Lesson 2: Economics Ch1 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (87, 23, 'Lesson 3: Economics Ch1 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (88, 23, 'Lesson 4: Economics Ch1 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (89, 24, 'Lesson 1: Economics Ch2 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (90, 24, 'Lesson 2: Economics Ch2 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (91, 24, 'Lesson 3: Economics Ch2 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (92, 24, 'Lesson 4: Economics Ch2 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (93, 25, 'Lesson 1: Economics Ch3 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (94, 25, 'Lesson 2: Economics Ch3 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (95, 25, 'Lesson 3: Economics Ch3 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (96, 25, 'Lesson 4: Economics Ch3 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (97, 26, 'Lesson 1: Economics Ch4 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (98, 26, 'Lesson 2: Economics Ch4 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (99, 26, 'Lesson 3: Economics Ch4 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (100, 26, 'Lesson 4: Economics Ch4 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (101, 27, 'Lesson 1: Economics Ch5 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (102, 27, 'Lesson 2: Economics Ch5 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (103, 27, 'Lesson 3: Economics Ch5 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (104, 27, 'Lesson 4: Economics Ch5 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (105, 28, 'Lesson 1: Economics Ch1 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (106, 28, 'Lesson 2: Economics Ch1 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (107, 28, 'Lesson 3: Economics Ch1 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (108, 28, 'Lesson 4: Economics Ch1 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (109, 29, 'Lesson 1: Economics Ch2 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (110, 29, 'Lesson 2: Economics Ch2 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (111, 29, 'Lesson 3: Economics Ch2 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (112, 29, 'Lesson 4: Economics Ch2 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (113, 30, 'Lesson 1: Economics Ch3 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (114, 30, 'Lesson 2: Economics Ch3 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (115, 30, 'Lesson 3: Economics Ch3 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (116, 30, 'Lesson 4: Economics Ch3 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (117, 31, 'Lesson 1: Economics Ch4 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (118, 31, 'Lesson 2: Economics Ch4 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (119, 31, 'Lesson 3: Economics Ch4 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (120, 31, 'Lesson 4: Economics Ch4 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (121, 32, 'Lesson 1: Economics Ch5 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (122, 32, 'Lesson 2: Economics Ch5 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (123, 32, 'Lesson 3: Economics Ch5 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (124, 32, 'Lesson 4: Economics Ch5 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (125, 33, 'Lesson 1: English Ch1 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (126, 33, 'Lesson 2: English Ch1 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (127, 33, 'Lesson 3: English Ch1 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (128, 33, 'Lesson 4: English Ch1 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (129, 34, 'Lesson 1: English Ch2 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (130, 34, 'Lesson 2: English Ch2 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (131, 34, 'Lesson 3: English Ch2 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (132, 34, 'Lesson 4: English Ch2 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (133, 35, 'Lesson 1: English Ch3 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (134, 35, 'Lesson 2: English Ch3 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (135, 35, 'Lesson 3: English Ch3 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (136, 35, 'Lesson 4: English Ch3 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (137, 36, 'Lesson 1: English Ch4 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (138, 36, 'Lesson 2: English Ch4 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (139, 36, 'Lesson 3: English Ch4 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (140, 36, 'Lesson 4: English Ch4 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (141, 37, 'Lesson 1: English Ch5 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (142, 37, 'Lesson 2: English Ch5 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (143, 37, 'Lesson 3: English Ch5 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (144, 37, 'Lesson 4: English Ch5 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (145, 38, 'Lesson 1: English Ch1 - Class 10', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (146, 38, 'Lesson 2: English Ch1 - Class 10', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (147, 38, 'Lesson 3: English Ch1 - Class 10', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (148, 38, 'Lesson 4: English Ch1 - Class 10', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (149, 39, 'Lesson 1: English Ch2 - Class 10', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (150, 39, 'Lesson 2: English Ch2 - Class 10', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (151, 39, 'Lesson 3: English Ch2 - Class 10', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (152, 39, 'Lesson 4: English Ch2 - Class 10', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (153, 40, 'Lesson 1: English Ch3 - Class 10', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (154, 40, 'Lesson 2: English Ch3 - Class 10', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (155, 40, 'Lesson 3: English Ch3 - Class 10', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (156, 40, 'Lesson 4: English Ch3 - Class 10', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (157, 41, 'Lesson 1: English Ch4 - Class 10', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (158, 41, 'Lesson 2: English Ch4 - Class 10', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (159, 41, 'Lesson 3: English Ch4 - Class 10', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (160, 41, 'Lesson 4: English Ch4 - Class 10', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (161, 42, 'Lesson 1: English Ch5 - Class 10', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (162, 42, 'Lesson 2: English Ch5 - Class 10', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (163, 42, 'Lesson 3: English Ch5 - Class 10', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (164, 42, 'Lesson 4: English Ch5 - Class 10', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (165, 43, 'Lesson 1: English Ch1 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (166, 43, 'Lesson 2: English Ch1 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (167, 43, 'Lesson 3: English Ch1 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (168, 43, 'Lesson 4: English Ch1 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (169, 44, 'Lesson 1: English Ch2 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (170, 44, 'Lesson 2: English Ch2 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (171, 44, 'Lesson 3: English Ch2 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (172, 44, 'Lesson 4: English Ch2 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (173, 45, 'Lesson 1: English Ch3 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (174, 45, 'Lesson 2: English Ch3 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (175, 45, 'Lesson 3: English Ch3 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (176, 45, 'Lesson 4: English Ch3 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (177, 46, 'Lesson 1: English Ch4 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (178, 46, 'Lesson 2: English Ch4 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (179, 46, 'Lesson 3: English Ch4 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (180, 46, 'Lesson 4: English Ch4 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (181, 47, 'Lesson 1: English Ch5 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (182, 47, 'Lesson 2: English Ch5 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (183, 47, 'Lesson 3: English Ch5 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (184, 47, 'Lesson 4: English Ch5 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (185, 48, 'Lesson 1: English Ch1 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (186, 48, 'Lesson 2: English Ch1 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (187, 48, 'Lesson 3: English Ch1 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (188, 48, 'Lesson 4: English Ch1 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (189, 49, 'Lesson 1: English Ch2 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (190, 49, 'Lesson 2: English Ch2 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (191, 49, 'Lesson 3: English Ch2 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (192, 49, 'Lesson 4: English Ch2 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (193, 50, 'Lesson 1: English Ch3 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (194, 50, 'Lesson 2: English Ch3 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (195, 50, 'Lesson 3: English Ch3 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (196, 50, 'Lesson 4: English Ch3 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (197, 51, 'Lesson 1: English Ch4 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (198, 51, 'Lesson 2: English Ch4 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (199, 51, 'Lesson 3: English Ch4 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (200, 51, 'Lesson 4: English Ch4 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (201, 52, 'Lesson 1: English Ch5 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (202, 52, 'Lesson 2: English Ch5 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (203, 52, 'Lesson 3: English Ch5 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (204, 52, 'Lesson 4: English Ch5 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (205, 53, 'Lesson 1: English Ch1 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (206, 53, 'Lesson 2: English Ch1 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (207, 53, 'Lesson 3: English Ch1 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (208, 53, 'Lesson 4: English Ch1 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (209, 54, 'Lesson 1: English Ch2 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (210, 54, 'Lesson 2: English Ch2 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (211, 54, 'Lesson 3: English Ch2 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (212, 54, 'Lesson 4: English Ch2 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (213, 55, 'Lesson 1: English Ch3 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (214, 55, 'Lesson 2: English Ch3 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (215, 55, 'Lesson 3: English Ch3 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (216, 55, 'Lesson 4: English Ch3 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (217, 56, 'Lesson 1: English Ch4 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (218, 56, 'Lesson 2: English Ch4 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (219, 56, 'Lesson 3: English Ch4 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (220, 56, 'Lesson 4: English Ch4 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (221, 57, 'Lesson 1: English Ch5 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (222, 57, 'Lesson 2: English Ch5 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (223, 57, 'Lesson 3: English Ch5 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (224, 57, 'Lesson 4: English Ch5 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (225, 58, 'Lesson 1: English Ch1 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (226, 58, 'Lesson 2: English Ch1 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (227, 58, 'Lesson 3: English Ch1 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (228, 58, 'Lesson 4: English Ch1 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (229, 59, 'Lesson 1: English Ch2 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (230, 59, 'Lesson 2: English Ch2 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (231, 59, 'Lesson 3: English Ch2 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (232, 59, 'Lesson 4: English Ch2 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (233, 60, 'Lesson 1: English Ch3 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (234, 60, 'Lesson 2: English Ch3 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (235, 60, 'Lesson 3: English Ch3 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (236, 60, 'Lesson 4: English Ch3 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (237, 61, 'Lesson 1: English Ch4 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (238, 61, 'Lesson 2: English Ch4 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (239, 61, 'Lesson 3: English Ch4 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (240, 61, 'Lesson 4: English Ch4 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (241, 62, 'Lesson 1: English Ch5 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (242, 62, 'Lesson 2: English Ch5 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (243, 62, 'Lesson 3: English Ch5 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (244, 62, 'Lesson 4: English Ch5 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (245, 63, 'Lesson 1: English Ch1 - Class 4', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (246, 63, 'Lesson 2: English Ch1 - Class 4', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (247, 63, 'Lesson 3: English Ch1 - Class 4', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (248, 63, 'Lesson 4: English Ch1 - Class 4', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (249, 64, 'Lesson 1: English Ch2 - Class 4', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (250, 64, 'Lesson 2: English Ch2 - Class 4', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (251, 64, 'Lesson 3: English Ch2 - Class 4', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (252, 64, 'Lesson 4: English Ch2 - Class 4', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (253, 65, 'Lesson 1: English Ch3 - Class 4', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (254, 65, 'Lesson 2: English Ch3 - Class 4', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (255, 65, 'Lesson 3: English Ch3 - Class 4', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (256, 65, 'Lesson 4: English Ch3 - Class 4', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (257, 66, 'Lesson 1: English Ch4 - Class 4', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (258, 66, 'Lesson 2: English Ch4 - Class 4', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (259, 66, 'Lesson 3: English Ch4 - Class 4', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (260, 66, 'Lesson 4: English Ch4 - Class 4', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (261, 67, 'Lesson 1: English Ch5 - Class 4', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (262, 67, 'Lesson 2: English Ch5 - Class 4', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (263, 67, 'Lesson 3: English Ch5 - Class 4', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (264, 67, 'Lesson 4: English Ch5 - Class 4', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (265, 68, 'Lesson 1: English Ch1 - Class 5', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (266, 68, 'Lesson 2: English Ch1 - Class 5', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (267, 68, 'Lesson 3: English Ch1 - Class 5', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (268, 68, 'Lesson 4: English Ch1 - Class 5', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (269, 69, 'Lesson 1: English Ch2 - Class 5', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (270, 69, 'Lesson 2: English Ch2 - Class 5', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (271, 69, 'Lesson 3: English Ch2 - Class 5', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (272, 69, 'Lesson 4: English Ch2 - Class 5', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (273, 70, 'Lesson 1: English Ch3 - Class 5', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (274, 70, 'Lesson 2: English Ch3 - Class 5', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (275, 70, 'Lesson 3: English Ch3 - Class 5', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (276, 70, 'Lesson 4: English Ch3 - Class 5', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (277, 71, 'Lesson 1: English Ch4 - Class 5', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (278, 71, 'Lesson 2: English Ch4 - Class 5', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (279, 71, 'Lesson 3: English Ch4 - Class 5', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (280, 71, 'Lesson 4: English Ch4 - Class 5', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (281, 72, 'Lesson 1: English Ch5 - Class 5', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (282, 72, 'Lesson 2: English Ch5 - Class 5', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (283, 72, 'Lesson 3: English Ch5 - Class 5', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (284, 72, 'Lesson 4: English Ch5 - Class 5', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (285, 73, 'Lesson 1: English Ch1 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (286, 73, 'Lesson 2: English Ch1 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (287, 73, 'Lesson 3: English Ch1 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (288, 73, 'Lesson 4: English Ch1 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (289, 74, 'Lesson 1: English Ch2 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (290, 74, 'Lesson 2: English Ch2 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (291, 74, 'Lesson 3: English Ch2 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (292, 74, 'Lesson 4: English Ch2 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (293, 75, 'Lesson 1: English Ch3 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (294, 75, 'Lesson 2: English Ch3 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (295, 75, 'Lesson 3: English Ch3 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (296, 75, 'Lesson 4: English Ch3 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (297, 76, 'Lesson 1: English Ch4 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (298, 76, 'Lesson 2: English Ch4 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (299, 76, 'Lesson 3: English Ch4 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (300, 76, 'Lesson 4: English Ch4 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (301, 77, 'Lesson 1: English Ch5 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (302, 77, 'Lesson 2: English Ch5 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (303, 77, 'Lesson 3: English Ch5 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (304, 77, 'Lesson 4: English Ch5 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (305, 78, 'Lesson 1: English Ch1 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (306, 78, 'Lesson 2: English Ch1 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (307, 78, 'Lesson 3: English Ch1 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (308, 78, 'Lesson 4: English Ch1 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (309, 79, 'Lesson 1: English Ch2 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (310, 79, 'Lesson 2: English Ch2 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (311, 79, 'Lesson 3: English Ch2 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (312, 79, 'Lesson 4: English Ch2 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (313, 80, 'Lesson 1: English Ch3 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (314, 80, 'Lesson 2: English Ch3 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (315, 80, 'Lesson 3: English Ch3 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (316, 80, 'Lesson 4: English Ch3 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (317, 81, 'Lesson 1: English Ch4 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (318, 81, 'Lesson 2: English Ch4 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (319, 81, 'Lesson 3: English Ch4 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (320, 81, 'Lesson 4: English Ch4 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (321, 82, 'Lesson 1: English Ch5 - Class 9', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (322, 82, 'Lesson 2: English Ch5 - Class 9', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (323, 82, 'Lesson 3: English Ch5 - Class 9', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (324, 82, 'Lesson 4: English Ch5 - Class 9', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (325, 83, 'Lesson 1: Environmental Science Ch1 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (326, 83, 'Lesson 2: Environmental Science Ch1 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (327, 83, 'Lesson 3: Environmental Science Ch1 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (328, 83, 'Lesson 4: Environmental Science Ch1 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (329, 84, 'Lesson 1: Environmental Science Ch2 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (330, 84, 'Lesson 2: Environmental Science Ch2 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (331, 84, 'Lesson 3: Environmental Science Ch2 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (332, 84, 'Lesson 4: Environmental Science Ch2 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (333, 85, 'Lesson 1: Environmental Science Ch3 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (334, 85, 'Lesson 2: Environmental Science Ch3 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (335, 85, 'Lesson 3: Environmental Science Ch3 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (336, 85, 'Lesson 4: Environmental Science Ch3 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (337, 86, 'Lesson 1: Environmental Science Ch4 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (338, 86, 'Lesson 2: Environmental Science Ch4 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (339, 86, 'Lesson 3: Environmental Science Ch4 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (340, 86, 'Lesson 4: Environmental Science Ch4 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (341, 87, 'Lesson 1: Environmental Science Ch5 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (342, 87, 'Lesson 2: Environmental Science Ch5 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (343, 87, 'Lesson 3: Environmental Science Ch5 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (344, 87, 'Lesson 4: Environmental Science Ch5 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (345, 88, 'Lesson 1: Environmental Science Ch1 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (346, 88, 'Lesson 2: Environmental Science Ch1 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (347, 88, 'Lesson 3: Environmental Science Ch1 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (348, 88, 'Lesson 4: Environmental Science Ch1 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (349, 89, 'Lesson 1: Environmental Science Ch2 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (350, 89, 'Lesson 2: Environmental Science Ch2 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (351, 89, 'Lesson 3: Environmental Science Ch2 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (352, 89, 'Lesson 4: Environmental Science Ch2 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (353, 90, 'Lesson 1: Environmental Science Ch3 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (354, 90, 'Lesson 2: Environmental Science Ch3 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (355, 90, 'Lesson 3: Environmental Science Ch3 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (356, 90, 'Lesson 4: Environmental Science Ch3 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (357, 91, 'Lesson 1: Environmental Science Ch4 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (358, 91, 'Lesson 2: Environmental Science Ch4 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (359, 91, 'Lesson 3: Environmental Science Ch4 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (360, 91, 'Lesson 4: Environmental Science Ch4 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (361, 92, 'Lesson 1: Environmental Science Ch5 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (362, 92, 'Lesson 2: Environmental Science Ch5 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (363, 92, 'Lesson 3: Environmental Science Ch5 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (364, 92, 'Lesson 4: Environmental Science Ch5 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (365, 93, 'Lesson 1: Environmental Science Ch1 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (366, 93, 'Lesson 2: Environmental Science Ch1 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (367, 93, 'Lesson 3: Environmental Science Ch1 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (368, 93, 'Lesson 4: Environmental Science Ch1 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (369, 94, 'Lesson 1: Environmental Science Ch2 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (370, 94, 'Lesson 2: Environmental Science Ch2 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (371, 94, 'Lesson 3: Environmental Science Ch2 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (372, 94, 'Lesson 4: Environmental Science Ch2 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (373, 95, 'Lesson 1: Environmental Science Ch3 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (374, 95, 'Lesson 2: Environmental Science Ch3 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (375, 95, 'Lesson 3: Environmental Science Ch3 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (376, 95, 'Lesson 4: Environmental Science Ch3 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (377, 96, 'Lesson 1: Environmental Science Ch4 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (378, 96, 'Lesson 2: Environmental Science Ch4 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (379, 96, 'Lesson 3: Environmental Science Ch4 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (380, 96, 'Lesson 4: Environmental Science Ch4 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (381, 97, 'Lesson 1: Environmental Science Ch5 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (382, 97, 'Lesson 2: Environmental Science Ch5 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (383, 97, 'Lesson 3: Environmental Science Ch5 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (384, 97, 'Lesson 4: Environmental Science Ch5 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (385, 98, 'Lesson 1: General Knowledge Ch1 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (386, 98, 'Lesson 2: General Knowledge Ch1 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (387, 98, 'Lesson 3: General Knowledge Ch1 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (388, 98, 'Lesson 4: General Knowledge Ch1 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (389, 99, 'Lesson 1: General Knowledge Ch2 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (390, 99, 'Lesson 2: General Knowledge Ch2 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (391, 99, 'Lesson 3: General Knowledge Ch2 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (392, 99, 'Lesson 4: General Knowledge Ch2 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (393, 100, 'Lesson 1: General Knowledge Ch3 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (394, 100, 'Lesson 2: General Knowledge Ch3 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (395, 100, 'Lesson 3: General Knowledge Ch3 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (396, 100, 'Lesson 4: General Knowledge Ch3 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (397, 101, 'Lesson 1: General Knowledge Ch4 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (398, 101, 'Lesson 2: General Knowledge Ch4 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (399, 101, 'Lesson 3: General Knowledge Ch4 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (400, 101, 'Lesson 4: General Knowledge Ch4 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (401, 102, 'Lesson 1: General Knowledge Ch5 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (402, 102, 'Lesson 2: General Knowledge Ch5 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (403, 102, 'Lesson 3: General Knowledge Ch5 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (404, 102, 'Lesson 4: General Knowledge Ch5 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (405, 103, 'Lesson 1: General Knowledge Ch1 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (406, 103, 'Lesson 2: General Knowledge Ch1 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (407, 103, 'Lesson 3: General Knowledge Ch1 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (408, 103, 'Lesson 4: General Knowledge Ch1 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (409, 104, 'Lesson 1: General Knowledge Ch2 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (410, 104, 'Lesson 2: General Knowledge Ch2 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (411, 104, 'Lesson 3: General Knowledge Ch2 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (412, 104, 'Lesson 4: General Knowledge Ch2 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (413, 105, 'Lesson 1: General Knowledge Ch3 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (414, 105, 'Lesson 2: General Knowledge Ch3 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (415, 105, 'Lesson 3: General Knowledge Ch3 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (416, 105, 'Lesson 4: General Knowledge Ch3 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (417, 106, 'Lesson 1: General Knowledge Ch4 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (418, 106, 'Lesson 2: General Knowledge Ch4 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (419, 106, 'Lesson 3: General Knowledge Ch4 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (420, 106, 'Lesson 4: General Knowledge Ch4 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (421, 107, 'Lesson 1: General Knowledge Ch5 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (422, 107, 'Lesson 2: General Knowledge Ch5 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (423, 107, 'Lesson 3: General Knowledge Ch5 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (424, 107, 'Lesson 4: General Knowledge Ch5 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (425, 108, 'Lesson 1: Hindi Ch1 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (426, 108, 'Lesson 2: Hindi Ch1 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (427, 108, 'Lesson 3: Hindi Ch1 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (428, 108, 'Lesson 4: Hindi Ch1 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (429, 109, 'Lesson 1: Hindi Ch2 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (430, 109, 'Lesson 2: Hindi Ch2 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (431, 109, 'Lesson 3: Hindi Ch2 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (432, 109, 'Lesson 4: Hindi Ch2 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (433, 110, 'Lesson 1: Hindi Ch3 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (434, 110, 'Lesson 2: Hindi Ch3 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (435, 110, 'Lesson 3: Hindi Ch3 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (436, 110, 'Lesson 4: Hindi Ch3 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (437, 111, 'Lesson 1: Hindi Ch4 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (438, 111, 'Lesson 2: Hindi Ch4 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (439, 111, 'Lesson 3: Hindi Ch4 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (440, 111, 'Lesson 4: Hindi Ch4 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (441, 112, 'Lesson 1: Hindi Ch5 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (442, 112, 'Lesson 2: Hindi Ch5 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (443, 112, 'Lesson 3: Hindi Ch5 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (444, 112, 'Lesson 4: Hindi Ch5 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (445, 113, 'Lesson 1: Hindi Ch1 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (446, 113, 'Lesson 2: Hindi Ch1 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (447, 113, 'Lesson 3: Hindi Ch1 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (448, 113, 'Lesson 4: Hindi Ch1 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (449, 114, 'Lesson 1: Hindi Ch2 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (450, 114, 'Lesson 2: Hindi Ch2 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (451, 114, 'Lesson 3: Hindi Ch2 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (452, 114, 'Lesson 4: Hindi Ch2 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (453, 115, 'Lesson 1: Hindi Ch3 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (454, 115, 'Lesson 2: Hindi Ch3 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (455, 115, 'Lesson 3: Hindi Ch3 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (456, 115, 'Lesson 4: Hindi Ch3 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (457, 116, 'Lesson 1: Hindi Ch4 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (458, 116, 'Lesson 2: Hindi Ch4 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (459, 116, 'Lesson 3: Hindi Ch4 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (460, 116, 'Lesson 4: Hindi Ch4 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (461, 117, 'Lesson 1: Hindi Ch5 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (462, 117, 'Lesson 2: Hindi Ch5 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (463, 117, 'Lesson 3: Hindi Ch5 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (464, 117, 'Lesson 4: Hindi Ch5 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (465, 118, 'Lesson 1: Hindi Ch1 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (466, 118, 'Lesson 2: Hindi Ch1 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (467, 118, 'Lesson 3: Hindi Ch1 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (468, 118, 'Lesson 4: Hindi Ch1 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (469, 119, 'Lesson 1: Hindi Ch2 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (470, 119, 'Lesson 2: Hindi Ch2 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (471, 119, 'Lesson 3: Hindi Ch2 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (472, 119, 'Lesson 4: Hindi Ch2 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (473, 120, 'Lesson 1: Hindi Ch3 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (474, 120, 'Lesson 2: Hindi Ch3 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (475, 120, 'Lesson 3: Hindi Ch3 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (476, 120, 'Lesson 4: Hindi Ch3 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (477, 121, 'Lesson 1: Hindi Ch4 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (478, 121, 'Lesson 2: Hindi Ch4 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (479, 121, 'Lesson 3: Hindi Ch4 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (480, 121, 'Lesson 4: Hindi Ch4 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (481, 122, 'Lesson 1: Hindi Ch5 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (482, 122, 'Lesson 2: Hindi Ch5 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (483, 122, 'Lesson 3: Hindi Ch5 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (484, 122, 'Lesson 4: Hindi Ch5 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (485, 123, 'Lesson 1: Mathematics Ch1 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (486, 123, 'Lesson 2: Mathematics Ch1 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (487, 123, 'Lesson 3: Mathematics Ch1 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (488, 123, 'Lesson 4: Mathematics Ch1 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (489, 124, 'Lesson 1: Mathematics Ch2 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (490, 124, 'Lesson 2: Mathematics Ch2 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (491, 124, 'Lesson 3: Mathematics Ch2 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (492, 124, 'Lesson 4: Mathematics Ch2 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (493, 125, 'Lesson 1: Mathematics Ch3 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (494, 125, 'Lesson 2: Mathematics Ch3 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (495, 125, 'Lesson 3: Mathematics Ch3 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (496, 125, 'Lesson 4: Mathematics Ch3 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (497, 126, 'Lesson 1: Mathematics Ch4 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (498, 126, 'Lesson 2: Mathematics Ch4 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (499, 126, 'Lesson 3: Mathematics Ch4 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (500, 126, 'Lesson 4: Mathematics Ch4 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (501, 127, 'Lesson 1: Mathematics Ch5 - Class 1', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (502, 127, 'Lesson 2: Mathematics Ch5 - Class 1', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (503, 127, 'Lesson 3: Mathematics Ch5 - Class 1', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (504, 127, 'Lesson 4: Mathematics Ch5 - Class 1', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (505, 128, 'Lesson 1: Mathematics Ch1 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (506, 128, 'Lesson 2: Mathematics Ch1 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (507, 128, 'Lesson 3: Mathematics Ch1 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (508, 128, 'Lesson 4: Mathematics Ch1 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (509, 129, 'Lesson 1: Mathematics Ch2 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (510, 129, 'Lesson 2: Mathematics Ch2 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (511, 129, 'Lesson 3: Mathematics Ch2 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (512, 129, 'Lesson 4: Mathematics Ch2 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (513, 130, 'Lesson 1: Mathematics Ch3 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (514, 130, 'Lesson 2: Mathematics Ch3 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (515, 130, 'Lesson 3: Mathematics Ch3 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (516, 130, 'Lesson 4: Mathematics Ch3 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (517, 131, 'Lesson 1: Mathematics Ch4 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (518, 131, 'Lesson 2: Mathematics Ch4 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (519, 131, 'Lesson 3: Mathematics Ch4 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (520, 131, 'Lesson 4: Mathematics Ch4 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (521, 132, 'Lesson 1: Mathematics Ch5 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (522, 132, 'Lesson 2: Mathematics Ch5 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (523, 132, 'Lesson 3: Mathematics Ch5 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (524, 132, 'Lesson 4: Mathematics Ch5 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (525, 133, 'Lesson 1: Mathematics Ch1 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (526, 133, 'Lesson 2: Mathematics Ch1 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (527, 133, 'Lesson 3: Mathematics Ch1 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (528, 133, 'Lesson 4: Mathematics Ch1 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (529, 134, 'Lesson 1: Mathematics Ch2 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (530, 134, 'Lesson 2: Mathematics Ch2 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (531, 134, 'Lesson 3: Mathematics Ch2 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (532, 134, 'Lesson 4: Mathematics Ch2 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (533, 135, 'Lesson 1: Mathematics Ch3 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (534, 135, 'Lesson 2: Mathematics Ch3 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (535, 135, 'Lesson 3: Mathematics Ch3 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (536, 135, 'Lesson 4: Mathematics Ch3 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (537, 136, 'Lesson 1: Mathematics Ch4 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (538, 136, 'Lesson 2: Mathematics Ch4 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (539, 136, 'Lesson 3: Mathematics Ch4 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (540, 136, 'Lesson 4: Mathematics Ch4 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (541, 137, 'Lesson 1: Mathematics Ch5 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (542, 137, 'Lesson 2: Mathematics Ch5 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (543, 137, 'Lesson 3: Mathematics Ch5 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (544, 137, 'Lesson 4: Mathematics Ch5 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (545, 138, 'Lesson 1: Mathematics Ch1 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (546, 138, 'Lesson 2: Mathematics Ch1 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (547, 138, 'Lesson 3: Mathematics Ch1 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (548, 138, 'Lesson 4: Mathematics Ch1 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (549, 139, 'Lesson 1: Mathematics Ch2 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (550, 139, 'Lesson 2: Mathematics Ch2 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (551, 139, 'Lesson 3: Mathematics Ch2 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (552, 139, 'Lesson 4: Mathematics Ch2 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (553, 140, 'Lesson 1: Mathematics Ch3 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (554, 140, 'Lesson 2: Mathematics Ch3 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (555, 140, 'Lesson 3: Mathematics Ch3 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (556, 140, 'Lesson 4: Mathematics Ch3 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (557, 141, 'Lesson 1: Mathematics Ch4 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (558, 141, 'Lesson 2: Mathematics Ch4 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (559, 141, 'Lesson 3: Mathematics Ch4 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (560, 141, 'Lesson 4: Mathematics Ch4 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (561, 142, 'Lesson 1: Mathematics Ch5 - Class 2', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (562, 142, 'Lesson 2: Mathematics Ch5 - Class 2', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (563, 142, 'Lesson 3: Mathematics Ch5 - Class 2', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (564, 142, 'Lesson 4: Mathematics Ch5 - Class 2', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (565, 143, 'Lesson 1: Mathematics Ch1 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (566, 143, 'Lesson 2: Mathematics Ch1 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (567, 143, 'Lesson 3: Mathematics Ch1 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (568, 143, 'Lesson 4: Mathematics Ch1 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (569, 144, 'Lesson 1: Mathematics Ch2 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (570, 144, 'Lesson 2: Mathematics Ch2 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (571, 144, 'Lesson 3: Mathematics Ch2 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (572, 144, 'Lesson 4: Mathematics Ch2 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (573, 145, 'Lesson 1: Mathematics Ch3 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (574, 145, 'Lesson 2: Mathematics Ch3 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (575, 145, 'Lesson 3: Mathematics Ch3 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (576, 145, 'Lesson 4: Mathematics Ch3 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (577, 146, 'Lesson 1: Mathematics Ch4 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (578, 146, 'Lesson 2: Mathematics Ch4 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (579, 146, 'Lesson 3: Mathematics Ch4 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (580, 146, 'Lesson 4: Mathematics Ch4 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (581, 147, 'Lesson 1: Mathematics Ch5 - Class 3', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (582, 147, 'Lesson 2: Mathematics Ch5 - Class 3', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (583, 147, 'Lesson 3: Mathematics Ch5 - Class 3', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (584, 147, 'Lesson 4: Mathematics Ch5 - Class 3', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (585, 148, 'Lesson 1: Physics Ch1 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (586, 148, 'Lesson 2: Physics Ch1 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (587, 148, 'Lesson 3: Physics Ch1 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (588, 148, 'Lesson 4: Physics Ch1 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (589, 149, 'Lesson 1: Physics Ch2 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (590, 149, 'Lesson 2: Physics Ch2 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (591, 149, 'Lesson 3: Physics Ch2 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (592, 149, 'Lesson 4: Physics Ch2 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (593, 150, 'Lesson 1: Physics Ch3 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (594, 150, 'Lesson 2: Physics Ch3 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (595, 150, 'Lesson 3: Physics Ch3 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (596, 150, 'Lesson 4: Physics Ch3 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (597, 151, 'Lesson 1: Physics Ch4 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (598, 151, 'Lesson 2: Physics Ch4 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (599, 151, 'Lesson 3: Physics Ch4 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (600, 151, 'Lesson 4: Physics Ch4 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (601, 152, 'Lesson 1: Physics Ch5 - Class 11', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (602, 152, 'Lesson 2: Physics Ch5 - Class 11', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (603, 152, 'Lesson 3: Physics Ch5 - Class 11', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (604, 152, 'Lesson 4: Physics Ch5 - Class 11', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (605, 153, 'Lesson 1: Physics Ch1 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (606, 153, 'Lesson 2: Physics Ch1 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (607, 153, 'Lesson 3: Physics Ch1 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (608, 153, 'Lesson 4: Physics Ch1 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (609, 154, 'Lesson 1: Physics Ch2 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (610, 154, 'Lesson 2: Physics Ch2 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (611, 154, 'Lesson 3: Physics Ch2 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (612, 154, 'Lesson 4: Physics Ch2 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (613, 155, 'Lesson 1: Physics Ch3 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (614, 155, 'Lesson 2: Physics Ch3 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (615, 155, 'Lesson 3: Physics Ch3 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (616, 155, 'Lesson 4: Physics Ch3 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (617, 156, 'Lesson 1: Physics Ch4 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (618, 156, 'Lesson 2: Physics Ch4 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (619, 156, 'Lesson 3: Physics Ch4 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (620, 156, 'Lesson 4: Physics Ch4 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (621, 157, 'Lesson 1: Physics Ch5 - Class 12', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (622, 157, 'Lesson 2: Physics Ch5 - Class 12', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (623, 157, 'Lesson 3: Physics Ch5 - Class 12', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (624, 157, 'Lesson 4: Physics Ch5 - Class 12', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (625, 158, 'Lesson 1: Sanskrit Ch1 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (626, 158, 'Lesson 2: Sanskrit Ch1 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (627, 158, 'Lesson 3: Sanskrit Ch1 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (628, 158, 'Lesson 4: Sanskrit Ch1 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (629, 159, 'Lesson 1: Sanskrit Ch2 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (630, 159, 'Lesson 2: Sanskrit Ch2 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (631, 159, 'Lesson 3: Sanskrit Ch2 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (632, 159, 'Lesson 4: Sanskrit Ch2 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (633, 160, 'Lesson 1: Sanskrit Ch3 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (634, 160, 'Lesson 2: Sanskrit Ch3 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (635, 160, 'Lesson 3: Sanskrit Ch3 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (636, 160, 'Lesson 4: Sanskrit Ch3 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (637, 161, 'Lesson 1: Sanskrit Ch4 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (638, 161, 'Lesson 2: Sanskrit Ch4 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (639, 161, 'Lesson 3: Sanskrit Ch4 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (640, 161, 'Lesson 4: Sanskrit Ch4 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (641, 162, 'Lesson 1: Sanskrit Ch5 - Class 6', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (642, 162, 'Lesson 2: Sanskrit Ch5 - Class 6', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (643, 162, 'Lesson 3: Sanskrit Ch5 - Class 6', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (644, 162, 'Lesson 4: Sanskrit Ch5 - Class 6', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (645, 163, 'Lesson 1: Sanskrit Ch1 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (646, 163, 'Lesson 2: Sanskrit Ch1 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (647, 163, 'Lesson 3: Sanskrit Ch1 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (648, 163, 'Lesson 4: Sanskrit Ch1 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (649, 164, 'Lesson 1: Sanskrit Ch2 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (650, 164, 'Lesson 2: Sanskrit Ch2 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (651, 164, 'Lesson 3: Sanskrit Ch2 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (652, 164, 'Lesson 4: Sanskrit Ch2 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (653, 165, 'Lesson 1: Sanskrit Ch3 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (654, 165, 'Lesson 2: Sanskrit Ch3 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (655, 165, 'Lesson 3: Sanskrit Ch3 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (656, 165, 'Lesson 4: Sanskrit Ch3 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (657, 166, 'Lesson 1: Sanskrit Ch4 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (658, 166, 'Lesson 2: Sanskrit Ch4 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (659, 166, 'Lesson 3: Sanskrit Ch4 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (660, 166, 'Lesson 4: Sanskrit Ch4 - Class 8', 4);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (661, 167, 'Lesson 1: Sanskrit Ch5 - Class 8', 1);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (662, 167, 'Lesson 2: Sanskrit Ch5 - Class 8', 2);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (663, 167, 'Lesson 3: Sanskrit Ch5 - Class 8', 3);
INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_no`) VALUES (664, 167, 'Lesson 4: Sanskrit Ch5 - Class 8', 4);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- Table structure for student_notifications
CREATE TABLE `student_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=329 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (27, 26, 'Successfully enrolled in Physics Fundamentals', 0, 2025-11-15 10:42:37);
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

ready to exams', 0, 2025-11-18 10:50:54);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (59, 10, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (60, 11, 'New Schedule: meeting based on course content - 2025-11-20 11:10 (Course)', 0, 2025-11-18 11:10:35);
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

next week', 0, 2025-11-18 11:12:10);
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

Next Monday Holiday', 0, 2025-11-18 11:26:35);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (129, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:01 (Maintenance)', 0, 2025-11-18 12:01:43);
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

Next week Hoilday', 0, 2025-11-18 12:06:51);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (175, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 12:22 (General)', 0, 2025-11-18 12:22:26);
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

next week', 0, 2025-11-18 12:25:13);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (221, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-20 17:47 (Maintenance)', 0, 2025-11-18 12:47:53);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (244, 11, 'New Schedule: meeting based on course content - 2025-11-28 17:59 (Assessment)', 0, 2025-11-18 13:00:15);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (267, 11, 'New Schedule: Meeting Based on Perfomance  - 2025-11-22 17:12 (Maintenance)', 0, 2025-11-18 13:12:48);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (290, 11, 'New Schedule: meet up  - 2025-11-18 17:01 (Assessment)', 0, 2025-11-18 15:36:18);
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
INSERT INTO `student_notifications` (`id`, `student_id`, `message`, `is_read`, `created_at`) VALUES (313, 11, '⏰ REMINDER: meet up  is 1 hour away! Scheduled for November 18, 2025 at 11:31 AM', 0, 2025-11-18 15:37:36);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for student_progress
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (1, 11, 5, '{"Introduction": 100, "What is the Web and Internet": 100, "What is HTTP": 100, "Installing web browsers": 100, "What is an API": 100, "Planning your web project": 100, "Sketching your website design": 100, "Choosing Assets": 100, "Creating project folder structure": 100}', '[]', '{}', 2025-11-17 15:11:44, 2025-11-18 10:51:38);
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (3, 11, 1, '{"Introduction": 0, "What is the Web and Internet": 100, "What is HTTP": 0, "Installing web browsers": 0, "What is an API": 100, "Planning your web project": 100, "Sketching your website design": 100, "Choosing Assets": 100, "Creating project folder structure": 100}', '["Introduction", "What is the Web and Internet", "What is HTTP"]', '{}', 2025-11-17 15:23:48, 2025-11-18 10:51:38);
INSERT INTO `student_progress` (`id`, `student_id`, `course_id`, `progress`, `completed`, `quiz_attempts`, `created_at`, `updated_at`) VALUES (4, 11, 6, '{"Introduction": 100}', '[]', '{}', 2025-11-17 17:34:21, 2025-11-18 10:51:38);

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
  `profile_completed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for students
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (4, 'STU20258610', 'd', '', '1234567890', '10', 'icse', '', 2025-08-04 17:45:27, 2025-08-05 10:01:43, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (5, 'STU20250284', 'da', 'male', '9113046752', '7', 'cbse', '', 2025-08-05 10:03:37, 2025-08-05 12:18:18, '$2y$10$riCxaTRw6rSBUi.HjOK6TeJ6svcBnRgVzvVIimZJEgMtIT9zlDk0O', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (6, 'STU20257359', 'Adisha', 'female', '9113046752', '12', 'state', '', 2025-08-06 11:13:17, 2025-08-06 11:14:56, '$2y$10$LHQxG4umz287LLaoj/6E.u6.msRaqrxNylYKOmcqFqfgGP/WtAK2G', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (7, 'STU20259176', 'Darshan', 'male', '9111111111', '10', 'icse', '', 2025-08-07 10:32:28, 2025-08-07 10:33:50, '$2y$10$yBmsnlaBymORYIgze/BVKOBGFe87montZMGWlD/PbFwelALVvBhk2', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (8, 'STU20254553', 'Darshan', 'male', '9113046752', '9', 'cbse', '', 2025-08-21 10:49:48, 2025-11-11 07:26:45, '$2y$10$DcmpJief66Outn0/tfmxZOISwij0CBFIJEPmyAaQ7paRvl/AOENTK', NULL, '', '', '', '["Science","Mathematics"]', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (9, 'STU20252523', 'Darshan', 'male', '9113046755', '7', 'icse', '', 2025-08-21 16:53:25, 2025-08-21 16:59:00, '$2y$10$Og0VvFBXQa4mh01iMIn3s.9M1TOc.5UgXNS4mKwWA.W96IR3u9R.W', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (10, 'STU20251807', 'da', '', '9113046752', '1', 'cbse', '', 2025-08-30 11:02:23, 2025-08-30 11:02:23, '$2y$10$vy1uaV7zY.lPJLm5kRBaqeY3R38dNOvOG5tlSzE1Rrdz.KA4udFye', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (11, 'STU20259433', 'Arun Kumar', 'male', '9223637098', '9', 'icse', '', 2025-09-02 10:57:22, 2025-11-11 16:21:08, '$2y$10$k2xJwV6GoPwM5YG74FA52eqGwS0J.ATt4x.XC8ay53D7Vld750VRK', NULL, '', '', '', '["Science"]', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (12, 'STU20259054', 'Darshan', 'male', '9113046755', '12', 'state', '', 2025-09-09 15:43:33, 2025-09-10 13:52:06, '$2y$10$BY5DMrGmWB2cHlRt3bO99ezqLssHrsFSVx6nrHOgHtrVWqxHJ7mOS', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (13, 'STU20255349', 'Virat', '', '9876543210', '6', 'cbse', '', 2025-09-09 15:54:32, 2025-09-09 15:55:18, '$2y$10$a0pciVtd7F4XLfNxi8jfe.nlh/QqTUMTjvvXgzawQHwp.rNVz86PK', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (14, 'STU20256695', 'Kohli', '', '9876543210', '4', 'icse', '', 2025-09-09 16:09:37, 2025-09-09 16:09:37, '$2y$10$R/MJSba0N4Dx.ngw1NK1/.suAt3yoyLDwfYj3jmnjpJUqYVqnoOP2', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (15, 'STU000015', 'Darshan', '', '9113046753', '7', 'icse', '', 2025-09-16 11:11:50, 2025-09-16 11:11:50, 'pbkdf2_sha256$600000$Po6njYtidevH9khCMX7D8f$um74FTNqIkU7wrNHEFgUDGvkUAD/d6ZvePawIIA/JgI=', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (16, 'STU000016', 'ABD', '', '9223637098', '3', 'icse', '', 2025-09-17 16:29:09, 2025-09-17 16:29:09, 'pbkdf2_sha256$600000$Wuqz3zLrbFDMBZpRnj8c2R$+bwrcp1yDz78xd7lBqqAVabGmOqR6f/XfgCtT04Gd1s=', NULL, NULL, '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (17, 'STU000017', 'ABD', 'male', '9223637099', '8', 'igcse', '', 2025-09-17 16:45:04, 2025-09-17 16:45:55, 'pbkdf2_sha256$600000$yVt0gNsKv2Zu2u4WtcCanm$rU8qVUQ688iZYLIjBm6tiQJmEPLX0G2Ou9uq3R7VF1Q=', 2004-02-17, 'Bangalore', 'RCB', '9876543210', '["Mathematics", "Science", "Arts"]', 1);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (18, 'STU000018', 'Virat', 'male', '9223637098', '6', 'icse', '', 2025-09-17 17:14:10, 2025-09-17 17:56:59, 'pbkdf2_sha256$600000$Re3Dwg7ExrP3BMES7EeTwp$lZGLsX/Jujxhtuu06n5HB1wvVAL6ftXHqbQ4MGC3JcM=', 2025-09-11, 'asdfg', 'erfgn', '1234567890', '["Physics","Biology","Economics"]', 1);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (19, 'STU000019', 'Darshan', '', '9113046752', '6', 'icse', '', 2025-09-18 08:27:08, 2025-09-18 08:27:08, 'pbkdf2_sha256$600000$y1FuKGTSJGjtBdjZFCds2g$Jy/tax2U9B5vCMDQR9Gym8fKaLgaCOR90IuknxmAchA=', NULL, '', '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (20, 'STU000020', 'Devika', '', '9380199999', '1', 'icse', '', 2025-09-18 11:04:50, 2025-09-18 11:04:50, 'pbkdf2_sha256$600000$0WxvjOGyuKmrtEPOb8U4Vw$dvWXpgKdYKeCDrdgp3QeLDN81iEzTk18uFs41FUVU/A=', NULL, '', '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (21, 'STU000021', 'Devika', '', '9380199999', '1', 'icse', '', 2025-09-18 11:05:56, 2025-09-18 11:05:56, 'pbkdf2_sha256$600000$fBi7ITRJYjwPGCcc1Tsl8A$TAHEV7hHOMGdf9HPtTeh+OZtHGP4oXJ4jR5aQvPQmuk=', NULL, '', '', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (22, 'STU000022', 'Adisha', 'female', '9113046752', '12', 'state', '', 2025-09-18 11:09:24, 2025-09-22 13:25:39, 'pbkdf2_sha256$600000$3i2fNmpegDkyV6bToLcWbV$xuBA5/Z3VB0PeqHm0rFl4KXI98Sg5fa+Hm8FwuMDVYU=', NULL, '', 'Darshan', '', '', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (23, 'STU000023', 'Darshan', 'male', '9113046752', '10', 'CBSE', '', 2025-09-18 11:13:49, 2025-11-11 05:28:00, 'pbkdf2_sha256$600000$Hfqha8PSM6vbouUWfqeVfD$2FG1amgbG9zX7665hRW6U1+jhaYSPFqa5MF//GbQpXc=', NULL, '', '', '', '["Mathematics","Chemistry"]', 0);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (24, 'STU000024', 'Darshan', '', '9113046752', '4', 'icse', '', 2025-09-18 14:27:06, 2025-09-18 14:27:30, 'pbkdf2_sha256$600000$kpcmGvdsi5sqqy6BPhdJpR$R40RhHLn4MUpXcn1zPLyc9Qys/OpCuuzqsj4/CTNRAQ=', NULL, '', '', '', '', 1);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (25, 'STU000025', 'Virat', 'male', '9223637099', '1', 'igcse', '', 2025-09-22 15:43:12, 2025-09-22 16:05:52, 'pbkdf2_sha256$600000$xXWR6Z7eCFYyOFF3mA7oIK$yT6nkNhHB4mamb/zWpAaidC/MWzzPrD8++QLOvdlxJ0=', 2025-09-12, 'dfghjkl', 'wefgbn', '23456789', '["Science", "Arts"]', 1);
INSERT INTO `students` (`id`, `student_id`, `name`, `gender`, `mobile_self`, `class`, `board`, `profile_picture`, `created_at`, `updated_at`, `password_hash`, `date_of_birth`, `address`, `parent_name`, `parent_phone`, `interests`, `profile_completed`) VALUES (26, 'S10310967', 'swathi', NULL, '7096785335', '2', 'cbse', '', 2025-10-07 07:16:35, 2025-10-07 07:16:35, 'pbkdf2_sha256$1000000$cypdAvGElb12z1WTePYfWh$V1wjhioO2+wDn91FoJQDuWj/HQnFTOtMmf5ewLUiYTo=', NULL, '', '', '', '', 0);

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

-- Table structure for teacher_email_logs
CREATE TABLE `teacher_email_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) DEFAULT NULL,
  `email_subject` varchar(255) DEFAULT NULL,
  `email_body` text DEFAULT NULL,
  `sent_status` varchar(20) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- Table structure for video_progress
CREATE TABLE `video_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `video_id` varchar(100) NOT NULL,
  `video_time` decimal(10,2) DEFAULT 0.00,
  `video_duration` decimal(10,2) DEFAULT NULL,
  `last_watched` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for video_progress
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (1, 12, 2, 'Introduction', 6.67, 80.11, 2025-11-06 16:16:54);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (2, 8, 1, 'Introduction', 1.72, 80.11, 2025-11-11 13:04:02);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (3, 11, 5, 'Introduction', 80.11, 80.11, 2025-11-17 17:56:41);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (4, 11, 5, 'What is the Web and Internet', 305.11, 305.11, 2025-11-17 17:03:12);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (5, 11, 5, 'What is HTTP', 380.11, 380.11, 2025-11-17 17:03:55);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (6, 11, 5, 'What is an API', 357.37, 357.37, 2025-11-17 17:05:32);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (7, 11, 5, 'Planning your web project', 104.00, 104.00, 2025-11-17 17:05:56);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (8, 11, 1, 'Introduction', 0.00, 80.11, 2025-11-17 17:56:15);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (9, 11, 1, 'What is HTTP', 0.00, NULL, 2025-11-17 15:26:12);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (10, 11, 1, 'Installing web browsers', 0.00, NULL, 2025-11-17 15:27:27);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (11, 11, 1, 'What is the Web and Internet', 305.11, 305.11, 2025-11-17 15:27:57);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (12, 11, 1, 'What is an API', 357.37, 357.37, 2025-11-17 17:55:57);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (13, 11, 1, 'Sketching your website design', 110.37, 110.37, 2025-11-17 16:05:25);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (14, 11, 1, 'Planning your web project', 104.00, 104.00, 2025-11-17 16:04:00);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (15, 11, 1, 'Choosing Assets', 246.92, 246.92, 2025-11-17 16:06:47);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (16, 11, 5, 'Installing web browsers', 164.61, 164.61, 2025-11-17 17:04:18);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (17, 11, 5, 'Choosing Assets', 246.92, 246.92, 2025-11-17 17:07:14);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (18, 11, 1, 'Creating project folder structure', 454.87, 454.87, 2025-11-17 16:08:54);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (19, 11, 6, 'Introduction', 80.11, 80.11, 2025-11-17 16:33:47);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (20, 11, 6, 'What is the Web and Internet', 305.11, 305.11, 2025-11-17 17:45:15);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (21, 11, 6, 'Installing web browsers', 164.61, 164.61, 2025-11-17 17:46:03);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (22, 11, 5, 'Sketching your website design', 110.37, 110.37, 2025-11-17 17:06:40);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (23, 11, 5, 'Creating project folder structure', 454.87, 454.87, 2025-11-17 17:07:44);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (24, 11, 6, 'What is HTTP', 380.11, 380.11, 2025-11-17 17:45:51);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (25, 11, 6, 'What is an API', 357.37, 357.37, 2025-11-17 17:46:35);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (26, 11, 6, 'Planning your web project', 104.00, 104.00, 2025-11-17 17:47:05);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (27, 11, 6, 'Sketching your website design', 110.37, 110.37, 2025-11-17 17:47:41);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (28, 11, 6, 'Choosing Assets', 246.92, 246.92, 2025-11-17 17:48:11);
INSERT INTO `video_progress` (`id`, `student_id`, `course_id`, `video_id`, `video_time`, `video_duration`, `last_watched`) VALUES (29, 11, 6, 'Creating project folder structure', 454.87, 454.87, 2025-11-17 17:48:57);
