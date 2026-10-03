import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FROM = "tlbr.io <hello@newsletter.tlbr.io>";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function unsubscribeLink(email: string): string {
  const token = createHmac("sha256", process.env.UNSUBSCRIBE_SECRET!)
    .update(email)
    .digest("hex");
  return `https://tlbr.io/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

async function sendWelcomeEmail(email: string) {
  const unsub = unsubscribeLink(email);
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: email,
      subject: "Your slides are about to get a lot better",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
</head>
<body style="margin:0;padding:0;background:#f0f0ee;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0ee;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr><td style="background:#0a1a2f;padding:36px 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p style="margin:0 0 16px;color:#94e561;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">tlbr.io newsletter</p>
              <h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:28px;font-weight:700;line-height:1.3;">Your slides are about<br/>to get a lot better</h1>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#ffffff;padding:36px 40px 32px;">
        <p style="margin:0 0 18px;color:#0a1a2f;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;">Hey,</p>
        <p style="margin:0 0 18px;color:#0a1a2f;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;">Thanks for signing up — welcome to the tlbr.io newsletter.</p>
        <p style="margin:0 0 18px;color:#0a1a2f;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;">PowerPoint gets a bad reputation. Cluttered decks, off-brand fonts, that one colleague who somehow makes every slide look worse than a blank one.</p>
        <p style="margin:0 0 18px;color:#0a1a2f;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;">But PowerPoint is not the problem. The way most teams use it is.</p>
        <p style="margin:0 0 18px;color:#0a1a2f;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;">That is exactly why tlbr.io exists. We build bespoke toolbars that live right inside PowerPoint, giving your team instant access to brand colours, layouts, templates, and formatting tools — all in one click.</p>
        <p style="margin:0 0 32px;color:#0a1a2f;font-family:Arial,sans-serif;font-size:16px;line-height:1.8;">Every Tuesday we will land in your inbox with one practical tip on presentation design and brand consistency. No fluff — just things you can actually use.</p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr><td style="background:#0a1a2f;border-radius:999px;padding:14px 28px;">
            <a href="https://tlbr.io" style="color:#94e561;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;display:block;white-space:nowrap;">Visit tlbr.io &rarr;</a>
          </td></tr>
        </table>

        <p style="margin:0;color:#0a1a2f;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;font-weight:700;">The tlbr.io team</p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f0f0ee;padding:20px 40px;border-top:1px solid #e4e4e2;">
        <p style="margin:0;color:#999;font-family:Arial,sans-serif;font-size:12px;text-align:center;line-height:1.7;">
          You subscribed at <a href="https://tlbr.io" style="color:#0a1a2f;text-decoration:underline;">tlbr.io</a>. &nbsp;&bull;&nbsp;
          <a href="${unsub}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { error, data } = await db
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    // Only send welcome email for new subscribers (not duplicates)
    if (data && data.length > 0) {
      await sendWelcomeEmail(email);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
