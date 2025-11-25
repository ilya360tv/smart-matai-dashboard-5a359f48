-- Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  active TEXT NOT NULL DEFAULT 'פעיל',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contractors table
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  active TEXT NOT NULL DEFAULT 'פעיל',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers
CREATE POLICY "Enable read access for all users" ON public.suppliers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.suppliers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.suppliers
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.suppliers
  FOR DELETE USING (true);

-- Create policies for contractors
CREATE POLICY "Enable read access for all users" ON public.contractors
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.contractors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.contractors
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.contractors
  FOR DELETE USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at
  BEFORE UPDATE ON public.contractors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();