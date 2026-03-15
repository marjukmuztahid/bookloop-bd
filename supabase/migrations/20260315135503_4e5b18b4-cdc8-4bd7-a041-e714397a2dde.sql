
-- Create seller_ratings table
CREATE TABLE public.seller_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL,
  buyer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (buyer_id, listing_id)
);

-- Enable RLS
ALTER TABLE public.seller_ratings ENABLE ROW LEVEL SECURITY;

-- Everyone can read ratings
CREATE POLICY "Anyone can view seller ratings"
  ON public.seller_ratings FOR SELECT
  TO public
  USING (true);

-- Buyers can insert their own ratings (for delivered orders)
CREATE POLICY "Buyers can insert their own ratings"
  ON public.seller_ratings FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.buyer_id = auth.uid()
        AND o.listing_id = seller_ratings.listing_id
        AND o.status = 'delivered'
    )
  );

-- Migrate existing reviews data to seller_ratings
INSERT INTO public.seller_ratings (seller_id, listing_id, buyer_id, rating, created_at)
SELECT seller_id, listing_id, buyer_id, rating, created_at
FROM public.reviews
ON CONFLICT (buyer_id, listing_id) DO NOTHING;

-- Drop reviews table
DROP TABLE IF EXISTS public.reviews;
