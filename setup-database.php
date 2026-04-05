<?php
/**
 * Database Setup Script
 * Run once: http://localhost/Tourism-Management-System-main/setup-database.php
 *
 * This script:
 *  1. Connects to MySQL (no DB selected)
 *  2. Creates tms_system database if missing
 *  3. Creates all required tables
 *  4. Inserts default admin + tourist users
 *  5. Fixes travel_packages.type column (ENUM → VARCHAR if needed)
 *
 * DELETE THIS FILE after running.
 */

// ── Load .env ────────────────────────────────────────────────────────────────
$envPath = __DIR__ . '/backend/.env';
if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        [$name, $value] = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

$host   = $_ENV['DB_HOST'] ?? 'localhost';
$dbName = $_ENV['DB_NAME'] ?? 'tms_system';
$user   = $_ENV['DB_USER'] ?? 'root';
$pass   = $_ENV['DB_PASS'] ?? '';

$log = [];

function out($msg) {
    global $log;
    $log[] = $msg;
    echo $msg . "\n";
    flush();
}

header('Content-Type: text/plain');

out("=== TMS Database Setup ===");
out("Target DB: $dbName on $host");
out("");

try {
    // Connect without selecting a DB first
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    out("✓ Connected to MySQL");

    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    out("✓ Database '$dbName' ready");

    $pdo->exec("USE `$dbName`");

    // ── roles ────────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS `roles` (
        `id`          INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name`        VARCHAR(50)  NOT NULL,
        `description` VARCHAR(255) DEFAULT NULL,
        `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `unique_role_name` (`name`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    out("✓ Table: roles");

    // Seed roles
    $pdo->exec("INSERT IGNORE INTO `roles` (`id`,`name`,`description`) VALUES
        (1,'administrator','Full system access and management'),
        (2,'tourist','Browse and book packages')");

    // ── users ────────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
        `id`             INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `full_name`      VARCHAR(100) NOT NULL,
        `email`          VARCHAR(100) NOT NULL,
        `mobile`         VARCHAR(20)  NOT NULL,
        `password`       VARCHAR(255) NOT NULL,
        `role_id`        INT(11) UNSIGNED NOT NULL DEFAULT 2,
        `status`         ENUM('active','inactive','suspended') DEFAULT 'active',
        `email_verified` TINYINT(1) DEFAULT 0,
        `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `unique_email` (`email`),
        KEY `idx_role`   (`role_id`),
        KEY `idx_status` (`status`),
        CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    out("✓ Table: users");

    // Default users — password is 'password' (bcrypt)
    $hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    $pdo->exec("INSERT IGNORE INTO `users` (`full_name`,`email`,`mobile`,`password`,`role_id`,`status`,`email_verified`) VALUES
        ('System Administrator','admin@tms.com','08012345678','$hash',1,'active',1),
        ('Demo Tourist','tourist@tms.com','08034567890','$hash',2,'active',1)");

    // ── travel_packages ──────────────────────────────────────────────────────
    // Use VARCHAR(50) for type — NOT ENUM — so any type string is accepted
    $pdo->exec("CREATE TABLE IF NOT EXISTS `travel_packages` (
        `id`           INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name`         VARCHAR(200) NOT NULL,
        `slug`         VARCHAR(250) NOT NULL,
        `destination`  VARCHAR(100) NOT NULL,
        `type`         VARCHAR(50)  NOT NULL,
        `duration`     INT(11)      NOT NULL COMMENT 'Duration in days',
        `price`        DECIMAL(10,2) NOT NULL,
        `description`  TEXT         NOT NULL,
        `itinerary`    TEXT         DEFAULT NULL,
        `inclusions`   TEXT         DEFAULT NULL,
        `requirements` TEXT         DEFAULT NULL,
        `image`        VARCHAR(255) DEFAULT NULL,
        `status`       ENUM('draft','published','archived') DEFAULT 'draft',
        `created_by`   INT(11) UNSIGNED NOT NULL,
        `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `unique_slug`    (`slug`),
        KEY `idx_destination`       (`destination`),
        KEY `idx_type`              (`type`),
        KEY `idx_status`            (`status`),
        KEY `idx_created_by`        (`created_by`),
        CONSTRAINT `fk_package_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    out("✓ Table: travel_packages");

    // If table already existed with ENUM, migrate it to VARCHAR
    $stmt = $pdo->query("SELECT COLUMN_TYPE FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = '$dbName' AND TABLE_NAME = 'travel_packages' AND COLUMN_NAME = 'type'");
    $colType = $stmt->fetchColumn();
    if ($colType && stripos($colType, 'enum') !== false) {
        $pdo->exec("ALTER TABLE `travel_packages` MODIFY COLUMN `type` VARCHAR(50) NOT NULL");
        out("✓ Migrated travel_packages.type from ENUM to VARCHAR(50)");
    } else {
        out("  travel_packages.type is already VARCHAR — no migration needed");
    }

    // ── bookings ─────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS `bookings` (
        `id`                  INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `booking_reference`   VARCHAR(20)  NOT NULL,
        `user_id`             INT(11) UNSIGNED NOT NULL,
        `package_id`          INT(11) UNSIGNED NOT NULL,
        `travel_date`         DATE         NOT NULL,
        `participants`        INT(11)      NOT NULL DEFAULT 1,
        `total_amount`        DECIMAL(10,2) NOT NULL,
        `emergency_contact`   VARCHAR(100) DEFAULT NULL,
        `special_requests`    TEXT         DEFAULT NULL,
        `status`              ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
        `cancelled_by`        ENUM('user','admin','system') DEFAULT NULL,
        `cancellation_reason` TEXT         DEFAULT NULL,
        `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `unique_booking_ref` (`booking_reference`),
        KEY `idx_user`        (`user_id`),
        KEY `idx_package`     (`package_id`),
        KEY `idx_status`      (`status`),
        KEY `idx_travel_date` (`travel_date`),
        CONSTRAINT `fk_booking_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)            ON DELETE RESTRICT,
        CONSTRAINT `fk_booking_package` FOREIGN KEY (`package_id`) REFERENCES `travel_packages`(`id`) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    out("✓ Table: bookings");

    // ── visa_applications ────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS `visa_applications` (
        `id`                   INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `application_number`   VARCHAR(20)  NOT NULL,
        `user_id`              INT(11) UNSIGNED NOT NULL,
        `destination_country`  VARCHAR(100) NOT NULL,
        `travel_purpose`       VARCHAR(50)  NOT NULL,
        `intended_travel_date` DATE         NOT NULL,
        `passport_number`      VARCHAR(50)  NOT NULL,
        `passport_expiry`      DATE         DEFAULT NULL,
        `documents`            TEXT         DEFAULT NULL,
        `status`               ENUM('submitted','under_review','approved','rejected') DEFAULT 'submitted',
        `admin_comments`       TEXT         DEFAULT NULL,
        `reviewed_by`          INT(11) UNSIGNED DEFAULT NULL,
        `reviewed_at`          TIMESTAMP NULL DEFAULT NULL,
        `created_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `unique_application_number` (`application_number`),
        KEY `idx_user`        (`user_id`),
        KEY `idx_status`      (`status`),
        KEY `idx_reviewed_by` (`reviewed_by`),
        CONSTRAINT `fk_visa_user`     FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE RESTRICT,
        CONSTRAINT `fk_visa_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    out("✓ Table: visa_applications");

    // ── payments ─────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS `payments` (
        `id`                   INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `transaction_id`       VARCHAR(100) NOT NULL,
        `booking_id`           INT(11) UNSIGNED DEFAULT NULL,
        `visa_application_id`  INT(11) UNSIGNED DEFAULT NULL,
        `user_id`              INT(11) UNSIGNED NOT NULL,
        `amount`               DECIMAL(10,2) NOT NULL,
        `currency`             VARCHAR(3)   DEFAULT 'NGN',
        `payment_method`       VARCHAR(50)  NOT NULL,
        `payment_gateway`      VARCHAR(50)  DEFAULT NULL,
        `gateway_reference`    VARCHAR(100) DEFAULT NULL,
        `status`               ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
        `paid_at`              TIMESTAMP NULL DEFAULT NULL,
        `created_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `unique_transaction_id` (`transaction_id`),
        KEY `idx_booking` (`booking_id`),
        KEY `idx_visa`    (`visa_application_id`),
        KEY `idx_user`    (`user_id`),
        KEY `idx_status`  (`status`),
        CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`)          REFERENCES `bookings`(`id`)           ON DELETE SET NULL,
        CONSTRAINT `fk_payment_visa`    FOREIGN KEY (`visa_application_id`) REFERENCES `visa_applications`(`id`) ON DELETE SET NULL,
        CONSTRAINT `fk_payment_user`    FOREIGN KEY (`user_id`)             REFERENCES `users`(`id`)              ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    out("✓ Table: payments");

    // ── reviews ──────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS `reviews` (
        `id`           INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `package_id`   INT(11) UNSIGNED NOT NULL,
        `user_id`      INT(11) UNSIGNED NOT NULL,
        `booking_id`   INT(11) UNSIGNED NOT NULL,
        `rating`       TINYINT(1) NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
        `comment`      TEXT DEFAULT NULL,
        `status`       ENUM('pending','approved','rejected') DEFAULT 'pending',
        `moderated_by` INT(11) UNSIGNED DEFAULT NULL,
        `moderated_at` TIMESTAMP NULL DEFAULT NULL,
        `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `unique_booking_review` (`booking_id`),
        KEY `idx_package` (`package_id`),
        KEY `idx_user`    (`user_id`),
        KEY `idx_status`  (`status`),
        CONSTRAINT `fk_review_package`   FOREIGN KEY (`package_id`)  REFERENCES `travel_packages`(`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_review_user`      FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`)           ON DELETE CASCADE,
        CONSTRAINT `fk_review_booking`   FOREIGN KEY (`booking_id`)  REFERENCES `bookings`(`id`)        ON DELETE CASCADE,
        CONSTRAINT `fk_review_moderator` FOREIGN KEY (`moderated_by`) REFERENCES `users`(`id`)          ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    out("✓ Table: reviews");

    // ── Final summary ────────────────────────────────────────────────────────
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    out("");
    out("=== Setup Complete ===");
    out("Tables in '$dbName': " . implode(', ', $tables));
    out("");
    out("Default credentials:");
    out("  Admin  → admin@tms.com   / password");
    out("  Tourist→ tourist@tms.com / password");
    out("");
    out("IMPORTANT: Delete this file (setup-database.php) after running.");

} catch (PDOException $e) {
    out("✗ ERROR: " . $e->getMessage());
    out("");
    out("Troubleshooting:");
    out("  - Is XAMPP MySQL running?");
    out("  - Check DB_USER and DB_PASS in backend/.env");
    out("  - Try visiting phpMyAdmin to verify credentials");
}
