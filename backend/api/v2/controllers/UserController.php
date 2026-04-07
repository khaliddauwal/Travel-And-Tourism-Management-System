<?php
/**
 * User Management Controller
 * Handles user CRUD operations (Admin only)
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class UserController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    /**
     * Get all users (Admin only)
     */
    public function index() {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        $role = $_GET['role'] ?? null;
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;

        // Build query
        $where = [];
        $params = [];

        if ($role) {
            $where[] = "r.name = :role";
            $params[':role'] = $role;
        }

        if ($status) {
            $where[] = "u.status = :status";
            $params[':status'] = $status;
        }

        if ($search) {
            $where[] = "(u.full_name LIKE :search OR u.email LIKE :search)";
            $params[':search'] = "%$search%";
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        // Get total count
        $countQuery = "SELECT COUNT(*) as total 
                       FROM users u 
                       JOIN roles r ON u.role_id = r.id 
                       $whereClause";
        
        $stmt = $this->conn->prepare($countQuery);
        $stmt->execute($params);
        $total = $stmt->fetch()['total'];

        // Get users
        $query = "SELECT u.id, u.full_name, u.email, u.mobile, u.status, u.email_verified, 
                  u.created_at, u.updated_at, r.name as role_name
                  FROM users u
                  JOIN roles r ON u.role_id = r.id
                  $whereClause
                  ORDER BY u.created_at DESC
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $users = $stmt->fetchAll();

        Response::success([
            'users' => $users,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * Get single user
     */
    public function show($id) {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $query = "SELECT u.id, u.full_name, u.email, u.mobile, u.status, u.email_verified, 
                  u.created_at, u.updated_at, r.name as role_name
                  FROM users u
                  JOIN roles r ON u.role_id = r.id
                  WHERE u.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $user = $stmt->fetch();

        if (!$user) {
            Response::notFound("User not found");
        }

        Response::success($user);
    }

    /**
     * Create new user (Admin only)
     */
    public function create() {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

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

        // Resolve role: accept either role name (string) or role_id (int)
        $roleId = null;
        if (!empty($data['role_id']) && is_numeric($data['role_id'])) {
            $roleId = (int)$data['role_id'];
        } elseif (!empty($data['role'])) {
            $roleName = $data['role'] === 'admin' ? 'administrator' : $data['role'];
            $rs = $this->conn->prepare("SELECT id FROM roles WHERE name = :name LIMIT 1");
            $rs->bindValue(':name', $roleName);
            $rs->execute();
            $roleRow = $rs->fetch();
            if (!$roleRow) {
                Response::error("Invalid role: " . $data['role'], 400);
            }
            $roleId = (int)$roleRow['id'];
        } else {
            // Default to tourist
            $rs = $this->conn->prepare("SELECT id FROM roles WHERE name = 'tourist' LIMIT 1");
            $rs->execute();
            $roleId = (int)($rs->fetch()['id'] ?? 2);
        }

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
        $stmt->bindValue(':role_id', $roleId, PDO::PARAM_INT);
        $stmt->bindValue(':status', $data['status'] ?? 'active');

        if ($stmt->execute()) {
            $userId = $this->conn->lastInsertId();
            $user = $this->getUserById($userId);

            Response::success($user, "User created successfully", 201);
        }

        Response::serverError("Failed to create user");
    }

    /**
     * Update user
     */
    public function update($id) {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $currentUser = Auth::getCurrentUser();
        $data = json_decode(file_get_contents("php://input"), true);

        // Check if user exists
        $user = $this->getUserById($id);
        if (!$user) {
            Response::notFound("User not found");
        }

        // Prevent admin from demoting themselves
        if ($id == $currentUser->id && isset($data['role_id']) && $data['role_id'] != $user['role_id']) {
            Response::error("You cannot change your own role");
        }

        // Build update query dynamically
        $updates = [];
        $params = [':id' => $id];

        if (isset($data['full_name'])) {
            $updates[] = "full_name = :full_name";
            $params[':full_name'] = $data['full_name'];
        }

        if (isset($data['email'])) {
            // Check if email is already taken by another user
            $query = "SELECT id FROM users WHERE email = :email AND id != :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->fetch()) {
                Response::error("Email already in use", 409);
            }

            $updates[] = "email = :email";
            $params[':email'] = $data['email'];
        }

        if (isset($data['mobile'])) {
            $updates[] = "mobile = :mobile";
            $params[':mobile'] = $data['mobile'];
        }

        if (isset($data['role_id'])) {
            $updates[] = "role_id = :role_id";
            $params[':role_id'] = $data['role_id'];
        }

        if (isset($data['status'])) {
            $updates[] = "status = :status";
            $params[':status'] = $data['status'];
        }

        if (isset($data['password'])) {
            $updates[] = "password = :password";
            $params[':password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        if (empty($updates)) {
            Response::error("No fields to update");
        }

        $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        $updatedUser = $this->getUserById($id);
        Response::success($updatedUser, "User updated successfully");
    }

    /**
     * Delete user
     */
    public function delete($id) {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $currentUser = Auth::getCurrentUser();

        // Prevent admin from deleting themselves
        if ($id == $currentUser->id) {
            Response::error("You cannot delete your own account");
        }

        // Check if user has active bookings
        $query = "SELECT COUNT(*) as count FROM bookings 
                  WHERE user_id = :id AND status IN ('pending', 'confirmed')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->fetch()['count'] > 0) {
            Response::error("Cannot delete user with active bookings");
        }

        // Delete user
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            Response::success(null, "User deleted successfully");
        }

        Response::serverError("Failed to delete user");
    }

    /**
     * Get user by ID
     */
    private function getUserById($id) {
        $query = "SELECT u.id, u.full_name, u.email, u.mobile, u.status, u.email_verified, 
                  u.created_at, u.updated_at, r.name as role_name, u.role_id
                  FROM users u
                  JOIN roles r ON u.role_id = r.id
                  WHERE u.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }
}
