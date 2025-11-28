-- Create order_groups table (קבוצות הזמנות)
CREATE TABLE IF NOT EXISTS public.order_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'פעיל',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sub_orders table (תת-הזמנות)
CREATE TABLE IF NOT EXISTS public.sub_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_group_id UUID NOT NULL REFERENCES public.order_groups(id) ON DELETE CASCADE,
  sub_number INTEGER NOT NULL,
  full_order_number TEXT NOT NULL,
  partner_type TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  active_door_type TEXT,
  fixed_door_type TEXT,
  active_louvre_type TEXT,
  fixed_louvre_type TEXT,
  door_width NUMERIC,
  active_door_direction TEXT,
  fixed_door_direction TEXT,
  door_height NUMERIC,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  installer_price NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_group_id, sub_number)
);

-- Enable RLS on order_groups
ALTER TABLE public.order_groups ENABLE ROW LEVEL SECURITY;

-- Enable RLS on sub_orders
ALTER TABLE public.sub_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for order_groups (allow all operations for now)
CREATE POLICY "Enable read access for all users" ON public.order_groups
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.order_groups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.order_groups
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.order_groups
  FOR DELETE USING (true);

-- Create policies for sub_orders (allow all operations for now)
CREATE POLICY "Enable read access for all users" ON public.sub_orders
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.sub_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.sub_orders
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.sub_orders
  FOR DELETE USING (true);

-- Create trigger for updated_at on order_groups
CREATE TRIGGER update_order_groups_updated_at
  BEFORE UPDATE ON public.order_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on sub_orders
CREATE TRIGGER update_sub_orders_updated_at
  BEFORE UPDATE ON public.sub_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial active group (C47)
INSERT INTO public.order_groups (group_number, status)
VALUES ('C47', 'פעיל')
ON CONFLICT (group_number) DO NOTHING;