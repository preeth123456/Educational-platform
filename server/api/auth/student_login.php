<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Student.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit;
}

// Initialize student object
$student = new Student($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Log the received data for debugging
error_log("Login request received: " . print_r($data, true));

if(!empty($data->studentId) && !empty($data->password)) {
    
    // Attempt to login
    if($student->login($data->studentId, $data->password)) {
        // Set response code - 200 OK
        http_response_code(200);
        
        // Return student data (excluding password)
        echo json_encode(array(
            "status" => "success",
            "message" => "Login successful.",
            "data" => array(
                "id" => $student->id,
                "student_id" => $student->student_id,
                "name" => $student->name,
                "phone" => $student->mobile_self,
                "class" => $student->class,
                "board" => $student->board,
                "gender" => $student->gender,
                "profile_picture" => $student->profile_picture
            )
        ));
    } else {
        // Set response code - 401 unauthorized
        http_response_code(401);
        
        // Tell the user
        echo json_encode(array(
            "status" => "error",
            "message" => "Invalid student ID or password."
        ));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);
    
    // Tell the user what's missing
    $missing_fields = array();
    if (empty($data->studentId)) $missing_fields[] = "studentId";
    if (empty($data->password)) $missing_fields[] = "password";
    
    echo json_encode(array(
        "status" => "error",
        "message" => "Missing required fields: " . implode(", ", $missing_fields)
    ));
}
?> 