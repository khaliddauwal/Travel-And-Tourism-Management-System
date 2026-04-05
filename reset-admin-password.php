<?php
$host = 'localhost';
$dbname = 'tms_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Hash the correct password
    $newPassword = 'Admin@123';
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    
    // Update admin password
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = 'admin@tms.com'");
    $stmt->execute([$hashedPassword]);
    
    // Verify it worked
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = 'admin@tms.com'");
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $passwordMatch = password_verify($newPassword, $user['password']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Admin password reset successfully',
        'email' => 'admin@tms.com',
        'password' => $newPassword,
        'password_verified' => $passwordMatch
    ], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
