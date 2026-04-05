<?php
require_once __DIR__ . '/../../../includes/config.php';
require_once __DIR__ . '/../../../includes/logger.php';
require_once __DIR__ . '/../../../includes/validation.php';

class VisaController {
    private $dbh;
    private $logger;

    public function __construct() {
        global $dbh;
        $this->dbh = $dbh;
        $this->logger = new Logger();
    }

    /**
     * Submit a new visa request
     */
    public function submitRequest() {
        try {
            // Check if user is logged in
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Authentication required'
                ]);
                return;
            }

            $userId = $_SESSION['user_id'];

            // Validate required fields
            $requiredFields = ['destinationCountry', 'travelPurpose', 'intendedTravelDate', 'passportNumber'];
            foreach ($requiredFields as $field) {
                if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
                    http_response_code(422);
                    echo json_encode([
                        'success' => false,
                        'message' => ucfirst($field) . ' is required',
                        'errors' => [$field => [ucfirst($field) . ' is required']]
                    ]);
                    return;
                }
            }

            // Sanitize input
            $destinationCountry = trim($_POST['destinationCountry']);
            $travelPurpose = trim($_POST['travelPurpose']);
            $intendedTravelDate = trim($_POST['intendedTravelDate']);
            $passportNumber = trim($_POST['passportNumber']);

            // Validate travel purpose
            $validPurposes = ['tourism', 'business', 'education', 'medical', 'family', 'other'];
            if (!in_array($travelPurpose, $validPurposes)) {
                http_response_code(422);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid travel purpose'
                ]);
                return;
            }

            // Validate travel date (must be in the future)
            $travelDate = new DateTime($intendedTravelDate);
            $today = new DateTime();
            if ($travelDate <= $today) {
                http_response_code(422);
                echo json_encode([
                    'success' => false,
                    'message' => 'Travel date must be in the future'
                ]);
                return;
            }

            // Handle file upload if present
            $documentPath = null;
            if (isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK) {
                $documentPath = $this->handleFileUpload($_FILES['document']);
                if (!$documentPath) {
                    http_response_code(422);
                    echo json_encode([
                        'success' => false,
                        'message' => 'File upload failed'
                    ]);
                    return;
                }
            }

            // Insert visa request
            $sql = "INSERT INTO visa_requests (user_id, destination_country, travel_purpose, intended_travel_date, passport_number, document_path) 
                    VALUES (:user_id, :destination_country, :travel_purpose, :intended_travel_date, :passport_number, :document_path)";
            
            $query = $this->dbh->prepare($sql);
            $query->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $query->bindParam(':destination_country', $destinationCountry, PDO::PARAM_STR);
            $query->bindParam(':travel_purpose', $travelPurpose, PDO::PARAM_STR);
            $query->bindParam(':intended_travel_date', $intendedTravelDate, PDO::PARAM_STR);
            $query->bindParam(':passport_number', $passportNumber, PDO::PARAM_STR);
            $query->bindParam(':document_path', $documentPath, PDO::PARAM_STR);

            if ($query->execute()) {
                $requestId = $this->dbh->lastInsertId();
                
                // Get the created request
                $visaRequest = $this->getVisaRequestById($requestId);
                
                $this->logger->info("Visa request submitted", [
                    'user_id' => $userId,
                    'request_id' => $requestId,
                    'destination' => $destinationCountry
                ]);

                echo json_encode([
                    'success' => true,
                    'message' => 'Visa request submitted successfully',
                    'data' => $visaRequest
                ]);
            } else {
                throw new Exception('Failed to submit visa request');
            }

        } catch (Exception $e) {
            $this->logger->error("Visa request submission failed", [
                'error' => $e->getMessage(),
                'user_id' => $_SESSION['user_id'] ?? null
            ]);

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to submit visa request'
            ]);
        }
    }

    /**
     * Get user's visa requests
     */
    public function getUserRequests() {
        try {
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Authentication required'
                ]);
                return;
            }

            $userId = $_SESSION['user_id'];

            $sql = "SELECT * FROM visa_requests WHERE user_id = :user_id ORDER BY submitted_at DESC";
            $query = $this->dbh->prepare($sql);
            $query->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $query->execute();

            $requests = $query->fetchAll(PDO::FETCH_ASSOC);
            
            // Format the response
            $formattedRequests = array_map([$this, 'formatVisaRequest'], $requests);

            echo json_encode([
                'success' => true,
                'data' => $formattedRequests
            ]);

        } catch (Exception $e) {
            $this->logger->error("Failed to get user visa requests", [
                'error' => $e->getMessage(),
                'user_id' => $_SESSION['user_id'] ?? null
            ]);

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to retrieve visa requests'
            ]);
        }
    }

    /**
     * Get all visa requests (Admin only)
     */
    public function getAllRequests() {
        try {
            // Check admin authentication (simplified for demo)
            if (!isset($_SESSION['user_id']) || !$this->isAdmin($_SESSION['user_id'])) {
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'message' => 'Admin access required'
                ]);
                return;
            }

            $status = $_GET['status'] ?? null;
            $page = (int)($_GET['page'] ?? 1);
            $limit = (int)($_GET['limit'] ?? 20);
            $offset = ($page - 1) * $limit;

            // Build query
            $whereClause = '';
            $params = [];
            
            if ($status && $status !== 'all') {
                $whereClause = 'WHERE vr.status = :status';
                $params[':status'] = $status;
            }

            $sql = "SELECT vr.*, u.FullName as user_full_name, u.EmailId as user_email 
                    FROM visa_requests vr 
                    JOIN tblusers u ON vr.user_id = u.id 
                    $whereClause 
                    ORDER BY vr.submitted_at DESC 
                    LIMIT :limit OFFSET :offset";

            $query = $this->dbh->prepare($sql);
            foreach ($params as $key => $value) {
                $query->bindValue($key, $value);
            }
            $query->bindValue(':limit', $limit, PDO::PARAM_INT);
            $query->bindValue(':offset', $offset, PDO::PARAM_INT);
            $query->execute();

            $requests = $query->fetchAll(PDO::FETCH_ASSOC);

            // Get total count
            $countSql = "SELECT COUNT(*) FROM visa_requests vr $whereClause";
            $countQuery = $this->dbh->prepare($countSql);
            foreach ($params as $key => $value) {
                $countQuery->bindValue($key, $value);
            }
            $countQuery->execute();
            $total = $countQuery->fetchColumn();

            // Format the response
            $formattedRequests = array_map([$this, 'formatVisaRequestAdmin'], $requests);

            echo json_encode([
                'success' => true,
                'data' => $formattedRequests,
                'pagination' => [
                    'total' => (int)$total,
                    'page' => $page,
                    'limit' => $limit,
                    'totalPages' => ceil($total / $limit)
                ]
            ]);

        } catch (Exception $e) {
            $this->logger->error("Failed to get all visa requests", [
                'error' => $e->getMessage(),
                'user_id' => $_SESSION['user_id'] ?? null
            ]);

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to retrieve visa requests'
            ]);
        }
    }

    /**
     * Update visa request status (Admin only)
     */
    public function updateStatus($requestId) {
        try {
            // Check admin authentication
            if (!isset($_SESSION['user_id']) || !$this->isAdmin($_SESSION['user_id'])) {
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'message' => 'Admin access required'
                ]);
                return;
            }

            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['status'])) {
                http_response_code(422);
                echo json_encode([
                    'success' => false,
                    'message' => 'Status is required'
                ]);
                return;
            }

            $status = $input['status'];
            $adminComments = $input['adminComments'] ?? null;

            // Validate status
            $validStatuses = ['submitted', 'under_review', 'approved', 'rejected'];
            if (!in_array($status, $validStatuses)) {
                http_response_code(422);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid status'
                ]);
                return;
            }

            // Update the request
            $sql = "UPDATE visa_requests SET status = :status, admin_comments = :admin_comments, updated_at = NOW() WHERE id = :id";
            $query = $this->dbh->prepare($sql);
            $query->bindParam(':status', $status, PDO::PARAM_STR);
            $query->bindParam(':admin_comments', $adminComments, PDO::PARAM_STR);
            $query->bindParam(':id', $requestId, PDO::PARAM_INT);

            if ($query->execute()) {
                // Get the updated request
                $updatedRequest = $this->getVisaRequestById($requestId, true);
                
                $this->logger->info("Visa request status updated", [
                    'request_id' => $requestId,
                    'status' => $status,
                    'admin_id' => $_SESSION['user_id']
                ]);

                echo json_encode([
                    'success' => true,
                    'message' => 'Visa request status updated successfully',
                    'data' => $updatedRequest
                ]);
            } else {
                throw new Exception('Failed to update visa request status');
            }

        } catch (Exception $e) {
            $this->logger->error("Failed to update visa request status", [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
                'admin_id' => $_SESSION['user_id'] ?? null
            ]);

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update visa request status'
            ]);
        }
    }

    /**
     * Handle file upload
     */
    private function handleFileUpload($file) {
        try {
            // Validate file
            $allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            $maxSize = 5 * 1024 * 1024; // 5MB

            if (!in_array($file['type'], $allowedTypes)) {
                return false;
            }

            if ($file['size'] > $maxSize) {
                return false;
            }

            // Create upload directory if it doesn't exist
            $uploadDir = __DIR__ . '/../../../uploads/visa_documents/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            // Generate unique filename
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid('visa_doc_') . '.' . $extension;
            $filepath = $uploadDir . $filename;

            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                return 'uploads/visa_documents/' . $filename;
            }

            return false;

        } catch (Exception $e) {
            $this->logger->error("File upload failed", ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get visa request by ID
     */
    private function getVisaRequestById($id, $includeUserInfo = false) {
        if ($includeUserInfo) {
            $sql = "SELECT vr.*, u.FullName as user_full_name, u.EmailId as user_email 
                    FROM visa_requests vr 
                    JOIN tblusers u ON vr.user_id = u.id 
                    WHERE vr.id = :id";
        } else {
            $sql = "SELECT * FROM visa_requests WHERE id = :id";
        }

        $query = $this->dbh->prepare($sql);
        $query->bindParam(':id', $id, PDO::PARAM_INT);
        $query->execute();

        $request = $query->fetch(PDO::FETCH_ASSOC);
        
        if ($request) {
            return $includeUserInfo ? $this->formatVisaRequestAdmin($request) : $this->formatVisaRequest($request);
        }

        return null;
    }

    /**
     * Format visa request for user response
     */
    private function formatVisaRequest($request) {
        return [
            'id' => (int)$request['id'],
            'userId' => (int)$request['user_id'],
            'destinationCountry' => $request['destination_country'],
            'travelPurpose' => $request['travel_purpose'],
            'intendedTravelDate' => $request['intended_travel_date'],
            'passportNumber' => $request['passport_number'],
            'documentPath' => $request['document_path'],
            'status' => $request['status'],
            'adminComments' => $request['admin_comments'],
            'submittedAt' => $request['submitted_at'],
            'updatedAt' => $request['updated_at']
        ];
    }

    /**
     * Format visa request for admin response
     */
    private function formatVisaRequestAdmin($request) {
        $formatted = $this->formatVisaRequest($request);
        $formatted['userFullName'] = $request['user_full_name'] ?? null;
        $formatted['userEmail'] = $request['user_email'] ?? null;
        return $formatted;
    }

    /**
     * Check if user is admin (simplified for demo)
     */
    private function isAdmin($userId) {
        // In a real application, you would check user roles/permissions
        // For demo purposes, we'll assume user ID 1 is admin
        return $userId == 1;
    }
}
?>