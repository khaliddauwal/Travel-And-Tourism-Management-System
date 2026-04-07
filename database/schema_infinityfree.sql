-- ============================================
-- Travel & Tourism Management System
-- InfinityFree-compatible schema (no CREATE DATABASE / USE)
-- ============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- ============================================
-- 1. ROLES TABLE
-- ============================================
CREATE TABLE `roles` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'administrator', 'Full system access and management'),
(2, 'tourist', 'Browse and book packages');

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE `users` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role_id` INT(11) UNSIGNED NOT NULL DEFAULT 2,
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `email_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`),
  KEY `idx_role` (`role_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default users (password for both: "password")
INSERT INTO `users` (`full_name`, `email`, `mobile`, `password`, `role_id`, `status`, `email_verified`) VALUES
('System Administrator', 'admin@tms.com', '08012345678', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'active', 1),
('Tourist User', 'tourist@tms.com', '08034567890', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 'active', 1);

-- ============================================
-- 3. TRAVEL PACKAGES TABLE
-- ============================================
CREATE TABLE `travel_packages` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(250) NOT NULL,
  `destination` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `duration` INT(11) NOT NULL COMMENT 'Duration in days',
  `price` DECIMAL(10,2) NOT NULL,
  `description` TEXT NOT NULL,
  `itinerary` TEXT DEFAULT NULL,
  `inclusions` TEXT DEFAULT NULL,
  `requirements` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `created_by` INT(11) UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slug` (`slug`),
  KEY `idx_destination` (`destination`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `fk_package_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. BOOKINGS TABLE
-- ============================================
CREATE TABLE `bookings` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_reference` VARCHAR(20) NOT NULL,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `package_id` INT(11) UNSIGNED NOT NULL,
  `travel_date` DATE NOT NULL,
  `participants` INT(11) NOT NULL DEFAULT 1,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `emergency_contact` VARCHAR(100) DEFAULT NULL,
  `special_requests` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  `cancelled_by` ENUM('user', 'admin', 'system') DEFAULT NULL,
  `cancellation_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_booking_ref` (`booking_reference`),
  KEY `idx_user` (`user_id`),
  KEY `idx_package` (`package_id`),
  KEY `idx_status` (`status`),
  KEY `idx_travel_date` (`travel_date`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_booking_package` FOREIGN KEY (`package_id`) REFERENCES `travel_packages`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. VISA APPLICATIONS TABLE
-- ============================================
CREATE TABLE `visa_applications` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `application_number` VARCHAR(20) NOT NULL,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `destination_country` VARCHAR(100) NOT NULL,
  `travel_purpose` ENUM('tourism', 'business', 'education', 'medical', 'family_visit', 'other') NOT NULL,
  `intended_travel_date` DATE NOT NULL,
  `passport_number` VARCHAR(50) NOT NULL,
  `passport_expiry` DATE DEFAULT NULL,
  `documents` TEXT DEFAULT NULL,
  `status` ENUM('submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',
  `admin_comments` TEXT DEFAULT NULL,
  `reviewed_by` INT(11) UNSIGNED DEFAULT NULL,
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application_number` (`application_number`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_reviewed_by` (`reviewed_by`),
  CONSTRAINT `fk_visa_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_visa_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. PAYMENTS TABLE
-- ============================================
CREATE TABLE `payments` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_id` VARCHAR(100) NOT NULL,
  `booking_id` INT(11) UNSIGNED DEFAULT NULL,
  `visa_application_id` INT(11) UNSIGNED DEFAULT NULL,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(3) DEFAULT 'NGN',
  `payment_method` ENUM('card', 'bank_transfer', 'mobile_money', 'cash') NOT NULL,
  `payment_gateway` VARCHAR(50) DEFAULT NULL,
  `gateway_reference` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_transaction_id` (`transaction_id`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_visa` (`visa_application_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_visa` FOREIGN KEY (`visa_application_id`) REFERENCES `visa_applications`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. REVIEWS TABLE
-- ============================================
CREATE TABLE `reviews` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` INT(11) UNSIGNED NOT NULL,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `booking_id` INT(11) UNSIGNED NOT NULL,
  `rating` TINYINT(1) NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `moderated_by` INT(11) UNSIGNED DEFAULT NULL,
  `moderated_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_booking_review` (`booking_id`),
  KEY `idx_package` (`package_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_review_package` FOREIGN KEY (`package_id`) REFERENCES `travel_packages`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_moderator` FOREIGN KEY (`moderated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE `notifications` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `type` ENUM('booking', 'visa', 'payment', 'system', 'promotion') NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. PASSWORD RESETS TABLE
-- ============================================
CREATE TABLE `password_resets` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `used` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_token` (`token`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE `activity_logs` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) UNSIGNED DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL,
  `entity_id` INT(11) UNSIGNED DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`, `entity_id`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
