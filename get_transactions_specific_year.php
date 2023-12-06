<?php
$conn = new mysqli('hostname', 'username', 'password', 'database');

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$customerID = $_SESSION['customerID']; // Retrieve the customer ID from the session
$year = $_POST['year']; // The year specified by the user

// Transactions for a specific year
$query = "SELECT * FROM Transactions WHERE Customer_ID = ? AND YEAR(Transaction_Date) = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $customerID, $year);
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
