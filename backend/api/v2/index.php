<?php
error_reporting(E_ALL);
ini_set("display_errors", 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(200); exit; }

if (file_exists(__DIR__ . "/../../.env")) {
    foreach (file(__DIR__ . "/../../.env", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), "#") === 0 || strpos($line, "=") === false) continue;
        list($k, $v) = explode("=", $line, 2);
        $_ENV[trim($k)] = trim($v);
    }
}

require_once __DIR__ . "/utils/Response.php";

$method   = $_SERVER["REQUEST_METHOD"];
$path     = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$path     = str_replace("/Tourism-Management-System-main/backend/api/v2", "", $path);
$path     = str_replace("/TTMS-DUAL-ROLES/backend/api/v2", "", $path);
$path     = str_replace("/backend/api/v2", "", $path);
$path     = trim($path, "/");
$segments = explode("/", $path);

try {
    $resource = $segments[0] ?? "";
    $id       = $segments[1] ?? null;
    $action   = $segments[2] ?? null;

    switch ($resource) {
        case "auth":
            require_once __DIR__ . "/controllers/AuthController.php";
            $c = new AuthController();
            switch ($id) {
                case "register":        if ($method==="POST") $c->register(); break;
                case "login":           if ($method==="POST") $c->login(); break;
                case "me":              if ($method==="GET")  $c->me(); break;
                case "logout":          if ($method==="POST") $c->logout(); break;
                case "forgot-password": if ($method==="POST") $c->forgotPassword(); break;
                case "reset-password":  if ($method==="POST") $c->resetPassword(); break;
                default: Response::notFound("Auth endpoint not found");
            }
            break;

        case "packages":
            require_once __DIR__ . "/controllers/PackageController.php";
            $c = new PackageController();
            if (!$id) {
                if ($method==="GET")  $c->index();
                if ($method==="POST") $c->create();
            } elseif ($id==="featured") {
                if ($method==="GET") $c->featured();
            } elseif ($id==="types") {
                if ($method==="GET") $c->types();
            } elseif ($action==="status") {
                if ($method==="PUT" || $method==="PATCH") $c->updateStatus($id);
            } else {
                if ($method==="GET")    $c->show($id);
                if ($method==="PUT")    $c->update($id);
                if ($method==="DELETE") $c->delete($id);
            }
            break;

        case "bookings":
            require_once __DIR__ . "/controllers/BookingController.php";
            $c = new BookingController();
            if (!$id) {
                if ($method==="GET")  $c->index();
                if ($method==="POST") $c->create();
            } elseif ($action==="status") {
                if ($method==="PUT") $c->updateStatus($id);
            } elseif ($action==="cancel") {
                if ($method==="PUT") $c->cancel($id);
            } elseif ($id==="statistics") {
                if ($method==="GET") $c->statistics();
            } else {
                if ($method==="GET") $c->show($id);
            }
            break;

        case "visa":
            require_once __DIR__ . "/controllers/VisaController.php";
            $c = new VisaController();
            if (!$id) {
                if ($method==="GET")  $c->index();
                if ($method==="POST") $c->submit();
            } elseif ($id==="my-requests") {
                if ($method==="GET") $c->myRequests();
            } elseif ($id==="admin" && $action==="all") {
                if ($method==="GET") $c->adminAll();
            } elseif ($id==="admin" && $action) {
                $subAction = $segments[3] ?? null;
                if ($subAction==="status" && $method==="PUT") $c->updateStatus($action);
            } elseif ($action==="status") {
                if ($method==="PUT") $c->updateStatus($id);
            } elseif ($id==="statistics") {
                if ($method==="GET") $c->statistics();
            } else {
                if ($method==="GET") $c->show($id);
            }
            break;

        case "payments":
            require_once __DIR__ . "/controllers/PaymentController.php";
            $c = new PaymentController();
            if (!$id) {
                if ($method==="GET")  $c->index();
                if ($method==="POST") $c->process();
            } elseif ($action==="confirm") {
                if ($method==="PUT") $c->confirm($id);
            } elseif ($id==="statistics") {
                if ($method==="GET") $c->statistics();
            } else {
                if ($method==="GET") $c->show($id);
            }
            break;

        case "users":
            require_once __DIR__ . "/controllers/UserController.php";
            $c = new UserController();
            if (!$id) {
                if ($method==="GET")  $c->index();
                if ($method==="POST") $c->create();
            } else {
                if ($method==="GET")    $c->show($id);
                if ($method==="PUT")    $c->update($id);
                if ($method==="DELETE") $c->delete($id);
            }
            break;

        case "reviews":
            require_once __DIR__ . "/controllers/ReviewController.php";
            $c = new ReviewController();
            if (!$id) {
                if ($method==="GET")  $c->index();
                if ($method==="POST") $c->create();
            } elseif ($action==="status") {
                if ($method==="PUT") $c->updateStatus($id);
            } else {
                if ($method==="DELETE") $c->delete($id);
            }
            break;

        case "health":
            Response::success(["status"=>"OK","timestamp"=>time()], "API is running");
            break;

        default:
            Response::notFound("Endpoint not found");
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    Response::serverError($e->getMessage());
} catch (Error $e) {
    error_log("API Fatal Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    Response::serverError("Server error: " . $e->getMessage());
}