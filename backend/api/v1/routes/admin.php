<?php
/**
 * Admin Routes
 */

// Get dashboard stats
$router->get('/admin/dashboard', function($params) {
    ApiAuth::requireAdmin();
    
    global $dbh;
    
    // Get statistics
    $stats = [];
    
    // Total packages
    $sql = "SELECT COUNT(*) as count FROM tbltourpackages";
    $query = $dbh->prepare($sql);
    $query->execute();
    $stats['totalPackages'] = $query->fetch(PDO::FETCH_OBJ)->count;
    
    // Total users
    $sql = "SELECT COUNT(*) as count FROM tblusers";
    $query = $dbh->prepare($sql);
    $query->execute();
    $stats['totalUsers'] = $query->fetch(PDO::FETCH_OBJ)->count;
    
    // Total bookings
    $sql = "SELECT COUNT(*) as count FROM tblbooking";
    $query = $dbh->prepare($sql);
    $query->execute();
    $stats['totalBookings'] = $query->fetch(PDO::FETCH_OBJ)->count;
    
    // Pending bookings
    $sql = "SELECT COUNT(*) as count FROM tblbooking WHERE status = 0";
    $query = $dbh->prepare($sql);
    $query->execute();
    $stats['pendingBookings'] = $query->fetch(PDO::FETCH_OBJ)->count;
    
    // Recent bookings
    $sql = "SELECT b.BookingId, b.FromDate, b.ToDate, b.status, b.RegDate,
                   u.FullName, u.EmailId, p.PackageName
            FROM tblbooking b
            JOIN tblusers u ON b.UserEmail = u.EmailId
            JOIN tbltourpackages p ON b.PackageId = p.PackageId
            ORDER BY b.RegDate DESC
            LIMIT 10";
    
    $query = $dbh->prepare($sql);
    $query->execute();
    
    $recentBookings = [];
    while ($row = $query->fetch(PDO::FETCH_OBJ)) {
        $recentBookings[] = [
            'id' => (int)$row->BookingId,
            'customerName' => $row->FullName,
            'customerEmail' => $row->EmailId,
            'packageName' => $row->PackageName,
            'fromDate' => $row->FromDate,
            'toDate' => $row->ToDate,
            'status' => (int)$row->status,
            'statusText' => getBookingStatus($row->status),
            'bookedAt' => $row->RegDate
        ];
    }
    
    $response = [
        'statistics' => $stats,
        'recentBookings' => $recentBookings
    ];
    
    ApiResponse::success($response, 'Dashboard data retrieved successfully');
});

// Get all bookings for admin
$router->get('/admin/bookings', function($params) {
    ApiAuth::requireAdmin();
    
    global $dbh;
    
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 20;
    $status = isset($_GET['status']) ? intval($_GET['status']) : null;
    
    $offset = ($page - 1) * $limit;
    
    // Build query
    $whereClause = "WHERE 1=1";
    $params = [];
    
    if ($status !== null) {
        $whereClause .= " AND b.status = :status";
        $params[':status'] = $status;
    }
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM tblbooking b $whereClause";
    $countQuery = $dbh->prepare($countSql);
    foreach ($params as $key => $value) {
        $countQuery->bindValue($key, $value);
    }
    $countQuery->execute();
    $total = $countQuery->fetch(PDO::FETCH_OBJ)->total;
    
    // Get bookings
    $sql = "SELECT b.*, u.FullName, u.EmailId, u.MobileNumber, 
                   p.PackageName, p.PackageLocation, p.PackagePrice
            FROM tblbooking b
            JOIN tblusers u ON b.UserEmail = u.EmailId
            JOIN tbltourpackages p ON b.PackageId = p.PackageId
            $whereClause
            ORDER BY b.RegDate DESC
            LIMIT :limit OFFSET :offset";
    
    $query = $dbh->prepare($sql);
    foreach ($params as $key => $value) {
        $query->bindValue($key, $value);
    }
    $query->bindValue(':limit', $limit, PDO::PARAM_INT);
    $query->bindValue(':offset', $offset, PDO::PARAM_INT);
    $query->execute();
    
    $bookings = [];
    while ($row = $query->fetch(PDO::FETCH_OBJ)) {
        $bookings[] = [
            'id' => (int)$row->BookingId,
            'customer' => [
                'name' => $row->FullName,
                'email' => $row->EmailId,
                'mobile' => $row->MobileNumber
            ],
            'package' => [
                'id' => (int)$row->PackageId,
                'name' => $row->PackageName,
                'location' => $row->PackageLocation,
                'price' => [
                    'usd' => (int)$row->PackagePrice,
                    'ngn' => Currency::convertUSDToNGN($row->PackagePrice),
                    'formatted' => Currency::displayPrice($row->PackagePrice)
                ]
            ],
            'fromDate' => $row->FromDate,
            'toDate' => $row->ToDate,
            'comment' => $row->Comment,
            'status' => (int)$row->status,
            'statusText' => getBookingStatus($row->status),
            'bookedAt' => $row->RegDate,
            'updatedAt' => $row->UpdationDate,
            'cancelledBy' => $row->CancelledBy
        ];
    }
    
    ApiResponse::paginated($bookings, $total, $page, $limit, 'Bookings retrieved successfully');
});

// Update booking status
$router->put('/admin/bookings/{id}/status', function($params) {
    ApiAuth::requireAdmin();
    
    $bookingId = intval($params['id'] ?? 0);
    
    if ($bookingId <= 0) {
        ApiResponse::error('Invalid booking ID', 400);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['status'])) {
        ApiResponse::error('Status is required', 400);
    }
    
    $status = intval($input['status']);
    $remark = isset($input['remark']) ? sanitizeInput($input['remark']) : '';
    
    if (!in_array($status, [0, 1, 2])) {
        ApiResponse::error('Invalid status value', 400);
    }
    
    global $dbh;
    
    // Check if booking exists
    $checkSql = "SELECT BookingId FROM tblbooking WHERE BookingId = :id";
    $checkQuery = $dbh->prepare($checkSql);
    $checkQuery->bindParam(':id', $bookingId, PDO::PARAM_INT);
    $checkQuery->execute();
    
    if ($checkQuery->rowCount() === 0) {
        ApiResponse::notFound('Booking not found');
    }
    
    // Update booking status
    $sql = "UPDATE tblbooking SET status = :status, UpdationDate = NOW() WHERE BookingId = :id";
    $query = $dbh->prepare($sql);
    $query->bindParam(':status', $status, PDO::PARAM_INT);
    $query->bindParam(':id', $bookingId, PDO::PARAM_INT);
    
    if ($query->execute()) {
        $admin = ApiAuth::getCurrentAdmin();
        Logger::info('Booking status updated by admin', [
            'bookingId' => $bookingId,
            'status' => $status,
            'admin' => $admin
        ]);
        
        ApiResponse::success(null, 'Booking status updated successfully');
    } else {
        ApiResponse::error('Failed to update booking status', 500);
    }
});
?>