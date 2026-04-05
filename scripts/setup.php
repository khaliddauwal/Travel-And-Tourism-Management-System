<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TMS Setup - Tourism Management System</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
        .btn:hover { background: #0056b3; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        .info { color: #17a2b8; }
    </style>
</head>
<body>
    <h1>🏖️ Tourism Management System - Setup</h1>
    
    <div class="card">
        <h2>📋 Setup Checklist</h2>
        <p>Follow these steps to set up your Tourism Management System:</p>
        
        <h3>1. Prerequisites</h3>
        <ul>
            <li>✅ XAMPP installed and running</li>
            <li>✅ Apache server started</li>
            <li>✅ MySQL server started</li>
        </ul>
        
        <h3>2. Database Setup</h3>
        <p>Choose one of the following options:</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>Option A: Automatic Setup (Recommended)</h4>
            <p>Let the system automatically create the database and import tables:</p>
            <a href="setup-database.php" class="btn">🚀 Auto Setup Database</a>
            <a href="import-database.php" class="btn">📥 Import Database Only</a>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>Option B: Manual Setup</h4>
            <ol>
                <li>Open <a href="http://localhost/phpmyadmin" target="_blank">phpMyAdmin</a></li>
                <li>Create a new database named <code>tms</code></li>
                <li>Import the <code>tms.sql</code> file</li>
                <li>Run the system test below</li>
            </ol>
        </div>
        
        <h3>3. System Verification</h3>
        <p>Test if everything is working correctly:</p>
        <a href="test-system.php" class="btn">🧪 Run System Test</a>
        
        <h3>4. Access the Application</h3>
        <p>Once setup is complete, you can access:</p>
        <a href="index.php" class="btn">🏠 Main Website</a>
        <a href="admin/index.php" class="btn">🔐 Admin Panel</a>
    </div>
    
    <div class="card">
        <h2>🔑 Default Login Credentials</h2>
        
        <h3>Admin Login</h3>
        <ul>
            <li><strong>URL:</strong> <a href="admin/index.php">admin/index.php</a></li>
            <li><strong>Username:</strong> admin</li>
            <li><strong>Password:</strong> Test@123</li>
        </ul>
        
        <h3>User Login</h3>
        <ul>
            <li><strong>URL:</strong> <a href="index.php">index.php</a></li>
            <li><strong>Email:</strong> anuj@gmail.com</li>
            <li><strong>Password:</strong> Test@123</li>
        </ul>
        
        <p class="warning"><strong>⚠️ Important:</strong> Change these default passwords after setup!</p>
    </div>
    
    <div class="card">
        <h2>🔧 Configuration</h2>
        <p>Database settings are configured in the <code>.env</code> file:</p>
        <pre style="background: #f8f9fa; padding: 10px; border-radius: 5px;">
DB_HOST=localhost
DB_NAME=tms
DB_USER=root
DB_PASS=
        </pre>
        <p>Modify these settings if your MySQL configuration is different.</p>
    </div>
    
    <div class="card">
        <h2>🆕 What's New - Security Improvements</h2>
        <ul>
            <li>✅ <strong>Password Security:</strong> Upgraded from MD5 to bcrypt hashing</li>
            <li>✅ <strong>CSRF Protection:</strong> All forms now protected against CSRF attacks</li>
            <li>✅ <strong>Session Security:</strong> Enhanced session management with hijacking detection</li>
            <li>✅ <strong>Input Validation:</strong> Comprehensive validation and sanitization</li>
            <li>✅ <strong>Error Logging:</strong> Structured logging system for debugging</li>
            <li>✅ <strong>Modern Architecture:</strong> MVC structure and Composer integration</li>
        </ul>
    </div>
    
    <div class="card">
        <h2>📚 Documentation</h2>
        <p>For detailed information about the improvements made:</p>
        <a href="IMPROVEMENTS.md" class="btn info">📖 View Improvements Documentation</a>
    </div>
</body>
</html>