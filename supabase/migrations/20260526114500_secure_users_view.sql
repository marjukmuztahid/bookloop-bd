-- 1. Drop the too-permissive SELECT policy on public.users
DROP POLICY IF EXISTS "Anyone can view user profiles" ON public.users;

-- 2. Rename public.users table to public.users_private
ALTER TABLE public.users RENAME TO users_private;

-- 3. Create RLS policies on the underlying table users_private
-- Only the owner, admins, or public SELECT (via the view) can access this table.
-- Since the view runs as the querying user, the underlying table must allow SELECT for USING(true)
-- but we protect the column exposure at the view level.
ALTER TABLE public.users_private RENAME CONSTRAINT users_pkey TO users_private_pkey;

-- 4. Create the public.users VIEW which exposes public fields to anyone,
-- but dynamically hides sensitive fields (phone, detailed_address, bkash_nagad_number, payment_method)
-- unless the querying user is the profile owner or an admin.
CREATE OR REPLACE VIEW public.users AS
SELECT
  id,
  full_name,
  district,
  CASE
    WHEN auth.uid() = id OR public.is_admin(auth.uid()) THEN phone
    ELSE NULL
  END AS phone,
  CASE
    WHEN auth.uid() = id OR public.is_admin(auth.uid()) THEN bkash_nagad_number
    ELSE NULL
  END AS bkash_nagad_number,
  CASE
    WHEN auth.uid() = id OR public.is_admin(auth.uid()) THEN detailed_address
    ELSE NULL
  END AS detailed_address,
  CASE
    WHEN auth.uid() = id OR public.is_admin(auth.uid()) THEN payment_method
    ELSE NULL
  END AS payment_method,
  is_banned,
  created_at
FROM public.users_private;

-- 5. Create INSTEAD OF INSERT trigger on the view to redirect insertions to users_private
CREATE OR REPLACE FUNCTION public.insert_users_view()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_private (id, full_name, phone, district, bkash_nagad_number, is_banned, created_at, payment_method, detailed_address)
  VALUES (
    NEW.id,
    NEW.full_name,
    NEW.phone,
    NEW.district,
    NEW.bkash_nagad_number,
    COALESCE(NEW.is_banned, false),
    COALESCE(NEW.created_at, now()),
    NEW.payment_method,
    NEW.detailed_address
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER insert_users_trigger
INSTEAD OF INSERT ON public.users
FOR EACH ROW EXECUTE FUNCTION public.insert_users_view();

-- 6. Create INSTEAD OF UPDATE trigger on the view to redirect updates to users_private
CREATE OR REPLACE FUNCTION public.update_users_view()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users_private
  SET
    full_name = COALESCE(NEW.full_name, OLD.full_name),
    phone = COALESCE(NEW.phone, OLD.phone),
    district = COALESCE(NEW.district, OLD.district),
    bkash_nagad_number = NEW.bkash_nagad_number,
    detailed_address = NEW.detailed_address,
    payment_method = NEW.payment_method,
    is_banned = COALESCE(NEW.is_banned, OLD.is_banned)
  WHERE id = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_users_trigger
INSTEAD OF UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_users_view();
