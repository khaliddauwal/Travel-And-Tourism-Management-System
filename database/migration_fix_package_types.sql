-- ============================================================
-- Migration: Replace travel_packages.type ENUM with VARCHAR
-- Run this once against your existing database.
-- Safe to run multiple times (checks column type first).
-- ============================================================

-- Step 1: Change ENUM to VARCHAR(50), preserving all existing data
ALTER TABLE `travel_packages`
  MODIFY COLUMN `type` VARCHAR(50) NOT NULL;

-- Step 2: Verify the change
-- SELECT COLUMN_TYPE FROM information_schema.COLUMNS
-- WHERE TABLE_SCHEMA = DATABASE()
--   AND TABLE_NAME = 'travel_packages'
--   AND COLUMN_NAME = 'type';
-- Expected result: varchar(50)
