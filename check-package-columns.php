<?php
// Check travel_packages table structure
try {
    $pdo = new PDO('mysql:host=localhost;dbname=tms_system', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "travel_packages table structure:\n";
    echo "=================================\n\n";
    
    $stmt = $pdo->query('DESCRIBE travel_packages');
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach($columns as $column) {
        echo sprintf("%-20s %-15s %s\n", 
            $column['Field'], 
            $column['Type'], 
            $column['Null'] == 'NO' ? 'NOT NULL' : 'NULL'
        );
    }
    
} catch(Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
