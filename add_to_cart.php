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
$customerID = $_POST['customerID']; // Retrieve the customer ID from the session

echo $itemNumber . $quantity . $customerID;

// Check for an active cart
$query = "SELECT Transaction_ID FROM Carts WHERE Customer_ID = ? AND Cart_status = 'in cart' LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $customerID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // If there is an active cart, use its Transaction_ID
    $row = $result->fetch_assoc();
    $transactionId = $row['Transaction_ID'];
} else {
    // If there is no active cart, create a new transaction
    $query = "INSERT INTO Transactions (Transaction_Status, Transaction_Date, Total_Price) VALUES ('in cart', CURDATE(), 0)";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $transactionId = $conn->insert_id; // Get the newly created Transaction_ID

    // Create a new cart entry with the new Transaction_ID
    $query = "INSERT INTO Carts (Customer_ID, Transaction_ID, Cart_status) VALUES (?, ?, 'in cart')";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $customerID, $transactionId);
    $stmt->execute();
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
    $query = "INSERT INTO Carts (Customer_ID, Transaction_ID, Item_number, Quantity, Cart_status) VALUES (?, ?, ?, ?, 'in cart')";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iiii", $customerID, $transactionId, $itemNumber, $quantity);
}

// Deduct the quantity from the inventory
$updateInventoryQuery = "UPDATE Inventory SET Quantity_in_inventory = Quantity_in_inventory - ? WHERE Item_number = ?";
$updateInventoryStmt = $conn->prepare($updateInventoryQuery);
$updateInventoryStmt->bind_param("ii", $quantity, $itemNumber);
$updateInventoryStmt->execute();

$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Item added to cart successfully!";
} else {
    echo "Failed to add item to cart.";
}

$updateInventoryStmt->close();
$stmt->close();
$conn->close();
?>
