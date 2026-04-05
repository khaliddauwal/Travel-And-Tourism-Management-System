<?php
/**
 * Package API Controller
 */

class ApiPackageController {
    private $dbh;
    
    public function __construct() {
        global $dbh;
        $this->dbh = $dbh;
    }
    
    /**
     * Get all packages with pagination
     * GET /packages
     */
    public function index($params = []) {
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
        $limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 10;
        $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
        $type = isset($_GET['type']) ? sanitizeInput($_GET['type']) : '';
        
        $offset = ($page - 1) * $limit;
        
        // Build query
        $whereClause = "WHERE 1=1";
        $params = [];
        
        if (!empty($search)) {
            $whereClause .= " AND (PackageName LIKE :search OR PackageLocation LIKE :search)";
            $params[':search'] = "%$search%";
        }
        
        if (!empty($type)) {
            $whereClause .= " AND PackageType = :type";
            $params[':type'] = $type;
        }
        
        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM tbltourpackages $whereClause";
        $countQuery = $this->dbh->prepare($countSql);
        foreach ($params as $key => $value) {
            $countQuery->bindValue($key, $value);
        }
        $countQuery->execute();
        $total = $countQuery->fetch(PDO::FETCH_OBJ)->total;
        
        // Get packages
        $sql = "SELECT PackageId, PackageName, PackageType, PackageLocation, PackagePrice, 
                       PackageFetures, PackageDetails, PackageImage, Creationdate 
                FROM tbltourpackages $whereClause 
                ORDER BY Creationdate DESC 
                LIMIT :limit OFFSET :offset";
        
        $query = $this->dbh->prepare($sql);
        foreach ($params as $key => $value) {
            $query->bindValue($key, $value);
        }
        $query->bindValue(':limit', $limit, PDO::PARAM_INT);
        $query->bindValue(':offset', $offset, PDO::PARAM_INT);
        $query->execute();
        
        $packages = [];
        while ($row = $query->fetch(PDO::FETCH_OBJ)) {
            $packages[] = $this->formatPackage($row);
        }
        
        ApiResponse::paginated($packages, $total, $page, $limit, 'Packages retrieved successfully');
    }
    
    /**
     * Get single package by ID
     * GET /packages/{id}
     */
    public function show($params = []) {
        $packageId = intval($params['id'] ?? 0);
        
        if ($packageId <= 0) {
            ApiResponse::error('Invalid package ID', 400);
        }
        
        $sql = "SELECT * FROM tbltourpackages WHERE PackageId = :id";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':id', $packageId, PDO::PARAM_INT);
        $query->execute();
        
        if ($query->rowCount() === 0) {
            ApiResponse::notFound('Package not found');
        }
        
        $package = $query->fetch(PDO::FETCH_OBJ);
        
        ApiResponse::success($this->formatPackage($package), 'Package retrieved successfully');
    }
    
    /**
     * Get package types
     * GET /packages/types
     */
    public function types($params = []) {
        $sql = "SELECT DISTINCT PackageType FROM tbltourpackages WHERE PackageType IS NOT NULL ORDER BY PackageType";
        $query = $this->dbh->prepare($sql);
        $query->execute();
        
        $types = [];
        while ($row = $query->fetch(PDO::FETCH_OBJ)) {
            $types[] = $row->PackageType;
        }
        
        ApiResponse::success($types, 'Package types retrieved successfully');
    }
    
    /**
     * Get featured packages
     * GET /packages/featured
     */
    public function featured($params = []) {
        $limit = isset($_GET['limit']) ? min(10, max(1, intval($_GET['limit']))) : 6;
        
        $sql = "SELECT PackageId, PackageName, PackageType, PackageLocation, PackagePrice, 
                       PackageFetures, PackageDetails, PackageImage, Creationdate 
                FROM tbltourpackages 
                ORDER BY Creationdate DESC 
                LIMIT :limit";
        
        $query = $this->dbh->prepare($sql);
        $query->bindValue(':limit', $limit, PDO::PARAM_INT);
        $query->execute();
        
        $packages = [];
        while ($row = $query->fetch(PDO::FETCH_OBJ)) {
            $packages[] = $this->formatPackage($row);
        }
        
        ApiResponse::success($packages, 'Featured packages retrieved successfully');
    }
    
    /**
     * Search packages
     * GET /packages/search
     */
    public function search($params = []) {
        $query = isset($_GET['q']) ? sanitizeInput($_GET['q']) : '';
        $limit = isset($_GET['limit']) ? min(20, max(1, intval($_GET['limit']))) : 10;
        
        if (empty($query)) {
            ApiResponse::error('Search query is required', 400);
        }
        
        $sql = "SELECT PackageId, PackageName, PackageType, PackageLocation, PackagePrice, 
                       PackageFetures, PackageDetails, PackageImage, Creationdate 
                FROM tbltourpackages 
                WHERE PackageName LIKE :query 
                   OR PackageLocation LIKE :query 
                   OR PackageDetails LIKE :query 
                ORDER BY PackageName ASC 
                LIMIT :limit";
        
        $queryObj = $this->dbh->prepare($sql);
        $queryObj->bindValue(':query', "%$query%", PDO::PARAM_STR);
        $queryObj->bindValue(':limit', $limit, PDO::PARAM_INT);
        $queryObj->execute();
        
        $packages = [];
        while ($row = $queryObj->fetch(PDO::FETCH_OBJ)) {
            $packages[] = $this->formatPackage($row);
        }
        
        ApiResponse::success($packages, "Search results for '$query'");
    }
    
    /**
     * Format package data for API response
     */
    private function formatPackage($package) {
        return [
            'id' => (int)$package->PackageId,
            'name' => $package->PackageName,
            'type' => $package->PackageType,
            'location' => $package->PackageLocation,
            'price' => [
                'usd' => (int)$package->PackagePrice,
                'ngn' => Currency::convertUSDToNGN($package->PackagePrice),
                'formatted' => Currency::displayPrice($package->PackagePrice)
            ],
            'features' => $package->PackageFetures,
            'details' => $package->PackageDetails,
            'image' => $package->PackageImage,
            'createdAt' => $package->Creationdate,
            'updatedAt' => $package->UpdationDate ?? null
        ];
    }
}
?>