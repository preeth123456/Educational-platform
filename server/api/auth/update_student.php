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

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Log the received data for debugging
error_log("Update student request received: " . print_r($data, true));

if (!empty($data->id) && !empty($data->student_id)) {
    
    // Set student property values
    $student->id = $data->id;
    $student->student_id = $data->student_id;
    $student->name = $data->name ?? '';
    $student->father_name = $data->father_name ?? '';
    $student->gender = $data->gender ?? '';
    $student->mobile_self = $data->mobile_self ?? '';
    $student->mobile_father = $data->mobile_father ?? '';
    $student->mobile_mother = $data->mobile_mother ?? '';
    $student->class = $data->class ?? '';
    $student->board = $data->board ?? '';
    $student->profile_picture = $data->profile_picture ?? '';

    // Validate required fields
    if (empty($student->name)) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Name is required."));
        exit;
    }

    if (empty($student->mobile_self)) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Mobile number is required."));
        exit;
    }

    // Update the student
    if ($student->update()) {
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "message" => "Student profile updated successfully.",
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
                "profile_picture" => $student->profile_picture
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to update student profile."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Student ID and ID are required."));
}
?> 