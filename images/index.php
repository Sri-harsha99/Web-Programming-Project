<?php

$xmlFilePath = './data.xml';

// Check if the file exists
if (file_exists($xmlFilePath)) {
    
    // Load the XML file
    $xml = simplexml_load_file($xmlFilePath);

    // Example: Update the price of Pancakes to 4
    foreach ($xml->product as $product) {
        if ($product->name == 'Pancakes') {
            $product->price = '4';
        }
    }

    // Convert the updated SimpleXML object back to a string
    $updatedXmlString = $xml->asXML();

    // Embed the updated XML string in a JavaScript variable
    echo '<script>';
    echo 'var updatedXmlString = ' . json_encode($updatedXmlString) . ';';
    echo '</script>';

} else {
    echo 'XML file not found.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pass Data to JavaScript</title>
</head>
<body>

<!-- Your JavaScript code can now access the PHP variable -->
<script>
    // Access the PHP variable in JavaScript
    console.log(updatedXmlString);
</script>

</body>
</html>
