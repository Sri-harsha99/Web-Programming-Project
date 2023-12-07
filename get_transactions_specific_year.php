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

$customerID = $_POST['customerID']; // Retrieve the customer ID from the session
$year = $_POST['year']; // The specific year to filter transactions

// Transactions for a specific year
$query = "SELECT t.Transaction_ID, t.Transaction_Status, t.Transaction_Date, t.Total_Price, 
                 c.Item_number, c.Quantity, i.Name, i.Category, i.Subcategory, i.Unit_price
          FROM Transactions t
          JOIN Carts c ON t.Transaction_ID = c.Transaction_ID
          JOIN Inventory i ON c.Item_number = i.Item_number
          WHERE c.Customer_ID = ? AND 
            (SUBSTRING(t.Transaction_Date, 1, 4) = ?)";

$stmt = $conn->prepare($query);
$stmt->bind_param("is", $customerID, $year);
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
