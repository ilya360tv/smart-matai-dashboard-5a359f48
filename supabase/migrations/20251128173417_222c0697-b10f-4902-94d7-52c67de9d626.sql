-- Update sub_orders table to support separate active and fixed door dimensions

-- Rename existing columns to active_door columns
ALTER TABLE sub_orders 
  RENAME COLUMN door_width TO active_door_width;

ALTER TABLE sub_orders 
  RENAME COLUMN door_height TO active_door_height;

-- Add new columns for fixed door dimensions (fixed_door_direction already exists)
ALTER TABLE sub_orders
  ADD COLUMN fixed_door_width numeric,
  ADD COLUMN fixed_door_height numeric;