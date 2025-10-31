-- Create pull handles inventory table
CREATE TABLE public.pull_handles_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  handle_type TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create locking products inventory table
CREATE TABLE public.locking_products_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hardware inventory table
CREATE TABLE public.hardware_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hardware_type TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pull_handles_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locking_products_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hardware_inventory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pull_handles_inventory
CREATE POLICY "Enable read access for all users" ON public.pull_handles_inventory
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.pull_handles_inventory
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.pull_handles_inventory
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.pull_handles_inventory
  FOR DELETE USING (true);

-- Create RLS policies for locking_products_inventory
CREATE POLICY "Enable read access for all users" ON public.locking_products_inventory
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.locking_products_inventory
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.locking_products_inventory
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.locking_products_inventory
  FOR DELETE USING (true);

-- Create RLS policies for hardware_inventory
CREATE POLICY "Enable read access for all users" ON public.hardware_inventory
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.hardware_inventory
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.hardware_inventory
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.hardware_inventory
  FOR DELETE USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_pull_handles_inventory_updated_at
  BEFORE UPDATE ON public.pull_handles_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locking_products_inventory_updated_at
  BEFORE UPDATE ON public.locking_products_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hardware_inventory_updated_at
  BEFORE UPDATE ON public.hardware_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_pull_handles_handle_type ON public.pull_handles_inventory(handle_type);
CREATE INDEX idx_locking_products_item_type ON public.locking_products_inventory(item_type);
CREATE INDEX idx_hardware_hardware_type ON public.hardware_inventory(hardware_type);