-- Add type column to notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'system';

-- Add expiry_warning_sent to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS expiry_warning_sent boolean NOT NULL DEFAULT false;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;