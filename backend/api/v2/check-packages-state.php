<?php
require __DIR__ . '/config/Database.php';
$db   = new Database();
$conn = $db->connect();

$rows = $conn->query('SELECT id, name, status, deleted_at FROM travel_packages LIMIT 10')->fetchAll(PDO::FETCH_ASSOC);
echo "=== Sample packages ===\n";
echo json_encode($rows, JSON_PRETTY_PRINT) . "\n\n";

$pub = $conn->query("SELECT COUNT(*) FROM travel_packages WHERE status='published'")->fetchColumn();
echo "published count: $pub\n";

$notDel = $conn->query("SELECT COUNT(*) FROM travel_packages WHERE deleted_at IS NULL")->fetchColumn();
echo "not soft-deleted: $notDel\n";

$pubNotDel = $conn->query("SELECT COUNT(*) FROM travel_packages WHERE status='published' AND deleted_at IS NULL")->fetchColumn();
echo "published + not deleted: $pubNotDel\n";

$all = $conn->query("SELECT COUNT(*) FROM travel_packages")->fetchColumn();
echo "total rows: $all\n";
