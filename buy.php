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

// Retrieve the Transaction_ID from the request
$transactionId = $_POST['transactionId'];

// Begin transaction
$conn->begin_transaction();

// Update the transaction status to 'shopped' in the Transactions table
$updateTransactionQuery = "UPDATE Transactions SET Transaction_Status = 'shopped' WHERE Transaction_ID = ?";
$updateTransactionStmt = $conn->prepare($updateTransactionQuery);
$updateTransactionStmt->bind_param("i", $transactionId);
$updateTransactionStmt->execute();

// Update the cart status to 'shopped' for all items with the Transaction_ID
$updateCartQuery = "UPDATE Carts SET Cart_status = 'shopped' WHERE Transaction_ID = ?";
$updateCartStmt = $conn->prepare($updateCartQuery);
$updateCartStmt->bind_param("i", $transactionId);
$updateCartStmt->execute();

// Commit transaction
$conn->commit();

echo "Purchase successful. Cart and transaction statuses updated to 'shopped'.";

$updateTransactionStmt->close();
$updateCartStmt->close();
$conn->close();
?>
