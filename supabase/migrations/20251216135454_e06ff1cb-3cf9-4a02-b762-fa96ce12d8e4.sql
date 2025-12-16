-- Update the stock order inventory trigger to handle receipt confirmation
-- When order is created, it's in 'בהזמנה' status (just ordered, not yet received)
-- When order status changes to 'התקבל', products ENTER inventory (incoming)
-- When order is cancelled, if it was received, products exit inventory

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

  -- Handle status change to received (התקבל) - products ENTER inventory
  IF TG_OP = 'UPDATE' AND NEW.status = 'התקבל' AND OLD.status != 'התקבל' THEN
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
      'קבלת הזמנת מלאי #' || NEW.row_number
    );
  END IF;

  -- Handle status change to cancelled - if was received, products exit
  IF TG_OP = 'UPDATE' AND NEW.status = 'מבוטל' AND OLD.status = 'התקבל' THEN
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
      'ביטול הזמנת מלאי שהתקבלה #' || NEW.row_number
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Update default status for stock_orders to 'בהזמנה'
ALTER TABLE stock_orders ALTER COLUMN status SET DEFAULT 'בהזמנה';