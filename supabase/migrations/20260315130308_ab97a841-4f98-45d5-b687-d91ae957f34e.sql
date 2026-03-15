
CREATE OR REPLACE FUNCTION public.decrement_listing_quantity(p_listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_qty integer;
BEGIN
  UPDATE listings
  SET quantity = quantity - 1
  WHERE id = p_listing_id AND quantity > 0
  RETURNING quantity INTO new_qty;

  IF new_qty = 0 THEN
    UPDATE listings
    SET status = 'sold_pending_delivery'
    WHERE id = p_listing_id;
  END IF;
END;
$$;
