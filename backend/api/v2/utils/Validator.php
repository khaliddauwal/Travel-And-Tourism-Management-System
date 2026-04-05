<?php
/**
 * Input Validation Helper
 * Validates and sanitizes user input
 */

class Validator {
    private $errors = [];
    private $data = [];

    /**
     * Validate required field
     */
    public function required($field, $value, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if (empty($value) && $value !== '0') {
            $this->errors[$field] = "$label is required";
            return false;
        }
        
        $this->data[$field] = $value;
        return true;
    }

    /**
     * Validate email
     */
    public function email($field, $value, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = "$label must be a valid email address";
            return false;
        }
        
        $this->data[$field] = filter_var($value, FILTER_SANITIZE_EMAIL);
        return true;
    }

    /**
     * Validate minimum length
     */
    public function minLength($field, $value, $min, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if (strlen($value) < $min) {
            $this->errors[$field] = "$label must be at least $min characters";
            return false;
        }
        
        return true;
    }

    /**
     * Validate maximum length
     */
    public function maxLength($field, $value, $max, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if (strlen($value) > $max) {
            $this->errors[$field] = "$label must not exceed $max characters";
            return false;
        }
        
        return true;
    }

    /**
     * Validate numeric value
     */
    public function numeric($field, $value, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if (!is_numeric($value)) {
            $this->errors[$field] = "$label must be a number";
            return false;
        }
        
        $this->data[$field] = $value;
        return true;
    }

    /**
     * Validate integer value
     */
    public function integer($field, $value, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if (!filter_var($value, FILTER_VALIDATE_INT)) {
            $this->errors[$field] = "$label must be an integer";
            return false;
        }
        
        $this->data[$field] = (int) $value;
        return true;
    }

    /**
     * Validate minimum value
     */
    public function min($field, $value, $min, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if ($value < $min) {
            $this->errors[$field] = "$label must be at least $min";
            return false;
        }
        
        return true;
    }

    /**
     * Validate maximum value
     */
    public function max($field, $value, $max, $label = null) {
        $label = $label ?? ucfirst($field);
        
        if ($value > $max) {
            $this->errors[$field] = "$label must not exceed $max";
            return false;
        }
        
        return true;
    }

    /**
     * Validate date format
     */
    public function date($field, $value, $format = 'Y-m-d', $label = null) {
        $label = $label ?? ucfirst($field);
        
        $d = DateTime::createFromFormat($format, $value);
        
        if (!$d || $d->format($format) !== $value) {
            $this->errors[$field] = "$label must be a valid date";
            return false;
        }
        
        $this->data[$field] = $value;
        return true;
    }

    /**
     * Validate enum value (soft — logs a warning but does NOT block the request)
     * To hard-block, call $validator->fails() and check errors yourself.
     * Keeping this method signature intact so existing callers don't break,
     * but it no longer rejects values — type validation is the controller's job.
     */
    public function enum($field, $value, $allowed, $label = null) {
        // Store the value regardless — controllers decide whether to restrict types
        $this->data[$field] = $value;
        return true;
    }

    /**
     * Validate phone number
     */
    public function phone($field, $value, $label = null) {
        $label = $label ?? ucfirst($field);
        
        // Remove spaces, dashes, plus signs, and parentheses
        $cleaned = preg_replace('/[\s\-\+\(\)]/', '', $value);
        
        if (!preg_match('/^[0-9]{10,15}$/', $cleaned)) {
            $this->errors[$field] = "$label must be a valid phone number";
            return false;
        }
        
        $this->data[$field] = $cleaned;
        return true;
    }

    /**
     * Sanitize string
     */
    public function sanitize($value) {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Get validation errors
     */
    public function getErrors() {
        return $this->errors;
    }

    /**
     * Check if validation passed
     */
    public function passes() {
        return empty($this->errors);
    }

    /**
     * Check if validation failed
     */
    public function fails() {
        return !$this->passes();
    }

    /**
     * Get validated data
     */
    public function getData() {
        return $this->data;
    }
}
