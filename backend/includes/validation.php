<?php

class Validator {
    private $errors = [];
    
    public function validate($data, $rules) {
        $this->errors = [];
        
        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;
            
            foreach ($fieldRules as $rule) {
                if (!$this->validateRule($field, $value, $rule)) {
                    break; // Stop on first error for this field
                }
            }
        }
        
        return empty($this->errors);
    }
    
    private function validateRule($field, $value, $rule) {
        $parts = explode(':', $rule);
        $ruleName = $parts[0];
        $parameter = $parts[1] ?? null;
        
        switch ($ruleName) {
            case 'required':
                if (empty($value)) {
                    $this->errors[$field] = ucfirst($field) . ' is required';
                    return false;
                }
                break;
                
            case 'email':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a valid email address';
                    return false;
                }
                break;
                
            case 'min':
                if (!empty($value) && strlen($value) < $parameter) {
                    $this->errors[$field] = ucfirst($field) . ' must be at least ' . $parameter . ' characters';
                    return false;
                }
                break;
                
            case 'max':
                if (!empty($value) && strlen($value) > $parameter) {
                    $this->errors[$field] = ucfirst($field) . ' cannot exceed ' . $parameter . ' characters';
                    return false;
                }
                break;
                
            case 'alpha':
                if (!empty($value) && !preg_match('/^[a-zA-Z\s]+$/', $value)) {
                    $this->errors[$field] = ucfirst($field) . ' must contain only letters and spaces';
                    return false;
                }
                break;
                
            case 'phone':
                if (!empty($value) && !preg_match('/^[\+]?[0-9\-\(\)\s]+$/', $value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a valid phone number';
                    return false;
                }
                break;
                
            case 'numeric':
                if (!empty($value) && !is_numeric($value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a number';
                    return false;
                }
                break;
                
            case 'date':
                if (!empty($value) && !strtotime($value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a valid date';
                    return false;
                }
                break;
                
            case 'url':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_URL)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a valid URL';
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    public function getErrors() {
        return $this->errors;
    }
    
    public function hasErrors() {
        return !empty($this->errors);
    }
    
    public function getFirstError() {
        return !empty($this->errors) ? reset($this->errors) : null;
    }
}
                    $this->errors[$field] = ucfirst($field) . ' must not exceed ' . $parameter . ' characters';
                    return false;
                }
                break;
                
            case 'numeric':
                if (!empty($value) && !is_numeric($value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a number';
                    return false;
                }
                break;
                
            case 'phone':
                if (!empty($value) && !preg_match('/^[0-9]{10,15}$/', $value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a valid phone number';
                    return false;
                }
                break;
                
            case 'alpha':
                if (!empty($value) && !preg_match('/^[a-zA-Z\s]+$/', $value)) {
                    $this->errors[$field] = ucfirst($field) . ' must contain only letters and spaces';
                    return false;
                }
                break;
                
            case 'alphanumeric':
                if (!empty($value) && !preg_match('/^[a-zA-Z0-9\s]+$/', $value)) {
                    $this->errors[$field] = ucfirst($field) . ' must contain only letters, numbers and spaces';
                    return false;
                }
                break;
                
            case 'date':
                if (!empty($value) && !strtotime($value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a valid date';
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    public function getErrors() {
        return $this->errors;
    }
    
    public function getFirstError() {
        return !empty($this->errors) ? reset($this->errors) : null;
    }
}

// Sanitization functions
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function sanitizeEmail($email) {
    return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
}

function sanitizeString($string) {
    return preg_replace('/[^a-zA-Z0-9\s\-_.]/', '', trim($string));
}

function sanitizePhone($phone) {
    return preg_replace('/[^0-9+\-\s()]/', '', trim($phone));
}
?>