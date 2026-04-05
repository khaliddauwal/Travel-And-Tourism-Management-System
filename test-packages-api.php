<?php
// Test the packages API endpoint
echo "Testing Packages API Endpoint\n";
echo "==============================\n\n";

// Simulate GET request
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/backend/api/v2/packages?limit=50';
$_GET['limit'] = 50;

// Capture output
ob_start();
try {
    include __DIR__ . '/backend/api/v2/index.php';
    $response = ob_get_clean();
    
    echo "Response:\n";
    echo $response;
    echo "\n";
} catch (Exception $e) {
    ob_end_clean();
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "\nTrace:\n" . $e->getTraceAsString() . "\n";
}
