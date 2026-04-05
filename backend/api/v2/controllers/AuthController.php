<?php
/**
 * Authentication Controller
 * Handles user registration, login, and password management
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/JWT.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    /**
     * Register new user
     */
    public function register() {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validator = new Validator();
        $validator->required('full_name', $data['full_name'] ?? '');
        $validator->email('email', $data['email'] ?? '');
        $validator->required('mobile', $data['mobile'] ?? '');
        $validator->phone('mobile', $data['mobile'] ?? '');
        $validator->required('password', $data['password'] ?? '');
        $validator->minLength('password', $data['password'] ?? '', 6);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $validData = $validator->getData();

        // Check if email already exists
        $query = "SELECT id FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $validData['email']);
        $stmt->execute();

        if ($stmt->fetch()) {
            Response::error("Email already registered", 409);
        }

        // All new registrations are tourists (role_id = 2)
        $roleId = 2; // Tourist role
        $status = 'active'; // Active by default

        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        // Insert user
        $query = "INSERT INTO users (full_name, email, mobile, password, role_id, status) 
                  VALUES (:full_name, :email, :mobile, :password, :role_id, :status)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':full_name', $validData['full_name']);
        $stmt->bindParam(':email', $validData['email']);
        $stmt->bindParam(':mobile', $validData['mobile']);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':role_id', $roleId);
        $stmt->bindParam(':status', $status);

        if ($stmt->execute()) {
            $userId = $this->conn->lastInsertId();

            // Generate JWT token
            $token = JWT::encode([
                'user_id' => $userId,
                'email' => $validData['email'],
                'role' => 'tourist'
            ]);

            // Get user data
            $user = $this->getUserById($userId);

            Response::success([
                'token' => $token,
                'user' => $user
            ], "Registration successful", 201);
        }

        Response::serverError("Registration failed");
    }

    /**
     * Login user
     */
    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validator = new Validator();
        $validator->required('email', $data['email'] ?? '');
        $validator->email('email', $data['email'] ?? '');
        $validator->required('password', $data['password'] ?? '');

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $validData = $validator->getData();

        // Get user
        $query = "SELECT u.*, r.name as role_name 
                  FROM users u 
                  JOIN roles r ON u.role_id = r.id 
                  WHERE u.email = :email";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $validData['email']);
        $stmt->execute();

        $user = $stmt->fetch();

        if (!$user) {
            Response::error("Invalid credentials", 401);
        }

        // Check if user is active
        if ($user['status'] !== 'active') {
            Response::error("Account is " . $user['status'], 403);
        }

        // Verify password
        if (!password_verify($data['password'], $user['password'])) {
            Response::error("Invalid credentials", 401);
        }

        // Generate JWT token
        $token = JWT::encode([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role_name']
        ]);

        // Remove password from response
        unset($user['password']);

        // Log activity
        $this->logActivity($user['id'], 'login');

        Response::success([
            'token' => $token,
            'user' => $user
        ], "Login successful");
    }

    /**
     * Get current user profile
     */
    public function me() {
        require_once __DIR__ . '/../middleware/Auth.php';
        
        $auth = new Auth();
        if (!$auth->authorize()) {
            return;
        }

        $user = Auth::getCurrentUser();
        Response::success($user, "User profile retrieved");
    }

    /**
     * Request password reset
     */
    public function forgotPassword() {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate email
        $validator = new Validator();
        $validator->required('email', $data['email'] ?? '');
        $validator->email('email', $data['email'] ?? '');

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $validData = $validator->getData();

        // Check if user exists
        $query = "SELECT id, full_name FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $validData['email']);
        $stmt->execute();

        $user = $stmt->fetch();

        if (!$user) {
            // Don't reveal if email exists
            Response::success(null, "If the email exists, a reset link has been sent");
        }

        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

        // Store reset token
        $query = "INSERT INTO password_resets (email, token, expires_at) 
                  VALUES (:email, :token, :expires_at)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $validData['email']);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires_at', $expiresAt);
        $stmt->execute();

        // TODO: Send email with reset link
        // For now, return token in response (remove in production)
        
        Response::success([
            'reset_token' => $token // Remove this in production
        ], "Password reset link sent to email");
    }

    /**
     * Reset password
     */
    public function resetPassword() {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validator = new Validator();
        $validator->required('token', $data['token'] ?? '');
        $validator->required('password', $data['password'] ?? '');
        $validator->minLength('password', $data['password'] ?? '', 6);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        // Verify token
        $query = "SELECT email FROM password_resets 
                  WHERE token = :token AND expires_at > NOW() AND used = 0";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $data['token']);
        $stmt->execute();

        $reset = $stmt->fetch();

        if (!$reset) {
            Response::error("Invalid or expired reset token", 400);
        }

        // Update password
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        
        $query = "UPDATE users SET password = :password WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':email', $reset['email']);
        $stmt->execute();

        // Mark token as used
        $query = "UPDATE password_resets SET used = 1 WHERE token = :token";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $data['token']);
        $stmt->execute();

        Response::success(null, "Password reset successful");
    }

    /**
     * Get user by ID
     */
    private function getUserById($id) {
        $query = "SELECT u.id, u.full_name, u.email, u.mobile, u.status, u.created_at, r.name as role_name 
                  FROM users u 
                  JOIN roles r ON u.role_id = r.id 
                  WHERE u.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Log user activity
     */
    private function logActivity($userId, $action) {
        $query = "INSERT INTO activity_logs (user_id, action, ip_address, user_agent) 
                  VALUES (:user_id, :action, :ip, :user_agent)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':action', $action);
        $stmt->bindValue(':ip', $_SERVER['REMOTE_ADDR'] ?? null);
        $stmt->bindValue(':user_agent', $_SERVER['HTTP_USER_AGENT'] ?? null);
        $stmt->execute();
    }
}
