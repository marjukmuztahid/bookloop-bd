import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, redirectTo } = await req.json();
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: email.trim().toLowerCase(),
      options: { redirectTo },
    });

    // Don't reveal if account exists — always return success-looking response
    if (error || !data?.properties?.action_link) {
      console.error('generateLink error:', error);
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resetLink = data.properties.action_link;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Reset your password</title></head>
<body style="margin:0;padding:0;background:#F9F9F9;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F9F9;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.06);overflow:hidden;">
        <tr><td style="padding:36px 36px 8px;text-align:center;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#1A1A1A;">Reset your password</h1>
        </td></tr>
        <tr><td style="padding:16px 36px 8px;font-size:15px;line-height:1.6;color:#3A3A3A;">
          Hi there,<br/><br/>
          We received a request to reset the password for your Book Loop BD account. Click the button below to choose a new password. This link expires in 1 hour.
        </td></tr>
        <tr><td style="padding:24px 36px;text-align:center;">
          <a href="${resetLink}" style="display:inline-block;background:#E8357A;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;font-size:15px;">Reset Password</a>
        </td></tr>
        <tr><td style="padding:0 36px 24px;font-size:13px;line-height:1.6;color:#8A8A8A;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetLink}" style="color:#E8357A;word-break:break-all;">${resetLink}</a>
        </td></tr>
        <tr><td style="padding:16px 36px 32px;font-size:13px;line-height:1.6;color:#8A8A8A;border-top:1px solid #F0F0F0;">
          If you didn't request this, you can safely ignore this email — your password won't change.
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:12px;color:#8A8A8A;">© Book Loop BD</p>
    </td></tr>
  </table>
</body></html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Book Loop BD <noreply@order.bookloopbd.com>',
        to: [email],
        subject: 'Reset your Book Loop BD password',
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('Resend error:', result);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
