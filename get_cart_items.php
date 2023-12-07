<?php
session_start(); // Start the session to use session variables

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

// Retrieve the customer ID from the session or request
$customerID = $_SESSION['customerID'] ?? $_POST['customerID']; // Use the session variable if available, otherwise use the POST variable

$query = "SELECT i.Item_number, i.Category, i.Subcategory, i.Name, c.Quantity, i.Unit_price, t.Transaction_ID, t.Total_Price
          FROM Carts c
          JOIN Inventory i ON c.Item_number = i.Item_number
          JOIN Transactions t ON c.Transaction_ID = t.Transaction_ID
          WHERE c.Cart_status = 'in cart' AND c.Customer_ID = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $customerID);
$stmt->execute();
$result = $stmt->get_result();

$cartItems = [];
while ($row = $result->fetch_assoc()) {
    $cartItems[] = $row;
}

echo json_encode($cartItems);

$stmt->close();
$conn->close();
?>
