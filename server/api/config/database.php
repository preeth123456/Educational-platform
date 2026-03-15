<?php
class Database {
    private $host = "localhost";
    private $db_name = "eduyata_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Test the connection
            $this->conn->query("SELECT 1");
            
        } catch(PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            echo "Connection error: " . $exception->getMessage();
            return null;
        }

        return $this->conn;
    }
}
?> 