<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../models/Course.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit;
}

// Initialize course object
$course = new Course($db);

// Get query parameters
$category = $_GET['category'] ?? '';
$level = $_GET['level'] ?? '';
$search = $_GET['search'] ?? '';
$limit = $_GET['limit'] ?? 20;
$student_id = $_GET['student_id'] ?? null;

try {
    $courses = array();
    
    if ($student_id) {
        // Get courses filtered by student's class and board
        $stmt = $course->getCoursesForStudent($student_id);
    } elseif (!empty($search)) {
        // Search courses
        $stmt = $course->search($search);
    } elseif (!empty($category)) {
        // Get courses by category
        $stmt = $course->getByCategory($category);
    } elseif (!empty($level)) {
        // Get courses by level
        $stmt = $course->getByLevel($level);
    } else {
        // Get all published courses
        $stmt = $course->getAllPublished();
    }
    
    // Get all course IDs for the current query
    $courseIds = array();
    $courseData = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $courseId = $row['id'];
        $courseData[$courseId] = array(
            "id" => $courseId,
            "course_id" => $row['course_id'],
            "title" => $row['title'],
            "description" => $row['description'],
            "category" => $row['category'],
            "level" => $row['level'],
            "duration_hours" => $row['duration_hours'],
            "price" => $row['price'],
            "thumbnail_url" => $row['thumbnail_url'],
            "instructor_name" => $row['instructor_name'],
            "qualification" => $row['qualification'],
            "created_at" => $row['created_at'],
            "students_count" => (int)($row['enrollment_count'] ?? 0),
            "is_enrolled" => false // Default to false
        );
        $courseIds[] = $courseId;
    }
    
    // If student ID is provided, check enrollment status for each course
    if ($student_id && !empty($courseIds)) {
        $placeholders = str_repeat('?,', count($courseIds) - 1) . '?';
        $sql = "SELECT course_id FROM student_enrollments WHERE student_id = ? AND course_id IN ($placeholders) AND status != 'dropped'";
        $stmt = $db->prepare($sql);
        
        // Bind parameters: first one is student_id, rest are course IDs
        $params = array_merge([$student_id], $courseIds);
        $stmt->execute($params);
        
        // Mark enrolled courses
        while ($enrollment = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $enrolledCourseId = $enrollment['course_id'];
            if (isset($courseData[$enrolledCourseId])) {
                $courseData[$enrolledCourseId]['is_enrolled'] = true;
            }
        }
    }
    
    // Convert associative array back to indexed array
    $courses = array_values($courseData);
    
    // Limit results if specified
    if ($limit > 0) {
        $courses = array_slice($courses, 0, $limit);
    }
    
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "data" => $courses,
        "count" => count($courses)
    ));
    
} catch (Exception $e) {
    error_log("Error getting courses: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Failed to get courses."));
}
?> 