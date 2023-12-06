<?php

$conn = new mysqli('hostname', 'username', 'password', 'database');

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// Retrieve user inputs from the form.
$userName = $_POST['userName'];
$password = $_POST['password'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$dob = $_POST['dob'];
$email = $_POST['email'];
$address = $_POST['address'];

$customerID = time();

// Insert customer information into the Customers table.
$stmt = $conn->prepare("INSERT INTO Customers (Customer_ID, First_Name, Last_Name, Age, Email, Address) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssss", $customerID, $firstName, $lastName, $dob, $email, $address);
$stmt->execute();

// Insert user information into the Users table.
$stmt = $conn->prepare("INSERT INTO Users (Customer_ID, User_Name, Password) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $customerID, $userName, $password);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "You have registered successfully!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>