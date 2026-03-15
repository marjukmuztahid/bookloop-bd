
-- Change orders FK from CASCADE to RESTRICT
ALTER TABLE public.orders DROP CONSTRAINT orders_listing_id_fkey;
ALTER TABLE public.orders ADD CONSTRAINT orders_listing_id_fkey 
  FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE RESTRICT;

-- Change wishlists FK from CASCADE to SET NULL (wishlists can lose the reference)
ALTER TABLE public.wishlists DROP CONSTRAINT wishlists_listing_id_fkey;
ALTER TABLE public.wishlists ALTER COLUMN listing_id DROP NOT NULL;
ALTER TABLE public.wishlists ADD CONSTRAINT wishlists_listing_id_fkey 
  FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE SET NULL;
