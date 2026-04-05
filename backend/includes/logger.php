<?php

class Logger {
    private static $logFile;
    
    public static function init() {
        self::$logFile = __DIR__ . '/../logs/app.log';
        
        // Create logs directory if it doesn't exist
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
    }
    
    public static function log($level, $message, $context = []) {
        if (!self::$logFile) {
            self::init();
        }
        
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' ' . json_encode($context) : '';
        $logEntry = "[{$timestamp}] {$level}: {$message}{$contextStr}" . PHP_EOL;
        
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    public static function error($message, $context = []) {
        self::log('ERROR', $message, $context);
    }
    
    public static function warning($message, $context = []) {
        self::log('WARNING', $message, $context);
    }
    
    public static function info($message, $context = []) {
        self::log('INFO', $message, $context);
    }
    
    public static function debug($message, $context = []) {
        if ($_ENV['APP_DEBUG'] ?? false) {
            self::log('DEBUG', $message, $context);
        }
    }
    
    public static function critical($message, $context = []) {
        self::log('CRITICAL', $message, $context);
        
        // Send critical errors to monitoring service
        self::notifyMonitoring($message, $context);
    }
    
    /**
     * Rotate log files daily
     */
    public static function rotateLog() {
        if (!self::$logFile) {
            self::init();
        }
        
        if (file_exists(self::$logFile)) {
            $fileSize = filesize(self::$logFile);
            $maxSize = 10 * 1024 * 1024; // 10MB
            
            if ($fileSize > $maxSize) {
                $rotatedFile = self::$logFile . '.' . date('Y-m-d-H-i-s');
                rename(self::$logFile, $rotatedFile);
                
                // Keep only last 30 rotated files
                self::cleanOldLogs();
            }
        }
    }
    
    /**
     * Clean old log files
     */
    private static function cleanOldLogs() {
        $logDir = dirname(self::$logFile);
        $files = glob($logDir . '/app.log.*');
        
        if (count($files) > 30) {
            // Sort by modification time
            usort($files, function($a, $b) {
                return filemtime($a) - filemtime($b);
            });
            
            // Remove oldest files
            $filesToRemove = array_slice($files, 0, count($files) - 30);
            foreach ($filesToRemove as $file) {
                unlink($file);
            }
        }
    }
    
    /**
     * Send critical errors to monitoring service
     */
    private static function notifyMonitoring($message, $context) {
        // TODO: Integrate with monitoring service (Sentry, etc.)
        // For now, just log to separate critical log
        $criticalLog = dirname(self::$logFile) . '/critical.log';
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' ' . json_encode($context) : '';
        $logEntry = "[{$timestamp}] CRITICAL: {$message}{$contextStr}" . PHP_EOL;
        
        file_put_contents($criticalLog, $logEntry, FILE_APPEND | LOCK_EX);
    }
}
        if (($_ENV['APP_DEBUG'] ?? false) === 'true') {
            self::log('DEBUG', $message, $context);
        }
    }
}

// Custom error handler
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    $errorTypes = [
        E_ERROR => 'ERROR',
        E_WARNING => 'WARNING',
        E_NOTICE => 'NOTICE',
        E_USER_ERROR => 'USER_ERROR',
        E_USER_WARNING => 'USER_WARNING',
        E_USER_NOTICE => 'USER_NOTICE'
    ];
    
    $type = $errorTypes[$errno] ?? 'UNKNOWN';
    Logger::error("PHP {$type}: {$errstr}", [
        'file' => $errfile,
        'line' => $errline
    ]);
    
    return false; // Let PHP handle the error normally
}

// Custom exception handler
function customExceptionHandler($exception) {
    Logger::error("Uncaught exception: " . $exception->getMessage(), [
        'file' => $exception->getFile(),
        'line' => $exception->getLine(),
        'trace' => $exception->getTraceAsString()
    ]);
}

// Set error and exception handlers
set_error_handler('customErrorHandler');
set_exception_handler('customExceptionHandler');

// Initialize logger
Logger::init();
?>