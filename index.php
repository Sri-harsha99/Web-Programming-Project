<?php
if(isset($_POST['action']) && $_POST['action'] == 'readXML') {
    readXML();
} elseif(isset($_POST['action']) && $_POST['action'] == 'updateXML'){
    writeXML();
} elseif(isset($_POST['action']) && $_POST['action'] == 'readJSON'){
    readJSON();
} elseif(isset($_POST['action']) && $_POST['action'] == 'updateJSON'){
    writeJSON();
}

function readXML() {
    $xmlFilePath = 'data.xml';

    if (file_exists($xmlFilePath)) {
        $xml = simplexml_load_file($xmlFilePath);
        $updatedXmlString = $xml->asXML();
        echo $updatedXmlString;
    } else {
        echo "Error";
    }
}

function writeXML() {
    $xmlData = $_POST['data'];

    if (!empty($xmlData)) {
        $xmlFilePath = 'data.xml';

        file_put_contents($xmlFilePath, $xmlData);
    }
    echo 'XML data has been written to output.xml';
}

function readJSON(){
    $jsonFilePath = 'data.json';

    if (file_exists($jsonFilePath)) {
        
        $jsonContents = file_get_contents($jsonFilePath);
    
        $jsonData = json_decode($jsonContents, true);
    
        if ($jsonData !== null) {
            header('Content-Type: application/json');
            echo json_encode($jsonData);
        } else {
            echo 'Error decoding JSON.';
        }
    } else {
        echo 'JSON file not found.';
    }
    
}

function writeJSON(){
    echo 'hi';
    $data = json_decode($_POST['data'], true);

    if ($data !== null) {
        // Specify the path to your JSON file
        $jsonFilePath = 'data.json';

        // Convert PHP array to a JSON string
        $jsonString = json_encode($data, JSON_PRETTY_PRINT);

        // Write the JSON string to the file
        file_put_contents($jsonFilePath, $jsonString);

        echo 'Data has been written to data.json';
    } else {
        echo 'Error decoding JSON data.';
    }

}


function newFun(){
    echo "new!";
}
?>
