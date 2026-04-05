<?php
// Test database tables
try {
    $pdo = new PDO('mysql:host=localhost;dbname=tms_system', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to database successfully!\n\n";
    
    // Show all tables
    $stmt = $pdo->query('SHOW TABLES');
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "Tables in tms_system database:\n";
    echo "================================\n";
    foreach($tables as $table) {
        echo "- $table\n";
    }
    
    echo "\n";
    
    // Check if travel_packages table exists
    if (in_array('travel_packages', $tables)) {
        echo "✓ travel_packages table exists\n\n";
        
        // Count packages
        $stmt = $pdo->query('SELECT COUNT(*) as count FROM travel_packages');
        $count = $stmt->fetch()['count'];
        echo "Total packages: $count\n";
        
        // Show package types
        $stmt = $pdo->query('SELECT DISTINCT type FROM travel_packages');
        $types = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "Package types: " . implode(', ', $types) . "\n";
    } else {
        echo "✗ travel_packages table does NOT exist!\n";
        echo "You need to import the database schema.\n";
    }
    
} catch(Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
