<?php
require_once __DIR__ . '/../controllers/VisaController.php';

// Initialize controller
$visaController = new VisaController();

// Handle different HTTP methods and routes
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path to get the route
$basePath = '/Tourism-Management-System-main/api/v1';
$route = str_replace($basePath, '', $path);

switch ($method) {
    case 'POST':
        if ($route === '/visa/submit') {
            $visaController->submitRequest();
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Route not found']);
        }
        break;

    case 'GET':
        if ($route === '/visa/my-requests') {
            $visaController->getUserRequests();
        } elseif ($route === '/visa/admin/all') {
            $visaController->getAllRequests();
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Route not found']);
        }
        break;

    case 'PUT':
        if (preg_match('/^\/visa\/admin\/(\d+)\/status$/', $route, $matches)) {
            $requestId = (int)$matches[1];
            $visaController->updateStatus($requestId);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Route not found']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>