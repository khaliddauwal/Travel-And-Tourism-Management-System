<?php
$host = 'localhost';
$dbname = 'tms_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    $stmt = $pdo->query("SELECT id, full_name, email, status, role_id FROM users WHERE role_id = 1");
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['admins' => $admins], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
