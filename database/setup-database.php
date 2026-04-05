<?php
// Database setup script
echo "<h2>🗄️ Database Setup for Tourism Management System</h2>";

try {
    // Load configuration
    include('includes/config.php');
    
    echo "<h3>1. Connecting to MySQL Server...</h3>";
    $database = new Database();
    $dbh = $database->connect();
    echo "✅ Connected successfully<br>";
    
    echo "<h3>2. Checking if SQL file exists...</h3>";
    $sqlFile = 'tms.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file 'tms.sql' not found. Please ensure it's in the root directory.");
    }
    echo "✅ Found tms.sql file<br>";
    
    echo "<h3>3. Reading and executing SQL file...</h3>";
    $sql = file_get_contents($sqlFile);
    
    // Split SQL into individual statements
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($statements as $statement) {
        if (empty($statement) || strpos($statement, '--') === 0) {
            continue; // Skip empty statements and comments
        }
        
        try {
            $dbh->exec($statement);
            $successCount++;
        } catch (PDOException $e) {
            // Skip "table already exists" errors
            if (strpos($e->getMessage(), 'already exists') === false) {
                echo "⚠️ Warning: " . $e->getMessage() . "<br>";
                $errorCount++;
            }
        }
    }
    
    echo "✅ Executed $successCount SQL statements successfully<br>";
    if ($errorCount > 0) {
        echo "⚠️ $errorCount statements had warnings<br>";
    }
    
    echo "<h3>4. Verifying table creation...</h3>";
    $tables = ['admin', 'tblusers', 'tblbooking', 'tbltourpackages', 'tblenquiry', 'tblissues', 'tblpages'];
    $existingTables = 0;
    
    foreach ($tables as $table) {
        try {
            $stmt = $dbh->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() > 0) {
                echo "✅ Table '$table' exists<br>";
                $existingTables++;
            } else {
                echo "❌ Table '$table' missing<br>";
            }
        } catch (Exception $e) {
            echo "❌ Error checking table '$table': " . $e->getMessage() . "<br>";
        }
    }
    
    echo "<h3>5. Updating admin password to bcrypt...</h3>";
    try {
        // Update admin password from MD5 to bcrypt
        $newPassword = password_hash('Test@123', PASSWORD_DEFAULT);
        $stmt = $dbh->prepare("UPDATE admin SET Password = ? WHERE UserName = 'admin'");
        $stmt->execute([$newPassword]);
        echo "✅ Admin password updated to bcrypt hash<br>";
    } catch (Exception $e) {
        echo "⚠️ Could not update admin password: " . $e->getMessage() . "<br>";
    }
    
    echo "<h3>🎉 Database Setup Complete!</h3>";
    echo "<p><strong>Summary:</strong></p>";
    echo "<ul>";
    echo "<li>Database: tms</li>";
    echo "<li>Tables created: $existingTables/" . count($tables) . "</li>";
    echo "<li>Admin credentials: admin / Test@123</li>";
    echo "</ul>";
    
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ul>";
    echo "<li><a href='test-system.php'>🧪 Run system test</a></li>";
    echo "<li><a href='index.php'>🏠 Go to main site</a></li>";
    echo "<li><a href='admin/index.php'>🔐 Admin login</a></li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<h3>❌ Setup Failed</h3>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    
    echo "<h4>🔧 Manual Setup Instructions:</h4>";
    echo "<ol>";
    echo "<li>Open phpMyAdmin (http://localhost/phpmyadmin)</li>";
    echo "<li>Create a new database named 'tms'</li>";
    echo "<li>Import the 'tms.sql' file into the database</li>";
    echo "<li>Run the <a href='test-system.php'>system test</a></li>";
    echo "</ol>";
    
    echo "<h4>🐛 Technical Details:</h4>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>