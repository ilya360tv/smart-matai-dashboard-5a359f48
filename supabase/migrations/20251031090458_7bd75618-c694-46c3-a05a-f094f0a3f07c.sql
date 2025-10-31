-- Drop the old doors_inventory table
DROP TABLE IF EXISTS public.doors_inventory;

-- Create separate tables for each door type
CREATE TABLE public.doors_d100 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL,
  direction TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.doors_d82 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL,
  direction TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.doors_d80 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL,
  direction TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.doors_d_rhk (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL,
  direction TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.doors_d6 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL,
  direction TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.doors_d7 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL,
  direction TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.doors_d100 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doors_d82 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doors_d80 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doors_d_rhk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doors_d6 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doors_d7 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for doors_d100
CREATE POLICY "Enable read access for all users" ON public.doors_d100 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.doors_d100 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.doors_d100 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.doors_d100 FOR DELETE USING (true);

-- Create RLS policies for doors_d82
CREATE POLICY "Enable read access for all users" ON public.doors_d82 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.doors_d82 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.doors_d82 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.doors_d82 FOR DELETE USING (true);

-- Create RLS policies for doors_d80
CREATE POLICY "Enable read access for all users" ON public.doors_d80 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.doors_d80 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.doors_d80 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.doors_d80 FOR DELETE USING (true);

-- Create RLS policies for doors_d_rhk
CREATE POLICY "Enable read access for all users" ON public.doors_d_rhk FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.doors_d_rhk FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.doors_d_rhk FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.doors_d_rhk FOR DELETE USING (true);

-- Create RLS policies for doors_d6
CREATE POLICY "Enable read access for all users" ON public.doors_d6 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.doors_d6 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.doors_d6 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.doors_d6 FOR DELETE USING (true);

-- Create RLS policies for doors_d7
CREATE POLICY "Enable read access for all users" ON public.doors_d7 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.doors_d7 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.doors_d7 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.doors_d7 FOR DELETE USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_doors_d100_updated_at BEFORE UPDATE ON public.doors_d100 FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doors_d82_updated_at BEFORE UPDATE ON public.doors_d82 FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doors_d80_updated_at BEFORE UPDATE ON public.doors_d80 FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doors_d_rhk_updated_at BEFORE UPDATE ON public.doors_d_rhk FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doors_d6_updated_at BEFORE UPDATE ON public.doors_d6 FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doors_d7_updated_at BEFORE UPDATE ON public.doors_d7 FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();