<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../models/Course.php';
require_once '../models/Enrollment.php';

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
$course = new Course($db);
$enrollment = new Enrollment($db);

// Get POST data
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid JSON data."));
    exit;
}

$student_id = $input['student_id'] ?? '';
$course_id = $input['course_id'] ?? '';

if (empty($student_id) || empty($course_id)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Student ID and Course ID are required."));
    exit;
}

try {
    // Check if course exists and is published
    $course_data = $course->getById($course_id);
    if (!$course_data) {
        http_response_code(404);
        echo json_encode(array("status" => "error", "message" => "Course not found or not published."));
        exit;
    }
    
    // Check if student is already enrolled
    if ($enrollment->isEnrolled($student_id, $course_id)) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Student is already enrolled in this course."));
        exit;
    }
    
    // Enroll student in course
    if ($enrollment->enroll($student_id, $course_id)) {
        // Get updated enrollment data
        $enrollment_data = $enrollment->getEnrollment($student_id, $course_id);
        
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "message" => "Successfully enrolled in course.",
            "data" => array(
                "enrollment_id" => $enrollment_data['id'],
                "student_id" => $student_id,
                "course_id" => $course_id,
                "enrollment_date" => $enrollment_data['enrollment_date'],
                "status" => $enrollment_data['status'],
                "course_title" => $course_data['title'],
                "instructor_name" => $course_data['instructor_name']
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to enroll in course."));
    }
    
} catch (Exception $e) {
    error_log("Error enrolling in course: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Failed to enroll in course."));
}
?> 