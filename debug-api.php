<?php
/**
 * API Diagnostic Script
 * Visit: http://localhost/Tourism-Management-System-main/debug-api.php
 * DELETE THIS FILE after debugging.
 */
header('Content-Type: application/json');

$result = [];

// 1. Check .env loading
$envPath = __DIR__ . '/backend/.env';
$result['env_file_exists'] = file_exists($envPath);

if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

$result['db_config'] = [
    'host' => $_ENV['DB_HOST'] ?? 'NOT SET',
    'name' => $_ENV['DB_NAME'] ?? 'NOT SET',
    'user' => $_ENV['DB_USER'] ?? 'NOT SET',
    'pass' => empty($_ENV['DB_PASS'] ?? '') ? '(empty)' : '(set)',
];

// 2. Test DB connection
try {
    $dsn = "mysql:host={$result['db_config']['host']};charset=utf8mb4";
    $pdo = new PDO($dsn, $result['db_config']['user'], $_ENV['DB_PASS'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $result['db_connection'] = 'OK';

    // 3. List databases
    $stmt = $pdo->query("SHOW DATABASES");
    $result['databases'] = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // 4. Check if tms_system exists
    $result['tms_system_exists'] = in_array('tms_system', $result['databases']);
    $result['tms_exists']        = in_array('tms', $result['databases']);

    // 5. Check tables in tms_system if it exists
    if ($result['tms_system_exists']) {
        $pdo->exec("USE tms_system");
        $stmt = $pdo->query("SHOW TABLES");
        $result['tms_system_tables'] = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Check travel_packages column types
        if (in_array('travel_packages', $result['tms_system_tables'])) {
            $stmt = $pdo->query("DESCRIBE travel_packages");
            $result['travel_packages_columns'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    // 6. Check tables in tms if it exists
    if ($result['tms_exists']) {
        $pdo->exec("USE tms");
        $stmt = $pdo->query("SHOW TABLES");
        $result['tms_tables'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

} catch (PDOException $e) {
    $result['db_connection'] = 'FAILED: ' . $e->getMessage();
}

// 7. Check controller file state
$controllerPath = __DIR__ . '/backend/api/v2/controllers/PackageController.php';
$result['controller_exists'] = file_exists($controllerPath);
if (file_exists($controllerPath)) {
    $content = file_get_contents($controllerPath);
    $result['controller_has_enum_call']   = strpos($content, '$validator->enum') !== false;
    $result['controller_has_mapPackage']  = strpos($content, 'mapPackage') !== false;
    $result['controller_has_try_catch']   = strpos($content, 'PDOException') !== false;
    $result['controller_size_bytes']      = strlen($content);
}

// 8. Check Validator.php enum method
$validatorPath = __DIR__ . '/backend/api/v2/utils/Validator.php';
if (file_exists($validatorPath)) {
    $content = file_get_contents($validatorPath);
    $result['validator_enum_blocks']  = strpos($content, 'must be one of') !== false;
    $result['validator_enum_accepts'] = strpos($content, 'Store the value regardless') !== false;
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
