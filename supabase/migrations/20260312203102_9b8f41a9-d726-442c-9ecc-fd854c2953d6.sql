
-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  district TEXT NOT NULL,
  bkash_nagad_number TEXT,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create listings table
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_name TEXT NOT NULL,
  author_publisher TEXT NOT NULL,
  curriculum TEXT NOT NULL CHECK (curriculum IN ('bangla_version', 'english_version', 'english_medium')),
  class_level TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'good', 'fair', 'worn')),
  weight_kg NUMERIC NOT NULL,
  seller_price NUMERIC NOT NULL,
  display_price NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'sold', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '60 days')
);

-- Trigger to auto-calculate display_price and expires_at
CREATE OR REPLACE FUNCTION public.listings_auto_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.display_price := NEW.seller_price * 1.05;
  NEW.expires_at := NEW.created_at + INTERVAL '60 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_auto_fields_trigger
BEFORE INSERT OR UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.listings_auto_fields();

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available listings" ON public.listings FOR SELECT USING (status = 'available' OR auth.uid() = seller_id);
CREATE POLICY "Authenticated users can create listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own listings" ON public.listings FOR UPDATE USING (auth.uid() = seller_id);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  delivery_address TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_charge NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'pickup_scheduled', 'in_transit', 'delivered', 'unsuccessful', 'cancelled')),
  pickup_scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view orders for their listings" ON public.orders FOR SELECT USING (auth.uid() IN (SELECT seller_id FROM public.listings WHERE id = listing_id));
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for book photos
INSERT INTO storage.buckets (id, name, public) VALUES ('book-photos', 'book-photos', true);

CREATE POLICY "Anyone can view book photos" ON storage.objects FOR SELECT USING (bucket_id = 'book-photos');
CREATE POLICY "Authenticated users can upload book photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'book-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own book photos" ON storage.objects FOR UPDATE USING (bucket_id = 'book-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own book photos" ON storage.objects FOR DELETE USING (bucket_id = 'book-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
