<?php
class Response {
    public static function success($data = null, $message = "Success", $code = 200) {
        http_response_code($code);
        $json = json_encode(
            ["success"=>true,"message"=>$message,"data"=>$data],
            JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
        );
        echo $json;
        exit;
    }
    public static function error($message = "Error", $code = 400, $errors = []) {
        http_response_code($code);
        $r = ["success"=>false,"message"=>$message];
        if (!empty($errors)) { $r["errors"] = $errors; }
        echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
        exit;
    }
    public static function validationError($errors = []) { self::error("Validation failed", 422, $errors); }
    public static function notFound($message = "Resource not found") { self::error($message, 404); }
    public static function unauthorized($message = "Unauthorized") { self::error($message, 401); }
    public static function forbidden($message = "Forbidden") { self::error($message, 403); }
    public static function serverError($message = "Internal server error") { self::error($message, 500); }
}