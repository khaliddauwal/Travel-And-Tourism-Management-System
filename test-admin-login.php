<?php
$host = 'localhost';
$dbname = 'tms_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Get admin user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = 'admin@tms.com'");
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Test password
        $testPassword = 'Admin@123';
        $passwordMatch = password_verify($testPassword, $user['password']);
        
        echo json_encode([
            'user_exists' => true,
            'email' => $user['email'],
            'password_hash' => substr($user['password'], 0, 20) . '...',
            'password_match' => $passwordMatch,
            'test_password' => $testPassword
        ], JSON_PRETTY_PRINT);
    } else {
        echo json_encode(['user_exists' => false]);
    }
    
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
