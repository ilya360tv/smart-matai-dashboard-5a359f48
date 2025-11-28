-- Add insert fields to sub_orders table
ALTER TABLE sub_orders 
ADD COLUMN insert_width numeric,
ADD COLUMN insert_height numeric,
ADD COLUMN insert_color_1 text,
ADD COLUMN insert_color_2 text;

-- Add comments to explain the columns
COMMENT ON COLUMN sub_orders.insert_width IS 'Width of insert in mm (for insert orders)';
COMMENT ON COLUMN sub_orders.insert_height IS 'Height of insert in mm (for insert orders)';
COMMENT ON COLUMN sub_orders.insert_color_1 IS 'Primary color for insert';
COMMENT ON COLUMN sub_orders.insert_color_2 IS 'Secondary color for insert (optional)';