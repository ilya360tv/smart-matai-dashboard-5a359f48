-- Create stock_orders table for customer/marketer orders that reduce inventory
CREATE TABLE public.stock_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  row_number INTEGER NOT NULL,
  wing_width NUMERIC,
  direction TEXT CHECK (direction IN ('R', 'L')),
  wing_height NUMERIC,
  drilling TEXT CHECK (drilling IN ('100+', '100-', 'HOSEM', 'KATIF', 'RESHAFIM')),
  door_color TEXT CHECK (door_color IN ('9016t', '9001t', '7126d', '0096d', 'mr09')),
  construction_frame TEXT,
  frame_height NUMERIC,
  cover_frame TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  installer_price NUMERIC NOT NULL DEFAULT 0,
  partner_type TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'פעיל',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stock_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.stock_orders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.stock_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.stock_orders FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.stock_orders FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_stock_orders_updated_at
  BEFORE UPDATE ON public.stock_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();