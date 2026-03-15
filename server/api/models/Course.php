<?php
require_once __DIR__ . '/../config/database.php';

class Course {
    private $conn;
    private $table_name = "courses";

    public $id;
    public $course_id;
    public $title;
    public $description;
    public $instructor_id;
    public $category;
    public $level;
    public $duration_hours;
    public $price;
    public $thumbnail_url;
    public $class_level;
    public $board;
    public $is_published;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all published courses
    public function getAllPublished() {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification,
                         COUNT(e.id) as enrollment_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  LEFT JOIN student_enrollments e ON c.id = e.course_id AND e.status != 'dropped'
                  WHERE c.is_published = 1
                  GROUP BY c.id
                  ORDER BY c.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Get courses by category
    public function getByCategory($category) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification,
                         COUNT(e.id) as enrollment_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  LEFT JOIN student_enrollments e ON c.id = e.course_id AND e.status != 'dropped'
                  WHERE c.category = ? AND c.is_published = 1
                  GROUP BY c.id
                  ORDER BY c.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $category);
        $stmt->execute();
        return $stmt;
    }

    // Get single course by ID
    public function getById($id) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification, t.experience_years
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  WHERE c.id = ? AND c.is_published = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->id = $row['id'];
            $this->course_id = $row['course_id'];
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->instructor_id = $row['instructor_id'];
            $this->category = $row['category'];
            $this->level = $row['level'];
            $this->duration_hours = $row['duration_hours'];
            $this->price = $row['price'];
            $this->thumbnail_url = $row['thumbnail_url'];
            $this->is_published = $row['is_published'];
            $this->created_at = $row['created_at'];
            return $row;
        }
        return false;
    }

    // Get single course by course_id
    public function getByCourseId($course_id) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification, t.experience_years
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  WHERE c.course_id = ? AND c.is_published = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $course_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->id = $row['id'];
            $this->course_id = $row['course_id'];
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->instructor_id = $row['instructor_id'];
            $this->category = $row['category'];
            $this->level = $row['level'];
            $this->duration_hours = $row['duration_hours'];
            $this->price = $row['price'];
            $this->thumbnail_url = $row['thumbnail_url'];
            $this->is_published = $row['is_published'];
            $this->created_at = $row['created_at'];
            return $row;
        }
        return false;
    }

    // Get courses by level
    public function getByLevel($level) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification,
                         COUNT(e.id) as enrollment_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  LEFT JOIN student_enrollments e ON c.id = e.course_id AND e.status != 'dropped'
                  WHERE c.level = ? AND c.is_published = 1
                  GROUP BY c.id
                  ORDER BY c.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $level);
        $stmt->execute();
        return $stmt;
    }

    // Search courses
    public function search($search_term) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification,
                         COUNT(e.id) as enrollment_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  LEFT JOIN student_enrollments e ON c.id = e.course_id AND e.status != 'dropped'
                  WHERE (c.title LIKE ? OR c.description LIKE ?) AND c.is_published = 1
                  GROUP BY c.id
                  ORDER BY c.created_at DESC";
        
        $search_pattern = "%$search_term%";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $search_pattern);
        $stmt->bindParam(2, $search_pattern);
        $stmt->execute();
        return $stmt;
    }

    // Get popular courses (most enrolled)
    public function getPopularCourses($limit = 6) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification,
                         COUNT(e.id) as enrollment_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  LEFT JOIN student_enrollments e ON c.id = e.course_id AND e.status != 'dropped'
                  WHERE c.is_published = 1
                  GROUP BY c.id
                  ORDER BY enrollment_count DESC
                  LIMIT ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    // Get recommended courses for a student
    public function getRecommendedForStudent($student_id, $limit = 6) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification,
                         COUNT(e.id) as enrollment_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  LEFT JOIN student_enrollments e ON c.id = e.course_id AND e.status != 'dropped'
                  WHERE c.is_published = 1 
                  AND c.id NOT IN (
                      SELECT course_id FROM student_enrollments WHERE student_id = ?
                  )
                  GROUP BY c.id
                  ORDER BY RAND()
                  LIMIT ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    // Get course categories
    public function getCategories() {
        $query = "SELECT * FROM course_categories ORDER BY name";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Check if student is enrolled in course (by primary course id)
    public function isStudentEnrolled($student_id, $course_id) {
        $query = "SELECT * FROM student_enrollments 
                  WHERE student_id = ? AND course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    // Check if student is enrolled in course (by course_id string)
    public function isStudentEnrolledByCourseId($student_id, $course_id_string) {
        $query = "SELECT e.* FROM student_enrollments e
                  INNER JOIN courses c ON e.course_id = c.id
                  WHERE e.student_id = ? AND c.course_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->bindParam(2, $course_id_string);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    // Get student's enrolled courses
    public function getStudentEnrollments($student_id) {
        $query = "SELECT c.*, t.name as instructor_name, e.enrollment_date, 
                         e.progress_percentage, e.status
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  INNER JOIN student_enrollments e ON c.id = e.course_id
                  WHERE e.student_id = ?
                  ORDER BY e.enrollment_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->execute();
        return $stmt;
    }

    // Get courses filtered by student's class and board
    public function getCoursesForStudent($student_id) {
        $query = "SELECT c.*, t.name as instructor_name, t.qualification,
                         COUNT(e.id) as enrollment_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN teachers t ON c.instructor_id = t.id
                  LEFT JOIN student_enrollments e ON c.id = e.course_id AND e.status != 'dropped'
                  LEFT JOIN students s ON s.id = ?
                  WHERE c.is_published = 1 
                  AND (c.class_level = '' OR c.class_level = s.class)
                  AND (c.board = '' OR c.board = s.board)
                  GROUP BY c.id
                  ORDER BY c.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->execute();
        return $stmt;
    }
}
?> 