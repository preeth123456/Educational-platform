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
    echo json_encode(array("message" => "Database connection failed."));
    exit;
}

// Initialize student object
$student = new Student($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Log the received data for debugging
error_log("Received registration data: " . print_r($data, true));

if(!empty($data->name) && !empty($data->phone)) {
    
    // Generate unique student ID
    $student_id = 'STU' . date('Y') . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    
    // Set student property values
    $student->student_id = $student_id;
    $student->name = $data->name;
    $student->father_name = $data->father_name ?? '';
    $student->gender = $data->gender ?? '';
    $student->mobile_self = $data->phone;
    $student->mobile_father = $data->father_phone ?? '';
    $student->mobile_mother = $data->mother_phone ?? '';
    $student->college = $data->class ?? '';
    $student->location = $data->board ?? '';
    $student->profile_picture = '';

    // Create the student
    if($student->create()) {
        // Set response code - 201 created
        http_response_code(201);
        
        // Tell the user
        echo json_encode(array(
            "message" => "Student was created successfully.",
            "student_id" => $student_id,
            "data" => array(
                "id" => $student->id,
                "student_id" => $student_id,
                "name" => $student->name,
                "phone" => $student->mobile_self,
                "class" => $student->college,
                "board" => $student->location
            )
        ));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode(array("message" => "Unable to create student. Database error occurred."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);
    
    // Tell the user what's missing
    $missing_fields = array();
    if (empty($data->name)) $missing_fields[] = "name";
    if (empty($data->phone)) $missing_fields[] = "phone";
    
    echo json_encode(array(
        "message" => "Unable to create student. Missing required fields: " . implode(", ", $missing_fields),
        "received_data" => $data
    ));
}
?> 