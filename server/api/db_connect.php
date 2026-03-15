<?php
$host = "localhost";
$user = "root"; // change if needed
$password = "root123"; // change if needed
$dbname = "eduyata_db"; // your DB name

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
