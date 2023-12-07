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

$zipCode = $_POST['zipCode'];
$month = $_POST['month']; // Assuming this is a string like 'Ja' for January

$query = "SELECT c.Customer_ID, c.First_Name, c.Last_Name
FROM Transactions t
JOIN Carts ct ON ct.Transaction_ID = t.Transaction_ID
JOIN Customers c ON c.Customer_ID = ct.Customer_ID
WHERE c.Address LIKE ? AND SUBSTRING(t.Transaction_Date, 6, 2) = ?
GROUP BY c.Customer_ID, c.First_Name, c.Last_Name
HAVING COUNT(ct.Transaction_ID) > 2";

$stmt = $conn->prepare($query);
$zipCodePattern = "%$zipCode%";
$stmt->bind_param("ss", $zipCodePattern, $month); // Changed 'i' to 's' because $month is a string
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
