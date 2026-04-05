<?php
/**
 * User Routes
 */

// Get user profile
$router->get('/users/profile', function($params) {
    $email = ApiAuth::requireAuth();
    
    global $dbh;
    
    $sql = "SELECT FullName, MobileNumber, EmailId, RegDate FROM tblusers WHERE EmailId = :email";
    $query = $dbh->prepare($sql);
    $query->bindParam(':email', $email, PDO::PARAM_STR);
    $query->execute();
    
    if ($query->rowCount() === 0) {
        ApiResponse::notFound('User not found');
    }
    
    $user = $query->fetch(PDO::FETCH_OBJ);
    
    $response = [
        'fullName' => $user->FullName,
        'mobileNumber' => $user->MobileNumber,
        'email' => $user->EmailId,
        'registrationDate' => $user->RegDate
    ];
    
    ApiResponse::success($response, 'User profile retrieved successfully');
});

// Update user profile
$router->put('/users/profile', function($params) {
    $email = ApiAuth::requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        ApiResponse::error('Invalid JSON input', 400);
    }
    
    // Validate input
    $validator = new Validator();
    $isValid = $validator->validate($input, [
        'fullName' => ['required', 'alpha', 'min:2', 'max:50'],
        'mobileNumber' => ['required', 'phone']
    ]);
    
    if (!$isValid) {
        ApiResponse::validationError($validator->getErrors());
    }
    
    global $dbh;
    
    $fullName = sanitizeInput($input['fullName']);
    $mobileNumber = sanitizePhone($input['mobileNumber']);
    
    $sql = "UPDATE tblusers SET FullName = :fullName, MobileNumber = :mobileNumber WHERE EmailId = :email";
    $query = $dbh->prepare($sql);
    $query->bindParam(':fullName', $fullName, PDO::PARAM_STR);
    $query->bindParam(':mobileNumber', $mobileNumber, PDO::PARAM_STR);
    $query->bindParam(':email', $email, PDO::PARAM_STR);
    
    if ($query->execute()) {
        Logger::info('User profile updated via API', ['email' => $email]);
        ApiResponse::success(null, 'Profile updated successfully');
    } else {
        ApiResponse::error('Failed to update profile', 500);
    }
});

// Change password
$router->put('/users/password', function($params) {
    $email = ApiAuth::requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        ApiResponse::error('Invalid JSON input', 400);
    }
    
    // Validate input
    $validator = new Validator();
    $isValid = $validator->validate($input, [
        'currentPassword' => ['required'],
        'newPassword' => ['required', 'min:6', 'max:100']
    ]);
    
    if (!$isValid) {
        ApiResponse::validationError($validator->getErrors());
    }
    
    global $dbh;
    
    $currentPassword = $input['currentPassword'];
    $newPassword = $input['newPassword'];
    
    // Get current password hash
    $sql = "SELECT Password FROM tblusers WHERE EmailId = :email";
    $query = $dbh->prepare($sql);
    $query->bindParam(':email', $email, PDO::PARAM_STR);
    $query->execute();
    
    if ($query->rowCount() === 0) {
        ApiResponse::notFound('User not found');
    }
    
    $user = $query->fetch(PDO::FETCH_OBJ);
    
    // Verify current password
    if (!password_verify($currentPassword, $user->Password)) {
        ApiResponse::error('Current password is incorrect', 400);
    }
    
    // Update password
    $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    $updateSql = "UPDATE tblusers SET Password = :password WHERE EmailId = :email";
    $updateQuery = $dbh->prepare($updateSql);
    $updateQuery->bindParam(':password', $hashedNewPassword, PDO::PARAM_STR);
    $updateQuery->bindParam(':email', $email, PDO::PARAM_STR);
    
    if ($updateQuery->execute()) {
        Logger::info('User password changed via API', ['email' => $email]);
        ApiResponse::success(null, 'Password updated successfully');
    } else {
        ApiResponse::error('Failed to update password', 500);
    }
});
?>