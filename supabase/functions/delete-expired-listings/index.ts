import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date().toISOString();

    // Find expired available listings
    const { data: expired } = await supabase
      .from('listings')
      .select('id, book_name, seller_id')
      .eq('status', 'available')
      .lt('expires_at', now);

    if (!expired?.length) {
      return new Response(JSON.stringify({ message: 'No expired listings' }), { status: 200 });
    }

    for (const listing of expired) {
      // Delete listing
      await supabase.from('listings').delete().eq('id', listing.id);

      // Log activity
      await supabase.from('activity_log').insert({
        event_type: 'listing_expired',
        description: `Listing "${listing.book_name}" expired and was removed`,
      });

      // Notify seller
      await supabase.from('notifications').insert({
        user_id: listing.seller_id,
        message: `Your listing for "${listing.book_name}" has expired and been removed.`,
        type: 'listing',
      });
    }

    return new Response(JSON.stringify({ deleted: expired.length }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
