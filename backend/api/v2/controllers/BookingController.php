<?php
/**
 * Booking Controller
 * Handles booking CRUD operations
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class BookingController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    /**
     * Get all bookings (filtered by role)
     */
    public function index() {
        $auth = new Auth();
        if (!$auth->authorize()) {
            return;
        }

        $user = Auth::getCurrentUser();
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;

        // Build query based on role
        $where = [];
        $params = [];

        if ($user->role_name === 'tourist') {
            $where[] = "b.user_id = :user_id";
            $params[':user_id'] = $user->id;
        }

        if ($status) {
            $where[] = "b.status = :status";
            $params[':status'] = $status;
        }

        if ($search) {
            $where[] = "(b.booking_reference LIKE :search OR p.name LIKE :search OR u.full_name LIKE :search)";
            $params[':search'] = "%$search%";
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        // Get total count
        $countQuery = "SELECT COUNT(*) as total 
                       FROM bookings b
                       JOIN travel_packages p ON b.package_id = p.id
                       JOIN users u ON b.user_id = u.id
                       $whereClause";
        
        $stmt = $this->conn->prepare($countQuery);
        $stmt->execute($params);
        $total = $stmt->fetch()['total'];

        // Get bookings
        $query = "SELECT b.*, p.name as package_name, p.destination, p.image as package_image,
                  u.full_name as user_name, u.email as user_email, u.mobile as user_mobile
                  FROM bookings b
                  JOIN travel_packages p ON b.package_id = p.id
                  JOIN users u ON b.user_id = u.id
                  $whereClause
                  ORDER BY b.created_at DESC
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $bookings = $stmt->fetchAll();

        Response::success([
            'bookings' => $bookings,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * Get single booking
     */
    public function show($id) {
        $auth = new Auth();
        if (!$auth->authorize()) {
            return;
        }

        $user = Auth::getCurrentUser();

        $query = "SELECT b.*, p.name as package_name, p.destination, p.duration, p.image as package_image,
                  u.full_name as user_name, u.email as user_email, u.mobile as user_mobile,
                  pay.transaction_id, pay.amount as payment_amount, pay.status as payment_status
                  FROM bookings b
                  JOIN travel_packages p ON b.package_id = p.id
                  JOIN users u ON b.user_id = u.id
                  LEFT JOIN payments pay ON b.id = pay.booking_id
                  WHERE b.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $booking = $stmt->fetch();

        if (!$booking) {
            Response::notFound("Booking not found");
        }

        // Check permission
        if ($user->role_name === 'tourist' && $booking['user_id'] != $user->id) {
            Response::forbidden("Access denied");
        }

        Response::success($booking);
    }

    /**
     * Create new booking
     */
    public function create() {
        $auth = new Auth();
        if (!$auth->authorize()) {
            return;
        }

        $user = Auth::getCurrentUser();
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validator = new Validator();
        $validator->required('package_id', $data['package_id'] ?? '');
        $validator->integer('package_id', $data['package_id'] ?? '');
        $validator->required('travel_date', $data['travel_date'] ?? '');
        $validator->date('travel_date', $data['travel_date'] ?? '');
        $validator->required('participants', $data['participants'] ?? '');
        $validator->integer('participants', $data['participants'] ?? '');
        $validator->min('participants', $data['participants'] ?? 0, 1);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $validData = $validator->getData();

        // Validate travel date (minimum 7 days in advance)
        $travelDate = new DateTime($validData['travel_date']);
        $minDate = new DateTime('+7 days');
        
        if ($travelDate < $minDate) {
            Response::error("Travel date must be at least 7 days in advance");
        }

        // Get package details
        $query = "SELECT * FROM travel_packages WHERE id = :id AND status = 'published'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $validData['package_id']);
        $stmt->execute();

        $package = $stmt->fetch();

        if (!$package) {
            Response::notFound("Package not found or not available");
        }

        // Calculate total amount
        $totalAmount = $package['price'] * $validData['participants'];

        // Generate unique booking reference
        $bookingReference = $this->generateBookingReference();

        // Insert booking
        $query = "INSERT INTO bookings 
                  (booking_reference, user_id, package_id, travel_date, participants, total_amount, emergency_contact, special_requests, status) 
                  VALUES (:ref, :user_id, :package_id, :travel_date, :participants, :total_amount, :emergency_contact, :special_requests, 'pending')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':ref', $bookingReference);
        $stmt->bindParam(':user_id', $user->id);
        $stmt->bindParam(':package_id', $validData['package_id']);
        $stmt->bindParam(':travel_date', $validData['travel_date']);
        $stmt->bindParam(':participants', $validData['participants']);
        $stmt->bindParam(':total_amount', $totalAmount);
        $stmt->bindValue(':emergency_contact', $data['emergency_contact'] ?? null);
        $stmt->bindValue(':special_requests', $data['special_requests'] ?? null);

        if ($stmt->execute()) {
            $bookingId = $this->conn->lastInsertId();

            // Create notification
            $this->createNotification($user->id, 'booking', 'Booking Created', 
                "Your booking {$bookingReference} has been created successfully", "/bookings/{$bookingId}");

            $booking = $this->getBookingById($bookingId);
            Response::success($booking, "Booking created successfully", 201);
        }

        Response::serverError("Failed to create booking");
    }

    /**
     * Update booking status (Admin only)
     */
    public function updateStatus($id) {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validator = new Validator();
        $validator->required('status', $data['status'] ?? '');
        $validator->enum('status', $data['status'] ?? '', ['pending', 'confirmed', 'cancelled', 'completed']);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        // Get booking
        $booking = $this->getBookingById($id);
        if (!$booking) {
            Response::notFound("Booking not found");
        }

        // Update status
        $query = "UPDATE bookings SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Create notification
        $this->createNotification($booking['user_id'], 'booking', 'Booking Status Updated', 
            "Your booking {$booking['booking_reference']} status has been updated to {$data['status']}", "/bookings/{$id}");

        $updatedBooking = $this->getBookingById($id);
        Response::success($updatedBooking, "Booking status updated successfully");
    }

    /**
     * Cancel booking
     */
    public function cancel($id) {
        $auth = new Auth();
        if (!$auth->authorize()) {
            return;
        }

        $user = Auth::getCurrentUser();
        $data = json_decode(file_get_contents("php://input"), true);

        // Get booking
        $booking = $this->getBookingById($id);
        if (!$booking) {
            Response::notFound("Booking not found");
        }

        // Check permission
        if ($user->role_name === 'tourist' && $booking['user_id'] != $user->id) {
            Response::forbidden("Access denied");
        }

        // Check if booking can be cancelled
        if ($booking['status'] !== 'pending' && $booking['status'] !== 'confirmed') {
            Response::error("Booking cannot be cancelled");
        }

        // Update booking
        $cancelledBy = $user->role_name === 'tourist' ? 'user' : 'admin';
        
        $query = "UPDATE bookings 
                  SET status = 'cancelled', cancelled_by = :cancelled_by, cancellation_reason = :reason 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cancelled_by', $cancelledBy);
        $stmt->bindValue(':reason', $data['reason'] ?? null);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Create notification
        $this->createNotification($booking['user_id'], 'booking', 'Booking Cancelled', 
            "Your booking {$booking['booking_reference']} has been cancelled", "/bookings/{$id}");

        Response::success(null, "Booking cancelled successfully");
    }

    /**
     * Get booking statistics (Admin only)
     */
    public function statistics() {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $user = Auth::getCurrentUser();

        // Get booking counts by status
        $query = "SELECT status, COUNT(*) as count 
                  FROM bookings 
                  GROUP BY status";
        
        $stmt = $this->conn->query($query);
        $statusCounts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        // Get total revenue
        $query = "SELECT SUM(total_amount) as total_revenue 
                  FROM bookings 
                  WHERE status IN ('confirmed', 'completed')";
        
        $stmt = $this->conn->query($query);
        $totalRevenue = $stmt->fetch()['total_revenue'] ?? 0;

        // Get recent bookings
        $query = "SELECT b.*, p.name as package_name, u.full_name as user_name
                  FROM bookings b
                  JOIN travel_packages p ON b.package_id = p.id
                  JOIN users u ON b.user_id = u.id
                  ORDER BY b.created_at DESC
                  LIMIT 5";
        
        $stmt = $this->conn->query($query);
        $recentBookings = $stmt->fetchAll();

        Response::success([
            'status_counts' => $statusCounts,
            'total_revenue' => (float)$totalRevenue,
            'recent_bookings' => $recentBookings
        ]);
    }

    /**
     * Get booking by ID
     */
    private function getBookingById($id) {
        $query = "SELECT b.*, p.name as package_name, p.price as package_price
                  FROM bookings b
                  JOIN travel_packages p ON b.package_id = p.id
                  WHERE b.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Generate unique booking reference
     */
    private function generateBookingReference() {
        do {
            $reference = 'TMS-' . strtoupper(substr(uniqid(), -8));
            
            $query = "SELECT COUNT(*) as count FROM bookings WHERE booking_reference = :ref";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':ref', $reference);
            $stmt->execute();
            
            $exists = $stmt->fetch()['count'] > 0;
        } while ($exists);

        return $reference;
    }

    /**
     * Create notification
     */
    private function createNotification($userId, $type, $title, $message, $link = null) {
        $query = "INSERT INTO notifications (user_id, type, title, message, link) 
                  VALUES (:user_id, :type, :title, :message, :link)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':message', $message);
        $stmt->bindValue(':link', $link);
        $stmt->execute();
    }
}
