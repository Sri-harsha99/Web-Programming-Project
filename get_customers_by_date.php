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

$date = $_POST['date'];

// Create a DateTime object from the original date string
$dateObject = DateTime::createFromFormat('m/d/Y', $date);

// Format the DateTime object to yyyy-mm-dd format
$formattedDate = $dateObject->format('Y-m-d');

$query = "SELECT c.Customer_ID, c.First_Name, c.Last_Name
          FROM Customers c
          JOIN Transactions t ON c.Customer_ID = t.Customer_ID
          WHERE t.Transaction_Date = ?
          GROUP BY c.Customer_ID
          HAVING COUNT(t.Transaction_ID) > 2";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $formattedDate);
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
