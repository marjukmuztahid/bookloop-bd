CREATE OR REPLACE FUNCTION public.listings_auto_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  fee_rate numeric;
  platform_fee numeric;
BEGIN
  -- Calculate tiered platform fee
  IF NEW.seller_price <= 500 THEN
    fee_rate := 0.07;
  ELSE
    fee_rate := 0.05;
  END IF;
  
  platform_fee := round(NEW.seller_price * fee_rate);
  NEW.display_price := NEW.seller_price + platform_fee;
  
  -- Set expiry to 60 days from now on insert
  IF TG_OP = 'INSERT' THEN
    NEW.expires_at := now() + interval '60 days';
  END IF;
  
  RETURN NEW;
END;
$$;