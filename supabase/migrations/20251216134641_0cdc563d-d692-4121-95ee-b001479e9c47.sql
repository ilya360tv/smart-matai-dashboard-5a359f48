-- Add missing columns to sub_orders table to match the new structure
ALTER TABLE public.sub_orders 
ADD COLUMN IF NOT EXISTS drilling text,
ADD COLUMN IF NOT EXISTS door_color text,
ADD COLUMN IF NOT EXISTS construction_frame text,
ADD COLUMN IF NOT EXISTS frame_height numeric,
ADD COLUMN IF NOT EXISTS cover_frame text,
ADD COLUMN IF NOT EXISTS electric_lock boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS handle_hole boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS clamp_holes text;