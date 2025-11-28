-- Add status column to sub_orders table
ALTER TABLE sub_orders ADD COLUMN status TEXT NOT NULL DEFAULT 'פעיל';

-- Add comment to explain the column
COMMENT ON COLUMN sub_orders.status IS 'Status of sub-order: פעיל (active) or בוטל (cancelled)';