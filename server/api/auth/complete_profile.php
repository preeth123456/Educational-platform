<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $student_id = $input['student_id'] ?? null;
    $gender = $input['gender'] ?? null;
    $date_of_birth = $input['dateOfBirth'] ?? null;
    $address = $input['address'] ?? null;
    $parent_name = $input['parentName'] ?? null;
    $parent_phone = $input['parentPhone'] ?? null;
    $interests = $input['interests'] ?? [];
    $profile_picture = $input['profilePicture'] ?? null;
    
    if (!$student_id) {
        throw new Exception('Student ID is required');
    }
    
    // Database connection
    $host = 'localhost';
    $dbname = 'aiedupro';
    $username = 'root';
    $password = '';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Update student profile
    $sql = "UPDATE students SET 
            gender = :gender,
            date_of_birth = :date_of_birth,
            address = :address,
            parent_name = :parent_name,
            parent_phone = :parent_phone,
            interests = :interests,
            profile_picture = :profile_picture,
            profile_completed = 1,
            updated_at = NOW()
            WHERE id = :student_id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':gender' => $gender,
        ':date_of_birth' => $date_of_birth,
        ':address' => $address,
        ':parent_name' => $parent_name,
        ':parent_phone' => $parent_phone,
        ':interests' => json_encode($interests),
        ':profile_picture' => $profile_picture,
        ':student_id' => $student_id
    ]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Profile completed successfully'
        ]);
    } else {
        throw new Exception('Failed to update profile');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>