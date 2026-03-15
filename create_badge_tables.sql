-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'trophy',
    category VARCHAR(20) NOT NULL,
    difficulty VARCHAR(15) NOT NULL,
    points INT DEFAULT 10,
    criteria TEXT,
    color VARCHAR(7) DEFAULT '#FFD700',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name (name)
);

-- Create student_badges table
CREATE TABLE IF NOT EXISTS student_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context JSON,
    progress INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_badge (student_id, badge_id)
);

-- Create badge_progress table
CREATE TABLE IF NOT EXISTS badge_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    badge_id INT NOT NULL,
    current_progress JSON,
    progress_percentage FLOAT DEFAULT 0.0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_badge_progress (student_id, badge_id)
);

-- Insert default badges
INSERT INTO badges (name, description, icon, category, difficulty, points, color, criteria) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'completion', 'beginner', 10, '#4CAF50', '{"lessons_completed": 1}'),
('Quick Learner', 'Complete a lesson in under 30 minutes', '⚡', 'performance', 'beginner', 15, '#FF9800', '{"lesson_time_under": 30}'),
('Quiz Master', 'Score 80% or higher on your first quiz', '🧠', 'performance', 'beginner', 20, '#2196F3', '{"quiz_score_min": 80, "quiz_attempts": 1}'),
('Chapter Champion', 'Complete an entire chapter', '📚', 'completion', 'intermediate', 50, '#9C27B0', '{"chapters_completed": 1}'),
('Streak Keeper', 'Study for 7 consecutive days', '🔥', 'streak', 'intermediate', 75, '#FF5722', '{"study_streak_days": 7}'),
('High Achiever', 'Maintain 90% average across 5 quizzes', '⭐', 'performance', 'intermediate', 100, '#FFD700', '{"quiz_average_min": 90, "quiz_count_min": 5}'),
('Course Conqueror', 'Complete an entire course with 85% average', '🏆', 'completion', 'advanced', 200, '#FFD700', '{"courses_completed": 1, "course_average_min": 85}'),
('Subject Expert', 'Complete 3 courses in the same subject', '🎓', 'skill', 'advanced', 300, '#673AB7', '{"same_subject_courses": 3}'),
('Improvement Star', 'Improve quiz scores by 30% over 10 attempts', '📈', 'improvement', 'advanced', 250, '#4CAF50', '{"score_improvement": 30, "quiz_attempts_min": 10}')
ON DUPLICATE KEY UPDATE name=name;