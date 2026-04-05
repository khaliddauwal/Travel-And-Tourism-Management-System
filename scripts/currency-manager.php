<?php
// Currency Management Tool for Tourism Management System
include('includes/config.php');
startSecureSession();

// Handle exchange rate updates
if (isset($_POST['update_rates'])) {
    $usdRate = floatval($_POST['usd_rate']);
    $eurRate = floatval($_POST['eur_rate']);
    $gbpRate = floatval($_POST['gbp_rate']);
    
    if ($usdRate > 0) Currency::updateExchangeRate('USD', $usdRate);
    if ($eurRate > 0) Currency::updateExchangeRate('EUR', $eurRate);
    if ($gbpRate > 0) Currency::updateExchangeRate('GBP', $gbpRate);
    
    $msg = "Exchange rates updated successfully!";
}

// Sample price conversions
$samplePrices = [100, 500, 1000, 3000, 6000];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currency Manager - Tourism Management System</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #3F84B1; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .rate-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-weight: bold; margin-bottom: 5px; }
        .form-group input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #218838; }
        .conversion-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .conversion-table th, .conversion-table td { border: 1px solid #ddd; padding: 12px; text-align: center; }
        .conversion-table th { background: #f8f9fa; }
        .success { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .naira { color: #34ad00; font-weight: bold; font-size: 1.1em; }
        .currency-symbol { font-size: 2em; color: #34ad00; }
    </style>
</head>
<body>
    <div class="header">
        <h1><span class="currency-symbol">₦</span> Currency Manager</h1>
        <p>Manage exchange rates and currency conversions for Nigerian Naira</p>
    </div>

    <?php if (isset($msg)): ?>
        <div class="success"><?php echo $msg; ?></div>
    <?php endif; ?>

    <div class="card">
        <h2>📊 Current Exchange Rates</h2>
        <form method="post">
            <div class="rate-form">
                <div class="form-group">
                    <label for="usd_rate">USD to NGN Rate:</label>
                    <input type="number" step="0.01" name="usd_rate" id="usd_rate" 
                           value="<?php echo Currency::getExchangeRate('USD'); ?>" placeholder="1650.00">
                </div>
                <div class="form-group">
                    <label for="eur_rate">EUR to NGN Rate:</label>
                    <input type="number" step="0.01" name="eur_rate" id="eur_rate" 
                           value="<?php echo Currency::getExchangeRate('EUR'); ?>" placeholder="1750.00">
                </div>
                <div class="form-group">
                    <label for="gbp_rate">GBP to NGN Rate:</label>
                    <input type="number" step="0.01" name="gbp_rate" id="gbp_rate" 
                           value="<?php echo Currency::getExchangeRate('GBP'); ?>" placeholder="2050.00">
                </div>
                <div class="form-group">
                    <label>&nbsp;</label>
                    <button type="submit" name="update_rates" class="btn">Update Rates</button>
                </div>
            </div>
        </form>
    </div>

    <div class="card">
        <h2>💱 Price Conversion Examples</h2>
        <table class="conversion-table">
            <thead>
                <tr>
                    <th>USD Price</th>
                    <th>NGN Price</th>
                    <th>Formatted Display</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($samplePrices as $price): ?>
                <tr>
                    <td>$<?php echo number_format($price); ?></td>
                    <td class="naira">₦<?php echo number_format(Currency::convertUSDToNGN($price)); ?></td>
                    <td><?php echo Currency::displayPrice($price); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <div class="card">
        <h2>🎯 Package Price Updates</h2>
        <p>Current package prices in the system (converted to Naira):</p>
        
        <?php
        // Get sample packages from database
        try {
            $sql = "SELECT PackageId, PackageName, PackagePrice FROM tbltourpackages LIMIT 5";
            $query = $dbh->prepare($sql);
            $query->execute();
            $packages = $query->fetchAll(PDO::FETCH_OBJ);
            
            if ($packages) {
                echo "<table class='conversion-table'>";
                echo "<thead><tr><th>Package Name</th><th>Original (USD)</th><th>Converted (NGN)</th></tr></thead>";
                echo "<tbody>";
                
                foreach ($packages as $package) {
                    echo "<tr>";
                    echo "<td>" . htmlentities($package->PackageName) . "</td>";
                    echo "<td>$" . number_format($package->PackagePrice) . "</td>";
                    echo "<td class='naira'>" . Currency::displayPrice($package->PackagePrice) . "</td>";
                    echo "</tr>";
                }
                
                echo "</tbody></table>";
            } else {
                echo "<p>No packages found. Please import the database first.</p>";
            }
        } catch (Exception $e) {
            echo "<p>Database not available. Please set up the database first.</p>";
        }
        ?>
    </div>

    <div class="card">
        <h2>🔧 Currency System Features</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div>
                <h3>✅ Implemented</h3>
                <ul>
                    <li>Automatic USD to NGN conversion</li>
                    <li>Proper Naira symbol (₦) display</li>
                    <li>Number formatting with commas</li>
                    <li>Exchange rate management</li>
                    <li>Helper functions for easy use</li>
                </ul>
            </div>
            <div>
                <h3>📋 Updated Files</h3>
                <ul>
                    <li>index.php - Homepage offers</li>
                    <li>package-list.php - Package prices</li>
                    <li>package-details.php - Detail prices</li>
                    <li>includes/currency.php - Currency system</li>
                    <li>includes/config.php - System integration</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card">
        <h2>💡 Usage Examples</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace;">
            <p><strong>In PHP templates:</strong></p>
            <p>&lt;?php echo displayPrice($packagePrice); ?&gt; // Converts USD to NGN and formats</p>
            <p>&lt;?php echo formatNaira(1500000); ?&gt; // Formats NGN amount</p>
            <p>&lt;?php echo Currency::format(2500000); ?&gt; // Full class method</p>
            
            <p><strong>Current Settings:</strong></p>
            <p>Currency: <?php echo Currency::getName(); ?> (<?php echo Currency::getCode(); ?>)</p>
            <p>Symbol: <?php echo Currency::getSymbol(); ?></p>
            <p>USD Rate: 1 USD = ₦<?php echo number_format(Currency::getExchangeRate('USD')); ?></p>
        </div>
    </div>

    <div class="card">
        <h2>🚀 Navigation</h2>
        <p>
            <a href="index.php" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">🏠 Main Site</a>
            <a href="package-list.php" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">📦 View Packages</a>
            <a href="test-system.php" style="background: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">🧪 System Test</a>
        </p>
    </div>
</body>
</html>