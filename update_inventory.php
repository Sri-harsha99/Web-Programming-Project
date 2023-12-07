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

    // Prepare the SQL statement for updating existing inventory data
    $updateStmt = $conn->prepare("UPDATE Inventory SET Name=?, Category=?, Subcategory=?, Unit_price=?, Quantity_in_inventory=? WHERE Item_number=?");

    // Prepare the SQL statement for inserting new inventory data
    $insertStmt = $conn->prepare("INSERT INTO Inventory (Item_number, Name, Category, Subcategory, Unit_price, Quantity_in_inventory) VALUES (?, ?, ?, ?, ?, ?)");

    // Iterate over each item and update or insert into the inventory
    foreach ($inventoryArray as $item) {
        // Check if the item exists
        $checkStmt = $conn->prepare("SELECT Item_number FROM Inventory WHERE Item_number=?");
        $checkStmt->bind_param("i", $item['Item_number']);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows > 0) {
            // Item exists, update it
            $updateStmt->bind_param("sssidi", $item['Name'], $item['Category'], $item['Subcategory'], $item['Unit_price'], $item['Quantity_in_inventory'], $item['Item_number']);
            $updateStmt->execute();
        } else {
            // Item does not exist, insert it
            $insertStmt->bind_param("isssdi", $item['Item_number'], $item['Name'], $item['Category'], $item['Subcategory'], $item['Unit_price'], $item['Quantity_in_inventory']);
            $insertStmt->execute();
        }
    }

    // Commit transaction
    $conn->commit();

    // Check for successful update or insertion
    if ($updateStmt->affected_rows > 0 || $insertStmt->affected_rows > 0) {
        echo "Inventory updated successfully!";
    } else {
        echo "No changes made to the inventory.";
    }

    // Close the statements
    $updateStmt->close();
    $insertStmt->close();
    $checkStmt->close();
} else {
    echo "No data received.";
}

// Close the database connection
$conn->close();
?>
