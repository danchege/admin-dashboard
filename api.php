<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Suppress PHP errors from being output
ini_set('display_errors', 0);
error_reporting(0);

ini_set('log_errors', 1);
ini_set('error_log', 'error_log.txt'); // Log errors to a file
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "1234567";
$dbname = "mannabay_foundation_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Handle different request types
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        if (isset($_GET['staff_id'])) {
            getStaff($_GET['staff_id']);
        } else {
            getAllStaff();
        }
        break;
    case 'POST':
        addStaff();
        break;
    case 'PUT':
        updateStaff();
        break;
    case 'DELETE':
        deleteStaff();
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function getAllStaff() {
    global $conn;
    $sql = "SELECT s.*, w.ward_name, d.dept_name, r.rank_name 
            FROM staff s
            LEFT JOIN wards w ON s.ward_id = w.ward_id
            LEFT JOIN departments d ON s.dept_id = d.dept_id
            LEFT JOIN ranks r ON s.rank_id = r.rank_id";
    $result = $conn->query($sql);

    $staff = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $staff[] = $row;
        }
    }
    echo json_encode($staff);
}

function getStaff($staff_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT s.*, w.ward_name, d.dept_name, r.rank_name 
                           FROM staff s
                           LEFT JOIN wards w ON s.ward_id = w.ward_id
                           LEFT JOIN departments d ON s.dept_id = d.dept_id
                           LEFT JOIN ranks r ON s.rank_id = r.rank_id
                           WHERE s.staff_id = ?");
    $stmt->bind_param("i", $staff_id);
    $stmt->execute();
    $result = $stmt->get_result();
    echo json_encode($result->fetch_assoc());
}

function addStaff() {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Invalid input data"]);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO staff (national_id, first_name, middle_name, last_name, 
                          gender, date_of_birth, email, phone, ward_id, address, dept_id, 
                          rank_id, employment_date, salary, status) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("ssssssssisiiids", 
        $data['national_id'],
        $data['first_name'],
        $data['middle_name'],
        $data['last_name'],
        $data['gender'],
        $data['date_of_birth'],
        $data['email'],
        $data['phone'],
        $data['ward_id'],
        $data['address'],
        $data['dept_id'],
        $data['rank_id'],
        $data['employment_date'],
        $data['salary'],
        $data['status']
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "staff_id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}

function updateStaff() {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $conn->prepare("UPDATE staff SET 
                          national_id = ?, first_name = ?, middle_name = ?, last_name = ?, 
                          gender = ?, date_of_birth = ?, email = ?, phone = ?, ward_id = ?, 
                          address = ?, dept_id = ?, rank_id = ?, employment_date = ?, 
                          salary = ?, status = ?
                          WHERE staff_id = ?");
    
    $stmt->bind_param("ssssssssisiiidsi", 
        $data['national_id'],
        $data['first_name'],
        $data['middle_name'],
        $data['last_name'],
        $data['gender'],
        $data['date_of_birth'],
        $data['email'],
        $data['phone'],
        $data['ward_id'],
        $data['address'],
        $data['dept_id'],
        $data['rank_id'],
        $data['employment_date'],
        $data['salary'],
        $data['status'],
        $data['staff_id']
    );
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}

function deleteStaff() {
    global $conn;
    $staff_id = $_GET['staff_id'];
    
    $stmt = $conn->prepare("DELETE FROM staff WHERE staff_id = ?");
    $stmt->bind_param("i", $staff_id);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}

$conn->close();
?>