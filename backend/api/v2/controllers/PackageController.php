<?php
require_once __DIR__ . "/../config/Database.php";
require_once __DIR__ . "/../middleware/Auth.php";
require_once __DIR__ . "/../utils/Response.php";
require_once __DIR__ . "/../utils/Validator.php";
require_once __DIR__ . "/../utils/FileUpload.php";

class PackageController {
    private $db;
    private $conn;
    public function __construct() {
        $this->db   = new Database();
        $this->conn = $this->db->connect();
    }
    public function index() {
        try {
            $page   = max(1, (int)($_GET["page"]  ?? 1));
            $limit  = max(1, (int)($_GET["limit"] ?? 12));
            $offset = ($page - 1) * $limit;
            $type   = $_GET["type"]   ?? null;
            $search = $_GET["search"] ?? null;
            $status = $_GET["status"] ?? "published";
            $where = []; $params = [];
            if ($status !== "all") { $where[] = "p.status = :status"; $params[":status"] = $status; }
            if ($type)   { $where[] = "p.type = :type";   $params[":type"]   = $type; }
            if ($search) { $where[] = "(p.name LIKE :search OR p.destination LIKE :search)"; $params[":search"] = "%$search%"; }
            $wc = !empty($where) ? implode(" AND ", $where) : "1=1";
            $cs = $this->conn->prepare("SELECT COUNT(*) AS total FROM travel_packages p WHERE $wc");
            $cs->execute($params);
            $total = (int)$cs->fetch()["total"];
            $sql = "SELECT p.*, COALESCE(u.full_name,\"Admin\") AS created_by_name, (SELECT AVG(r.rating) FROM reviews r WHERE r.package_id=p.id AND r.status=\"approved\") AS avg_rating, (SELECT COUNT(*) FROM reviews r WHERE r.package_id=p.id AND r.status=\"approved\") AS review_count FROM travel_packages p LEFT JOIN users u ON p.created_by=u.id WHERE $wc ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->conn->prepare($sql);
            foreach ($params as $k => $v) { $stmt->bindValue($k, $v); }
            $stmt->bindValue(":limit",  $limit,  PDO::PARAM_INT);
            $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
            $stmt->execute();
            $packages = array_map([$this, "mapPackage"], $stmt->fetchAll(PDO::FETCH_ASSOC));
            error_log("About to call Response::success with ".count($packages)." packages"); Response::success(["packages"=>$packages,"data"=>$packages,"pagination"=>["current_page"=>$page,"per_page"=>$limit,"total"=>$total,"total_pages"=>(int)ceil($total/max($limit,1))]]);
        } catch (Exception $e) {
            error_log("PackageController::index: ".$e->getMessage());
            Response::serverError("Failed to fetch packages: ".$e->getMessage());
        }
    }
    public function show($id) {
        try {
            $stmt = $this->conn->prepare("SELECT p.*, COALESCE(u.full_name,\"Admin\") AS created_by_name FROM travel_packages p LEFT JOIN users u ON p.created_by=u.id WHERE p.id=:id");
            $stmt->bindParam(":id",$id); $stmt->execute();
            $package = $stmt->fetch();
            if (!$package) { Response::notFound("Package not found"); return; }
            $r2 = $this->conn->prepare("SELECT r.*, u.full_name AS user_name FROM reviews r JOIN users u ON r.user_id=u.id WHERE r.package_id=:id AND r.status=\"approved\" ORDER BY r.created_at DESC LIMIT 10");
            $r2->bindParam(":id",$id); $r2->execute();
            $package["reviews"] = $r2->fetchAll();
            Response::success($this->mapPackage($package));
        } catch (Exception $e) { Response::serverError("Failed to fetch package: ".$e->getMessage()); }
    }
    public function create() {
        try {
            $auth = new Auth();
            if (!$auth->authorize(["administrator"])) { return; }
            $user = Auth::getCurrentUser();
            if (!$user) { Response::unauthorized("Could not resolve current user"); return; }
            $body = !empty($_POST) ? $_POST : (json_decode(file_get_contents("php://input"),true) ?? []);
            $v = new Validator();
            $v->required("name",$body["name"]??""); $v->required("destination",$body["destination"]??"");
            $v->required("type",$body["type"]??"");
            $v->enum("type",$body["type"]??"",["city_tour","adventure","festival","cultural","nature","wildlife","religious","educational","luxury","budget","umrah","hajj"]);
            $v->required("duration",$body["duration"]??""); $v->integer("duration",$body["duration"]??""); $v->min("duration",$body["duration"]??0,1);
            $v->required("price",$body["price"]??""); $v->numeric("price",$body["price"]??""); $v->min("price",$body["price"]??0,0);
            $v->required("description",$body["description"]??"");
            if ($v->fails()) { Response::validationError($v->getErrors()); return; }
            $imagePath = null;
            if (isset($_FILES["image"]) && $_FILES["image"]["error"]===UPLOAD_ERR_OK) {
                $up = new FileUpload(__DIR__."/../../uploads/");
                $imagePath = $up->upload($_FILES["image"],"packages");
                if (!$imagePath) { Response::error("Image upload failed"); return; }
            } elseif (!empty($body["image_url"])) {
                $imagePath = filter_var($body["image_url"],FILTER_VALIDATE_URL) ? $body["image_url"] : null;
            }
            $slug   = $this->generateSlug($body["name"]);
            $status = in_array($body["status"]??"",["draft","published","archived"]) ? $body["status"] : "published";
            $stmt = $this->conn->prepare("INSERT INTO travel_packages (name,slug,destination,type,duration,price,description,itinerary,inclusions,requirements,image,status,created_by) VALUES (:name,:slug,:destination,:type,:duration,:price,:description,:itinerary,:inclusions,:requirements,:image,:status,:created_by)");
            $stmt->bindValue(":name",$body["name"]); $stmt->bindValue(":slug",$slug);
            $stmt->bindValue(":destination",$body["destination"]); $stmt->bindValue(":type",$body["type"]);
            $stmt->bindValue(":duration",(int)$body["duration"],PDO::PARAM_INT); $stmt->bindValue(":price",(float)$body["price"]);
            $stmt->bindValue(":description",$body["description"]); $stmt->bindValue(":itinerary",$body["itinerary"]??null);
            $stmt->bindValue(":inclusions",$body["inclusions"]??null); $stmt->bindValue(":requirements",$body["requirements"]??null);
            $stmt->bindValue(":image",$imagePath); $stmt->bindValue(":status",$status);
            $stmt->bindValue(":created_by",(int)$user->id,PDO::PARAM_INT);
            if (!$stmt->execute()) { Response::serverError("Failed to create package"); return; }
            Response::success($this->mapPackage($this->getPackageById((int)$this->conn->lastInsertId())),"Package created successfully",201);
        } catch (Exception $e) { error_log("create: ".$e->getMessage()); Response::serverError("Failed to create package: ".$e->getMessage()); }
    }
    public function update($id) {
        try {
            $auth = new Auth(); if (!$auth->authorize(["administrator"])) { return; }
            $package = $this->getPackageById($id);
            if (!$package) { Response::notFound("Package not found"); return; }
            $body = !empty($_POST) ? $_POST : (json_decode(file_get_contents("php://input"),true) ?? []);
            $updates=[]; $params=[":id"=>$id];
            foreach (["name","destination","type","duration","price","description","itinerary","inclusions","requirements","status"] as $f) {
                if (isset($body[$f])) { $updates[] = "$f=:$f"; $params[":$f"]=$body[$f]; }
            }
            if (isset($body["name"])) { $updates[]="slug=:slug"; $params[":slug"]=$this->generateSlug($body["name"]); }
            if (isset($_FILES["image"]) && $_FILES["image"]["error"]===UPLOAD_ERR_OK) {
                $up=new FileUpload(__DIR__."/../../uploads/"); $ip=$up->upload($_FILES["image"],"packages");
                if ($ip) { $updates[]="image=:image"; $params[":image"]=$ip; }
            } elseif (!empty($body["image_url"])) {
                $u=filter_var($body["image_url"],FILTER_VALIDATE_URL)?$body["image_url"]:null;
                if ($u) { $updates[]="image=:image"; $params[":image"]=$u; }
            }
            if (empty($updates)) { Response::error("No fields to update"); return; }
            $this->conn->prepare("UPDATE travel_packages SET ".implode(",",$updates)." WHERE id=:id")->execute($params);
            Response::success($this->mapPackage($this->getPackageById($id)),"Package updated successfully");
        } catch (Exception $e) { Response::serverError("Failed to update: ".$e->getMessage()); }
    }
    public function delete($id) {
        try {
            $auth = new Auth(); if (!$auth->authorize(["administrator"])) { return; }
            $s=$this->conn->prepare("SELECT COUNT(*) AS cnt FROM bookings WHERE package_id=:id AND status IN (\"pending\",\"confirmed\")");
            $s->bindParam(":id",$id); $s->execute();
            if ((int)$s->fetch()["cnt"]>0) { Response::error("Cannot delete package with active bookings"); return; }
            $pkg=$this->getPackageById($id);
            if (!$pkg) { Response::notFound("Package not found"); return; }
            $this->conn->prepare("DELETE FROM travel_packages WHERE id=:id")->execute([":id"=>$id]);
            Response::success(null,"Package deleted successfully");
        } catch (Exception $e) { Response::serverError("Failed to delete: ".$e->getMessage()); }
    }
    public function featured() {
        try {
            $limit=min(20,max(1,(int)($_GET["limit"]??6)));
            $stmt=$this->conn->prepare("SELECT p.*,COALESCE(u.full_name,\"Admin\") AS created_by_name FROM travel_packages p LEFT JOIN users u ON p.created_by=u.id WHERE p.status=\"published\" ORDER BY p.created_at DESC LIMIT :limit");
            $stmt->bindValue(":limit",$limit,PDO::PARAM_INT); $stmt->execute();
            Response::success(array_map([$this,"mapPackage"],$stmt->fetchAll(PDO::FETCH_ASSOC)));
        } catch (Exception $e) { Response::serverError("Failed to fetch featured: ".$e->getMessage()); }
    }
    public function types() {
        try {
            $stmt=$this->conn->query("SELECT DISTINCT type FROM travel_packages WHERE status=\"published\" ORDER BY type");
            Response::success(array_column($stmt->fetchAll(PDO::FETCH_ASSOC),"type"));
        } catch (Exception $e) { Response::serverError("Failed to fetch types: ".$e->getMessage()); }
    }
    public function updateStatus($id) {
        try {
            $auth=new Auth(); if (!$auth->authorize(["administrator"])) { return; }
            $data=json_decode(file_get_contents("php://input"),true)??$_POST;
            $status=$data["status"]??null;
            if (!in_array($status,["draft","published","archived"])) { Response::error("Invalid status"); return; }
            $this->conn->prepare("UPDATE travel_packages SET status=:status WHERE id=:id")->execute([":status"=>$status,":id"=>$id]);
            Response::success($this->mapPackage($this->getPackageById($id)),"Status updated");
        } catch (Exception $e) { Response::serverError("Failed to update status: ".$e->getMessage()); }
    }
    private function getPackageById($id) {
        $stmt=$this->conn->prepare("SELECT * FROM travel_packages WHERE id=:id");
        $stmt->bindParam(":id",$id); $stmt->execute(); return $stmt->fetch();
    }
    private function generateSlug($name) {
        $base=strtolower(trim(preg_replace("/[^A-Za-z0-9-]+/","-",$name),"-"));
        $slug=$base; $i=1;
        while(true){
            $s=$this->conn->prepare("SELECT COUNT(*) AS cnt FROM travel_packages WHERE slug=:slug");
            $s->bindValue(":slug",$slug); $s->execute();
            if((int)$s->fetch()["cnt"]===0){break;}
            $slug=$base."-".(++$i);
        }
        return $slug;
    }
    private function mapPackage($row) {
        if (!$row) { return null; }
        $ngn=(float)($row["price"]??0);
        return array_merge($row,["id"=>(int)$row["id"],"location"=>$row["destination"]??"","features"=>$row["inclusions"]??"","details"=>$row["description"]??"","price"=>["ngn"=>$ngn,"usd"=>round($ngn/1500,2),"formatted"=>chr(8358).number_format($ngn,0)],"createdAt"=>$row["created_at"]??""]);
    }
}