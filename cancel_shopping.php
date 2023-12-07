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

$transactionId = $_POST['transactionId'];

// Begin transaction
$conn->begin_transaction();

// Update the inventory based on the items in the cart
$query = "UPDATE Inventory i
          JOIN Carts c ON i.Item_number = c.Item_number
          SET i.Quantity_in_inventory = i.Quantity_in_inventory + c.Quantity
          WHERE c.Transaction_ID = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $transactionId);
$stmt->execute();

// Delete the cart items
$query = "DELETE FROM Carts WHERE Transaction_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $transactionId);
$stmt->execute();

// Update the transaction status to 'cancelled'
$query = "UPDATE Transactions SET Transaction_Status = 'cancelled' WHERE Transaction_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $transactionId);
$stmt->execute();

// Commit transaction
$conn->commit();

echo "Shopping cancelled and inventory updated.";

$stmt->close();
$conn->close();
?>
