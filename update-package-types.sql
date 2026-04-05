-- Update travel_packages table to support all 10 package types
-- Run this in phpMyAdmin or MySQL command line

USE tms_system;

ALTER TABLE travel_packages 
MODIFY COLUMN type ENUM(
  'city_tour',
  'adventure', 
  'festival',
  'cultural',
  'nature',
  'wildlife',
  'religious',
  'educational',
  'luxury',
  'budget'
) NOT NULL;

-- Verify the change
DESCRIBE travel_packages;

SELECT 'Package types updated successfully!' as message;
