-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  product_width NUMERIC,
  side TEXT CHECK (side IN ('R', 'L', 'ימין', 'שמאל')),
  drilling TEXT,
  katif_blocker TEXT,
  door_color TEXT,
  construction_frame TEXT,
  frame_height NUMERIC,
  cover_frame TEXT,
  electric_lock BOOLEAN DEFAULT false,
  handle_hole BOOLEAN DEFAULT false,
  clamp_holes TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  installer_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth needs)
CREATE POLICY "Enable read access for all users" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.orders 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete access for all users" 
ON public.orders 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_customer_name ON public.orders(customer_name);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);