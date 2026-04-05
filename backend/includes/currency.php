<?php
/**
 * Currency Management for Tourism Management System
 * Converts all prices to Nigerian Naira (₦)
 */

class Currency {
    // Exchange rates (USD to NGN) - Update these regularly
    private static $exchangeRates = [
        'USD_TO_NGN' => 1650.00, // 1 USD = 1650 NGN (approximate)
        'EUR_TO_NGN' => 1750.00, // 1 EUR = 1750 NGN (approximate)
        'GBP_TO_NGN' => 2050.00  // 1 GBP = 2050 NGN (approximate)
    ];
    
    private static $currencySymbol = '₦';
    private static $currencyCode = 'NGN';
    private static $currencyName = 'Nigerian Naira';
    
    /**
     * Convert USD price to Nigerian Naira
     */
    public static function convertUSDToNGN($usdAmount) {
        return round($usdAmount * self::$exchangeRates['USD_TO_NGN'], 2);
    }
    
    /**
     * Format price in Nigerian Naira
     */
    public static function formatNGN($amount, $showSymbol = true) {
        $formatted = number_format($amount, 2);
        return $showSymbol ? self::$currencySymbol . $formatted : $formatted;
    }
    
    /**
     * Display price with proper formatting
     */
    public static function displayPrice($usdPrice, $showCurrency = true) {
        $ngnPrice = self::convertUSDToNGN($usdPrice);
        return self::formatNGN($ngnPrice, $showCurrency);
    }
    
    /**
     * Get currency symbol
     */
    public static function getSymbol() {
        return self::$currencySymbol;
    }
    
    /**
     * Get currency code
     */
    public static function getCode() {
        return self::$currencyCode;
    }
    
    /**
     * Get currency name
     */
    public static function getName() {
        return self::$currencyName;
    }
    
    /**
     * Update exchange rate
     */
    public static function updateExchangeRate($fromCurrency, $rate) {
        $key = strtoupper($fromCurrency) . '_TO_NGN';
        if (array_key_exists($key, self::$exchangeRates)) {
            self::$exchangeRates[$key] = $rate;
            return true;
        }
        return false;
    }
    
    /**
     * Get current exchange rate
     */
    public static function getExchangeRate($fromCurrency = 'USD') {
        $key = strtoupper($fromCurrency) . '_TO_NGN';
        return self::$exchangeRates[$key] ?? 1650.00;
    }
    
    /**
     * Convert any amount to display format
     */
    public static function toNaira($amount, $fromCurrency = 'USD') {
        switch (strtoupper($fromCurrency)) {
            case 'USD':
                return self::convertUSDToNGN($amount);
            case 'EUR':
                return round($amount * self::$exchangeRates['EUR_TO_NGN'], 2);
            case 'GBP':
                return round($amount * self::$exchangeRates['GBP_TO_NGN'], 2);
            default:
                return $amount; // Assume already in NGN
        }
    }
    
    /**
     * Format for display with thousands separator
     */
    public static function format($amount, $decimals = 0) {
        return self::$currencySymbol . number_format($amount, $decimals);
    }
    
    /**
     * Get price range formatting
     */
    public static function priceRange($minPrice, $maxPrice) {
        $minNGN = self::convertUSDToNGN($minPrice);
        $maxNGN = self::convertUSDToNGN($maxPrice);
        
        return self::format($minNGN) . ' - ' . self::format($maxNGN);
    }
}

// Helper function for quick currency conversion
function toNaira($amount, $fromCurrency = 'USD') {
    return Currency::toNaira($amount, $fromCurrency);
}

// Helper function for quick formatting
function formatNaira($amount, $decimals = 0) {
    return Currency::format($amount, $decimals);
}

// Helper function for price display
function displayPrice($usdPrice) {
    return Currency::displayPrice($usdPrice);
}
?>