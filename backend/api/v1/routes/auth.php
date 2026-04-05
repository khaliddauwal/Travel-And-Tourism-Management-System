<?php
/**
 * Authentication Routes
 */

require_once __DIR__ . '/../controllers/AuthController.php';

// User Authentication
$router->post('/auth/login', 'ApiAuthController@login');
$router->post('/auth/register', 'ApiAuthController@register');
$router->post('/auth/logout', 'ApiAuthController@logout');
$router->get('/auth/me', 'ApiAuthController@me');

// Admin Authentication
$router->post('/auth/admin/login', 'ApiAuthController@adminLogin');

// Password Reset (future implementation)
$router->post('/auth/forgot-password', function($params) {
    ApiResponse::error('Not implemented yet', 501);
});

$router->post('/auth/reset-password', function($params) {
    ApiResponse::error('Not implemented yet', 501);
});
?>