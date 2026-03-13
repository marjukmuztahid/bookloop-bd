CREATE OR REPLACE FUNCTION public.mark_listing_sold_pending(p_listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.listings
  SET status = 'sold_pending_delivery'
  WHERE id = p_listing_id
    AND status = 'available';
END;
$$;