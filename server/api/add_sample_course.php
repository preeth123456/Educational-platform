<?php
require_once 'config/cors.php';
require_once 'config/database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo "Database connection failed.";
    exit;
}

// Insert a course with course_id = "5" for testing
$query = "INSERT INTO courses (course_id, title, description, instructor_id, category, level, duration_hours, price, thumbnail_url, is_published) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
          title = VALUES(title), 
          description = VALUES(description),
          is_published = VALUES(is_published)";

$stmt = $db->prepare($query);

$course_id = "5";
$title = "Advanced Mathematics & Problem Solving";
$description = "Master advanced mathematical concepts including calculus, linear algebra, and differential equations. Perfect for students preparing for competitive exams and higher studies.";
$instructor_id = 1; // Assuming teacher with ID 1 exists
$category = "Mathematics";
$level = "advanced";
$duration_hours = 45;
$price = 349.99;
$thumbnail_url = "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500";
$is_published = 1;

$result = $stmt->execute([
    $course_id, $title, $description, $instructor_id, $category, 
    $level, $duration_hours, $price, $thumbnail_url, $is_published
]);

if ($result) {
    echo "Course with ID '5' added/updated successfully!";
    
    // Show the course details
    $query = "SELECT * FROM courses WHERE course_id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$course_id]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<h3>Course Details:</h3>";
    echo "<pre>" . print_r($course, true) . "</pre>";
} else {
    echo "Error adding course.";
}
?>