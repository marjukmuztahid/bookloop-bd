
CREATE OR REPLACE FUNCTION public.listings_auto_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.display_price := NEW.seller_price * 1.05;
  NEW.expires_at := NEW.created_at + INTERVAL '60 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;
