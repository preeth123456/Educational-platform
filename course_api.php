<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'eduyata_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Handle API routes
if (preg_match('/\/api\/teacher-assignments\/(\d+)/', $path, $matches) && $method === 'GET') {
    $teacherId = $matches[1];
    $stmt = $pdo->prepare("
        SELECT 
            tcs.mapping_id,
            tcs.subject_id,
            b.board_name,
            c.class_name,
            s.subject_name
        FROM teacher_class_subjects tcs
        JOIN classes c ON tcs.class_id = c.class_id
        JOIN boards b ON c.board_id = b.board_id
        JOIN subjects s ON tcs.subject_id = s.subject_id
        WHERE tcs.teacher_id = ?
        ORDER BY b.board_name, c.class_number, s.subject_name
    ");
    $stmt->execute([$teacherId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif (strpos($path, '/api/boards') !== false && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM boards ORDER BY board_name");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif (preg_match('/\/api\/classes\/(\d+)/', $path, $matches) && $method === 'GET') {
    $boardId = $matches[1];
    $stmt = $pdo->prepare("SELECT * FROM classes WHERE board_id = ? ORDER BY class_number");
    $stmt->execute([$boardId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif (preg_match('/\/api\/subjects\/(\d+)/', $path, $matches) && $method === 'GET') {
    $classId = $matches[1];
    $stmt = $pdo->prepare("SELECT * FROM subjects WHERE class_id = ? ORDER BY subject_name");
    $stmt->execute([$classId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif (preg_match('/\/api\/chapters\/(\d+)/', $path, $matches) && $method === 'GET') {
    $subjectId = $matches[1];
    $stmt = $pdo->prepare("SELECT * FROM chapters WHERE subject_id = ? ORDER BY chapter_number");
    $stmt->execute([$subjectId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif (preg_match('/\/api\/lessons\/(\d+)/', $path, $matches) && $method === 'GET') {
    $chapterId = $matches[1];
    $stmt = $pdo->prepare("SELECT * FROM lessons WHERE chapter_id = ? ORDER BY lesson_number");
    $stmt->execute([$chapterId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif (strpos($path, '/api/topics') !== false && $method === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO topics (lesson_id, topic_name, video_url, description, content_type) VALUES (?, ?, ?, ?, ?)");
    
    if ($stmt->execute([
        $input['lesson_id'],
        $input['topic_name'],
        $input['video_url'],
        $input['description'],
        $input['content_type']
    ])) {
        echo json_encode(['success' => true, 'topic_id' => $pdo->lastInsertId()]);
    } else {
        echo json_encode(['error' => 'Failed to create topic']);
    }
}
else {
    echo json_encode(['error' => 'Invalid endpoint']);
}


?>