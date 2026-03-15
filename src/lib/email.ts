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

// ── EMAIL TEMPLATE WRAPPER ─────────────────────────────────

function emailTemplate(heroEmoji: string, heroTitle: string, heroSubtitle: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F9F9F9;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9F9F9;padding:32px 16px">
<tr><td align="center">

<!-- Main container 600px -->
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">

  <!-- HEADER -->
  <tr><td align="center" style="padding:24px 0 20px">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-0.5px;font-family:Inter,system-ui,sans-serif">
          ♾️ Book Loop BD
        </td>
      </tr>
      <tr>
        <td align="center" style="font-size:11px;color:#8A8A8A;padding-top:4px;font-family:Inter,system-ui,sans-serif">
          Give books a second life
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- HERO CARD (frosted glass) -->
  <tr><td style="padding:0 0 16px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.5);border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
      <tr><td align="center" style="padding:32px 24px 28px">
        <div style="font-size:40px;line-height:1;margin-bottom:16px">${heroEmoji}</div>
        <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1A1A1A;font-family:Inter,system-ui,sans-serif;letter-spacing:-0.3px">${heroTitle}</h1>
        <p style="margin:0;font-size:13px;color:#8A8A8A;font-family:Inter,system-ui,sans-serif">${heroSubtitle}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- BODY CARD (frosted glass) -->
  <tr><td style="padding:0 0 16px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.5);border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
      <tr><td style="padding:28px 32px">
        ${bodyContent}
      </td></tr>
    </table>
  </td></tr>

  <!-- CTA BUTTON -->
  <tr><td align="center" style="padding:8px 0 24px">
    <a href="https://bookloopbd.com" style="display:inline-block;background-color:#E8357A;color:#ffffff;font-size:14px;font-weight:600;font-family:Inter,system-ui,sans-serif;text-decoration:none;padding:14px 32px;border-radius:999px;box-shadow:0 4px 14px rgba(232,53,122,0.25)">
      Visit Book Loop BD
    </a>
  </td></tr>

  <!-- FOOTER -->
  <tr><td align="center" style="padding:16px 0 8px;border-top:1px solid rgba(0,0,0,0.06)">
    <p style="margin:0 0 4px;font-size:11px;color:#8A8A8A;font-family:Inter,system-ui,sans-serif">Book Loop BD &middot; Dhaka, Bangladesh</p>
    <p style="margin:0;font-size:10px;color:#AAAAAA;font-family:Inter,system-ui,sans-serif">
      &copy; ${new Date().getFullYear()} Book Loop BD &middot;
      <a href="https://bookloopbd.com/privacy-policy" style="color:#E8357A;text-decoration:none">Privacy Policy</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function detailRow(label: string, value: string, accent = false): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px">
    <tr>
      <td style="font-size:12px;color:#8A8A8A;font-family:Inter,system-ui,sans-serif;padding:6px 0;width:140px;vertical-align:top">${label}</td>
      <td style="font-size:13px;color:${accent ? '#E8357A' : '#3A3A3A'};font-weight:${accent ? '700' : '600'};font-family:Inter,system-ui,sans-serif;padding:6px 0;vertical-align:top">${value}</td>
    </tr>
  </table>`;
}

function bodyText(text: string): string {
  return `<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3A3A3A;font-family:Inter,system-ui,sans-serif">${text}</p>`;
}

function signOff(): string {
  return `<p style="margin:16px 0 0;font-size:13px;color:#8A8A8A;font-family:Inter,system-ui,sans-serif">Best regards,<br><strong style="color:#3A3A3A">Team Book Loop BD</strong></p>`;
}

// ── BUYER EMAILS ───────────────────────────────────────────

export function buyerOrderApproved(buyerFirstName: string, bookTitle: string, deliveryAddress: string, totalCOD: number): { subject: string; html: string } {
  const body = `
    ${bodyText(`Hi <strong>${buyerFirstName}</strong>,`)}
    ${bodyText(`Great news! Your order for <strong style="color:#E8357A">${bookTitle}</strong> has been confirmed by our team and the seller is now preparing your package.`)}
    ${bodyText(`A Steadfast courier agent will pick it up soon and deliver it to your address:`)}
    ${detailRow('Delivery Address', deliveryAddress)}
    ${detailRow('Amount (COD)', `৳ ${totalCOD.toLocaleString('en-BD')}`, true)}
    <div style="background:rgba(232,53,122,0.06);border-radius:12px;padding:14px 16px;margin:16px 0">
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.6">
        📱 Please keep your phone accessible — the delivery agent may contact you during delivery.
      </p>
    </div>
    ${bodyText(`Thank you for choosing Book Loop BD. By buying second-hand books, you're helping make education more affordable while giving books a second life.`)}
    ${bodyText(`Happy reading! 📚`)}
    ${signOff()}
  `;
  return {
    subject: 'Your order has been confirmed 📦',
    html: emailTemplate('📦', 'Order Confirmed!', 'Your book is on its way to you', body),
  };
}

export function buyerDeliverySuccessful(buyerFirstName: string, bookTitle: string): { subject: string; html: string } {
  const body = `
    ${bodyText(`Hi <strong>${buyerFirstName}</strong>,`)}
    ${bodyText(`Your order for <strong style="color:#E8357A">${bookTitle}</strong> has been successfully delivered.`)}
    ${bodyText(`We hope you enjoy your new book and that it helps you in your studies.`)}
    ${bodyText(`If you ever want to buy or sell more books, visit us again at <a href="https://bookloopbd.com" style="color:#E8357A;text-decoration:none;font-weight:600">bookloopbd.com</a>`)}
    <div style="background:rgba(34,197,94,0.08);border-radius:12px;padding:14px 16px;margin:16px 0">
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.6">
        ♻️ Every book sold on Book Loop BD gets a second life and helps another student learn more affordably.
      </p>
    </div>
    ${bodyText(`Happy reading! 📚🎉`)}
    ${signOff()}
  `;
  return {
    subject: 'Your order has been delivered 🎉',
    html: emailTemplate('🎉', 'Delivery Successful!', 'Your book has arrived', body),
  };
}

export function buyerDeliveryUnsuccessful(buyerFirstName: string, bookTitle: string): { subject: string; html: string } {
  const body = `
    ${bodyText(`Hi <strong>${buyerFirstName}</strong>,`)}
    ${bodyText(`We attempted to deliver your order from Book Loop BD, but unfortunately the delivery was unsuccessful.`)}
    <div style="background:rgba(239,68,68,0.06);border-radius:12px;padding:14px 16px;margin:16px 0">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#3A3A3A;font-family:Inter,system-ui,sans-serif">This may have happened because:</p>
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.8">
        • The delivery address was incomplete or incorrect<br>
        • Our courier partner was unable to reach you by phone during delivery
      </p>
    </div>
    ${bodyText(`Because of this, the order has been cancelled and the book has been returned to the seller.`)}
    <div style="background:rgba(232,53,122,0.06);border-radius:12px;padding:14px 16px;margin:16px 0">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1A1A1A;font-family:Inter,system-ui,sans-serif">What you can do next</p>
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.8">
        If you would still like to purchase the book, please place a new order and make sure that:<br>
        • Your delivery address is correct and complete<br>
        • Your phone number is active and reachable
      </p>
    </div>
    ${bodyText(`We apologize for the inconvenience and hope to serve you again soon.`)}
    ${bodyText(`Thank you for using Book Loop BD to give books a second life. 📚♻️`)}
    ${signOff()}
  `;
  return {
    subject: 'Delivery Attempt Unsuccessful – Please Check Your Details',
    html: emailTemplate('📭', 'Delivery Unsuccessful', 'We couldn\'t complete your delivery', body),
  };
}

// ── SELLER EMAILS ──────────────────────────────────────────

export function sellerOrderApproved(sellerFirstName: string, bookTitle: string): { subject: string; html: string } {
  const body = `
    ${bodyText(`Hi <strong>${sellerFirstName}</strong>,`)}
    ${bodyText(`Great news! 🎉`)}
    ${bodyText(`Your book <strong style="color:#E8357A">${bookTitle}</strong> has just been ordered by a buyer on Book Loop BD.`)}
    ${bodyText(`Please prepare the book for pickup. Our courier partner Steadfast will contact you shortly to collect the package.`)}
    <div style="background:rgba(232,53,122,0.06);border-radius:12px;padding:16px 18px;margin:16px 0">
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1A1A1A;font-family:Inter,system-ui,sans-serif">📦 Packaging Instructions</p>
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.9">
        To ensure the book reaches the buyer safely, please follow these steps:<br>
        • Wrap the book in plastic or a waterproof cover to protect it from rain or moisture.<br>
        • Place the book inside a strong envelope, poly bag, or small box.<br>
        • Seal the package securely with tape.<br>
        • Your Parcel ID will be sent via SMS; please ensure it is written clearly on the package.
      </p>
    </div>
    ${bodyText(`Once the courier pickup is scheduled, we will notify you.`)}
    ${bodyText(`Thank you for giving your books a second life with Book Loop BD. ♻️`)}
    ${signOff()}
  `;
  return {
    subject: 'Your Book Has Been Ordered on Book Loop BD 📚',
    html: emailTemplate('📚', 'Your Book Has Been Ordered!', 'A buyer just placed an order for your book', body),
  };
}

export function sellerDeliverySuccessful(sellerFirstName: string, bookTitle: string, payoutAmount: number): { subject: string; html: string } {
  const body = `
    ${bodyText(`Hi <strong>${sellerFirstName}</strong>,`)}
    ${bodyText(`Congratulations! 🎉`)}
    ${bodyText(`Your book <strong style="color:#E8357A">${bookTitle}</strong> has been successfully delivered to the buyer.`)}
    ${detailRow('Your Payout', `৳ ${payoutAmount.toLocaleString('en-BD')}`, true)}
    <div style="background:rgba(34,197,94,0.08);border-radius:12px;padding:14px 16px;margin:16px 0">
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.6">
        💸 Your payment will be sent shortly to your bKash/Nagad number linked with your account. Please allow some time for the payment to be processed.
      </p>
    </div>
    ${bodyText(`Thank you for being a part of Book Loop BD and helping make education more affordable while giving books a second life.`)}
    ${bodyText(`We look forward to seeing more of your books listed on the platform! 📚`)}
    ${signOff()}
  `;
  return {
    subject: 'Your Book Has Been Delivered 📦',
    html: emailTemplate('🎉', 'Book Delivered Successfully!', 'Congratulations on your sale', body),
  };
}

export function sellerDeliveryUnsuccessful(sellerFirstName: string, bookTitle: string): { subject: string; html: string } {
  const body = `
    ${bodyText(`Hi <strong>${sellerFirstName}</strong>,`)}
    ${bodyText(`We wanted to inform you that the delivery attempt for your book <strong style="color:#E8357A">${bookTitle}</strong> was unsuccessful.`)}
    <div style="background:rgba(239,68,68,0.06);border-radius:12px;padding:14px 16px;margin:16px 0">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#3A3A3A;font-family:Inter,system-ui,sans-serif">This can sometimes happen if:</p>
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.8">
        • The buyer could not be reached by phone<br>
        • The delivery address was incorrect or incomplete
      </p>
    </div>
    ${bodyText(`Our courier partner was unable to complete the delivery, so the book will be returned to you shortly.`)}
    <div style="background:rgba(232,53,122,0.06);border-radius:12px;padding:16px 18px;margin:16px 0">
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1A1A1A;font-family:Inter,system-ui,sans-serif">What happens next?</p>
      <p style="margin:0;font-size:12px;color:#3A3A3A;font-family:Inter,system-ui,sans-serif;line-height:1.9">
        • The courier will contact you to return the book.<br>
        • Your book listing on Book Loop BD has been automatically renewed, so other buyers can still purchase it.<br>
        • You do not need to relist the book manually.
      </p>
    </div>
    ${bodyText(`We appreciate your patience and thank you for helping give books a second life through Book Loop BD. 📚♻️`)}
    ${signOff()}
  `;
  return {
    subject: 'Delivery Update for Your Book on Book Loop BD',
    html: emailTemplate('📭', 'Delivery Unsuccessful', 'The delivery couldn\'t be completed', body),
  };
}
