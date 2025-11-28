-- Add frame_option column to sub_orders table
ALTER TABLE sub_orders 
ADD COLUMN frame_option TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN sub_orders.frame_option IS 'Type of frame installation: כנף עם משקוף, כנף בלי משקוף, רק משקוף';