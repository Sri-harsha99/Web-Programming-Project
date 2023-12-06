<?php
// Assume $conn is the connection to your database.
$conn = new mysqli('hostname', 'username', 'password', 'database');

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$transactionId = $_POST['transactionId'];

$query = "UPDATE Transactions SET Transaction_Status = 'shopped' WHERE Transaction_ID = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $transactionId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Transaction status updated to 'shopped'.";
} else {
    echo "No changes made to the transaction status.";
}

$stmt->close();
$conn->close();
?>
