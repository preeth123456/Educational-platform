<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../models/Student.php';

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

// Initialize student object
$student = new Student($db);

// Get student ID from query parameter
$student_id = $_GET['student_id'] ?? '';

if (empty($student_id)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Student ID is required."));
    exit;
}

// Set student ID and fetch data
$student->student_id = $student_id;

if ($student->readOne()) {
    // Return student data
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "data" => array(
            "id" => $student->id,
            "student_id" => $student->student_id,
            "name" => $student->name,
            "father_name" => $student->father_name,
            "gender" => $student->gender,
            "mobile_self" => $student->mobile_self,
            "mobile_father" => $student->mobile_father,
            "mobile_mother" => $student->mobile_mother,
            "class" => $student->class,
            "board" => $student->board,
            "profile_picture" => $student->profile_picture,
            "created_at" => $student->created_at
        )
    ));
} else {
    http_response_code(404);
    echo json_encode(array("status" => "error", "message" => "Student not found."));
}
?> 