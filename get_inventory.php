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

// Select all inventory data from the Inventory table
$query = "SELECT * FROM Inventory";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $inventoryData = array();

    // Fetch each row from the result and store it in $inventoryData array
    while ($row = $result->fetch_assoc()) {
        $formattedRow = array(
            'name' => $row['Name'],
            'type' => $row['Category'],
            'category' => $row['Subcategory'],
            'price' => $row['Unit_price'],
            'inventory' => $row['Quantity_in_inventory'],
            'image' => $row['Image'],
            'id' => $row['Item_number']
        );
        $inventoryData[] = $formattedRow;
    }

    // Convert the $inventoryData array to JSON format
    $jsonResponse = json_encode($inventoryData);

    // Set headers to indicate JSON content type
    header('Content-Type: application/json');

    // Output the JSON response
    echo $jsonResponse;
} else {
    echo "No inventory data found.";
}

// Close the database connection
$conn->close();
?>
