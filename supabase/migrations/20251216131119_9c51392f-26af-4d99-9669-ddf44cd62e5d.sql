-- =====================================================
-- STOCK MOVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movement_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  product_id UUID,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  partner_name TEXT,
  partner_type TEXT,
  order_id UUID,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_stock_movements_updated_at 
  BEFORE UPDATE ON stock_movements 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON stock_movements FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON stock_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON stock_movements FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON stock_movements FOR DELETE USING (true);

CREATE INDEX idx_stock_movements_date ON stock_movements(movement_date);
CREATE INDEX idx_stock_movements_product_type ON stock_movements(product_type);
CREATE INDEX idx_stock_movements_movement_type ON stock_movements(movement_type);

-- =====================================================
-- CUSTOMER PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_id UUID,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  open_debt NUMERIC GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  payment_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'בהמתנה',
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_customer_payments_updated_at 
  BEFORE UPDATE ON customer_payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE customer_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON customer_payments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON customer_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON customer_payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON customer_payments FOR DELETE USING (true);

CREATE INDEX idx_customer_payments_status ON customer_payments(status);
CREATE INDEX idx_customer_payments_customer_name ON customer_payments(customer_name);

-- =====================================================
-- SUPPLIER PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS supplier_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name TEXT NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  open_debt NUMERIC GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  payment_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'בהמתנה',
  payment_method TEXT,
  payment_reference TEXT,
  invoice_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_supplier_payments_updated_at 
  BEFORE UPDATE ON supplier_payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE supplier_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON supplier_payments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON supplier_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON supplier_payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON supplier_payments FOR DELETE USING (true);

CREATE INDEX idx_supplier_payments_status ON supplier_payments(status);
CREATE INDEX idx_supplier_payments_supplier_name ON supplier_payments(supplier_name);