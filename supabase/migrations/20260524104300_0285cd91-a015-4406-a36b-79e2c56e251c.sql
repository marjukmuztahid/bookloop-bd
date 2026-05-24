
ALTER TABLE public.listings ALTER COLUMN expires_at SET DEFAULT (now() + interval '90 days');

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
    NEW.expires_at := now() + interval '90 days';
  END IF;

  RETURN NEW;
END;
$function$;

UPDATE public.listings
SET expires_at = created_at + interval '90 days'
WHERE status IN ('pending', 'available')
  AND expires_at = created_at + interval '60 days';
