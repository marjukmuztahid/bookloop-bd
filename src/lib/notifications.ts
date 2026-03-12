import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'listing' | 'order' | 'delivery' | 'payment' | 'system';

export async function sendNotification(
  userId: string,
  message: string,
  type: NotificationType = 'system'
): Promise<void> {
  await supabase.from('notifications').insert({
    user_id: userId,
    message,
    type,
  } as any);
}
