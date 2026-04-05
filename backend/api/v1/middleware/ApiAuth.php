<?php
/**
 * API Authentication Middleware
 * Handles JWT tokens and session-based auth
 */

class ApiAuth {
    
    /**
     * Verify JWT token
     */
    public static function verifyToken($token) {
        if (!$token) {
            return false;
        }
        
        try {
            // Simple JWT verification - in production use a proper JWT library
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return false;
            }
            
            $header = json_decode(base64_decode($parts[0]), true);
            $payload = json_decode(base64_decode($parts[1]), true);
            
            // Check expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return false;
            }
            
            // Verify signature (simplified - use proper JWT library in production)
            $secret = $_ENV['JWT_SECRET'] ?? 'your-secret-key';
            $signature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], $secret, true);
            $expectedSignature = base64_decode($parts[2]);
            
            return hash_equals($signature, $expectedSignature) ? $payload : false;
        } catch (Exception $e) {
            Logger::error('JWT verification failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
    
    /**
     * Generate JWT token
     */
    public static function generateToken($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['exp'] = time() + 3600; // 1 hour expiration
        $payload = json_encode($payload);
        
        $headerEncoded = base64_encode($header);
        $payloadEncoded = base64_encode($payload);
        
        $secret = $_ENV['JWT_SECRET'] ?? 'your-secret-key';
        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $secret, true);
        $signatureEncoded = base64_encode($signature);
        
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }
    
    /**
     * Check if user is authenticated
     */
    public static function requireAuth() {
        if (!isLoggedIn()) {
            ApiResponse::unauthorized('Authentication required');
        }
        
        return $_SESSION['login'];
    }
    
    /**
     * Check if admin is authenticated
     */
    public static function requireAdmin() {
        if (!isAdminLoggedIn()) {
            ApiResponse::unauthorized('Admin authentication required');
        }
        
        return $_SESSION['alogin'];
    }
    
    /**
     * Get current user email from session
     */
    public static function getCurrentUser() {
        return $_SESSION['login'] ?? null;
    }
    
    /**
     * Get current admin from session
     */
    public static function getCurrentAdmin() {
        return $_SESSION['alogin'] ?? null;
    }
    
    /**
     * Validate API key (optional)
     */
    public static function validateApiKey($key) {
        // TODO: Implement API key validation
        return true;
    }
    
    /**
     * Rate limiting (basic implementation)
     */
    public static function rateLimit($identifier, $maxRequests = 100, $timeWindow = 3600) {
        // TODO: Implement proper rate limiting with Redis/database
        return true;
    }
    
    /**
     * Extract bearer token from headers
     */
    public static function getBearerToken() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
}
?>