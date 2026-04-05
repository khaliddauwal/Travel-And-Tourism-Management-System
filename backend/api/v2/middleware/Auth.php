<?php
/**
 * Authentication Middleware
 * Validates JWT tokens and checks user permissions
 */

require_once __DIR__ . '/../config/JWT.php';
require_once __DIR__ . '/../config/Database.php';

class Auth {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    /**
     * Authenticate user from JWT token
     * @return object|null User data if authenticated
     */
    public function authenticate() {
        $token = JWT::getBearerToken();

        if (!$token) {
            return null;
        }

        $decoded = JWT::decode($token);

        if (!$decoded || !isset($decoded->user_id)) {
            return null;
        }

        // Verify user still exists and is active
        $query = "SELECT u.*, r.name as role_name 
                  FROM users u 
                  JOIN roles r ON u.role_id = r.id 
                  WHERE u.id = :user_id AND u.status = 'active'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $decoded->user_id);
        $stmt->execute();

        $user = $stmt->fetch();

        if (!$user) {
            return null;
        }

        // Remove password from user object
        unset($user['password']);

        return (object) $user;
    }

    /**
     * Check if user has required role
     * @param array $allowedRoles
     * @return bool
     */
    public function authorize($allowedRoles = []) {
        $user = $this->authenticate();

        if (!$user) {
            $this->sendUnauthorized("Authentication required");
            return false;
        }

        if (!empty($allowedRoles) && !in_array($user->role_name, $allowedRoles)) {
            $this->sendForbidden("Insufficient permissions");
            return false;
        }

        // Store user in global scope for controllers
        $GLOBALS['current_user'] = $user;

        return true;
    }

    /**
     * Send 401 Unauthorized response
     */
    private function sendUnauthorized($message = "Unauthorized") {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }

    /**
     * Send 403 Forbidden response
     */
    private function sendForbidden($message = "Forbidden") {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }

    /**
     * Get current authenticated user
     * @return object|null
     */
    public static function getCurrentUser() {
        return $GLOBALS['current_user'] ?? null;
    }
}
