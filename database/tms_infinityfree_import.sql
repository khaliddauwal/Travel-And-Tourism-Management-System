/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(11) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 14:45:55'),(2,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 14:59:35'),(3,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 15:35:55'),(4,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 10:58:33'),(5,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:38:42'),(6,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:39:42'),(7,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-02 02:11:26'),(8,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-02 02:17:32'),(9,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-05 10:58:45'),(10,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-05 11:04:13'),(11,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-06 01:02:07'),(12,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-06 01:13:10'),(13,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 00:32:51'),(14,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 00:43:16'),(15,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 00:52:09'),(16,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 00:53:55'),(17,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 01:12:24'),(18,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 01:20:33'),(19,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 01:32:19'),(20,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 01:44:51'),(21,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 01:56:44'),(22,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 02:02:09'),(23,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-07 02:06:14'),(24,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 16:13:56'),(25,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 17:03:00'),(26,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 17:13:25'),(27,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 18:45:23'),(28,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-12 03:37:29'),(29,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-29 05:11:19'),(30,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-29 06:58:38'),(31,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 09:50:49'),(32,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 09:59:17'),(33,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 10:13:25'),(34,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 10:13:43'),(35,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 12:17:39'),(36,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920','2026-03-31 22:36:25'),(37,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 22:41:48'),(38,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 23:09:22'),(39,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 23:12:08'),(40,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-31 23:20:43'),(41,3,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920','2026-04-01 20:55:28'),(42,3,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920','2026-04-01 20:55:54'),(43,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920','2026-04-01 20:56:20'),(44,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 20:59:38'),(45,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 21:03:34'),(46,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 21:04:13'),(47,3,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920','2026-04-01 21:17:16'),(48,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 21:41:27'),(49,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 21:48:50'),(50,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 21:49:28'),(51,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 21:54:43'),(52,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 22:03:18'),(53,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 22:08:58'),(54,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-01 22:11:40'),(55,6,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-04 21:38:03'),(56,1,'login',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-04-04 22:05:13');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) unsigned DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_table_name` (`table_name`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `booking_reference` varchar(20) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `package_id` int(11) unsigned NOT NULL,
  `travel_date` date NOT NULL,
  `participants` int(11) NOT NULL DEFAULT 1,
  `total_amount` decimal(10,2) NOT NULL,
  `emergency_contact` varchar(100) DEFAULT NULL,
  `special_requests` text DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `cancelled_by` enum('user','admin','system') DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_booking_ref` (`booking_reference`),
  KEY `idx_user` (`user_id`),
  KEY `idx_package` (`package_id`),
  KEY `idx_status` (`status`),
  KEY `idx_travel_date` (`travel_date`),
  CONSTRAINT `fk_booking_package` FOREIGN KEY (`package_id`) REFERENCES `travel_packages` (`id`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'TMS-6CB85659',6,24,'2026-04-21',1,2110000.00,'khalid (+2347044585406)',NULL,'pending',NULL,NULL,'2026-04-04 21:46:51','2026-04-04 21:46:51',NULL),(2,'TMS-6FD0D17D',6,24,'2026-04-23',1,2110000.00,'khalid (+2347044585406)',NULL,'confirmed',NULL,NULL,'2026-04-04 21:47:41','2026-04-04 22:10:48',NULL),(3,'TMS-925864F4',6,25,'2026-04-17',1,99999999.99,'khalid (+2347044585406)',NULL,'pending',NULL,NULL,'2026-04-04 21:56:53','2026-04-04 21:56:53',NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `type` enum('booking','visa','payment','system','promotion') NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,3,'visa','Visa Application Submitted','Your visa application VISA-2026-AD8F34 has been submitted successfully.','/visa-status',0,'2026-04-01 20:55:54'),(2,3,'visa','Visa Application Updated','Your visa application VISA-2026-AD8F34 status changed to under_review.','/visa-status',0,'2026-04-01 20:56:21'),(3,6,'visa','Visa Application Submitted','Your visa application VISA-2026-47B175 has been submitted successfully.','/visa-status',0,'2026-04-01 21:00:36'),(4,6,'visa','Visa Application Updated','Your visa application VISA-2026-47B175 status changed to under_review.','/visa-status',0,'2026-04-01 21:03:55'),(5,6,'visa','Visa Application Submitted','Your visa application VISA-2026-12F08C has been submitted successfully.','/visa-status',0,'2026-04-01 21:15:29'),(6,6,'visa','Visa Application Submitted','Your visa application VISA-2026-93E1D5 has been submitted successfully.','/visa-status',0,'2026-04-01 21:16:09'),(7,6,'visa','Visa Application Submitted','Your visa application VISA-2026-84EDE5 has been submitted successfully.','/visa-status',0,'2026-04-01 21:41:12'),(8,6,'visa','Visa Application Updated','Your visa application VISA-2026-84EDE5 status changed to under_review.','/visa-status',0,'2026-04-01 21:42:10'),(9,6,'visa','Visa Application Submitted','Your visa application VISA-2026-5973B8 has been submitted successfully.','/visa-status',0,'2026-04-01 21:55:17'),(10,6,'visa','Visa Application Submitted','Your visa application VISA-2026-70D570 has been submitted successfully.','/visa-status',0,'2026-04-01 22:03:51'),(11,6,'visa','Visa Application Updated','Your visa application VISA-2026-93E1D5 status changed to approved.','/visa-status',0,'2026-04-01 22:09:18'),(12,6,'visa','Visa Application Updated','Your visa application VISA-2026-70D570 status changed to rejected.','/visa-status',0,'2026-04-01 22:09:46'),(13,6,'booking','Booking Created','Your booking TMS-6CB85659 has been created successfully','/bookings/1',0,'2026-04-04 21:46:51'),(14,6,'booking','Booking Created','Your booking TMS-6FD0D17D has been created successfully','/bookings/2',0,'2026-04-04 21:47:41'),(15,6,'booking','Booking Created','Your booking TMS-925864F4 has been created successfully','/bookings/3',0,'2026-04-04 21:56:53'),(16,6,'visa','Visa Application Submitted','Your visa application VISA-2026-118B1E has been submitted successfully.','/visa-status',0,'2026-04-04 21:59:45'),(17,6,'booking','Booking Status Updated','Your booking TMS-6FD0D17D status has been updated to confirmed','/bookings/2',0,'2026-04-04 22:10:48');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_token` (`token`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(100) NOT NULL,
  `booking_id` int(11) unsigned DEFAULT NULL,
  `visa_application_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'NGN',
  `payment_method` enum('card','bank_transfer','mobile_money','cash') NOT NULL,
  `payment_gateway` varchar(50) DEFAULT NULL,
  `gateway_reference` varchar(100) DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_transaction_id` (`transaction_id`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_visa` (`visa_application_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_payment_visa` FOREIGN KEY (`visa_application_id`) REFERENCES `visa_applications` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `package_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `booking_id` int(11) unsigned NOT NULL,
  `rating` tinyint(1) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `moderated_by` int(11) unsigned DEFAULT NULL,
  `moderated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_booking_review` (`booking_id`),
  KEY `idx_package` (`package_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `fk_review_moderator` (`moderated_by`),
  CONSTRAINT `fk_review_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_moderator` FOREIGN KEY (`moderated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_package` FOREIGN KEY (`package_id`) REFERENCES `travel_packages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'administrator','Full system access and management','2026-02-19 15:34:46'),(2,'agent','Manage packages and bookings','2026-02-19 15:34:46'),(3,'tourist','Browse and book packages','2026-02-19 15:34:46');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_packages`
--

DROP TABLE IF EXISTS `travel_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_packages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `type` enum('city_tour','adventure','festival','cultural','nature','wildlife','religious','educational','luxury','budget','umrah','hajj') NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'Duration in days',
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `itinerary` text DEFAULT NULL,
  `inclusions` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'published',
  `created_by` int(11) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slug` (`slug`),
  KEY `idx_destination` (`destination`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `fk_package_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_packages`
--

LOCK TABLES `travel_packages` WRITE;
/*!40000 ALTER TABLE `travel_packages` DISABLE KEYS */;
INSERT INTO `travel_packages` VALUES (1,'Umrah','umrah','Saudi Arabia (makka and madina)','umrah',15,100000.00,'BookingManagement.tsx:45 Failed to load bookings: TypeError: response.data.data.map is not a function\r\n    at ApiService.getBookings (api.ts:398:1)\r\n    at async BookingManagement.tsx:32:1\r\n\r\nBookingManagement.tsx:45 Failed to load bookings: TypeError: response.data.data.map is not a function\r\n    at ApiService.getBookings (api.ts:398:1)\r\n    at async BookingManagement.tsx:32:1\r\n\r\n',NULL,'UMRAH',NULL,NULL,'published',1,'2026-03-29 06:57:34','2026-03-31 11:56:47',NULL),(2,'Umrah','umrah-2','Saudi Arabia (makka and madina)','umrah',21,1000000.00,'Umrah package',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 09:58:02','2026-03-31 11:56:47',NULL),(3,'Umrah','umrah-3','Saudi Arabia (makka and madina)','umrah',21,1000000.00,'umrahh',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 10:14:31','2026-03-31 11:56:47',NULL),(4,'Umrah','umrah-4','Saudi Arabia (makka and madina)','umrah',21,1000000.00,'umrahh',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:04:06','2026-03-31 11:56:47',NULL),(5,'Umrah','umrah-5','Saudi Arabia (makka and madina)','religious',21,1200000.00,'umrahhh',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:06:23','2026-03-31 11:06:23',NULL),(6,'Umrah','umrah-6','Saudi Arabia (makka and madina)','umrah',19,1200000.00,'Umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:08:59','2026-03-31 11:56:47',NULL),(8,'Umrah','umrah-8','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:40:00','2026-03-31 11:56:47',NULL),(10,'Umrah','umrah-10','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:40:15','2026-03-31 11:56:47',NULL),(11,'Umrah','umrah-11','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:40:16','2026-03-31 11:56:47',NULL),(12,'Umrah','umrah-12','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:40:17','2026-03-31 11:56:47',NULL),(13,'Umrah','umrah-13','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:40:18','2026-03-31 11:56:47',NULL),(14,'Umrah','umrah-14','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:40:19','2026-03-31 11:56:47',NULL),(15,'Umrah','umrah-15','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:46:44','2026-03-31 11:56:47',NULL),(16,'Umrah','umrah-16','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:46:48','2026-03-31 11:56:47',NULL),(17,'Umrah','umrah-17','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:46:50','2026-03-31 11:56:47',NULL),(18,'Umrah','umrah-18','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:46:56','2026-03-31 11:56:47',NULL),(19,'Umrah','umrah-19','Saudi Arabia (makka and madina)','umrah',21,2133000.00,'umrah trip',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:52:01','2026-03-31 11:56:47',NULL),(20,'Umrah','umrah-20','Saudi Arabia (makka and madina)','umrah',21,2130000.00,'umrah trip',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:53:24','2026-03-31 11:56:47',NULL),(21,'Umrah','umrah-21','Saudi Arabia (makka and madina)','umrah',21,2130000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 11:59:10','2026-03-31 11:59:10',NULL),(22,'Umrah','umrah-22','Saudi Arabia (makka and madina)','religious',21,210000.00,'umrah',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 12:18:26','2026-03-31 12:18:26',NULL),(23,'Umrah','umrah-23','Saudi Arabia (makka and madina)','umrah',21,2111000.00,'umrah',NULL,'UMRAH',NULL,NULL,'published',1,'2026-03-31 20:54:04','2026-03-31 20:54:04',NULL),(24,'Umrah','umrah-24','Saudi Arabia (makka and madina)','umrah',21,2110000.00,'hotel',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 20:59:47','2026-03-31 20:59:47',NULL),(25,'Summer Vacation','summer-vacation','monaco','city_tour',8,99999999.99,'montecarlo',NULL,'hotel, transport',NULL,NULL,'published',1,'2026-03-31 21:14:19','2026-03-31 21:14:19',NULL);
/*!40000 ALTER TABLE `travel_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) unsigned NOT NULL DEFAULT 3,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`),
  KEY `idx_role` (`role_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Administrator','admin@tms.com','08012345678','$2y$10$sHEYYOEBowMTzt4MJUqFouDIe7SqfM2NIPF4WyUmsijozByto.b6W',1,'active',1,'2026-02-19 15:34:46','2026-02-20 14:59:17',NULL),(2,'Travel Agent','agent@tms.com','08023456789','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',2,'active',1,'2026-02-19 15:34:46','2026-02-19 15:34:46',NULL),(3,'Demo Tourist','tourist@tms.com','08034567890','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',3,'active',1,'2026-02-19 15:34:46','2026-02-19 15:34:46',NULL),(4,'Test User 1771596734901','test1771596734901@test.com','08012345678','$2y$10$vYqzPK6rnnfcEXdbKKiCBuqat6P/dTnpP13ldcng9zJG99iRODJcy',3,'active',0,'2026-02-20 14:12:15','2026-02-20 14:12:15',NULL),(5,'Test User 1771596770048','test1771596770048@test.com','08012345678','$2y$10$HT3Msm9ZOABD82zqGBgkO.W.6CZ0gpHI.oP8Ogpazf1uP3GdwIqaa',3,'active',0,'2026-02-20 14:12:50','2026-02-20 14:12:50',NULL),(6,'Khalid Auwal Hafiz','khalidauwal732@gmail.com','2347044585406','$2y$10$t9F4ECgSQoCA46tbxDuHT.wBC6P4y8h/t3W5fNjK0UVw3OLyt4mpa',3,'active',0,'2026-02-20 14:33:34','2026-02-20 14:33:34',NULL),(7,'Clear Path Agency','aukhtrv@gmail.com','2347044585406','$2y$10$/6OnqFFcJ23hhj2d9jObguEKeOrp7cM3ZPYJ2.ndH6cK5NEKP/x5C',3,'active',0,'2026-02-20 14:48:18','2026-02-20 14:48:18',NULL),(8,'khalid auwal','khalidauwal@gmail.com','2347044585406','$2y$10$ECg3TjYRWqYLFGyAQNUVJeTGEmcNaq5OYpKMyCWQZgzakOmtmvy02',3,'active',0,'2026-03-08 16:23:31','2026-03-08 16:23:31',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visa_applications`
--

DROP TABLE IF EXISTS `visa_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visa_applications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `application_number` varchar(20) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `destination_country` varchar(100) NOT NULL,
  `travel_purpose` enum('tourism','business','education','medical','family_visit','other') NOT NULL,
  `intended_travel_date` date NOT NULL,
  `passport_number` varchar(50) NOT NULL,
  `passport_expiry` date DEFAULT NULL,
  `documents` text DEFAULT NULL COMMENT 'JSON array of uploaded documents',
  `status` enum('submitted','under_review','approved','rejected') DEFAULT 'submitted',
  `admin_comments` text DEFAULT NULL,
  `reviewed_by` int(11) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application_number` (`application_number`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_reviewed_by` (`reviewed_by`),
  KEY `idx_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_visa_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_visa_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visa_applications`
--

LOCK TABLES `visa_applications` WRITE;
/*!40000 ALTER TABLE `visa_applications` DISABLE KEYS */;
INSERT INTO `visa_applications` VALUES (1,'VISA-2026-AD8F34',3,'United Kingdom','tourism','2027-06-15','AB1234567',NULL,'[]','under_review','Documents look good, processing.',1,'2026-04-01 20:56:21','2026-04-01 20:55:54','2026-04-01 20:56:21',NULL),(2,'VISA-2026-47B175',6,'saudi','other','2026-04-20','B04597247',NULL,'[\"C:\\\\xampp\\\\htdocs\\\\TTMS-DUAL-ROLES\\\\backend\\\\api\\\\v2\\\\controllers\\/..\\/..\\/uploads\\/visa_documents\\/69cd87747aae7_1775077236.jpeg\"]','under_review','',1,'2026-04-01 21:03:55','2026-04-01 21:00:36','2026-04-01 21:03:55',NULL),(3,'VISA-2026-12F08C',6,'United State','business','2026-04-14','B04597247',NULL,'[]','submitted',NULL,NULL,NULL,'2026-04-01 21:15:29','2026-04-01 21:15:29',NULL),(4,'VISA-2026-93E1D5',6,'Canada','tourism','2026-04-19','B04597247',NULL,'[]','approved','',1,'2026-04-01 22:09:18','2026-04-01 21:16:09','2026-04-01 22:09:18',NULL),(5,'VISA-2026-84EDE5',6,'China','education','2026-04-20','B04597247',NULL,'[]','under_review','',1,'2026-04-01 21:42:10','2026-04-01 21:41:12','2026-04-01 21:42:10',NULL),(6,'VISA-2026-5973B8',6,'Portugal','tourism','2026-04-20','B04597247',NULL,'[]','submitted',NULL,NULL,NULL,'2026-04-01 21:55:17','2026-04-01 21:55:17',NULL),(7,'VISA-2026-70D570',6,'Argentina','medical','2026-04-20','B04597247',NULL,'[]','rejected','',1,'2026-04-01 22:09:46','2026-04-01 22:03:51','2026-04-01 22:09:46',NULL),(8,'VISA-2026-118B1E',6,'India','business','2026-04-20','B04597445',NULL,'[]','submitted',NULL,NULL,NULL,'2026-04-04 21:59:45','2026-04-04 21:59:45',NULL);
/*!40000 ALTER TABLE `visa_applications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-07 15:41:35
