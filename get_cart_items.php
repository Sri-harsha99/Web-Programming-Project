<?php
// Assume $conn is the connection to your database.
$conn = new mysqli('hostname', 'username', 'password', 'database');

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$query = "SELECT i.Item_number, i.Category, i.Subcategory, i.Name, c.Quantity, i.Unit_price, t.Transaction_ID, t.Total_Price
          FROM Carts c
          JOIN Inventory i ON c.Item_number = i.Item_number
          JOIN Transactions t ON c.Transaction_ID = t.Transaction_ID
          WHERE c.Cart_status = 'in cart'";

$result = $conn->query($query);

$cartItems = [];
while ($row = $result->fetch_assoc()) {
    $cartItems[] = $row;
}

echo json_encode($cartItems);

$conn->close();
?>
