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

$itemNumber = $_POST['itemNumber'];
$quantity = $_POST['quantity'];
$customerID = $_SESSION['customerID']; // Retrieve the customer ID from the session

// Check for an active transaction
$query = "SELECT Transaction_ID FROM Transactions WHERE Customer_ID = ? AND Transaction_Status = 'in cart'";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $customerID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // If there is an active transaction, use its ID
    $row = $result->fetch_assoc();
    $transactionId = $row['Transaction_ID'];
} else {
    // If there is no active transaction, create a new one
    $query = "INSERT INTO Transactions (Customer_ID, Transaction_Status) VALUES (?, 'in cart')";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $customerID);
    $stmt->execute();
    $transactionId = $conn->insert_id; // Get the newly created Transaction_ID
}

// Now, add or update the item in the cart with the Transaction_ID
$query = "SELECT * FROM Carts WHERE Customer_ID = ? AND Item_number = ? AND Transaction_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("iii", $customerID, $itemNumber, $transactionId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // If the item is already in the cart, update the quantity
    $query = "UPDATE Carts SET Quantity = Quantity + ? WHERE Customer_ID = ? AND Item_number = ? AND Transaction_ID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iiii", $quantity, $customerID, $itemNumber, $transactionId);
} else {
    // If the item is not in the cart, insert a new record
    $query = "INSERT INTO Carts (Customer_ID, Transaction_ID, Item_number, Quantity) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iiii", $customerID, $transactionId, $itemNumber, $quantity);
}

$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Item added to cart successfully!";
} else {
    echo "Failed to add item to cart.";
}

$stmt->close();
$conn->close();
?>
