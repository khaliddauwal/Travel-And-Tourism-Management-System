<?php
// Simple database import script
echo "<h2>📥 Database Import Tool</h2>";

try {
    // Load configuration
    include('includes/config.php');
    
    echo "<h3>1. Connecting to database...</h3>";
    $database = new Database();
    $dbh = $database->connect();
    echo "✅ Connected to database 'tms'<br>";
    
    echo "<h3>2. Checking SQL file...</h3>";
    $sqlFile = 'tms.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file 'tms.sql' not found in the root directory.");
    }
    echo "✅ Found tms.sql file (" . round(filesize($sqlFile)/1024, 2) . " KB)<br>";
    
    echo "<h3>3. Importing database...</h3>";
    
    // Read the entire SQL file
    $sql = file_get_contents($sqlFile);
    
    // Remove comments and split into statements
    $sql = preg_replace('/--.*$/m', '', $sql); // Remove single line comments
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql); // Remove multi-line comments
    
    // Split by semicolon but be careful with semicolons in strings
    $statements = [];
    $current = '';
    $inString = false;
    $stringChar = '';
    
    for ($i = 0; $i < strlen($sql); $i++) {
        $char = $sql[$i];
        
        if (!$inString && ($char === '"' || $char === "'")) {
            $inString = true;
            $stringChar = $char;
        } elseif ($inString && $char === $stringChar) {
            $inString = false;
        } elseif (!$inString && $char === ';') {
            $statements[] = trim($current);
            $current = '';
            continue;
        }
        
        $current .= $char;
    }
    
    if (trim($current)) {
        $statements[] = trim($current);
    }
    
    $successCount = 0;
    $errorCount = 0;
    $skippedCount = 0;
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement)) {
            continue;
        }
        
        try {
            $dbh->exec($statement);
            $successCount++;
            
            // Show progress for major operations
            if (stripos($statement, 'CREATE TABLE') === 0) {
                preg_match('/CREATE TABLE `?(\w+)`?/i', $statement, $matches);
                $tableName = $matches[1] ?? 'unknown';
                echo "📋 Created table: $tableName<br>";
            } elseif (stripos($statement, 'INSERT INTO') === 0) {
                preg_match('/INSERT INTO `?(\w+)`?/i', $statement, $matches);
                $tableName = $matches[1] ?? 'unknown';
                echo "📝 Inserted data into: $tableName<br>";
            }
            
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'already exists') !== false) {
                $skippedCount++;
                echo "⚠️ Skipped (already exists): " . substr($statement, 0, 50) . "...<br>";
            } else {
                $errorCount++;
                echo "❌ Error: " . $e->getMessage() . "<br>";
                echo "Statement: " . substr($statement, 0, 100) . "...<br>";
            }
        }
    }
    
    echo "<h3>4. Updating admin password...</h3>";
    // Update the admin password to use bcrypt
    $newPassword = password_hash('Test@123', PASSWORD_DEFAULT);
    $stmt = $dbh->prepare("UPDATE admin SET Password = ? WHERE UserName = 'admin'");
    $stmt->execute([$newPassword]);
    echo "✅ Admin password updated to secure bcrypt hash<br>";
    
    echo "<h3>5. Verifying import...</h3>";
    $tables = ['admin', 'tblusers', 'tblbooking', 'tbltourpackages'];
    $verifiedTables = 0;
    
    foreach ($tables as $table) {
        try {
            $stmt = $dbh->query("SELECT COUNT(*) as count FROM $table");
            $result = $stmt->fetch();
            echo "✅ Table '$table': {$result['count']} records<br>";
            $verifiedTables++;
        } catch (Exception $e) {
            echo "❌ Table '$table': Not found or error<br>";
        }
    }
    
    echo "<h3>🎉 Import Complete!</h3>";
    echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h4>📊 Import Summary:</h4>";
    echo "<ul>";
    echo "<li>✅ Successful statements: $successCount</li>";
    echo "<li>⚠️ Skipped (existing): $skippedCount</li>";
    echo "<li>❌ Errors: $errorCount</li>";
    echo "<li>📋 Tables verified: $verifiedTables</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<h4>🔑 Login Credentials:</h4>";
    echo "<ul>";
    echo "<li><strong>Admin:</strong> admin / Test@123</li>";
    echo "<li><strong>User:</strong> anuj@gmail.com / Test@123</li>";
    echo "</ul>";
    
    echo "<h4>🚀 Next Steps:</h4>";
    echo "<p>";
    echo "<a href='test-system.php' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;'>🧪 Run System Test</a> ";
    echo "<a href='index.php' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;'>🏠 Go to Website</a> ";
    echo "<a href='admin/index.php' style='background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;'>🔐 Admin Login</a>";
    echo "</p>";
    
} catch (Exception $e) {
    echo "<h3>❌ Import Failed</h3>";
    echo "<div style='background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "</div>";
    
    echo "<h4>🔧 Alternative Methods:</h4>";
    echo "<ol>";
    echo "<li><strong>phpMyAdmin:</strong> Go to <a href='http://localhost/phpmyadmin'>phpMyAdmin</a>, select 'tms' database, and import the tms.sql file</li>";
    echo "<li><strong>Command Line:</strong> <code>mysql -u root -p tms < tms.sql</code></li>";
    echo "<li><strong>XAMPP Shell:</strong> Use the MySQL command line in XAMPP</li>";
    echo "</ol>";
}
?>