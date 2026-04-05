<?php
/**
 * File Upload Handler
 * Handles secure file uploads
 */

class FileUpload {
    private $uploadDir;
    private $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    private $maxSize = 5242880; // 5MB
    private $errors = [];

    public function __construct($uploadDir = 'uploads/') {
        $this->uploadDir = rtrim($uploadDir, '/') . '/';
        
        // Create upload directory if it doesn't exist
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    /**
     * Upload single file
     * @param array $file $_FILES array element
     * @param string $subDir Subdirectory within uploads
     * @return string|false File path on success, false on failure
     */
    public function upload($file, $subDir = '') {
        // Validate file
        if (!$this->validate($file)) {
            return false;
        }

        // Create subdirectory if specified
        $targetDir = $this->uploadDir . ($subDir ? rtrim($subDir, '/') . '/' : '');
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $targetPath = $targetDir . $filename;

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            return $targetPath;
        }

        $this->errors[] = "Failed to move uploaded file";
        return false;
    }

    /**
     * Upload multiple files
     * @param array $files $_FILES array
     * @param string $subDir Subdirectory within uploads
     * @return array Array of uploaded file paths
     */
    public function uploadMultiple($files, $subDir = '') {
        $uploaded = [];

        foreach ($files['name'] as $key => $name) {
            $file = [
                'name' => $files['name'][$key],
                'type' => $files['type'][$key],
                'tmp_name' => $files['tmp_name'][$key],
                'error' => $files['error'][$key],
                'size' => $files['size'][$key]
            ];

            $path = $this->upload($file, $subDir);
            if ($path) {
                $uploaded[] = $path;
            }
        }

        return $uploaded;
    }

    /**
     * Validate uploaded file
     * @param array $file
     * @return bool
     */
    private function validate($file) {
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $this->errors[] = $this->getUploadError($file['error']);
            return false;
        }

        // Check file size
        if ($file['size'] > $this->maxSize) {
            $this->errors[] = "File size exceeds maximum allowed size of " . ($this->maxSize / 1048576) . "MB";
            return false;
        }

        // Check file type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $this->allowedTypes)) {
            $this->errors[] = "File type not allowed. Allowed types: JPG, PNG, PDF";
            return false;
        }

        // Additional security check for images
        if (strpos($mimeType, 'image/') === 0) {
            $imageInfo = getimagesize($file['tmp_name']);
            if ($imageInfo === false) {
                $this->errors[] = "Invalid image file";
                return false;
            }
        }

        return true;
    }

    /**
     * Get upload error message
     */
    private function getUploadError($code) {
        switch ($code) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return "File size exceeds maximum allowed";
            case UPLOAD_ERR_PARTIAL:
                return "File was only partially uploaded";
            case UPLOAD_ERR_NO_FILE:
                return "No file was uploaded";
            case UPLOAD_ERR_NO_TMP_DIR:
                return "Missing temporary folder";
            case UPLOAD_ERR_CANT_WRITE:
                return "Failed to write file to disk";
            case UPLOAD_ERR_EXTENSION:
                return "File upload stopped by extension";
            default:
                return "Unknown upload error";
        }
    }

    /**
     * Delete file
     * @param string $path
     * @return bool
     */
    public function delete($path) {
        if (file_exists($path) && is_file($path)) {
            return unlink($path);
        }
        return false;
    }

    /**
     * Get validation errors
     */
    public function getErrors() {
        return $this->errors;
    }

    /**
     * Set allowed file types
     */
    public function setAllowedTypes($types) {
        $this->allowedTypes = $types;
    }

    /**
     * Set maximum file size
     */
    public function setMaxSize($size) {
        $this->maxSize = $size;
    }
}
