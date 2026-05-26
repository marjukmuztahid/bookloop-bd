DO $$
BEGIN
  -- Insert into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '72c0c6b2-89c8-441d-a9ab-e200f969595d') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, aud, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      '72c0c6b2-89c8-441d-a9ab-e200f969595d',
      'bookloopbd.com@gmail.com',
      '$2a$10$3zMhP.K0P.GfA5Xk6i6/GOnbB.e7y2Nl15qf44/0Xw.x1d4Y89Jie', -- dummy hash for 'admin123'
      now(),
      'authenticated',
      'authenticated',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    );
  END IF;

  -- Insert into public.users if not exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = '72c0c6b2-89c8-441d-a9ab-e200f969595d') THEN
    INSERT INTO public.users (id, full_name, phone, district, bkash_nagad_number, is_banned, created_at)
    VALUES (
      '72c0c6b2-89c8-441d-a9ab-e200f969595d',
      'BookLoop Admin',
      '01700000000',
      'Dhaka',
      NULL,
      false,
      now()
    );
  END IF;

  -- Insert into public.admin_users if not exists
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE id = '72c0c6b2-89c8-441d-a9ab-e200f969595d') THEN
    INSERT INTO public.admin_users (id, email)
    VALUES ('72c0c6b2-89c8-441d-a9ab-e200f969595d', 'bookloopbd.com@gmail.com');
  END IF;
END $$;