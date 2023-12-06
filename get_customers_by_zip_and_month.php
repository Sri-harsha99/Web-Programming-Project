<?php
// Assume $conn is the connection to your database.
$conn = new mysqli('hostname', 'username', 'password', 'database');

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$zipCode = $_POST['zipCode'];
$month = $_POST['month'];

$query = "SELECT c.Customer_ID, c.First_Name, c.Last_Name
          FROM Customers c
          JOIN Transactions t ON c.Customer_ID = t.Customer_ID
          WHERE c.Address LIKE ? AND MONTH(t.Transaction_Date) = ?
          GROUP BY c.Customer_ID
          HAVING COUNT(t.Transaction_ID) > 2";

$stmt = $conn->prepare($query);
$zipCodePattern = "%$zipCode%";
$stmt->bind_param("si", $zipCodePattern, $month);
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
