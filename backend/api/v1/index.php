<?php
/**
 * Tourism Management System - REST API v1
 * Main API Entry Point
 */

// Enable CORS for React frontend
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include core files
require_once '../../includes/config.php';
require_once 'middleware/ApiAuth.php';
require_once 'middleware/ApiResponse.php';
require_once 'routes/Router.php';

// Start secure session for API
startSecureSession();

try {
    // Router is already initialized in Router.php as global $router
    
    // Load all routes
    require_once 'routes/auth.php';
    require_once 'routes/packages.php';
    require_once 'routes/bookings.php';
    require_once 'routes/users.php';
    require_once 'routes/admin.php';
    require_once 'routes/visa.php';
    
    // Get request method and URI
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Remove API base path - handle different possible paths
    $possibleBasePaths = [
        '/Tourism-Management-System-main/Tourism-Management-System-main/api/v1',
        '/Tourism-Management-System-main/api/v1',
        '/api/v1'
    ];
    
    $cleanUri = $uri;
    foreach ($possibleBasePaths as $basePath) {
        if (strpos($uri, $basePath) === 0) {
            $cleanUri = str_replace($basePath, '', $uri);
            break;
        }
    }
    
    // Ensure clean URI starts with /
    if (empty($cleanUri) || $cleanUri[0] !== '/') {
        $cleanUri = '/' . ltrim($cleanUri, '/');
    }
    
    // Route the request
    $router->route($method, $cleanUri);
    
} catch (Exception $e) {
    Logger::error('API Error: ' . $e->getMessage(), [
        'method' => $_SERVER['REQUEST_METHOD'],
        'uri' => $_SERVER['REQUEST_URI'],
        'trace' => $e->getTraceAsString()
    ]);
    
    ApiResponse::error('Internal server error', 500);
}
?>