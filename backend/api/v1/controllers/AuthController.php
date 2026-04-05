<?php
/**
 * Authentication API Controller
 */

class ApiAuthController {
    private $dbh;
    
    public function __construct() {
        global $dbh;
        $this->dbh = $dbh;
    }
    
    /**
     * User login
     * POST /auth/login
     */
    public function login($params = []) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            ApiResponse::error('Invalid JSON input', 400);
        }
        
        // Validate input
        $validator = new Validator();
        $isValid = $validator->validate($input, [
            'email' => ['required', 'email'],
            'password' => ['required', 'min:6']
        ]);
        
        if (!$isValid) {
            ApiResponse::validationError($validator->getErrors());
        }
        
        $email = sanitizeEmail($input['email']);
        $password = $input['password'];
        
        // Check user credentials
        $sql = "SELECT FullName, MobileNumber, EmailId, Password FROM tblusers WHERE EmailId=:email";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_OBJ);
        
        if ($query->rowCount() > 0) {
            $stored_password = $results[0]->Password;
            if (password_verify($password, $stored_password)) {
                $_SESSION['login'] = $email;
                
                // Get user details
                $user = $this->getUserDetails($email);
                
                Logger::info('User logged in via API', ['email' => $email]);
                
                ApiResponse::success([
                    'user' => $user,
                    'session_id' => session_id()
                ], 'Login successful');
            }
        }
        
        Logger::warning('Failed login attempt via API', ['email' => $email]);
        ApiResponse::error('Invalid credentials', 401);
    }
    
    /**
     * User registration
     * POST /auth/register
     */
    public function register($params = []) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            ApiResponse::error('Invalid JSON input', 400);
        }
        
        // Validate input
        $validator = new Validator();
        $isValid = $validator->validate($input, [
            'fullName' => ['required', 'alpha', 'min:2', 'max:50'],
            'mobileNumber' => ['required', 'phone'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:6', 'max:100']
        ]);
        
        if (!$isValid) {
            ApiResponse::validationError($validator->getErrors());
        }
        
        $fullName = sanitizeInput($input['fullName']);
        $mobileNumber = sanitizePhone($input['mobileNumber']);
        $email = sanitizeEmail($input['email']);
        $password = $input['password'];
        
        // Check if email already exists
        $sql = "SELECT EmailId FROM tblusers WHERE EmailId=:email";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();
        
        if ($query->rowCount() > 0) {
            ApiResponse::error('Email already exists', 400);
        }
        
        // Hash password and insert user
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        $sql = "INSERT INTO tblusers(FullName, MobileNumber, EmailId, Password) VALUES(:fname, :mnumber, :email, :password)";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':fname', $fullName, PDO::PARAM_STR);
        $query->bindParam(':mnumber', $mobileNumber, PDO::PARAM_STR);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
        
        if ($query->execute()) {
            Logger::info('New user registered via API', ['email' => $email]);
            ApiResponse::success(null, 'Registration successful', 201);
        } else {
            ApiResponse::error('Registration failed', 500);
        }
    }
    
    /**
     * User logout
     * POST /auth/logout
     */
    public function logout($params = []) {
        $email = ApiAuth::getCurrentUser();
        
        if ($email) {
            Logger::info('User logged out via API', ['email' => $email]);
        }
        
        // Clear session
        unset($_SESSION['login']);
        session_destroy();
        
        ApiResponse::success(null, 'Logout successful');
    }
    
    /**
     * Get current user
     * GET /auth/me
     */
    public function me($params = []) {
        $email = ApiAuth::requireAuth();
        $user = $this->getUserDetails($email);
        
        ApiResponse::success($user, 'User details retrieved');
    }
    
    /**
     * Admin login
     * POST /auth/admin/login
     */
    public function adminLogin($params = []) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            ApiResponse::error('Invalid JSON input', 400);
        }
        
        // Validate input
        $validator = new Validator();
        $isValid = $validator->validate($input, [
            'username' => ['required'],
            'password' => ['required']
        ]);
        
        if (!$isValid) {
            ApiResponse::validationError($validator->getErrors());
        }
        
        $username = sanitizeInput($input['username']);
        $password = $input['password'];
        
        // Check admin credentials
        $sql = "SELECT UserName, Password FROM admin WHERE UserName=:username";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':username', $username, PDO::PARAM_STR);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_OBJ);
        
        if ($query->rowCount() > 0) {
            $stored_password = $results[0]->Password;
            if (password_verify($password, $stored_password)) {
                $_SESSION['alogin'] = $username;
                
                Logger::info('Admin logged in via API', ['username' => $username]);
                
                ApiResponse::success([
                    'admin' => ['username' => $username],
                    'session_id' => session_id()
                ], 'Admin login successful');
            }
        }
        
        Logger::warning('Failed admin login attempt via API', ['username' => $username]);
        ApiResponse::error('Invalid credentials', 401);
    }
    
    /**
     * Get user details by email
     */
    private function getUserDetails($email) {
        $sql = "SELECT FullName, MobileNumber, EmailId, RegDate FROM tblusers WHERE EmailId=:email";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();
        $result = $query->fetch(PDO::FETCH_OBJ);
        
        if ($result) {
            return [
                'fullName' => $result->FullName,
                'mobileNumber' => $result->MobileNumber,
                'email' => $result->EmailId,
                'registrationDate' => $result->RegDate
            ];
        }
        
        return null;
    }
}
?>