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

try {
    // Get categories
    $stmt = $course->getCategories();
    $categories = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $categories[] = array(
            "id" => $row['id'],
            "name" => $row['name'],
            "description" => $row['description'],
            "icon" => $row['icon'],
            "color" => $row['color']
        );
    }
    
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "data" => $categories,
        "count" => count($categories)
    ));
    
} catch (Exception $e) {
    error_log("Error getting categories: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Failed to get categories."));
}
?> 