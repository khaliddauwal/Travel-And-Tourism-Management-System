<?php

require_once 'src/models/User.php';

class AuthController {
    private $userModel;
    
    public function __construct($database) {
        $this->userModel = new User($database);
    }
    
    public function login($email, $password) {
        if($this->userModel->authenticate($email, $password)) {
            $_SESSION['login'] = $email;
            return true;
        }
        return false;
    }
    
    public function register($fullName, $mobileNumber, $email, $password) {
        // Check if email already exists
        if($this->userModel->emailExists($email)) {
            return ['success' => false, 'message' => 'Email already exists'];
        }
        
        if($this->userModel->create($fullName, $mobileNumber, $email, $password)) {
            return ['success' => true, 'message' => 'Registration successful'];
        }
        
        return ['success' => false, 'message' => 'Registration failed'];
    }
    
    public function forgotPassword($email, $mobile, $newPassword) {
        // Verify email and mobile combination
        $user = $this->userModel->findByEmail($email);
        if($user && $user->MobileNumber === $mobile) {
            if($this->userModel->updatePassword($email, $mobile, $newPassword)) {
                return ['success' => true, 'message' => 'Password updated successfully'];
            }
        }
        
        return ['success' => false, 'message' => 'Invalid email or mobile number'];
    }
    
    public function logout() {
        secureLogout();
    }
}
?>