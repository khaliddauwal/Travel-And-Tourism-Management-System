<?php
/**
 * Secure Session Management
 */

function startSecureSession() {
    // Set secure session parameters
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_secure', 0); // Set to 1 for HTTPS
    ini_set('session.cookie_samesite', 'Strict');
    
    // Set session timeout (30 minutes)
    ini_set('session.gc_maxlifetime', 1800);
    
    session_start();
    
    // Regenerate session ID periodically
    if (!isset($_SESSION['created'])) {
        $_SESSION['created'] = time();
    } else if (time() - $_SESSION['created'] > 1800) {
        // Session expired
        session_regenerate_id(true);
        $_SESSION['created'] = time();
    }
    
    // Check for session hijacking
    if (!isset($_SESSION['user_agent'])) {
        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
    } else if ($_SESSION['user_agent'] !== ($_SERVER['HTTP_USER_AGENT'] ?? '')) {
        // Possible session hijacking
        session_destroy();
        header('Location: index.php');
        exit();
    }
}

function isLoggedIn() {
    return isset($_SESSION['login']) && !empty($_SESSION['login']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: index.php');
        exit();
    }
}

function isAdminLoggedIn() {
    return isset($_SESSION['alogin']) && !empty($_SESSION['alogin']);
}

function requireAdminLogin() {
    if (!isAdminLoggedIn()) {
        header('Location: index.php');
        exit();
    }
}

function secureLogout() {
    session_start();
    $_SESSION = array();
    
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
}
?>