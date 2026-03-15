-- Video Conferencing Database Schema

-- Video Conference Sessions
CREATE TABLE IF NOT EXISTS video_conferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    session_id INT NULL,
    meeting_url TEXT NOT NULL,
    meeting_id VARCHAR(100) UNIQUE NOT NULL,
    host_key VARCHAR(50),
    participant_key VARCHAR(50),
    status ENUM('scheduled', 'live', 'ended', 'cancelled') DEFAULT 'scheduled',
    scheduled_start DATETIME,
    actual_start DATETIME NULL,
    actual_end DATETIME NULL,
    max_participants INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES virtual_classrooms(id) ON DELETE CASCADE,
    INDEX idx_classroom_id (classroom_id),
    INDEX idx_meeting_id (meeting_id),
    INDEX idx_status (status)
);

-- Conference Participants
CREATE TABLE IF NOT EXISTS conference_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    user_id INT NOT NULL,
    user_type ENUM('teacher', 'student') NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    duration_minutes INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (conference_id) REFERENCES video_conferences(id) ON DELETE CASCADE,
    INDEX idx_conference_id (conference_id),
    INDEX idx_user_id (user_id)
);

-- Conference Recordings
CREATE TABLE IF NOT EXISTS conference_recordings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    recording_url TEXT,
    recording_size BIGINT DEFAULT 0,
    duration_minutes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (conference_id) REFERENCES video_conferences(id) ON DELETE CASCADE,
    INDEX idx_conference_id (conference_id)
);