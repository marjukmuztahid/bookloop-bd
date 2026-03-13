
-- Add sold_pending_delivery to allowed statuses
ALTER TABLE public.listings DROP CONSTRAINT listings_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_status_check CHECK (status = ANY (ARRAY['pending'::text, 'available'::text, 'sold'::text, 'sold_pending_delivery'::text, 'rejected'::text]));

-- Update RLS policy to also show sold_pending_delivery listings publicly
DROP POLICY "Anyone can view available listings" ON public.listings;
CREATE POLICY "Anyone can view available listings" ON public.listings
  FOR SELECT TO public
  USING ((status IN ('available', 'sold_pending_delivery')) OR (auth.uid() = seller_id));
