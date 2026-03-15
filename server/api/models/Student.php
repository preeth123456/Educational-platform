<?php
require_once __DIR__ . '/../config/database.php';

class Student {
    private $conn;
    private $table_name = "students";

    public $id;
    public $student_id;
    public $name;
    public $father_name;
    public $gender;
    public $mobile_self;
    public $mobile_father;
    public $mobile_mother;
    public $class;
    public $board;
    public $profile_picture;
    public $password_hash;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new student
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    student_id = :student_id,
                    name = :name,
                    father_name = :father_name,
                    gender = :gender,
                    mobile_self = :mobile_self,
                    mobile_father = :mobile_father,
                    mobile_mother = :mobile_mother,
                    class = :class,
                    board = :board,
                    profile_picture = :profile_picture,
                    password_hash = :password_hash";

        try {
            $stmt = $this->conn->prepare($query);

            // Sanitize inputs
            $this->student_id = htmlspecialchars(strip_tags($this->student_id));
            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->father_name = htmlspecialchars(strip_tags($this->father_name));
            $this->gender = htmlspecialchars(strip_tags($this->gender));
            $this->mobile_self = htmlspecialchars(strip_tags($this->mobile_self));
            $this->mobile_father = htmlspecialchars(strip_tags($this->mobile_father));
            $this->mobile_mother = htmlspecialchars(strip_tags($this->mobile_mother));
            $this->class = htmlspecialchars(strip_tags($this->class));
            $this->board = htmlspecialchars(strip_tags($this->board));
            $this->profile_picture = htmlspecialchars(strip_tags($this->profile_picture));
            $this->password_hash = htmlspecialchars(strip_tags($this->password_hash));

            // Bind parameters
            $stmt->bindParam(":student_id", $this->student_id);
            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":father_name", $this->father_name);
            $stmt->bindParam(":gender", $this->gender);
            $stmt->bindParam(":mobile_self", $this->mobile_self);
            $stmt->bindParam(":mobile_father", $this->mobile_father);
            $stmt->bindParam(":mobile_mother", $this->mobile_mother);
            $stmt->bindParam(":class", $this->class);
            $stmt->bindParam(":board", $this->board);
            $stmt->bindParam(":profile_picture", $this->profile_picture);
            $stmt->bindParam(":password_hash", $this->password_hash);

            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            
            error_log("Student creation failed: " . print_r($stmt->errorInfo(), true));
            return false;
            
        } catch(PDOException $e) {
            error_log("Database error in Student::create(): " . $e->getMessage());
            return false;
        }
    }

    // Read all students
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read single student
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE student_id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->student_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->id = $row['id'];
            $this->student_id = $row['student_id'];
            $this->name = $row['name'];
            $this->father_name = $row['father_name'];
            $this->gender = $row['gender'];
            $this->mobile_self = $row['mobile_self'];
            $this->mobile_father = $row['mobile_father'];
            $this->mobile_mother = $row['mobile_mother'];
            $this->class = $row['class'];
            $this->board = $row['board'];
            $this->profile_picture = $row['profile_picture'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }

    // Update student
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    name = :name,
                    father_name = :father_name,
                    gender = :gender,
                    mobile_self = :mobile_self,
                    mobile_father = :mobile_father,
                    mobile_mother = :mobile_mother,
                    class = :class,
                    board = :board,
                    profile_picture = :profile_picture
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->father_name = htmlspecialchars(strip_tags($this->father_name));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->mobile_self = htmlspecialchars(strip_tags($this->mobile_self));
        $this->mobile_father = htmlspecialchars(strip_tags($this->mobile_father));
        $this->mobile_mother = htmlspecialchars(strip_tags($this->mobile_mother));
        $this->class = htmlspecialchars(strip_tags($this->class));
        $this->board = htmlspecialchars(strip_tags($this->board));
        $this->profile_picture = htmlspecialchars(strip_tags($this->profile_picture));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind parameters
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':father_name', $this->father_name);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':mobile_self', $this->mobile_self);
        $stmt->bindParam(':mobile_father', $this->mobile_father);
        $stmt->bindParam(':mobile_mother', $this->mobile_mother);
        $stmt->bindParam(':class', $this->class);
        $stmt->bindParam(':board', $this->board);
        $stmt->bindParam(':profile_picture', $this->profile_picture);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete student
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Login student by student_id and password
    public function login($student_id, $password) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE student_id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row && password_verify($password, $row['password_hash'])) {
            $this->id = $row['id'];
            $this->student_id = $row['student_id'];
            $this->name = $row['name'];
            $this->father_name = $row['father_name'];
            $this->gender = $row['gender'];
            $this->mobile_self = $row['mobile_self'];
            $this->mobile_father = $row['mobile_father'];
            $this->mobile_mother = $row['mobile_mother'];
            $this->class = $row['class'];
            $this->board = $row['board'];
            $this->profile_picture = $row['profile_picture'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }
}
?> 