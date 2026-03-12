import { supabase } from '@/integrations/supabase/client';

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html },
    });
    if (error) console.error('Email send error:', error);
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

const LOGO_URL = 'https://yfebvmihphqbfddhzcaf.supabase.co/storage/v1/object/public/book-photos/logo.png';

export function emailTemplate(body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Inter,system-ui,-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
<tr><td style="padding:32px 32px 0;text-align:center">
<h2 style="margin:0 0 24px;font-size:18px;font-weight:800;color:#1A1A1A">Book Loop BD</h2>
</td></tr>
<tr><td style="padding:0 32px 32px">
${body}
</td></tr>
<tr><td style="padding:16px 32px;background:#fafafa;text-align:center;border-top:1px solid rgba(0,0,0,0.06)">
<p style="margin:0;font-size:11px;color:#8A8A8A">© 2025 Book Loop BD • This is an automated message</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function sellerListingApproved(bookName: string, listingId: string): { subject: string; html: string } {
  return {
    subject: 'Your listing is live! 🎉',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px">Great news!</h3>
      <p style="color:#3A3A3A;font-size:14px">Your listing for <strong>${bookName}</strong> has been approved and is now live on the marketplace.</p>
      <p style="text-align:center;margin:24px 0">
        <a href="https://bookloopbd.com/listings/${listingId}" style="display:inline-block;padding:12px 28px;background:#E8357A;color:#fff;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px">View Your Listing</a>
      </p>
    `),
  };
}

export function sellerListingRejected(bookName: string, reason: string): { subject: string; html: string } {
  return {
    subject: 'Update on your listing',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px">Update on your listing</h3>
      <p style="color:#3A3A3A;font-size:14px">Unfortunately, your listing for <strong>${bookName}</strong> was not approved.</p>
      <p style="color:#3A3A3A;font-size:14px"><strong>Reason:</strong> ${reason}</p>
    `),
  };
}

export function buyerOrderConfirmed(bookName: string, amount: number): { subject: string; html: string } {
  return {
    subject: 'Order confirmed! 🛒',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px">Order Confirmed</h3>
      <p style="color:#3A3A3A;font-size:14px">Your order for <strong>${bookName}</strong> has been placed. COD amount: <strong style="color:#E8357A">৳ ${amount.toLocaleString('en-BD')}</strong></p>
      <p style="color:#8A8A8A;font-size:13px">Our team will review your order and notify you once it's approved.</p>
    `),
  };
}

export function buyerOrderApproved(bookName: string): { subject: string; html: string } {
  return {
    subject: 'Great news — your order is approved! ✅',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px">Order Approved!</h3>
      <p style="color:#3A3A3A;font-size:14px">Your order for <strong>${bookName}</strong> has been approved. Steadfast will deliver it to you soon.</p>
    `),
  };
}

export function sellerDeliveryConfirmed(bookName: string, amount: number): { subject: string; html: string } {
  return {
    subject: 'Delivery confirmed — payment coming 💸',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px">Delivery Successful!</h3>
      <p style="color:#3A3A3A;font-size:14px">Your book <strong>${bookName}</strong> has been delivered successfully.</p>
      <p style="color:#3A3A3A;font-size:14px">Your payment of <strong style="color:#E8357A">৳ ${amount.toLocaleString('en-BD')}</strong> will be sent to your bKash/Nagad shortly.</p>
    `),
  };
}
