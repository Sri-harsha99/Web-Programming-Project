<?php
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

$customerID = $_SESSION['customerID']; // Retrieve the customer ID from the session

// Transactions for the last 3 months
$query = "SELECT * FROM Transactions WHERE Customer_ID = ? AND Transaction_Date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $customerID);
$stmt->execute();
$result = $stmt->get_result();

$transactions = [];
while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

echo json_encode($transactions);

$stmt->close();
$conn->close();
?>
