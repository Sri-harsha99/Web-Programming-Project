<?php
// Assume $conn is the connection to your database.
$conn = new mysqli('hostname', 'username', 'password', 'database');

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$date = $_POST['date'];

$query = "SELECT c.Customer_ID, c.First_Name, c.Last_Name
          FROM Customers c
          JOIN Transactions t ON c.Customer_ID = t.Customer_ID
          WHERE t.Transaction_Date = ?
          GROUP BY c.Customer_ID
          HAVING COUNT(t.Transaction_ID) > 2";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$customers = [];
while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

echo json_encode($customers);

$stmt->close();
$conn->close();
?>
