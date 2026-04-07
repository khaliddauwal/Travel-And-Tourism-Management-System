<?php
/**
 * Review Controller
 * Handles package reviews and ratings
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class ReviewController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    /**
     * Get recent approved reviews (public, no auth required)
     * Used on the public homepage
     */
    public function recent() {
        $limit = min((int)($_GET['limit'] ?? 6), 20);

        $query = "SELECT r.rating, r.comment, r.created_at,
                         u.full_name as user_name
                  FROM reviews r
                  JOIN users u ON r.user_id = u.id
                  WHERE r.status = 'approved'
                    AND r.comment IS NOT NULL
                    AND r.comment != ''
                  ORDER BY r.created_at DESC
                  LIMIT :limit";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();

        $reviews = $stmt->fetchAll();

        Response::success($reviews, "Recent reviews retrieved");
    }

    /**
     * Get reviews for a package
     */
    public function index() {
        $packageId = $_GET['package_id'] ?? null;
        $status = $_GET['status'] ?? 'approved';

        if (!$packageId) {
            Response::error("package_id is required");
        }

        $query = "SELECT r.*, u.full_name as user_name
                  FROM reviews r
                  JOIN users u ON r.user_id = u.id
                  WHERE r.package_id = :package_id AND r.status = :status
                  ORDER BY r.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':package_id', $packageId);
        $stmt->bindParam(':status', $status);
        $stmt->execute();

        $reviews = $stmt->fetchAll();

        // Get average rating
        $query = "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
                  FROM reviews
                  WHERE package_id = :package_id AND status = 'approved'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':package_id', $packageId);
        $stmt->execute();
        $stats = $stmt->fetch();

        Response::success([
            'reviews' => $reviews,
            'average_rating' => round($stats['avg_rating'], 1),
            'total_reviews' => (int)$stats['total_reviews']
        ]);
    }

    /**
     * Submit review
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
        $validator->required('booking_id', $data['booking_id'] ?? '');
        $validator->integer('booking_id', $data['booking_id'] ?? '');
        $validator->required('rating', $data['rating'] ?? '');
        $validator->integer('rating', $data['rating'] ?? '');
        $validator->min('rating', $data['rating'] ?? 0, 1);
        $validator->max('rating', $data['rating'] ?? 0, 5);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $validData = $validator->getData();

        // Verify booking belongs to user and is completed
        $query = "SELECT * FROM bookings 
                  WHERE id = :booking_id AND user_id = :user_id AND package_id = :package_id AND status = 'completed'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':booking_id', $validData['booking_id']);
        $stmt->bindParam(':user_id', $user->id);
        $stmt->bindParam(':package_id', $validData['package_id']);
        $stmt->execute();

        if (!$stmt->fetch()) {
            Response::error("Invalid booking or booking not completed");
        }

        // Check if review already exists for this booking
        $query = "SELECT id FROM reviews WHERE booking_id = :booking_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':booking_id', $validData['booking_id']);
        $stmt->execute();

        if ($stmt->fetch()) {
            Response::error("Review already submitted for this booking", 409);
        }

        // Insert review
        $query = "INSERT INTO reviews (package_id, user_id, booking_id, rating, comment, status) 
                  VALUES (:package_id, :user_id, :booking_id, :rating, :comment, 'pending')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':package_id', $validData['package_id']);
        $stmt->bindParam(':user_id', $user->id);
        $stmt->bindParam(':booking_id', $validData['booking_id']);
        $stmt->bindParam(':rating', $validData['rating']);
        $stmt->bindValue(':comment', $data['comment'] ?? null);

        if ($stmt->execute()) {
            $reviewId = $this->conn->lastInsertId();
            $review = $this->getReviewById($reviewId);

            Response::success($review, "Review submitted successfully", 201);
        }

        Response::serverError("Failed to submit review");
    }

    /**
     * Update review status (Admin only)
     */
    public function updateStatus($id) {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $user = Auth::getCurrentUser();
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validator = new Validator();
        $validator->required('status', $data['status'] ?? '');
        $validator->enum('status', $data['status'] ?? '', ['pending', 'approved', 'rejected']);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        // Update review
        $query = "UPDATE reviews 
                  SET status = :status, moderated_by = :moderated_by, moderated_at = NOW() 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':moderated_by', $user->id);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $review = $this->getReviewById($id);
        Response::success($review, "Review status updated successfully");
    }

    /**
     * Delete review (Admin only)
     */
    public function delete($id) {
        $auth = new Auth();
        if (!$auth->authorize(['administrator'])) {
            return;
        }

        $query = "DELETE FROM reviews WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            Response::success(null, "Review deleted successfully");
        }

        Response::serverError("Failed to delete review");
    }

    /**
     * Get review by ID
     */
    private function getReviewById($id) {
        $query = "SELECT r.*, u.full_name as user_name
                  FROM reviews r
                  JOIN users u ON r.user_id = u.id
                  WHERE r.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }
}
