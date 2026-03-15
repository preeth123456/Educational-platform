<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Enrollment.php';
require_once __DIR__ . '/../models/Student.php';

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

// Initialize objects
$enrollment = new Enrollment($db);
$student = new Student($db);

// Get the student ID from query parameters or session
try {
    // Get student ID from query parameter or session
    $student_id = isset($_GET['student_id']) ? $_GET['student_id'] : null;
    
    // If no student_id provided, try to get from session
    if (empty($student_id) && session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (empty($student_id) && isset($_SESSION['student_id'])) {
        $student_id = $_SESSION['student_id'];
    }
    
    if (empty($student_id)) {
        http_response_code(401);
        echo json_encode(array("status" => "error", "message" => "Student ID is required."));
        exit;
    }
    
    // Get enrolled courses for the student
    $stmt = $enrollment->getStudentEnrollments($student_id);
    $enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the response
    $response = array(
        "status" => "success",
        "data" => array()
    );
    
    foreach ($enrollments as $enrollmentData) {
        // Calculate progress if not already set
        if (!isset($enrollmentData['progress_percentage'])) {
            $progress = $enrollment->calculateProgress($enrollmentData['student_id'], $enrollmentData['course_id']);
            $enrollmentData['progress_percentage'] = $progress;
        }
        
        $response['data'][] = array(
            "enrollment_id" => $enrollmentData['id'],
            "course_id" => $enrollmentData['course_id'],
            "course_title" => $enrollmentData['title'],
            "thumbnail_url" => $enrollmentData['thumbnail_url'],
            "instructor_name" => $enrollmentData['instructor_name'],
            "enrollment_date" => $enrollmentData['enrollment_date'],
            "status" => $enrollmentData['status'],
            "progress" => (float)$enrollmentData['progress_percentage'],
            "duration_hours" => (int)$enrollmentData['duration_hours']
        );
    }
    
    http_response_code(200);
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "status" => "error",
        "message" => "Error fetching enrolled courses: " . $e->getMessage()
    ));
}
?>
