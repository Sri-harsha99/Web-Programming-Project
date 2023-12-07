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

// Retrieve the JSON data from the request body
$jsonData = file_get_contents('php://input');

// Decode the JSON data into an associative array
$inventoryArray = json_decode($jsonData, true);

// Check if the array is not empty
if (!empty($inventoryArray)) {
    // Begin transaction
    $conn->begin_transaction();
    // Prepare the SQL statement for inserting new inventory data
    $insertStmt = $conn->prepare("INSERT INTO Inventory (Name, Category, Subcategory, Unit_price, Quantity_in_inventory, Image) VALUES (?, ?, ?, ?, ?, ?)");

    // Iterate over each item and update or insert into the inventory
    foreach ($inventoryArray as $item) {

        $insertStmt->bind_param("sssdis", $item['name'], $item['type'], $item['category'], $item['price'], $item['inventory'], $item['image']);
        $insertStmt->execute();
    }

    // Commit transaction
    $conn->commit();

    // Check for successful update or insertion
    if ($insertStmt->affected_rows > 0) {
        echo "Inventory updated successfully!";
    } else {
        echo "No changes made to the inventory.";
    }

    // Close the statements
    $insertStmt->close();
} else {
    echo "No data received.";
}

// Close the database connection
$conn->close();
?>
