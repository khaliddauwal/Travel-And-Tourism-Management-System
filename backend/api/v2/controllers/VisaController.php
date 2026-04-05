<?php
require_once __DIR__ . "/../config/Database.php";
require_once __DIR__ . "/../middleware/Auth.php";
require_once __DIR__ . "/../utils/Response.php";
require_once __DIR__ . "/../utils/Validator.php";
require_once __DIR__ . "/../utils/FileUpload.php";

class VisaController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db   = new Database();
        $this->conn = $this->db->connect();
    }

    // GET /visa  — tourist sees own, admin sees all
    public function index() {
        try {
            $auth = new Auth();
            if (!$auth->authorize()) { return; }
            $user = Auth::getCurrentUser();

            $page   = max(1, (int)($_GET["page"]  ?? 1));
            $limit  = max(1, (int)($_GET["limit"] ?? 20));
            $offset = ($page - 1) * $limit;
            $status = $_GET["status"] ?? null;

            $where = []; $params = [];
            if ($user->role_name === "tourist") {
                $where[] = "v.user_id = :user_id";
                $params[":user_id"] = $user->id;
            }
            if ($status) { $where[] = "v.status = :status"; $params[":status"] = $status; }
            $wc = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

            $cs = $this->conn->prepare("SELECT COUNT(*) AS total FROM visa_applications v $wc");
            $cs->execute($params);
            $total = (int)$cs->fetch()["total"];

            $stmt = $this->conn->prepare(
                "SELECT v.*, u.full_name AS user_name, u.email AS user_email,
                 r.full_name AS reviewed_by_name
                 FROM visa_applications v
                 JOIN users u ON v.user_id = u.id
                 LEFT JOIN users r ON v.reviewed_by = r.id
                 $wc ORDER BY v.created_at DESC LIMIT :limit OFFSET :offset"
            );
            foreach ($params as $k => $v2) { $stmt->bindValue($k, $v2); }
            $stmt->bindValue(":limit",  $limit,  PDO::PARAM_INT);
            $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
            $stmt->execute();
            $apps = array_map([$this, "mapApplication"], $stmt->fetchAll(PDO::FETCH_ASSOC));

            Response::success([
                "applications" => $apps,
                "data"         => $apps,
                "pagination"   => ["current_page"=>$page,"per_page"=>$limit,"total"=>$total,"total_pages"=>(int)ceil($total/max($limit,1))],
            ]);
        } catch (Exception $e) {
            error_log("VisaController::index: ".$e->getMessage());
            Response::serverError("Failed to fetch visa applications: ".$e->getMessage());
        }
    }

    // GET /visa/my-requests  — tourist own applications
    public function myRequests() {
        try {
            $auth = new Auth();
            if (!$auth->authorize()) { return; }
            $user = Auth::getCurrentUser();

            $stmt = $this->conn->prepare(
                "SELECT v.*, u.full_name AS user_name, u.email AS user_email
                 FROM visa_applications v
                 JOIN users u ON v.user_id = u.id
                 WHERE v.user_id = :uid
                 ORDER BY v.created_at DESC"
            );
            $stmt->bindValue(":uid", $user->id, PDO::PARAM_INT);
            $stmt->execute();
            $apps = array_map([$this, "mapApplication"], $stmt->fetchAll(PDO::FETCH_ASSOC));
            Response::success($apps);
        } catch (Exception $e) {
            error_log("VisaController::myRequests: ".$e->getMessage());
            Response::serverError("Failed to fetch your visa requests: ".$e->getMessage());
        }
    }

    // GET /visa/admin/all  — admin sees all
    public function adminAll() {
        try {
            $auth = new Auth();
            if (!$auth->authorize(["administrator"])) { return; }

            $page   = max(1, (int)($_GET["page"]  ?? 1));
            $limit  = max(1, (int)($_GET["limit"] ?? 20));
            $offset = ($page - 1) * $limit;
            $status = $_GET["status"] ?? null;

            $where = []; $params = [];
            if ($status) { $where[] = "v.status = :status"; $params[":status"] = $status; }
            $wc = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

            $cs = $this->conn->prepare("SELECT COUNT(*) AS total FROM visa_applications v $wc");
            $cs->execute($params);
            $total = (int)$cs->fetch()["total"];

            $stmt = $this->conn->prepare(
                "SELECT v.*, u.full_name AS user_name, u.email AS user_email,
                 r.full_name AS reviewed_by_name
                 FROM visa_applications v
                 JOIN users u ON v.user_id = u.id
                 LEFT JOIN users r ON v.reviewed_by = r.id
                 $wc ORDER BY v.created_at DESC LIMIT :limit OFFSET :offset"
            );
            foreach ($params as $k => $v2) { $stmt->bindValue($k, $v2); }
            $stmt->bindValue(":limit",  $limit,  PDO::PARAM_INT);
            $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
            $stmt->execute();
            $apps = array_map([$this, "mapApplication"], $stmt->fetchAll(PDO::FETCH_ASSOC));

            Response::success([
                "applications" => $apps,
                "data"         => $apps,
                "pagination"   => ["current_page"=>$page,"per_page"=>$limit,"total"=>$total,"total_pages"=>(int)ceil($total/max($limit,1))],
            ]);
        } catch (Exception $e) {
            error_log("VisaController::adminAll: ".$e->getMessage());
            Response::serverError("Failed to fetch visa applications: ".$e->getMessage());
        }
    }

    // GET /visa/{id}
    public function show($id) {
        try {
            $auth = new Auth();
            if (!$auth->authorize()) { return; }
            $user = Auth::getCurrentUser();

            $app = $this->getApplicationById($id);
            if (!$app) { Response::notFound("Visa application not found"); return; }
            if ($user->role_name === "tourist" && $app["user_id"] != $user->id) {
                Response::forbidden("Access denied"); return;
            }
            Response::success($this->mapApplication($app));
        } catch (Exception $e) {
            Response::serverError("Failed to fetch visa application: ".$e->getMessage());
        }
    }

    // POST /visa  — tourist submits application
    public function submit() {
        try {
            $auth = new Auth();
            if (!$auth->authorize()) { return; }
            $user = Auth::getCurrentUser();

            // Accept both camelCase (frontend FormData) and snake_case
            $body = !empty($_POST) ? $_POST : (json_decode(file_get_contents("php://input"), true) ?? []);

            $country     = $body["destination_country"]   ?? $body["destinationCountry"]   ?? "";
            $purpose     = $body["travel_purpose"]         ?? $body["travelPurpose"]         ?? "";
            $travelDate  = $body["intended_travel_date"]   ?? $body["intendedTravelDate"]    ?? "";
            $passport    = $body["passport_number"]        ?? $body["passportNumber"]        ?? "";
            $expiry      = $body["passport_expiry"]        ?? $body["passportExpiry"]        ?? null;

            error_log("VisaController::submit body: country=$country purpose=$purpose date=$travelDate passport=$passport");

            // Validate
            $errors = [];
            if (empty($country))    { $errors["destination_country"]   = "Destination country is required"; }
            if (empty($purpose))    { $errors["travel_purpose"]        = "Travel purpose is required"; }
            if (empty($travelDate)) { $errors["intended_travel_date"]  = "Travel date is required"; }
            if (empty($passport))   { $errors["passport_number"]       = "Passport number is required"; }

            // Normalise purpose: frontend sends "family", DB stores "family_visit"
            $purposeMap = ["family" => "family_visit"];
            if (isset($purposeMap[$purpose])) { $purpose = $purposeMap[$purpose]; }

            $allowedPurposes = ["tourism","business","education","medical","family_visit","other"];
            if (!empty($purpose) && !in_array($purpose, $allowedPurposes)) {
                $errors["travel_purpose"] = "Invalid travel purpose: $purpose";
            }

            if (!empty($travelDate)) {
                $d = DateTime::createFromFormat("Y-m-d", $travelDate);
                if (!$d) { $errors["intended_travel_date"] = "Travel date must be YYYY-MM-DD"; }
                elseif ($d <= new DateTime()) { $errors["intended_travel_date"] = "Travel date must be in the future"; }
            }

            if (!empty($errors)) { Response::validationError($errors); return; }

            // Handle document upload
            $documents = [];
            if (isset($_FILES["document"]) && $_FILES["document"]["error"] === UPLOAD_ERR_OK) {
                $uploader  = new FileUpload(__DIR__ . "/../../uploads/");
                $path      = $uploader->upload($_FILES["document"], "visa_documents");
                if ($path) { $documents[] = $path; }
            } elseif (isset($_FILES["documents"])) {
                $uploader  = new FileUpload(__DIR__ . "/../../uploads/");
                $documents = $uploader->uploadMultiple($_FILES["documents"], "visa_documents") ?? [];
            }

            $appNumber = $this->generateApplicationNumber();

            $stmt = $this->conn->prepare(
                "INSERT INTO visa_applications
                   (application_number, user_id, destination_country, travel_purpose,
                    intended_travel_date, passport_number, passport_expiry, documents, status)
                 VALUES
                   (:app_num, :user_id, :country, :purpose, :travel_date, :passport, :expiry, :documents, \"submitted\")"
            );
            $stmt->bindValue(":app_num",    $appNumber);
            $stmt->bindValue(":user_id",    (int)$user->id, PDO::PARAM_INT);
            $stmt->bindValue(":country",    $country);
            $stmt->bindValue(":purpose",    $purpose);
            $stmt->bindValue(":travel_date",$travelDate);
            $stmt->bindValue(":passport",   $passport);
            $stmt->bindValue(":expiry",     $expiry);
            $stmt->bindValue(":documents",  json_encode($documents));

            if (!$stmt->execute()) {
                error_log("VisaController::submit INSERT failed: ".json_encode($stmt->errorInfo()));
                Response::serverError("Failed to save visa application"); return;
            }

            $appId = (int)$this->conn->lastInsertId();
            error_log("VisaController::submit saved id=$appId appNumber=$appNumber");

            $this->createNotification($user->id, "visa", "Visa Application Submitted",
                "Your visa application $appNumber has been submitted successfully.", "/visa-status");

            Response::success($this->mapApplication($this->getApplicationById($appId)),
                              "Visa application submitted successfully", 201);
        } catch (Exception $e) {
            error_log("VisaController::submit exception: ".$e->getMessage());
            Response::serverError("Failed to submit visa application: ".$e->getMessage());
        }
    }

    // PUT /visa/admin/{id}/status  — admin updates status
    public function updateStatus($id) {
        try {
            $auth = new Auth();
            if (!$auth->authorize(["administrator"])) { return; }
            $user = Auth::getCurrentUser();

            $data   = json_decode(file_get_contents("php://input"), true) ?? $_POST;
            $status = $data["status"] ?? null;
            $allowed = ["submitted","under_review","approved","rejected"];
            if (!in_array($status, $allowed)) { Response::error("Invalid status value"); return; }

            $app = $this->getApplicationById($id);
            if (!$app) { Response::notFound("Visa application not found"); return; }

            $stmt = $this->conn->prepare(
                "UPDATE visa_applications
                 SET status=:status, admin_comments=:comments, reviewed_by=:reviewer, reviewed_at=NOW()
                 WHERE id=:id"
            );
            $stmt->bindValue(":status",   $status);
            $stmt->bindValue(":comments", $data["admin_comments"] ?? $data["adminComments"] ?? null);
            $stmt->bindValue(":reviewer", (int)$user->id, PDO::PARAM_INT);
            $stmt->bindValue(":id",       (int)$id, PDO::PARAM_INT);
            $stmt->execute();

            $this->createNotification($app["user_id"], "visa", "Visa Application Updated",
                "Your visa application {$app["application_number"]} status changed to $status.", "/visa-status");

            Response::success($this->mapApplication($this->getApplicationById($id)),
                              "Visa application status updated successfully");
        } catch (Exception $e) {
            error_log("VisaController::updateStatus: ".$e->getMessage());
            Response::serverError("Failed to update visa status: ".$e->getMessage());
        }
    }

    // GET /visa/statistics  — admin
    public function statistics() {
        try {
            $auth = new Auth();
            if (!$auth->authorize(["administrator"])) { return; }

            $counts = $this->conn->query(
                "SELECT status, COUNT(*) AS cnt FROM visa_applications GROUP BY status"
            )->fetchAll(PDO::FETCH_KEY_PAIR);

            $recent = $this->conn->query(
                "SELECT v.*, u.full_name AS user_name FROM visa_applications v
                 JOIN users u ON v.user_id = u.id
                 ORDER BY v.created_at DESC LIMIT 5"
            )->fetchAll(PDO::FETCH_ASSOC);

            Response::success(["status_counts"=>$counts,"recent_applications"=>array_map([$this,"mapApplication"],$recent)]);
        } catch (Exception $e) {
            Response::serverError("Failed to fetch statistics: ".$e->getMessage());
        }
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private function getApplicationById($id) {
        $stmt = $this->conn->prepare(
            "SELECT v.*, u.full_name AS user_name, u.email AS user_email
             FROM visa_applications v
             JOIN users u ON v.user_id = u.id
             WHERE v.id = :id"
        );
        $stmt->bindValue(":id", (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    /** Normalise DB row to camelCase shape the frontend expects */
    private function mapApplication($row) {
        if (!$row) { return null; }
        $docs = is_string($row["documents"]) ? (json_decode($row["documents"], true) ?? []) : ($row["documents"] ?? []);
        return [
            "id"                  => (int)$row["id"],
            "userId"              => (int)$row["user_id"],
            "applicationNumber"   => $row["application_number"] ?? "",
            "destinationCountry"  => $row["destination_country"] ?? "",
            "travelPurpose"       => $row["travel_purpose"] ?? "",
            "intendedTravelDate"  => $row["intended_travel_date"] ?? "",
            "passportNumber"      => $row["passport_number"] ?? "",
            "passportExpiry"      => $row["passport_expiry"] ?? null,
            "documents"           => $docs,
            "documentPath"        => !empty($docs) ? $docs[0] : null,
            "status"              => $row["status"] ?? "submitted",
            "adminComments"       => $row["admin_comments"] ?? null,
            "submittedAt"         => $row["created_at"] ?? "",
            "updatedAt"           => $row["updated_at"] ?? $row["created_at"] ?? "",
            "userFullName"        => $row["user_name"] ?? "",
            "userEmail"           => $row["user_email"] ?? "",
            "reviewedByName"      => $row["reviewed_by_name"] ?? null,
            // keep snake_case aliases so any legacy code still works
            "destination_country" => $row["destination_country"] ?? "",
            "travel_purpose"      => $row["travel_purpose"] ?? "",
            "intended_travel_date"=> $row["intended_travel_date"] ?? "",
            "passport_number"     => $row["passport_number"] ?? "",
            "created_at"          => $row["created_at"] ?? "",
            "updated_at"          => $row["updated_at"] ?? "",
        ];
    }

    private function generateApplicationNumber() {
        do {
            $num = "VISA-" . date("Y") . "-" . strtoupper(substr(uniqid(), -6));
            $s   = $this->conn->prepare("SELECT COUNT(*) AS c FROM visa_applications WHERE application_number=:n");
            $s->bindValue(":n", $num); $s->execute();
        } while ((int)$s->fetch()["c"] > 0);
        return $num;
    }

    private function createNotification($userId, $type, $title, $message, $link = null) {
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO notifications (user_id, type, title, message, link) VALUES (:u,:t,:ti,:m,:l)"
            );
            $stmt->bindValue(":u", (int)$userId, PDO::PARAM_INT);
            $stmt->bindValue(":t", $type);
            $stmt->bindValue(":ti",$title);
            $stmt->bindValue(":m", $message);
            $stmt->bindValue(":l", $link);
            $stmt->execute();
        } catch (Exception $e) {
            error_log("createNotification failed: ".$e->getMessage());
        }
    }
}
