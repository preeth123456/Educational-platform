<?php
// Database connection configuration for EduYata
class DatabaseConnection {
    private $host = 'localhost';
    private $dbname = 'eduyata_db';
    private $username = 'root';
    private $password = '';
    private $pdo;

    public function __construct() {
        try {
            $this->pdo = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->pdo;
    }
}

// Example usage functions for the teacher dashboard
class EduYataAPI {
    private $db;

    public function __construct() {
        $this->db = (new DatabaseConnection())->getConnection();
    }

    // Get all boards
    public function getBoards() {
        $stmt = $this->db->query("SELECT * FROM boards ORDER BY board_name");
        return $stmt->fetchAll();
    }

    // Get classes for a specific board
    public function getClassesByBoard($boardId) {
        $stmt = $this->db->prepare("
            SELECT c.*, b.board_name 
            FROM classes c 
            JOIN boards b ON c.board_id = b.board_id 
            WHERE c.board_id = ? 
            ORDER BY c.class_number
        ");
        $stmt->execute([$boardId]);
        return $stmt->fetchAll();
    }

    // Get subjects for a specific class
    public function getSubjectsByClass($classId) {
        $stmt = $this->db->prepare("
            SELECT s.*, c.class_name, b.board_name 
            FROM subjects s 
            JOIN classes c ON s.class_id = c.class_id 
            JOIN boards b ON c.board_id = b.board_id 
            WHERE s.class_id = ? 
            ORDER BY s.subject_name
        ");
        $stmt->execute([$classId]);
        return $stmt->fetchAll();
    }

    // Get teacher's assigned classes and subjects
    public function getTeacherAssignments($teacherId) {
        $stmt = $this->db->prepare("
            SELECT 
                tcs.*,
                b.board_name,
                c.class_name,
                s.subject_name,
                s.subject_code
            FROM teacher_class_subjects tcs
            JOIN classes c ON tcs.class_id = c.class_id
            JOIN boards b ON c.board_id = b.board_id
            JOIN subjects s ON tcs.subject_id = s.subject_id
            WHERE tcs.teacher_id = ?
            ORDER BY b.board_name, c.class_number, s.subject_name
        ");
        $stmt->execute([$teacherId]);
        return $stmt->fetchAll();
    }

    // Get chapters for a subject
    public function getChaptersBySubject($subjectId) {
        $stmt = $this->db->prepare("
            SELECT * FROM chapters 
            WHERE subject_id = ? 
            ORDER BY chapter_number
        ");
        $stmt->execute([$subjectId]);
        return $stmt->fetchAll();
    }

    // Get lessons for a chapter
    public function getLessonsByChapter($chapterId) {
        $stmt = $this->db->prepare("
            SELECT * FROM lessons 
            WHERE chapter_id = ? 
            ORDER BY lesson_number
        ");
        $stmt->execute([$chapterId]);
        return $stmt->fetchAll();
    }

    // Get topics for a lesson
    public function getTopicsByLesson($lessonId) {
        $stmt = $this->db->prepare("
            SELECT t.*, e.name as teacher_name 
            FROM topics t 
            LEFT JOIN educator e ON t.teacher_id = e.teacher_id 
            WHERE t.lesson_id = ? AND t.is_active = 1
            ORDER BY t.created_at
        ");
        $stmt->execute([$lessonId]);
        return $stmt->fetchAll();
    }

    // Add a new topic (for teachers)
    public function addTopic($lessonId, $teacherId, $topicName, $videoUrl, $description, $contentType = 'video') {
        $stmt = $this->db->prepare("
            INSERT INTO topics (lesson_id, teacher_id, topic_name, video_url, description, content_type) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        return $stmt->execute([$lessonId, $teacherId, $topicName, $videoUrl, $description, $contentType]);
    }

    // Update topic
    public function updateTopic($topicId, $topicName, $videoUrl, $description) {
        $stmt = $this->db->prepare("
            UPDATE topics 
            SET topic_name = ?, video_url = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE topic_id = ?
        ");
        return $stmt->execute([$topicName, $videoUrl, $description, $topicId]);
    }

    // Get complete curriculum structure for a board
    public function getCurriculumStructure($boardId) {
        $stmt = $this->db->prepare("
            SELECT 
                b.board_name,
                c.class_id, c.class_name, c.level,
                s.subject_id, s.subject_name, s.subject_code,
                ch.chapter_id, ch.chapter_name,
                l.lesson_id, l.lesson_name,
                COUNT(t.topic_id) as topic_count
            FROM boards b
            JOIN classes c ON b.board_id = c.board_id
            JOIN subjects s ON c.class_id = s.class_id
            LEFT JOIN chapters ch ON s.subject_id = ch.subject_id
            LEFT JOIN lessons l ON ch.chapter_id = l.chapter_id
            LEFT JOIN topics t ON l.lesson_id = t.lesson_id AND t.is_active = 1
            WHERE b.board_id = ?
            GROUP BY b.board_id, c.class_id, s.subject_id, ch.chapter_id, l.lesson_id
            ORDER BY c.class_number, s.subject_name, ch.chapter_number, l.lesson_number
        ");
        $stmt->execute([$boardId]);
        return $stmt->fetchAll();
    }
}

// Example API endpoints
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $api = new EduYataAPI();
    
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'boards':
                echo json_encode($api->getBoards());
                break;
                
            case 'classes':
                if (isset($_GET['board_id'])) {
                    echo json_encode($api->getClassesByBoard($_GET['board_id']));
                }
                break;
                
            case 'subjects':
                if (isset($_GET['class_id'])) {
                    echo json_encode($api->getSubjectsByClass($_GET['class_id']));
                }
                break;
                
            case 'teacher_assignments':
                if (isset($_GET['teacher_id'])) {
                    echo json_encode($api->getTeacherAssignments($_GET['teacher_id']));
                }
                break;
                
            case 'curriculum':
                if (isset($_GET['board_id'])) {
                    echo json_encode($api->getCurriculumStructure($_GET['board_id']));
                }
                break;
                
            default:
                echo json_encode(['error' => 'Invalid action']);
        }
    }
}
?>