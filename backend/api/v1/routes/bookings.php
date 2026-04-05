<?php
/**
 * Booking Routes
 */

// User booking routes
$router->get('/bookings', function($params) {
    $email = ApiAuth::requireAuth();
    
    global $dbh;
    
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(20, max(1, intval($_GET['limit']))) : 10;
    $offset = ($page - 1) * $limit;
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM tblbooking WHERE UserEmail = :email";
    $countQuery = $dbh->prepare($countSql);
    $countQuery->bindParam(':email', $email, PDO::PARAM_STR);
    $countQuery->execute();
    $total = $countQuery->fetch(PDO::FETCH_OBJ)->total;
    
    // Get bookings with package details
    $sql = "SELECT b.BookingId, b.PackageId, b.FromDate, b.ToDate, b.Comment, 
                   b.status, b.RegDate, b.UpdationDate, b.CancelledBy,
                   p.PackageName, p.PackageLocation, p.PackagePrice, p.PackageImage
            FROM tblbooking b
            JOIN tbltourpackages p ON b.PackageId = p.PackageId
            WHERE b.UserEmail = :email
            ORDER BY b.RegDate DESC
            LIMIT :limit OFFSET :offset";
    
    $query = $dbh->prepare($sql);
    $query->bindParam(':email', $email, PDO::PARAM_STR);
    $query->bindValue(':limit', $limit, PDO::PARAM_INT);
    $query->bindValue(':offset', $offset, PDO::PARAM_INT);
    $query->execute();
    
    $bookings = [];
    while ($row = $query->fetch(PDO::FETCH_OBJ)) {
        $bookings[] = [
            'id' => (int)$row->BookingId,
            'packageId' => (int)$row->PackageId,
            'packageName' => $row->PackageName,
            'packageLocation' => $row->PackageLocation,
            'packagePrice' => [
                'usd' => (int)$row->PackagePrice,
                'ngn' => Currency::convertUSDToNGN($row->PackagePrice),
                'formatted' => Currency::displayPrice($row->PackagePrice)
            ],
            'packageImage' => $row->PackageImage,
            'fromDate' => $row->FromDate,
            'toDate' => $row->ToDate,
            'comment' => $row->Comment,
            'status' => (int)$row->status,
            'statusText' => $this->getBookingStatus($row->status),
            'bookedAt' => $row->RegDate,
            'updatedAt' => $row->UpdationDate,
            'cancelledBy' => $row->CancelledBy
        ];
    }
    
    ApiResponse::paginated($bookings, $total, $page, $limit, 'Bookings retrieved successfully');
});

$router->post('/bookings', function($params) {
    $email = ApiAuth::requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        ApiResponse::error('Invalid JSON input', 400);
    }
    
    // Validate input
    $validator = new Validator();
    $isValid = $validator->validate($input, [
        'packageId' => ['required', 'numeric'],
        'fromDate' => ['required', 'date'],
        'toDate' => ['required', 'date'],
        'comment' => ['required', 'min:10', 'max:500']
    ]);
    
    if (!$isValid) {
        ApiResponse::validationError($validator->getErrors());
    }
    
    global $dbh;
    
    $packageId = intval($input['packageId']);
    $fromDate = sanitizeInput($input['fromDate']);
    $toDate = sanitizeInput($input['toDate']);
    $comment = sanitizeInput($input['comment']);
    $status = 0; // Pending
    
    // Verify package exists
    $packageSql = "SELECT PackageId FROM tbltourpackages WHERE PackageId = :id";
    $packageQuery = $dbh->prepare($packageSql);
    $packageQuery->bindParam(':id', $packageId, PDO::PARAM_INT);
    $packageQuery->execute();
    
    if ($packageQuery->rowCount() === 0) {
        ApiResponse::error('Package not found', 404);
    }
    
    // Create booking
    $sql = "INSERT INTO tblbooking(PackageId, UserEmail, FromDate, ToDate, Comment, status) 
            VALUES(:packageId, :email, :fromDate, :toDate, :comment, :status)";
    
    $query = $dbh->prepare($sql);
    $query->bindParam(':packageId', $packageId, PDO::PARAM_INT);
    $query->bindParam(':email', $email, PDO::PARAM_STR);
    $query->bindParam(':fromDate', $fromDate, PDO::PARAM_STR);
    $query->bindParam(':toDate', $toDate, PDO::PARAM_STR);
    $query->bindParam(':comment', $comment, PDO::PARAM_STR);
    $query->bindParam(':status', $status, PDO::PARAM_INT);
    
    if ($query->execute()) {
        $bookingId = $dbh->lastInsertId();
        
        Logger::info('New booking created via API', [
            'bookingId' => $bookingId,
            'email' => $email,
            'packageId' => $packageId
        ]);
        
        ApiResponse::success([
            'bookingId' => (int)$bookingId
        ], 'Booking created successfully', 201);
    } else {
        ApiResponse::error('Failed to create booking', 500);
    }
});

$router->get('/bookings/{id}', function($params) {
    $email = ApiAuth::requireAuth();
    $bookingId = intval($params['id'] ?? 0);
    
    if ($bookingId <= 0) {
        ApiResponse::error('Invalid booking ID', 400);
    }
    
    global $dbh;
    
    $sql = "SELECT b.*, p.PackageName, p.PackageLocation, p.PackagePrice, p.PackageImage
            FROM tblbooking b
            JOIN tbltourpackages p ON b.PackageId = p.PackageId
            WHERE b.BookingId = :id AND b.UserEmail = :email";
    
    $query = $dbh->prepare($sql);
    $query->bindParam(':id', $bookingId, PDO::PARAM_INT);
    $query->bindParam(':email', $email, PDO::PARAM_STR);
    $query->execute();
    
    if ($query->rowCount() === 0) {
        ApiResponse::notFound('Booking not found');
    }
    
    $booking = $query->fetch(PDO::FETCH_OBJ);
    
    $response = [
        'id' => (int)$booking->BookingId,
        'packageId' => (int)$booking->PackageId,
        'packageName' => $booking->PackageName,
        'packageLocation' => $booking->PackageLocation,
        'packagePrice' => [
            'usd' => (int)$booking->PackagePrice,
            'ngn' => Currency::convertUSDToNGN($booking->PackagePrice),
            'formatted' => Currency::displayPrice($booking->PackagePrice)
        ],
        'packageImage' => $booking->PackageImage,
        'fromDate' => $booking->FromDate,
        'toDate' => $booking->ToDate,
        'comment' => $booking->Comment,
        'status' => (int)$booking->status,
        'statusText' => getBookingStatus($booking->status),
        'bookedAt' => $booking->RegDate,
        'updatedAt' => $booking->UpdationDate,
        'cancelledBy' => $booking->CancelledBy
    ];
    
    ApiResponse::success($response, 'Booking retrieved successfully');
});

// Helper function for booking status
function getBookingStatus($status) {
    switch ($status) {
        case 0: return 'Pending';
        case 1: return 'Confirmed';
        case 2: return 'Cancelled';
        default: return 'Unknown';
    }
}
?>