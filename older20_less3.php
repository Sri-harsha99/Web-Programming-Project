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

$query = "SELECT c.Customer_ID, c.First_Name, c.Last_Name
          FROM Customers c
          JOIN Transactions t ON c.Customer_ID = t.Customer_ID
          WHERE TIMESTAMPDIFF(YEAR, c.Date_of_birth, CURDATE()) > 20
          GROUP BY c.Customer_ID
          HAVING COUNT(t.Transaction_ID) > 3";

$result = $conn->query($query);

$customers = [];
while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

echo json_encode($customers);

$conn->close();
?>
