DROP POLICY IF EXISTS "Sellers can update their own listings" ON public.listings;
CREATE POLICY "Sellers can update their own listings"
ON public.listings
FOR UPDATE
TO public
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);