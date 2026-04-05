<?php
// Simulate exactly what GET /packages does
require __DIR__ . '/config/Database.php';
require __DIR__ . '/utils/Response.php';

$db   = new Database();
$conn = $db->connect();

$page   = 1;
$limit  = 12;
$offset = 0;
$status = 'published';

$where  = ['p.status = :status'];
$params = [':status' => $status];
$whereClause = implode(' AND ', $where);

// Count
$countStmt = $conn->prepare("SELECT COUNT(*) AS total FROM travel_packages p WHERE $whereClause");
$countStmt->execute($params);
$total = (int)$countStmt->fetch()['total'];
echo "Total count: $total\n";

// Main query
$sql = "SELECT p.*,
        COALESCE(u.full_name, 'Admin') AS created_by_name,
        (SELECT AVG(r.rating) FROM reviews r WHERE r.package_id = p.id AND r.status = 'approved') AS avg_rating,
        (SELECT COUNT(*) FROM reviews r WHERE r.package_id = p.id AND r.status = 'approved') AS review_count
 FROM travel_packages p
 LEFT JOIN users u ON p.created_by = u.id
 WHERE $whereClause
 ORDER BY p.created_at DESC
 LIMIT :limit OFFSET :offset";

try {
    $stmt = $conn->prepare($sql);
    foreach ($params as $k => $v) { $stmt->bindValue($k, $v); }
    $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Rows returned: " . count($rows) . "\n";
    if (!empty($rows)) {
        echo "First row keys: " . implode(', ', array_keys($rows[0])) . "\n";
        echo "First package: " . $rows[0]['name'] . " | status: " . $rows[0]['status'] . "\n";
    }
} catch (Exception $e) {
    echo "QUERY ERROR: " . $e->getMessage() . "\n";
}

// Also test what the actual HTTP response looks like
echo "\n=== Simulating full index() call ===\n";
$_GET = ['limit' => '5'];
ob_start();
try {
    require_once __DIR__ . '/middleware/Auth.php';
    require_once __DIR__ . '/utils/Validator.php';
    require_once __DIR__ . '/utils/FileUpload.php';
    require_once __DIR__ . '/controllers/PackageController.php';
    $ctrl = new PackageController();
    $ctrl->index();
} catch (Exception $e) {
    echo "CONTROLLER ERROR: " . $e->getMessage() . "\n";
}
$output = ob_get_clean();
$decoded = json_decode($output, true);
if ($decoded) {
    echo "success: " . ($decoded['success'] ? 'true' : 'false') . "\n";
    if (isset($decoded['data']['packages'])) {
        echo "packages count: " . count($decoded['data']['packages']) . "\n";
    } elseif (isset($decoded['data'])) {
        echo "data type: " . gettype($decoded['data']) . "\n";
        echo "data keys: " . (is_array($decoded['data']) ? implode(', ', array_keys($decoded['data'])) : 'N/A') . "\n";
    }
    if (!$decoded['success']) {
        echo "error message: " . $decoded['message'] . "\n";
    }
} else {
    echo "Raw output: $output\n";
}
