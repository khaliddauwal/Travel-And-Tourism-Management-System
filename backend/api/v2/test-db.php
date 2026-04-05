<?php
/**
 * Quick DB diagnostic — visit this URL directly in browser to confirm DB state
 * http://localhost/Tourism-Management-System-main/backend/api/v2/test-db.php
 */
header('Content-Type: application/json');

$host   = 'localhost';
$dbname = 'tms_system';
$user   = 'root';
$pass   = '';

// Load .env overrides
if (file_exists(__DIR__ . '/../../.env')) {
    foreach (file(__DIR__ . '/../../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k); $v = trim($v);
        if ($k === 'DB_HOST')   $host   = $v;
        if ($k === 'DB_NAME')   $dbname = $v;
        if ($k === 'DB_USER')   $user   = $v;
        if ($k === 'DB_PASS')   $pass   = $v;
    }
}

$result = ['db_name' => $dbname, 'host' => $host, 'user' => $user];

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // List databases
    $dbs = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    $result['databases'] = $dbs;
    $result['target_db_exists'] = in_array($dbname, $dbs);

    if ($result['target_db_exists']) {
        $pdo->exec("USE `$dbname`");
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $result['tables'] = $tables;
        $result['travel_packages_exists'] = in_array('travel_packages', $tables);

        if ($result['travel_packages_exists']) {
            $count = $pdo->query("SELECT COUNT(*) FROM travel_packages")->fetchColumn();
            $result['package_count'] = (int)$count;
            $cols = $pdo->query("DESCRIBE travel_packages")->fetchAll(PDO::FETCH_COLUMN);
            $result['columns'] = $cols;
        }

        $result['users_exists'] = in_array('users', $tables);
        if ($result['users_exists']) {
            $admins = $pdo->query("SELECT id, full_name, email, status FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'administrator'")->fetchAll();
            $result['admin_users'] = $admins;
        }
    }

    $result['connection'] = 'OK';
} catch (Exception $e) {
    $result['connection'] = 'FAILED';
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
