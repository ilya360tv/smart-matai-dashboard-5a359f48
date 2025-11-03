-- Add price columns to pull_handles_inventory
ALTER TABLE public.pull_handles_inventory 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 0;

-- Add price columns to locking_products_inventory
ALTER TABLE public.locking_products_inventory 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 0;

-- Add price columns to hardware_inventory
ALTER TABLE public.hardware_inventory 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 0;

-- Add price columns to all door tables
ALTER TABLE public.doors_d6 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 670,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 800,
ADD COLUMN IF NOT EXISTS hardware_addition numeric DEFAULT 50;

ALTER TABLE public.doors_d7 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 670,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 800,
ADD COLUMN IF NOT EXISTS hardware_addition numeric DEFAULT 50;

ALTER TABLE public.doors_d80 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 670,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 800,
ADD COLUMN IF NOT EXISTS hardware_addition numeric DEFAULT 50;

ALTER TABLE public.doors_d82 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 670,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 800,
ADD COLUMN IF NOT EXISTS hardware_addition numeric DEFAULT 50;

ALTER TABLE public.doors_d88 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 670,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 800,
ADD COLUMN IF NOT EXISTS hardware_addition numeric DEFAULT 50;

ALTER TABLE public.doors_d100 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 770,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 950,
ADD COLUMN IF NOT EXISTS hardware_addition numeric DEFAULT 50;

ALTER TABLE public.doors_d_rhk 
ADD COLUMN IF NOT EXISTS supplier_price numeric DEFAULT 670,
ADD COLUMN IF NOT EXISTS reseller_price numeric DEFAULT 800,
ADD COLUMN IF NOT EXISTS hardware_addition numeric DEFAULT 50;

-- Create table for frame heads (ראש)
CREATE TABLE IF NOT EXISTS public.frame_heads_130 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size integer NOT NULL,
  type_9016t integer NOT NULL DEFAULT 0,
  type_9001t integer NOT NULL DEFAULT 0,
  type_7126d integer NOT NULL DEFAULT 0,
  type_0096d integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.frame_heads_130 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.frame_heads_130 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.frame_heads_130 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.frame_heads_130 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.frame_heads_130 FOR DELETE USING (true);

CREATE TRIGGER update_frame_heads_130_updated_at
  BEFORE UPDATE ON public.frame_heads_130
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for frame heads 240
CREATE TABLE IF NOT EXISTS public.frame_heads_240 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size integer NOT NULL,
  type_9016t integer NOT NULL DEFAULT 0,
  type_9001t integer NOT NULL DEFAULT 0,
  type_7126d integer NOT NULL DEFAULT 0,
  type_0096d integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.frame_heads_240 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.frame_heads_240 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.frame_heads_240 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.frame_heads_240 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.frame_heads_240 FOR DELETE USING (true);

CREATE TRIGGER update_frame_heads_240_updated_at
  BEFORE UPDATE ON public.frame_heads_240
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for frame legs (רגליים)
CREATE TABLE IF NOT EXISTS public.frame_legs_130 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  direction text NOT NULL,
  type_9016t integer NOT NULL DEFAULT 0,
  type_9001t integer NOT NULL DEFAULT 0,
  type_7126d integer NOT NULL DEFAULT 0,
  type_0096d integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.frame_legs_130 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.frame_legs_130 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.frame_legs_130 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.frame_legs_130 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.frame_legs_130 FOR DELETE USING (true);

CREATE TRIGGER update_frame_legs_130_updated_at
  BEFORE UPDATE ON public.frame_legs_130
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for frame legs 240
CREATE TABLE IF NOT EXISTS public.frame_legs_240 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  direction text NOT NULL,
  type_9016t integer NOT NULL DEFAULT 0,
  type_9001t integer NOT NULL DEFAULT 0,
  type_7126d integer NOT NULL DEFAULT 0,
  type_0096d integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.frame_legs_240 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.frame_legs_240 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.frame_legs_240 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.frame_legs_240 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.frame_legs_240 FOR DELETE USING (true);

CREATE TRIGGER update_frame_legs_240_updated_at
  BEFORE UPDATE ON public.frame_legs_240
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for inserts (אינסרט)
CREATE TABLE IF NOT EXISTS public.inserts_150 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size integer NOT NULL,
  type_9016 integer NOT NULL DEFAULT 0,
  type_7126 integer NOT NULL DEFAULT 0,
  type_mr09 integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.inserts_150 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.inserts_150 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.inserts_150 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.inserts_150 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.inserts_150 FOR DELETE USING (true);

CREATE TRIGGER update_inserts_150_updated_at
  BEFORE UPDATE ON public.inserts_150
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update prices for pull handles
UPDATE public.pull_handles_inventory SET supplier_price = 40, reseller_price = 50 WHERE handle_type = 'ידית אילת חצי' AND color = 'שחור';
UPDATE public.pull_handles_inventory SET supplier_price = 40, reseller_price = 50 WHERE handle_type = 'ידית אילת חצי' AND color = 'זהב';
UPDATE public.pull_handles_inventory SET supplier_price = 40, reseller_price = 50 WHERE handle_type = 'ידית אילת חצי' AND color = 'ברונזה';
UPDATE public.pull_handles_inventory SET supplier_price = 40, reseller_price = 50 WHERE handle_type = 'ידית אילת חצי' AND color = 'ניקל';
UPDATE public.pull_handles_inventory SET supplier_price = 50, reseller_price = 70 WHERE handle_type = 'ידית אילת' AND color = 'זהב';
UPDATE public.pull_handles_inventory SET supplier_price = 50, reseller_price = 70 WHERE handle_type = 'ידית אילת' AND color = 'שחור';
UPDATE public.pull_handles_inventory SET supplier_price = 45, reseller_price = 60 WHERE handle_type = 'ידית אילת' AND color = 'ניקל';
UPDATE public.pull_handles_inventory SET supplier_price = 50, reseller_price = 70 WHERE handle_type = 'ידית אילת' AND color = 'ברונזה';
UPDATE public.pull_handles_inventory SET supplier_price = 80, reseller_price = 120 WHERE handle_type = 'ידית אילת מטר';
UPDATE public.pull_handles_inventory SET supplier_price = 80, reseller_price = 120 WHERE handle_type = 'משיכה מטר שטוחה' AND color = 'זהב';
UPDATE public.pull_handles_inventory SET supplier_price = 70, reseller_price = 100 WHERE handle_type = 'משיכה מטר שטוחה' AND color = 'ניקל';
UPDATE public.pull_handles_inventory SET supplier_price = 80, reseller_price = 120 WHERE handle_type = 'משיכה 80 שטוחה';
UPDATE public.pull_handles_inventory SET supplier_price = 120, reseller_price = 150 WHERE handle_type = 'משיכה מטר שטוחה' AND color LIKE '%מוברש%';
UPDATE public.pull_handles_inventory SET supplier_price = 70, reseller_price = 100 WHERE handle_type = 'משיכה מטר עגול';
UPDATE public.pull_handles_inventory SET supplier_price = 80, reseller_price = 120 WHERE handle_type = 'משיכה 1.20עגול';
UPDATE public.pull_handles_inventory SET supplier_price = 20, reseller_price = 30 WHERE handle_type = 'ידית כדור נעה/קבועה' AND color = 'ניקל';
UPDATE public.pull_handles_inventory SET supplier_price = 30, reseller_price = 40 WHERE handle_type = 'ידית כדור נעה/קבועה' AND color IN ('שחור', 'זהב');

-- Update prices for locking products
UPDATE public.locking_products_inventory SET supplier_price = 19.90, reseller_price = 30 WHERE item_type = 'צלי׳ אלבה מפתח';
UPDATE public.locking_products_inventory SET supplier_price = 19.90, reseller_price = 30 WHERE item_type = 'צלי׳ אלבה כפתור';
UPDATE public.locking_products_inventory SET supplier_price = 38, reseller_price = 50 WHERE item_type = 'צלי׳ רב בריח מפתח';
UPDATE public.locking_products_inventory SET supplier_price = 38, reseller_price = 50 WHERE item_type = 'צלי׳ רב בריח כפתור';
UPDATE public.locking_products_inventory SET supplier_price = 55, reseller_price = 70 WHERE item_type = 'צלי׳ רב בריח מנעול כספת';
UPDATE public.locking_products_inventory SET supplier_price = 18.90, reseller_price = 30 WHERE item_type = 'צלי׳ תאומים כפתור';
UPDATE public.locking_products_inventory SET supplier_price = 18.90, reseller_price = 30 WHERE item_type = 'צל׳ תאומים מפתח';
UPDATE public.locking_products_inventory SET supplier_price = 18.90, reseller_price = 30 WHERE item_type LIKE '%פלד%';

-- Update prices for hardware
UPDATE public.hardware_inventory SET supplier_price = 55, reseller_price = 70 WHERE hardware_type = 'פירזול עגול' AND color IN ('ניקל', 'ברונזה');
UPDATE public.hardware_inventory SET supplier_price = 150, reseller_price = 220 WHERE hardware_type = 'אומנויות עגול RB';
UPDATE public.hardware_inventory SET supplier_price = 70, reseller_price = 100 WHERE hardware_type = 'אומנויות עגול';
UPDATE public.hardware_inventory SET supplier_price = 40, reseller_price = 50 WHERE hardware_type = 'פרזול P1';
UPDATE public.hardware_inventory SET supplier_price = 22, reseller_price = 50 WHERE hardware_type = 'ידית אש נעה';
UPDATE public.hardware_inventory SET supplier_price = 30, reseller_price = 50 WHERE hardware_type = 'ידית אש קבועה';
UPDATE public.hardware_inventory SET supplier_price = 40, reseller_price = 50 WHERE hardware_type = 'פירזול גיטרה';
UPDATE public.hardware_inventory SET supplier_price = 50, reseller_price = 70 WHERE hardware_type = 'פירזול מילניום';

-- Insert frame heads 130 data
INSERT INTO public.frame_heads_130 (size, type_9016t, type_9001t, type_7126d, type_0096d, total) VALUES
(600, 2, 0, 0, 0, 2),
(680, 1, 1, 0, 0, 2),
(700, 2, 0, 0, 0, 2),
(720, 1, 0, 1, 0, 2),
(740, 1, 3, 0, 0, 4),
(760, 1, 3, 0, 0, 4),
(780, 1, 1, 1, 0, 3),
(800, 1, 5, 3, 1, 10),
(820, 2, 0, 0, 0, 2),
(840, 2, 0, 2, 0, 4),
(880, 1, 2, 1, 2, 6),
(900, 1, 0, 0, 0, 1),
(940, 0, 0, 1, 0, 1),
(960, 1, 0, 0, 0, 1),
(980, 3, 0, 1, 2, 6),
(1080, 3, 0, 0, 0, 3);

-- Insert frame heads 240 data
INSERT INTO public.frame_heads_240 (size, type_9016t, type_9001t, type_7126d, type_0096d, total) VALUES
(600, 1, 0, 0, 0, 1),
(700, 1, 0, 2, 2, 5),
(800, 3, 2, 4, 4, 13),
(860, 1, 0, 0, 0, 1),
(880, 7, 1, 0, 4, 12),
(980, 0, 2, 1, 0, 3),
(1080, 3, 0, 0, 0, 3);

-- Insert frame legs 130 data
INSERT INTO public.frame_legs_130 (direction, type_9016t, type_9001t, type_7126d, type_0096d, total) VALUES
('ימין', 10, 7, 5, 6, 28),
('שמאל', 6, 7, 6, 0, 19);

-- Insert frame legs 240 data
INSERT INTO public.frame_legs_240 (direction, type_9016t, type_9001t, type_7126d, type_0096d, total) VALUES
('ימין', 4, 3, 4, 5, 16),
('שמאל', 10, 3, 3, 5, 21);

-- Insert inserts 150 data
INSERT INTO public.inserts_150 (size, type_9016, type_7126, type_mr09, total) VALUES
(700, 1, 4, 1, 6),
(740, 1, 0, 0, 1),
(780, 1, 0, 3, 4),
(800, 2, 1, 2, 5),
(820, 2, 1, 3, 6),
(840, 1, 0, 4, 5),
(860, 3, 0, 0, 3),
(880, 3, 2, 0, 5);