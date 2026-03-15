<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include CORS configuration
require_once __DIR__ . '/../config/cors.php';

// Log the request
error_log("Registration request received: " . $_SERVER['REQUEST_METHOD']);

try {
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../models/Student.php';

    // Get database connection
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    // Get posted data
    $raw_data = file_get_contents("php://input");
    error_log("Raw input data: " . $raw_data);
    
    $data = json_decode($raw_data);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }

    error_log("Decoded data: " . print_r($data, true));

    // Validate required fields
    if (empty($data->name)) {
        throw new Exception("Name is required");
    }
    
    if (empty($data->phone)) {
        throw new Exception("Phone number is required");
    }

    if (empty($data->password)) {
        throw new Exception("Password is required");
    }

    // Initialize student object
    $student = new Student($db);
    
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
    $student->class = $data->class ?? '';
    $student->board = $data->board ?? '';
    $student->profile_picture = '';
    
    // Hash the password
    $student->password_hash = password_hash($data->password, PASSWORD_DEFAULT);

    error_log("Attempting to create student with ID: " . $student_id);

    // Create the student
    if($student->create()) {
        http_response_code(201);
        echo json_encode(array(
            "status" => "success",
            "message" => "Student was created successfully.",
            "student_id" => $student_id,
            "data" => array(
                "id" => $student->id,
                "student_id" => $student_id,
                "name" => $student->name,
                "phone" => $student->mobile_self,
                "class" => $student->class,
                "board" => $student->board,
                "gender" => $student->gender,
                "profile_picture" => $student->profile_picture
            )
        ));
    } else {
        throw new Exception("Failed to create student in database");
    }

} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode(array(
        "status" => "error",
        "message" => $e->getMessage(),
        "debug_info" => array(
            "request_method" => $_SERVER['REQUEST_METHOD'],
            "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'not set',
            "raw_input" => $raw_data ?? 'not available'
        )
    ));
}
?> 