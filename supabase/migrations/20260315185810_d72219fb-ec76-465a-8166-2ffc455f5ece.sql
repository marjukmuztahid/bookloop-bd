ALTER TABLE public.listings
DROP CONSTRAINT IF EXISTS listings_status_check;

ALTER TABLE public.listings
ADD CONSTRAINT listings_status_check
CHECK (
  status = ANY (
    ARRAY[
      'pending'::text,
      'available'::text,
      'sold'::text,
      'sold_pending_delivery'::text,
      'rejected'::text,
      'deleted'::text,
      'expired'::text
    ]
  )
);