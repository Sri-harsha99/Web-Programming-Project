<?php
// Database connection details
$hostname = '128.199.7.149';
$username = 'root';
$password = 'change-me';
$database = 'nile';

// Connect to the database
$conn = new mysqli($hostname, $username, $password, $database);

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the username and password from the request
$username = $_POST['username'];
$password = $_POST['password'];

// Prepare the SQL statement for selecting user data
$stmt = $conn->prepare("SELECT u.*, c.* FROM Users u INNER JOIN Customers c ON u.Customer_ID = c.Customer_ID WHERE u.username=? AND u.password=?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

// Check if a user was found
if ($user = $result->fetch_assoc()) {
    // User found, return success and user data
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    // User not found, return failure message
    echo json_encode(['success' => false, 'message' => 'Invalid credentials.']);
}

// Close the statement and the database connection
$stmt->close();
$conn->close();
?>
