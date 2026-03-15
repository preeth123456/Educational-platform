<?php
require_once __DIR__ . '/config/cors.php';

include("db_connect.php"); // Your DB connection file

// Read JSON from request body
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] === "POST" && $data) {
    $name = $data['name'];
    $email = $data['email'];
    $phone = $data['phone'];
    $class = $data['class'];
    $board = $data['board'];
    $password = $data['password'];

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Prepare and execute
    $stmt = $conn->prepare("INSERT INTO students (full_name, email, phone_number, class, board, password_hash)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $name, $email, $phone, $class, $board, $passwordHash);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Registration successful!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
?>
