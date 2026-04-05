<?php
/**
 * Test Package Creation Endpoint
 * Run this file directly to test package creation
 */

// Simulate POST request to create package
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/backend/api/v2/packages';

// Simulate form data
$_POST = [
    'name' => 'Test Package',
    'destination' => 'Lagos, Nigeria',
    'type' => 'city_tour',
    'duration' => '3',
    'price' => '50000',
    'description' => 'This is a test package description that is longer than 50 characters to meet the validation requirements.',
    'inclusions' => 'Hotel, Transport, Guide',
    'status' => 'draft'
];

// Simulate authentication (you'll need to replace this with a real token)
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer YOUR_ADMIN_TOKEN_HERE';

echo "Testing Package Creation Endpoint\n";
echo "==================================\n\n";

echo "Request Data:\n";
print_r($_POST);
echo "\n";

// Include the API
try {
    ob_start();
    include __DIR__ . '/backend/api/v2/index.php';
    $response = ob_get_clean();
    
    echo "Response:\n";
    echo $response;
    echo "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
