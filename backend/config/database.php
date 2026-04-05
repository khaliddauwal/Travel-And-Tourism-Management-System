<?php

class Database {
    private $host;
    private $dbname;
    private $username;
    private $password;
    private $connection;
    
    public function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->dbname = $_ENV['DB_NAME'] ?? 'tms';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
    }
    
    public function connect() {
        if ($this->connection === null) {
            try {
                // First try to connect without specifying database to check if MySQL is running
                $dsn = "mysql:host={$this->host};charset=utf8";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                ];
                
                $tempConnection = new PDO($dsn, $this->username, $this->password, $options);
                
                // Check if database exists
                $stmt = $tempConnection->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?");
                $stmt->execute([$this->dbname]);
                
                if ($stmt->rowCount() == 0) {
                    // Database doesn't exist, create it
                    $tempConnection->exec("CREATE DATABASE IF NOT EXISTS `{$this->dbname}` CHARACTER SET utf8 COLLATE utf8_general_ci");
                }
                
                // Now connect to the specific database
                $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8";
                $this->connection = new PDO($dsn, $this->username, $this->password, $options);
                
            } catch (PDOException $e) {
                $errorMsg = "Database connection failed: " . $e->getMessage();
                error_log($errorMsg);
                
                // Provide more specific error information
                if (strpos($e->getMessage(), 'Access denied') !== false) {
                    throw new Exception("Database access denied. Please check your MySQL username and password in .env file");
                } elseif (strpos($e->getMessage(), 'Connection refused') !== false) {
                    throw new Exception("Cannot connect to MySQL server. Please ensure MySQL/XAMPP is running");
                } else {
                    throw new Exception("Database connection failed: " . $e->getMessage());
                }
            }
        }
        
        return $this->connection;
    }
    
    public function disconnect() {
        $this->connection = null;
    }
    
    public function getConnectionInfo() {
        return [
            'host' => $this->host,
            'database' => $this->dbname,
            'username' => $this->username,
            'password_set' => !empty($this->password)
        ];
    }
}
?>