<?php 
// Load environment variables
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// Include core systems
require_once 'logger.php';
require_once 'validation.php';
require_once 'assets.php';
require_once 'currency.php'; // Add currency system

// Database configuration
require_once __DIR__ . '/../config/database.php';
$database = new Database();
$dbh = $database->connect();

// Include security functions
require_once 'csrf.php';
require_once 'session.php';
?>