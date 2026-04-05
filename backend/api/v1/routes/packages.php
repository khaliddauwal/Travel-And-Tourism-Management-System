<?php
/**
 * Package Routes
 */

require_once __DIR__ . '/../controllers/PackageController.php';

// Public package routes
$router->get('/packages', 'ApiPackageController@index');
$router->get('/packages/featured', 'ApiPackageController@featured');
$router->get('/packages/types', 'ApiPackageController@types');
$router->get('/packages/search', 'ApiPackageController@search');
$router->get('/packages/{id}', 'ApiPackageController@show');

// Admin package routes (future implementation)
$router->post('/packages', function($params) {
    ApiAuth::requireAdmin();
    ApiResponse::error('Not implemented yet', 501);
});

$router->put('/packages/{id}', function($params) {
    ApiAuth::requireAdmin();
    ApiResponse::error('Not implemented yet', 501);
});

$router->delete('/packages/{id}', function($params) {
    ApiAuth::requireAdmin();
    ApiResponse::error('Not implemented yet', 501);
});
?>