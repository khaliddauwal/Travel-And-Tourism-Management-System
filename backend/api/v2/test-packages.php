<?php
/**
 * Minimal package endpoint test — bypasses the router entirely.
 * Visit: http://localhost/Tourism-Management-System-main/backend/api/v2/test-packages.php
 * DELETE after debugging.
 */
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0); // capture, don't display

$result = ['step' => '', 'error' => null, 'data' => null];

// Step 1: load .env
$result['step'] = '1_env';
$envPath = __DIR__ . '/../../.env';
$result['env_path'] = $envPath;
$result['env_exists'] = file_exists($envPath);

if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        [$k, $v] = explode('=', $line, 2);
        $_ENV[trim($k)] = trim($v);
    }
}

$result['db'] = [
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'name' => $_ENV['DB_NAME'] ?? 'tms_system',
    'user' => $_ENV['DB_USER'] ?? 'root',
    'pass' => empty($_ENV['DB_PASS'] ?? '') ? '(empty)' : '(set)',
];

// Step 2: connect
$result['step'] = '2_connect';
try {
    $pdo = new PDO(
        "mysql:host={$result['db']['host']};charset=utf8mb4",
        $result['db']['user'],
        $_ENV['DB_PASS'] ?? '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    $result['connection'] = 'OK';
} catch (PDOException $e) {
    $result['error'] = 'DB connect failed: ' . $e->getMessage();
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// Step 3: list databases
$result['step'] = '3_databases';
$result['databases'] = $pdo->query('SHOW DATABASES')->fetchAll(PDO::FETCH_COLUMN);

// Step 4: check tms_system
$result['step'] = '4_use_db';
$dbName = $result['db']['name'];
try {
    $pdo->exec("USE `$dbName`");
    $result['using_db'] = $dbName;
} catch (PDOException $e) {
    $result['error'] = "Cannot USE $dbName: " . $e->getMessage();
    $result['hint']  = 'Run setup-database.php first, or check DB_NAME in backend/.env';
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// Step 5: list tables
$result['step'] = '5_tables';
$result['tables'] = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
$result['travel_packages_exists'] = in_array('travel_packages', $result['tables']);

if (!$result['travel_packages_exists']) {
    $result['error'] = 'travel_packages table does not exist';
    $result['hint']  = 'Run setup-database.php to create it';
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// Step 6: describe travel_packages
$result['step'] = '6_describe';
$cols = $pdo->query('DESCRIBE travel_packages')->fetchAll();
$result['columns'] = array_column($cols, 'Type', 'Field');

// Step 7: query packages
$result['step'] = '7_query';
try {
    $rows = $pdo->query('SELECT COUNT(*) AS cnt FROM travel_packages')->fetch();
    $result['package_count'] = (int)$rows['cnt'];

    $packages = $pdo->query('SELECT id, name, type, status FROM travel_packages LIMIT 5')->fetchAll();
    $result['sample_packages'] = $packages;
    $result['query'] = 'OK';
} catch (PDOException $e) {
    $result['error'] = 'Query failed: ' . $e->getMessage();
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// Step 8: test controller load
$result['step'] = '8_controller';
try {
    ob_start();
    require_once __DIR__ . '/config/Database.php';
    require_once __DIR__ . '/utils/Response.php';
    require_once __DIR__ . '/utils/FileUpload.php';
    require_once __DIR__ . '/middleware/Auth.php';
    require_once __DIR__ . '/controllers/PackageController.php';
    ob_end_clean();
    $result['controller_loaded'] = true;
} catch (Throwable $e) {
    ob_end_clean();
    $result['error'] = 'Controller load failed: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// Step 9: call index()
$result['step'] = '9_index';
try {
    $_GET['limit'] = '5';
    ob_start();
    $ctrl = new PackageController();
    $ctrl->index();
    $output = ob_get_clean();
    $result['index_output'] = json_decode($output, true) ?? $output;
} catch (Throwable $e) {
    ob_end_clean();
    $result['error'] = 'index() threw: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

$result['step'] = 'done';
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
