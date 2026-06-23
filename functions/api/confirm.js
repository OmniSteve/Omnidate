/**
 * Cloudflare Pages Function: POST /api/confirm
 *
 * Environment variables to set in Cloudflare Pages dashboard:
 *   RESEND_API_KEY   — your Resend API key (get one free at resend.com)
 *   TO_EMAIL         — the email address to notify (yours, Steve)
 *   FROM_EMAIL       — a verified sender address in Resend (e.g. date@omnidesign.pro)
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const { date, time } = body;
  if (!date || !time) {
    return json({ ok: false, error: 'Date and time are required.' }, 400);
  }

  // Format nicely for the email
  const d = new Date(`${date}T${time}`);
  const formatted = d.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }) + ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { background: #0d1b2a; color: #f9f5f0; font-family: Georgia, serif; margin: 0; padding: 0; }
        .wrap { max-width: 480px; margin: 40px auto; padding: 40px 32px; background: #111827;
                border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; }
        .eyebrow { font-family: sans-serif; font-size: 11px; letter-spacing: 0.2em;
                   text-transform: uppercase; color: #e8c97e; margin-bottom: 16px; }
        h1 { font-size: 2rem; font-weight: 400; margin: 0 0 8px; }
        h1 em { font-style: italic; color: #f2a7b3; }
        .heart { color: #f2a7b3; font-size: 1.2rem; margin: 16px 0; }
        .date-box { background: rgba(242,167,179,0.1); border: 1px solid rgba(242,167,179,0.3);
                    border-radius: 2px; padding: 16px 20px; margin: 24px 0; text-align: center; }
        .date-box strong { font-size: 1.2rem; color: #f2a7b3; }
        .footer { font-family: sans-serif; font-size: 12px; color: #8a9ab5; margin-top: 32px; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <p class="eyebrow">She said yes ♡</p>
        <h1>Your date is <em>confirmed</em></h1>
        <div class="heart">✦ ♡ ✦</div>
        <p style="color:#8a9ab5; font-size:0.95rem;">Alex has confirmed your date for:</p>
        <div class="date-box"><strong>${formatted}</strong></div>
        <p style="color:#8a9ab5; font-size:0.95rem; line-height:1.6;">
          Time to start planning something wonderful. ♡
        </p>
        <div class="footer">Sent via your date invitation · omnidesign.pro</div>
      </div>
    </body>
    </html>
  `;

  // Send via Resend
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to:   [env.TO_EMAIL],
      subject: `🌹 Date confirmed — ${formatted}`,
      html: emailHtml,
    }),
  });

  if (!resendRes.ok) {
    const err = await resendRes.text();
    console.error('Resend error:', err);
    return json({ ok: false, error: 'Could not send confirmation email.' }, 500);
  }

  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
