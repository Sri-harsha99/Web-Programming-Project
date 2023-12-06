<?php
// Assume $conn is the connection to your database.
$conn = new mysqli('hostname', 'username', 'password', 'database');

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$itemNumber = $_POST['itemNumber'];
$unitPrice = $_POST['unitPrice'];
$quantityInInventory = $_POST['quantityInInventory'];

$query = "UPDATE Inventory SET Unit_price = ?, Quantity_in_inventory = ? WHERE Item_number = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("dii", $unitPrice, $quantityInInventory, $itemNumber);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Inventory item updated successfully!";
} else {
    echo "No changes made to the inventory item.";
}

$stmt->close();
$conn->close();
?>
