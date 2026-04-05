<?php
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Direct PHP file works!',
    'note' => 'If you see this, Apache is working but .htaccess routing is not'
]);
