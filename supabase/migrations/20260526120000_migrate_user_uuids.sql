-- Migration: Map and update migrated user UUIDs to match fresh auth.users UUIDs
-- Created to fix mismatches on new instance migrations.

BEGIN;

-- 1. Ensure public.users has the email column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text;

-- 2. Populate public.users.email from auth.users based on full_name matching if it's null
UPDATE public.users p
SET email = a.email
FROM auth.users a
WHERE p.full_name = (a.raw_user_meta_data->>'full_name') AND p.email IS NULL;

-- 3. Drop referencing foreign key constraints temporarily to allow primary key updates
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_seller_id_fkey;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;

-- 4. Create a temporary table to hold the mapping between old and new UUIDs
CREATE TEMP TABLE uuid_mapping AS
SELECT 
    p.id AS old_id,
    a.id AS new_id
FROM public.users p
JOIN auth.users a ON p.email = a.email
WHERE p.id <> a.id;

-- 5. Update foreign key columns in referencing tables using the mapping
-- Update listings seller_id
UPDATE public.listings l
SET seller_id = m.new_id
FROM uuid_mapping m
WHERE l.seller_id = m.old_id;

-- Also update listings.user_id if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'listings' AND column_name = 'user_id'
    ) THEN
        EXECUTE 'UPDATE public.listings l SET user_id = m.new_id FROM uuid_mapping m WHERE l.user_id = m.old_id';
    END IF;
END $$;

-- Update orders buyer_id
UPDATE public.orders o
SET buyer_id = m.new_id
FROM uuid_mapping m
WHERE o.buyer_id = m.old_id;

-- Also update orders.seller_id if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'seller_id'
    ) THEN
        EXECUTE 'UPDATE public.orders o SET seller_id = m.new_id FROM uuid_mapping m WHERE o.seller_id = m.old_id';
    END IF;
END $$;

-- Update wishlists user_id
UPDATE public.wishlists w
SET user_id = m.new_id
FROM uuid_mapping m
WHERE w.user_id = m.old_id;

-- Update notifications user_id
UPDATE public.notifications n
SET user_id = m.new_id
FROM uuid_mapping m
WHERE n.user_id = m.old_id;

-- Update activity_log user_id if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'activity_log' AND column_name = 'user_id'
    ) THEN
        EXECUTE 'UPDATE public.activity_log a SET user_id = m.new_id FROM uuid_mapping m WHERE a.user_id = m.old_id';
    END IF;
END $$;

-- 6. Resolve user primary key updates and merges in public.users
-- Set-A: If new_id ALREADY exists in public.users, DELETE the old_id row (data is merged/transferred)
DELETE FROM public.users
WHERE id IN (
    SELECT old_id 
    FROM uuid_mapping 
    WHERE new_id IN (SELECT id FROM public.users)
);

-- Set-B: If new_id does NOT exist in public.users, UPDATE old_id to new_id
UPDATE public.users p
SET id = m.new_id
FROM uuid_mapping m
WHERE p.id = m.old_id
  AND m.new_id NOT IN (SELECT id FROM public.users);

-- 7. Restore the foreign key constraints pointing to public.users(id) with CASCADE ON DELETE
ALTER TABLE public.listings 
    ADD CONSTRAINT listings_seller_id_fkey 
    FOREIGN KEY (seller_id) 
    REFERENCES public.users(id) 
    ON DELETE CASCADE;

ALTER TABLE public.orders 
    ADD CONSTRAINT orders_buyer_id_fkey 
    FOREIGN KEY (buyer_id) 
    REFERENCES public.users(id) 
    ON DELETE CASCADE;

ALTER TABLE public.notifications 
    ADD CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES public.users(id) 
    ON DELETE CASCADE;

ALTER TABLE public.wishlists 
    ADD CONSTRAINT wishlists_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES public.users(id) 
    ON DELETE CASCADE;

-- 8. Clean up the temp table
DROP TABLE uuid_mapping;

COMMIT;
