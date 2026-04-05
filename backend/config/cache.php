<?php
/**
 * Simple Cache Implementation
 * For production, consider using Redis or Memcached
 */

class SimpleCache {
    private static $cacheDir;
    
    public static function init() {
        self::$cacheDir = __DIR__ . '/../cache';
        if (!is_dir(self::$cacheDir)) {
            mkdir(self::$cacheDir, 0755, true);
        }
    }
    
    /**
     * Get cached value
     */
    public static function get($key, $default = null) {
        if (!self::$cacheDir) {
            self::init();
        }
        
        $file = self::$cacheDir . '/' . md5($key) . '.cache';
        
        if (!file_exists($file)) {
            return $default;
        }
        
        $data = unserialize(file_get_contents($file));
        
        // Check expiration
        if ($data['expires'] < time()) {
            unlink($file);
            return $default;
        }
        
        return $data['value'];
    }
    
    /**
     * Set cached value
     */
    public static function set($key, $value, $ttl = 3600) {
        if (!self::$cacheDir) {
            self::init();
        }
        
        $file = self::$cacheDir . '/' . md5($key) . '.cache';
        $data = [
            'value' => $value,
            'expires' => time() + $ttl
        ];
        
        file_put_contents($file, serialize($data), LOCK_EX);
    }
    
    /**
     * Delete cached value
     */
    public static function delete($key) {
        if (!self::$cacheDir) {
            self::init();
        }
        
        $file = self::$cacheDir . '/' . md5($key) . '.cache';
        if (file_exists($file)) {
            unlink($file);
        }
    }
    
    /**
     * Clear all cache
     */
    public static function clear() {
        if (!self::$cacheDir) {
            self::init();
        }
        
        $files = glob(self::$cacheDir . '/*.cache');
        foreach ($files as $file) {
            unlink($file);
        }
    }
    
    /**
     * Clean expired cache files
     */
    public static function cleanup() {
        if (!self::$cacheDir) {
            self::init();
        }
        
        $files = glob(self::$cacheDir . '/*.cache');
        foreach ($files as $file) {
            $data = unserialize(file_get_contents($file));
            if ($data['expires'] < time()) {
                unlink($file);
            }
        }
    }
}