CREATE POLICY "Sellers can delete their own listings"
ON public.listings FOR DELETE
TO public
USING (auth.uid() = seller_id);