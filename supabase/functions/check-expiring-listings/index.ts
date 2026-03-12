import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date().toISOString();
    const sevenDaysLater = new Date(Date.now() + 7 * 86400000).toISOString();

    // Find available listings expiring within 7 days that haven't been warned
    const { data: expiring } = await supabase
      .from('listings')
      .select('id, book_name, seller_id, expires_at')
      .eq('status', 'available')
      .eq('expiry_warning_sent', false)
      .gte('expires_at', now)
      .lte('expires_at', sevenDaysLater);

    if (!expiring?.length) {
      return new Response(JSON.stringify({ message: 'No expiring listings' }), { status: 200 });
    }

    for (const listing of expiring) {
      // Send in-app notification
      await supabase.from('notifications').insert({
        user_id: listing.seller_id,
        message: `Your listing for "${listing.book_name}" expires in ${Math.ceil((new Date(listing.expires_at).getTime() - Date.now()) / 86400000)} days. Renew it from your dashboard!`,
        type: 'listing',
      });

      // Mark as warned
      await supabase
        .from('listings')
        .update({ expiry_warning_sent: true })
        .eq('id', listing.id);
    }

    return new Response(JSON.stringify({ processed: expiring.length }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
