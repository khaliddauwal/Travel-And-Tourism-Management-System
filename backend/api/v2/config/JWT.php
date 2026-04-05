<?php
/**
 * JWT Helper Class
 * Handles JWT token generation and validation
 */

class JWT {
    private static $secret_key;
    private static $algorithm = 'HS256';
    private static $token_expiry = 86400; // 24 hours

    public static function init() {
        self::$secret_key = $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-this-in-production';
    }

    /**
     * Generate JWT token
     * @param array $payload
     * @return string
     */
    public static function encode($payload) {
        self::init();
        
        $header = [
            'typ' => 'JWT',
            'alg' => self::$algorithm
        ];

        $payload['iat'] = time();
        $payload['exp'] = time() + self::$token_expiry;

        $base64UrlHeader = self::base64UrlEncode(json_encode($header));
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Decode and validate JWT token
     * @param string $token
     * @return object|null
     */
    public static function decode($token) {
        self::init();

        try {
            $tokenParts = explode('.', $token);
            
            if (count($tokenParts) !== 3) {
                return null;
            }

            list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $tokenParts;

            // Verify signature
            $signature = self::base64UrlDecode($base64UrlSignature);
            $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);

            if (!hash_equals($signature, $expectedSignature)) {
                return null;
            }

            $payload = json_decode(self::base64UrlDecode($base64UrlPayload));

            // Check expiration
            if (isset($payload->exp) && $payload->exp < time()) {
                return null;
            }

            return $payload;

        } catch (Exception $e) {
            error_log("JWT Decode Error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Base64 URL encode
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL decode
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Get token from Authorization header
     * @return string|null
     */
    public static function getBearerToken() {
        $headers = self::getAuthorizationHeader();
        
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }

    /**
     * Get Authorization header
     */
    private static function getAuthorizationHeader() {
        $headers = null;
        
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        return $headers;
    }
}
