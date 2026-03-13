CREATE OR REPLACE FUNCTION public.listings_auto_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.display_price := NEW.seller_price;
  NEW.expires_at := NEW.created_at + INTERVAL '60 days';
  RETURN NEW;
END;
$function$;