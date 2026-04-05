<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/config/Database.php';
require __DIR__ . '/utils/Response.php';
require __DIR__ . '/utils/Validator.php';
require __DIR__ . '/utils/FileUpload.php';
require __DIR__ . '/middleware/Auth.php';
require __DIR__ . '/controllers/PackageController.php';

$_GET = ['limit' => '3', 'status' => 'published'];

echo "=== Calling PackageController::index() ===\n";
$ctrl = new PackageController();
$ctrl->index();
echo "\n=== Done ===\n";
