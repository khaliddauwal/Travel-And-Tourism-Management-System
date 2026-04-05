-- ============================================
-- Migration: Remove Agent Role
-- Description: Refactor system to support only Admin and Tourist roles
-- Date: March 6, 2026
-- ============================================

USE `tms_system`;

-- Step 1: Update existing agent users to tourist role (role_id = 2)
-- This preserves user accounts but changes their role
UPDATE `users` 
SET `role_id` = 2 
WHERE `role_id` = 2 AND EXISTS (
    SELECT 1 FROM `roles` WHERE `id` = 2 AND `name` = 'agent'
);

-- Step 2: Delete the agent role from roles table
DELETE FROM `roles` WHERE `name` = 'agent';

-- Step 3: Update role IDs to maintain consistency
-- Change tourist role from id=3 to id=2
UPDATE `users` SET `role_id` = 2 WHERE `role_id` = 3;

-- Step 4: Update the roles table to have only admin and tourist
DELETE FROM `roles` WHERE `id` > 2;

-- Step 5: Insert correct roles if they don't exist
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'administrator', 'Full system access and management'),
(2, 'tourist', 'Browse and book packages')
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `description` = VALUES(`description`);

-- Step 6: Update default role_id in users table
ALTER TABLE `users` 
MODIFY COLUMN `role_id` INT(11) UNSIGNED NOT NULL DEFAULT 2;

-- Step 7: Verify the changes
SELECT 'Migration completed successfully!' as status;
SELECT * FROM `roles`;
SELECT `role_id`, COUNT(*) as user_count FROM `users` GROUP BY `role_id`;
