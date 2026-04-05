<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Load environment
if (file_exists(__DIR__ . '/../../.env')) {
    $lines = file(__DIR__ . '/../../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

$tests = [
    'php_version' => PHP_VERSION,
    'env_loaded' => isset($_ENV['DB_HOST']),
    'db_host' => $_ENV['DB_HOST'] ?? 'not set',
    'db_name' => $_ENV['DB_NAME'] ?? 'not set',
];

// Test database connection
try {
    $host = $_ENV['DB_HOST'] ?? 'localhost';
    $dbname = $_ENV['DB_NAME'] ?? 'tms_system';
    $username = $_ENV['DB_USER'] ?? 'root';
    $password = $_ENV['DB_PASS'] ?? '';
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    
    $tests['database_connection'] = 'SUCCESS';
    
    // Test if users table exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $tests['users_table'] = 'EXISTS (' . $stmt->fetchColumn() . ' users)';
    
} catch (PDOException $e) {
    $tests['database_connection'] = 'FAILED: ' . $e->getMessage();
}

echo json_encode($tests, JSON_PRETTY_PRINT);
