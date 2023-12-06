<?php

$conn = new mysqli('hostname', 'username', 'password', 'database');

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

    // Delete existing data in the Inventory table
    $conn->query("DELETE FROM Inventory");

    // Prepare the SQL statement for inserting new inventory data
    $stmt = $conn->prepare("INSERT INTO Inventory (Item_number, Name, Category, Subcategory, Unit_price, Quantity_in_inventory) VALUES (?, ?, ?, ?, ?, ?)");

    // Iterate over each item and insert into the inventory
    foreach ($inventoryArray as $item) {
        $stmt->bind_param("isssdi", $item['Item_number'], $item['Name'], $item['Category'], $item['Subcategory'], $item['Unit_price'], $item['Quantity_in_inventory']);
        $stmt->execute();
    }

    // Commit transaction
    $conn->commit();

    // Check for successful insertion
    if ($stmt->affected_rows > 0) {
        echo "Inventory updated successfully!";
    } else {
        echo "No changes made to the inventory.";
    }

    // Close the statement
    $stmt->close();
} else {
    echo "No data received.";
}

// Close the database connection
$conn->close();
?>
