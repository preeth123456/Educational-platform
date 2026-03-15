<?php
require_once 'config/cors.php';

// API Information
$api_info = array(
    "name" => "Eduyata API",
    "version" => "1.0.0",
    "description" => "API for Eduyata Online Academy",
    "endpoints" => array(
        "student_registration" => "POST /auth/student_register.php",
        "student_login" => "POST /auth/student_login.php",
        "teacher_login" => "POST /auth/teacher_login.php",
        "get_students" => "GET /students/read.php",
        "get_student" => "GET /students/read_one.php?id={id}",
        "update_student" => "PUT /students/update.php",
        "delete_student" => "DELETE /students/delete.php"
    )
);

// Set response code - 200 OK
http_response_code(200);

// Tell the user about the API
echo json_encode($api_info);
?> 