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

export async function getUserEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('get_user_email', { _user_id: userId });
  if (error) {
    console.error('Failed to get user email:', error);
    return null;
  }
  return data as string | null;
}

function emailTemplate(body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,system-ui,-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
<tr><td style="padding:28px 32px 0;text-align:center">
<h2 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#1A1A1A;letter-spacing:-0.3px">Book Loop BD</h2>
</td></tr>
<tr><td style="padding:0 32px 32px">
${body}
</td></tr>
<tr><td style="padding:16px 32px;background:#fafafa;text-align:center;border-top:1px solid #eee">
<p style="margin:0;font-size:11px;color:#999">© ${new Date().getFullYear()} Book Loop BD &bull; <a href="https://bookloopbd.com" style="color:#E8357A;text-decoration:none">bookloopbd.com</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── SELLER EMAILS ──────────────────────────────────────────

export function sellerOrderApproved(sellerFirstName: string, bookTitle: string): { subject: string; html: string } {
  return {
    subject: 'Your book has been ordered! 📦 — Book Loop BD',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px;font-weight:700;margin:0 0 12px">Great news, ${sellerFirstName}!</h3>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Your book <strong style="color:#E8357A">${bookTitle}</strong> has been ordered by a buyer. Please prepare your package — Steadfast courier will come to collect it from you soon.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Make sure the book is packed securely. We will notify you once the pickup is scheduled.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0">Thank you for selling on Book Loop BD!</p>
    `),
  };
}

export function sellerDeliverySuccessful(sellerFirstName: string, bookTitle: string, payoutAmount: number): { subject: string; html: string } {
  return {
    subject: 'Congratulations! Your book has been sold 🎉 — Book Loop BD',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px;font-weight:700;margin:0 0 12px">Congratulations, ${sellerFirstName}! 🎉</h3>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Your book <strong style="color:#E8357A">${bookTitle}</strong> has been successfully delivered to the buyer!</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Your payment of <strong style="color:#E8357A">৳ ${payoutAmount.toLocaleString('en-BD')}</strong> will be sent to your bKash/Nagad number shortly.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0">Thank you for being a part of Book Loop BD. We hope to see more of your listed books!</p>
    `),
  };
}

export function sellerDeliveryUnsuccessful(sellerFirstName: string, bookTitle: string): { subject: string; html: string } {
  return {
    subject: 'Delivery was unsuccessful — Book Loop BD',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px;font-weight:700;margin:0 0 12px">Hi ${sellerFirstName},</h3>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Unfortunately the delivery of your book <strong style="color:#E8357A">${bookTitle}</strong> was unsuccessful.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Don't worry — your book will be returned to you soon by Steadfast. Once you receive it back, your listing will automatically become available again on the platform.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0">If you have any questions, please contact us. Thank you for your patience.</p>
    `),
  };
}

// ── BUYER EMAILS ───────────────────────────────────────────

export function buyerOrderApproved(buyerFirstName: string, bookTitle: string, deliveryAddress: string, totalCOD: number): { subject: string; html: string } {
  return {
    subject: 'Your order has been confirmed! ✅ — Book Loop BD',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px;font-weight:700;margin:0 0 12px">Hi ${buyerFirstName}!</h3>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Your order for <strong style="color:#E8357A">${bookTitle}</strong> has been confirmed by our team! The seller is now preparing your package.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Steadfast courier will pick it up soon and deliver it to your address: <strong>${deliveryAddress}</strong>.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">You will pay <strong style="color:#E8357A">৳ ${totalCOD.toLocaleString('en-BD')}</strong> in cash upon delivery. Please keep your phone accessible — the delivery agent may call you.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0">Thank you for shopping on Book Loop BD!</p>
    `),
  };
}

export function buyerDeliverySuccessful(buyerFirstName: string, bookTitle: string): { subject: string; html: string } {
  return {
    subject: 'Your book has arrived! 📚 — Book Loop BD',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px;font-weight:700;margin:0 0 12px">Hi ${buyerFirstName}! 📚</h3>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Your order for <strong style="color:#E8357A">${bookTitle}</strong> has been successfully delivered!</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">We hope you enjoy your new book. If you ever want to buy or sell more books, visit us again at <a href="https://bookloopbd.com" style="color:#E8357A;text-decoration:none;font-weight:600">bookloopbd.com</a>.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0">Happy reading! 🎉</p>
    `),
  };
}

export function buyerDeliveryUnsuccessful(buyerFirstName: string, bookTitle: string): { subject: string; html: string } {
  return {
    subject: 'Delivery was unsuccessful — Book Loop BD',
    html: emailTemplate(`
      <h3 style="color:#1A1A1A;font-size:16px;font-weight:700;margin:0 0 12px">Hi ${buyerFirstName},</h3>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">Unfortunately we were unable to deliver your order for <strong style="color:#E8357A">${bookTitle}</strong>.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0 0 12px">This could be due to an incorrect address or unavailability at the time of delivery. Your order has been cancelled and no payment has been charged.</p>
      <p style="color:#3A3A3A;font-size:14px;line-height:1.6;margin:0">Please feel free to browse and place a new order on <a href="https://bookloopbd.com" style="color:#E8357A;text-decoration:none;font-weight:600">bookloopbd.com</a>. We're sorry for the inconvenience.</p>
    `),
  };
}
