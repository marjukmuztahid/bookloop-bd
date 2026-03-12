
-- Admin users table
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin_users (using security definer function)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = _user_id
  )
$$;

CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Activity log table
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity_log" ON public.activity_log
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert activity_log" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

-- Add rejection_reason to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Allow admins to update any listing
CREATE POLICY "Admins can update any listing" ON public.listings
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- Allow admins to delete listings
CREATE POLICY "Admins can delete any listing" ON public.listings
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Allow admins to view all listings (not just available)
CREATE POLICY "Admins can view all listings" ON public.listings
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Allow admins to update any order
CREATE POLICY "Admins can update any order" ON public.orders
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Allow admins to view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Allow admins to update any user (ban/unban)
CREATE POLICY "Admins can update any user" ON public.users
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- Allow admins to insert notifications for any user
CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
