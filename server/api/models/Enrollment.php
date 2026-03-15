<?php
require_once __DIR__ . '/../config/database.php';

class Enrollment {
    private $conn;
    private $table_name = "student_enrollments";

    public $id;
    public $student_id;
    public $course_id;
    public $enrollment_date;
    public $completion_date;
    public $progress_percentage;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Enroll student in a course
    public function enroll($student_id, $course_id) {
        // Check if already enrolled
        if ($this->isEnrolled($student_id, $course_id)) {
            return false;
        }

        $query = "INSERT INTO " . $this->table_name . "
                  (student_id, course_id, enrollment_date, status)
                  VALUES (?, ?, NOW(), 'enrolled')";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Check if student is enrolled
    public function isEnrolled($student_id, $course_id) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE student_id = ? AND course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    // Get enrollment details
    public function getEnrollment($student_id, $course_id) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE student_id = ? AND course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Update enrollment status
    public function updateStatus($student_id, $course_id, $status) {
        $query = "UPDATE " . $this->table_name . "
                  SET status = ?
                  WHERE student_id = ? AND course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $status);
        $stmt->bindParam(2, $student_id);
        $stmt->bindParam(3, $course_id);
        
        return $stmt->execute();
    }

    // Update progress percentage
    public function updateProgress($student_id, $course_id, $progress_percentage) {
        $query = "UPDATE " . $this->table_name . "
                  SET progress_percentage = ?
                  WHERE student_id = ? AND course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $progress_percentage);
        $stmt->bindParam(2, $student_id);
        $stmt->bindParam(3, $course_id);
        
        return $stmt->execute();
    }

    // Complete course
    public function completeCourse($student_id, $course_id) {
        $query = "UPDATE " . $this->table_name . "
                  SET status = 'completed', 
                      completion_date = NOW(),
                      progress_percentage = 100
                  WHERE student_id = ? AND course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id);
        
        return $stmt->execute();
    }

    // Get all enrollments for a student
    public function getStudentEnrollments($student_id) {
        $query = "SELECT e.*, c.title, c.thumbnail_url, c.duration_hours,
                         t.name as instructor_name
                  FROM " . $this->table_name . " e
                  INNER JOIN courses c ON e.course_id = c.id
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  WHERE e.student_id = ?
                  ORDER BY e.enrollment_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->execute();
        return $stmt;
    }

    // Get enrollment count for a course
    public function getCourseEnrollmentCount($course_id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . "
                  WHERE course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $course_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }

    // Drop course
    public function dropCourse($student_id, $course_id) {
        $query = "UPDATE " . $this->table_name . "
                  SET status = 'dropped'
                  WHERE student_id = ? AND course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id);
        
        return $stmt->execute();
    }

    // Calculate course progress
    public function calculateProgress($student_id, $course_id) {
        // This would typically involve counting completed lessons
        // For now, we'll use a simple calculation
        $query = "SELECT 
                    COUNT(lp.id) as completed_lessons,
                    COUNT(l.id) as total_lessons
                  FROM course_lessons l
                  LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id 
                    AND lp.student_id = ? AND lp.is_completed = 1
                  INNER JOIN course_modules cm ON l.module_id = cm.id
                  WHERE cm.course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row['total_lessons'] > 0) {
            $progress = ($row['completed_lessons'] / $row['total_lessons']) * 100;
            $this->updateProgress($student_id, $course_id, $progress);
            return $progress;
        }
        
        return 0;
    }
}
?> 