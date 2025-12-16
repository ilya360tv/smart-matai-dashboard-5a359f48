-- Create function to handle inventory deduction when order is created
CREATE OR REPLACE FUNCTION public.handle_order_inventory_deduction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_name TEXT;
  inventory_table TEXT;
  door_size TEXT;
BEGIN
  -- Only process if status is 'פעיל'
  IF NEW.status != 'פעיל' THEN
    RETURN NEW;
  END IF;

  -- Determine product name for stock movement
  product_name := COALESCE(NEW.active_door_type, NEW.product_category) || ' ' || 
                  COALESCE(NEW.active_door_width::TEXT, '') || 'x' || 
                  COALESCE(NEW.active_door_height::TEXT, '');

  -- Record stock movement (outgoing)
  INSERT INTO stock_movements (
    movement_type,
    product_name,
    product_type,
    quantity,
    partner_name,
    partner_type,
    order_id,
    notes
  ) VALUES (
    'יציאה',
    product_name,
    NEW.product_category,
    NEW.quantity,
    NEW.partner_name,
    NEW.partner_type,
    NEW.id,
    'הורדה אוטומטית מהזמנה ' || NEW.full_order_number
  );

  RETURN NEW;
END;
$$;

-- Create function to handle inventory restoration when order is cancelled
CREATE OR REPLACE FUNCTION public.handle_order_inventory_restoration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_name TEXT;
BEGIN
  -- Only process if status changed to 'בוטל'
  IF NEW.status = 'בוטל' AND OLD.status != 'בוטל' THEN
    -- Determine product name for stock movement
    product_name := COALESCE(NEW.active_door_type, NEW.product_category) || ' ' || 
                    COALESCE(NEW.active_door_width::TEXT, '') || 'x' || 
                    COALESCE(NEW.active_door_height::TEXT, '');

    -- Record stock movement (incoming - restoration)
    INSERT INTO stock_movements (
      movement_type,
      product_name,
      product_type,
      quantity,
      partner_name,
      partner_type,
      order_id,
      notes
    ) VALUES (
      'כניסה',
      product_name,
      NEW.product_category,
      NEW.quantity,
      NEW.partner_name,
      NEW.partner_type,
      NEW.id,
      'החזרה למלאי - ביטול הזמנה ' || NEW.full_order_number
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create function to handle stock order inventory
CREATE OR REPLACE FUNCTION public.handle_stock_order_inventory()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_name TEXT;
BEGIN
  -- Build product name
  product_name := 'דלת ' || COALESCE(NEW.wing_width::TEXT, '') || 'x' || 
                  COALESCE(NEW.wing_height::TEXT, '') || ' ' || 
                  COALESCE(NEW.door_color, '');

  -- Record stock movement based on status
  IF TG_OP = 'INSERT' AND NEW.status = 'פעיל' THEN
    INSERT INTO stock_movements (
      movement_type,
      product_name,
      product_type,
      quantity,
      partner_name,
      partner_type,
      order_id,
      notes
    ) VALUES (
      'יציאה',
      product_name,
      'הזמנת מלאי',
      NEW.quantity,
      NEW.partner_name,
      NEW.partner_type,
      NEW.id,
      'הורדה אוטומטית מהזמנת מלאי #' || NEW.row_number
    );
  END IF;

  -- Handle status change to cancelled
  IF TG_OP = 'UPDATE' AND NEW.status = 'מבוטל' AND OLD.status != 'מבוטל' THEN
    INSERT INTO stock_movements (
      movement_type,
      product_name,
      product_type,
      quantity,
      partner_name,
      partner_type,
      order_id,
      notes
    ) VALUES (
      'כניסה',
      product_name,
      'הזמנת מלאי',
      NEW.quantity,
      NEW.partner_name,
      NEW.partner_type,
      NEW.id,
      'החזרה למלאי - ביטול הזמנת מלאי #' || NEW.row_number
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers for sub_orders
DROP TRIGGER IF EXISTS trigger_order_inventory_deduction ON sub_orders;
CREATE TRIGGER trigger_order_inventory_deduction
  AFTER INSERT ON sub_orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_inventory_deduction();

DROP TRIGGER IF EXISTS trigger_order_inventory_restoration ON sub_orders;
CREATE TRIGGER trigger_order_inventory_restoration
  AFTER UPDATE ON sub_orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_inventory_restoration();

-- Create triggers for stock_orders
DROP TRIGGER IF EXISTS trigger_stock_order_inventory ON stock_orders;
CREATE TRIGGER trigger_stock_order_inventory
  AFTER INSERT OR UPDATE ON stock_orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_stock_order_inventory();