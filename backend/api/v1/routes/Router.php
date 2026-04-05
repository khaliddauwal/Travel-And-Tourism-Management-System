<?php
/**
 * Simple Router for API endpoints
 */

class Router {
    private $routes = [];
    
    /**
     * Add GET route
     */
    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }
    
    /**
     * Add POST route
     */
    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }
    
    /**
     * Add PUT route
     */
    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }
    
    /**
     * Add DELETE route
     */
    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    /**
     * Add route to collection
     */
    private function addRoute($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }
    
    /**
     * Route incoming request
     */
    public function route($method, $uri) {
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $this->matchPath($route['path'], $uri)) {
                $params = $this->extractParams($route['path'], $uri);
                return $this->callHandler($route['handler'], $params);
            }
        }
        
        ApiResponse::notFound('Endpoint not found');
    }
    
    /**
     * Match path with wildcards
     */
    private function matchPath($routePath, $uri) {
        // Convert route path to regex
        $pattern = preg_replace('/\{[^}]+\}/', '([^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        
        return preg_match($pattern, $uri);
    }
    
    /**
     * Extract parameters from URI
     */
    private function extractParams($routePath, $uri) {
        $params = [];
        
        // Extract parameter names from route
        preg_match_all('/\{([^}]+)\}/', $routePath, $paramNames);
        
        // Extract values from URI
        $pattern = preg_replace('/\{[^}]+\}/', '([^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        
        if (preg_match($pattern, $uri, $matches)) {
            array_shift($matches); // Remove full match
            
            foreach ($paramNames[1] as $index => $name) {
                $params[$name] = $matches[$index] ?? null;
            }
        }
        
        return $params;
    }
    
    /**
     * Call route handler
     */
    private function callHandler($handler, $params = []) {
        if (is_callable($handler)) {
            return call_user_func($handler, $params);
        }
        
        if (is_string($handler) && strpos($handler, '@') !== false) {
            list($class, $method) = explode('@', $handler);
            
            if (class_exists($class) && method_exists($class, $method)) {
                $instance = new $class();
                return call_user_func([$instance, $method], $params);
            }
        }
        
        ApiResponse::error('Invalid route handler', 500);
    }
}

// Global router instance
$router = new Router();
?>