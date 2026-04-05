<?php
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$dbname = 'tms_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Get the most recent user
    $stmt = $pdo->query("SELECT u.id, u.full_name, u.email, u.status, r.name as role_name 
                         FROM users u 
                         JOIN roles r ON u.role_id = r.id 
                         ORDER BY u.id DESC 
                         LIMIT 5");
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'recent_users' => $users
    ], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
