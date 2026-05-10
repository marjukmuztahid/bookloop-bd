CREATE OR REPLACE FUNCTION public.listings_auto_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  platform_fee numeric;
BEGIN
  platform_fee := round(NEW.seller_price * 0.10);
  NEW.display_price := NEW.seller_price + platform_fee;

  IF TG_OP = 'INSERT' THEN
    NEW.expires_at := now() + interval '60 days';
  END IF;

  RETURN NEW;
END;
$function$;

-- Recalculate display_price for all existing listings using the new flat 10% fee
UPDATE public.listings
SET display_price = seller_price + round(seller_price * 0.10);