CREATE POLICY "Admins can delete any order"
ON public.orders FOR DELETE TO authenticated
USING (is_admin(auth.uid()));