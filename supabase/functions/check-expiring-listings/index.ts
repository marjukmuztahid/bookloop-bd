import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

function buildExpiryEmail(sellerFirstName: string, bookTitle: string, daysLeft: number) {
  const dayWord = daysLeft === 1 ? 'day' : 'days';
  const subject = 'Your listing expires soon ⏳';
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F9F9F9;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9F9F9;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">
  <tr><td align="center" style="padding:24px 0 20px">
    <div style="font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-0.5px">♾️ Book Loop BD</div>
    <div style="font-size:11px;color:#8A8A8A;padding-top:4px">Give books a second life</div>
  </td></tr>
  <tr><td style="padding:0 0 16px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.5);border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
      <tr><td align="center" style="padding:32px 24px 28px">
        <div style="font-size:40px;line-height:1;margin-bottom:16px">⏳</div>
        <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1A1A1A;letter-spacing:-0.3px">Listing Expiring Soon</h1>
        <p style="margin:0;font-size:13px;color:#8A8A8A">Your book listing expires in ${daysLeft} ${dayWord}</p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:0 0 16px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.5);border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
      <tr><td style="padding:28px 32px">
        <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3A3A3A">Hi <strong>${sellerFirstName}</strong>,</p>
        <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3A3A3A">This is a friendly reminder that your listing for <strong style="color:#E8357A">${bookTitle}</strong> on Book Loop BD will expire in <strong>${daysLeft} ${dayWord}</strong>.</p>
        <div style="background:rgba(232,53,122,0.06);border-radius:12px;padding:16px 18px;margin:16px 0">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1A1A1A">⏳ What happens on expiry?</p>
          <p style="margin:0;font-size:12px;color:#3A3A3A;line-height:1.9">Listings stay live for 90 days. If your book remains unsold past that, it is automatically removed from the marketplace to keep the catalog fresh.</p>
        </div>
        <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3A3A3A">If you still want to sell this book, no action is needed right now — it stays live until the expiry date. After expiry, you can post a fresh listing for the same book any time.</p>
        <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3A3A3A">Thank you for helping give books a second life with Book Loop BD. 📚♻️</p>
        <p style="margin:16px 0 0;font-size:13px;color:#8A8A8A">Best regards,<br><strong style="color:#3A3A3A">Team Book Loop BD</strong></p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td align="center" style="padding:8px 0 24px">
    <a href="https://bookloopbd.com" style="display:inline-block;background-color:#E8357A;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:999px;box-shadow:0 4px 14px rgba(232,53,122,0.25)">Visit Book Loop BD</a>
  </td></tr>
  <tr><td align="center" style="padding:16px 0 8px;border-top:1px solid rgba(0,0,0,0.06)">
    <p style="margin:0 0 4px;font-size:11px;color:#8A8A8A">Book Loop BD &middot; Dhaka, Bangladesh</p>
    <p style="margin:0;font-size:10px;color:#AAAAAA">&copy; ${new Date().getFullYear()} Book Loop BD &middot; <a href="https://bookloopbd.com/privacy-policy" style="color:#E8357A;text-decoration:none">Privacy Policy</a></p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
  return { subject, html };
}

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date().toISOString();
    const sevenDaysLater = new Date(Date.now() + 7 * 86400000).toISOString();

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

    let emailsSent = 0;
    for (const listing of expiring) {
      const daysLeft = Math.max(1, Math.ceil((new Date(listing.expires_at).getTime() - Date.now()) / 86400000));

      // In-app notification
      await supabase.from('notifications').insert({
        user_id: listing.seller_id,
        message: `Your listing for "${listing.book_name}" expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. List again after expiry if it doesn't sell!`,
        type: 'listing',
      });

      // Email warning
      if (resendKey) {
        try {
          const { data: emailRes } = await supabase.rpc('get_user_email', { _user_id: listing.seller_id });
          const sellerEmail = emailRes as string | null;
          const { data: profile } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', listing.seller_id)
            .maybeSingle();
          const firstName = (profile?.full_name || 'there').split(' ')[0];

          if (sellerEmail) {
            const { subject, html } = buildExpiryEmail(firstName, listing.book_name, daysLeft);
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Book Loop BD <noreply@order.bookloopbd.com>',
                to: [sellerEmail],
                subject,
                html,
              }),
            });
            if (res.ok) emailsSent++;
            else console.error('Resend error:', await res.text());
          }
        } catch (e) {
          console.error('Email failed for listing', listing.id, e);
        }
      }

      await supabase
        .from('listings')
        .update({ expiry_warning_sent: true })
        .eq('id', listing.id);
    }

    return new Response(JSON.stringify({ processed: expiring.length, emailsSent }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
