<?php
/**
 * Payment Controller
 * Handles payment processing and management
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class PaymentController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    /**
     * Get all payments (filtered by role)
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

        // Build query based on role
        $where = [];
        $params = [];

        if ($user->role_name === 'tourist') {
            $where[] = "p.user_id = :user_id";
            $params[':user_id'] = $user->id;
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM payments p $whereClause";
        $stmt = $this->conn->prepare($countQuery);
        $stmt->execute($params);
        $total = $stmt->fetch()['total'];

        // Get payments
        $query = "SELECT p.*, u.full_name as user_name, u.email as user_email,
                  b.booking_reference, v.application_number
                  FROM payments p
                  JOIN users u ON p.user_id = u.id
                  LEFT JOIN bookings b ON p.booking_id = b.id
                  LEFT JOIN visa_applications v ON p.visa_application_id = v.id
                  $whereClause
                  ORDER BY p.created_at DESC
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $payments = $stmt->fetchAll();

        Response::success([
            'payments' => $payments,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * Process payment
     */
    public function process() {
        $auth = new Auth();
        if (!$auth->authorize()) {
            return;
        }

        $user = Auth::getCurrentUser();
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validator = new Validator();
        $validator->required('amount', $data['amount'] ?? '');
        $validator->numeric('amount', $data['amount'] ?? '');
        $validator->required('payment_method', $data['payment_method'] ?? '');
        $validator->enum('payment_method', $data['payment_method'] ?? '', 
            ['card', 'bank_transfer', 'mobile_money', 'cash']);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $validData = $validator->getData();

        // Validate booking or visa application
        if (empty($data['booking_id']) && empty($data['visa_application_id'])) {
            Response::error("Either booking_id or visa_application_id is required");
        }

        // Generate transaction ID
        $transactionId = $this->generateTransactionId();

        // Insert payment
        $query = "INSERT INTO payments 
                  (transaction_id, booking_id, visa_application_id, user_id, amount, currency, 
                   payment_method, payment_gateway, gateway_reference, status) 
                  VALUES (:txn_id, :booking_id, :visa_id, :user_id, :amount, :currency, 
                          :method, :gateway, :gateway_ref, :status)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':txn_id', $transactionId);
        $stmt->bindValue(':booking_id', $data['booking_id'] ?? null);
        $stmt->bindValue(':visa_id', $data['visa_application_id'] ?? null);
        $stmt->bindParam(':user_id', $user->id);
        $stmt->bindParam(':amount', $validData['amount']);
        $stmt->bindValue(':currency', $data['currency'] ?? 'NGN');
        $stmt->bindParam(':method', $validData['payment_method']);
        $stmt->bindValue(':gateway', $data['payment_gateway'] ?? null);
        $stmt->bindValue(':gateway_ref', $data['gateway_reference'] ?? null);
        $stmt->bindValue(':status', 'pending');

        if ($stmt->execute()) {
            $paymentId = $this->conn->lastInsertId();

            // TODO: Integrate with actual payment gateway (Paystack, etc.)
            // For now, simulate payment success
            
            $payment = $this->getPaymentById($paymentId);
            Response::success($payment, "Payment initiated successfully", 201);
        }

        Response::serverError("Failed to process payment");
    }

    /**
     * Confirm payment (webhook or manual)
     */
    public function confirm($id) {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Get payment
        $payment = $this->getPaymentById($id);
        if (!$payment) {
            Response::notFound("Payment not found");
        }

        // Update payment status
        $query = "UPDATE payments SET status = 'paid', paid_at = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Update related booking status if applicable
        if ($payment['booking_id']) {
            $query = "UPDATE bookings SET status = 'confirmed' WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $payment['booking_id']);
            $stmt->execute();

            // Create notification
            $this->createNotification($payment['user_id'], 'payment', 'Payment Confirmed', 
                "Your payment of {$payment['currency']} {$payment['amount']} has been confirmed", "/payments/{$id}");
        }

        $updatedPayment = $this->getPaymentById($id);
        Response::success($updatedPayment, "Payment confirmed successfully");
    }

    /**
     * Get payment statistics (Admin only)
     */
    public function statistics() {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        // Get total revenue
        $query = "SELECT SUM(amount) as total_revenue FROM payments WHERE status = 'paid'";
        $stmt = $this->conn->query($query);
        $totalRevenue = $stmt->fetch()['total_revenue'] ?? 0;

        // Get revenue by month (last 6 months)
        $query = "SELECT DATE_FORMAT(paid_at, '%Y-%m') as month, SUM(amount) as revenue
                  FROM payments
                  WHERE status = 'paid' AND paid_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                  GROUP BY month
                  ORDER BY month DESC";
        
        $stmt = $this->conn->query($query);
        $monthlyRevenue = $stmt->fetchAll();

        // Get payment counts by status
        $query = "SELECT status, COUNT(*) as count FROM payments GROUP BY status";
        $stmt = $this->conn->query($query);
        $statusCounts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        Response::success([
            'total_revenue' => (float)$totalRevenue,
            'monthly_revenue' => $monthlyRevenue,
            'status_counts' => $statusCounts
        ]);
    }

    /**
     * Get payment by ID
     */
    private function getPaymentById($id) {
        $query = "SELECT p.*, u.full_name as user_name, b.booking_reference, v.application_number
                  FROM payments p
                  JOIN users u ON p.user_id = u.id
                  LEFT JOIN bookings b ON p.booking_id = b.id
                  LEFT JOIN visa_applications v ON p.visa_application_id = v.id
                  WHERE p.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Generate unique transaction ID
     */
    private function generateTransactionId() {
        do {
            $txnId = 'TXN-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -8));
            
            $query = "SELECT COUNT(*) as count FROM payments WHERE transaction_id = :txn_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':txn_id', $txnId);
            $stmt->execute();
            
            $exists = $stmt->fetch()['count'] > 0;
        } while ($exists);

        return $txnId;
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
