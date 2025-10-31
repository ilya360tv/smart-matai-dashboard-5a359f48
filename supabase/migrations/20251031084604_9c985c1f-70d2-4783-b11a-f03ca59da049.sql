-- Create doors inventory table
CREATE TABLE public.doors_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL,
  direction TEXT NOT NULL,
  type_9016t INTEGER NOT NULL DEFAULT 0,
  type_9001t INTEGER NOT NULL DEFAULT 0,
  type_7126d INTEGER NOT NULL DEFAULT 0,
  type_0096d INTEGER NOT NULL DEFAULT 0,
  type_mr09 INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.doors_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for full access
CREATE POLICY "Enable read access for all users" 
ON public.doors_inventory 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.doors_inventory 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.doors_inventory 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete access for all users" 
ON public.doors_inventory 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_doors_inventory_updated_at
BEFORE UPDATE ON public.doors_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_doors_inventory_size ON public.doors_inventory(size);
CREATE INDEX idx_doors_inventory_direction ON public.doors_inventory(direction);