<?php
require_once '../config/cors.php';
require_once '../config/database.php';

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

// Class 12 Plant Biology Course
$course_data = [
    'course_id' => 'BIO12' . time(), // Generate a unique course ID
    'title' => 'Class 12: Plant Biology',
    'description' => 'Comprehensive study of plant biology for Class 12 students. Covers plant physiology, reproduction, genetics, and biotechnology applications in plants.',
    'instructor_id' => 1, // Make sure this instructor ID exists in your teachers table
    'category' => 'Science',
    'level' => 'intermediate',
    'duration_hours' => 30,
    'price' => 39.99,
    'thumbnail_url' => 'https://images.unsplash.com/photo-1490750967868-88aa4486ec94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
    'is_published' => 1
];

try {
    // Prepare SQL query
    $query = "INSERT INTO courses 
              (course_id, title, description, instructor_id, category, level, duration_hours, price, thumbnail_url, is_published)
              VALUES 
              (:course_id, :title, :description, :instructor_id, :category, :level, :duration_hours, :price, :thumbnail_url, :is_published)";
    
    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':course_id', $course_data['course_id']);
    $stmt->bindParam(':title', $course_data['title']);
    $stmt->bindParam(':description', $course_data['description']);
    $stmt->bindParam(':instructor_id', $course_data['instructor_id'], PDO::PARAM_INT);
    $stmt->bindParam(':category', $course_data['category']);
    $stmt->bindParam(':level', $course_data['level']);
    $stmt->bindParam(':duration_hours', $course_data['duration_hours'], PDO::PARAM_INT);
    $stmt->bindParam(':price', $course_data['price']);
    $stmt->bindParam(':thumbnail_url', $course_data['thumbnail_url']);
    $stmt->bindParam(':is_published', $course_data['is_published'], PDO::PARAM_BOOL);
    
    // Execute the query
    if ($stmt->execute()) {
        $course_id = $db->lastInsertId();
        echo json_encode([
            "status" => "success",
            "message" => "Course created successfully.",
            "course_id" => $course_id,
            "data" => $course_data
        ]);
    } else {
        throw new PDOException("Failed to create course.");
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error creating course: " . $e->getMessage(),
        "data" => $course_data
    ]);
}
?>
