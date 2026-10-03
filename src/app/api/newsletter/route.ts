import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FROM = "tlbr.io <hello@newsletter.tlbr.io>";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function sendWelcomeEmail(email: string) {
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
<body style="margin:0;padding:0;background:#f4f4f2;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#0a1a2f;border-radius:16px 16px 0 0;padding:40px 40px 36px;">
        <p style="margin:0 0 12px;color:#94e561;font-family:sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">tlbr.io newsletter</p>
        <h1 style="margin:0;color:#ffffff;font-family:sans-serif;font-size:30px;font-weight:700;line-height:1.25;">Your slides are about<br/>to get a lot better</h1>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#ffffff;padding:40px;">
        <p style="margin:0 0 20px;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;">Hey,</p>
        <p style="margin:0 0 20px;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;">Thanks for signing up — welcome to the tlbr.io newsletter.</p>
        <p style="margin:0 0 20px;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;">PowerPoint gets a bad reputation. Cluttered decks, off-brand fonts, that one colleague who somehow makes every slide look worse than a blank one.</p>
        <p style="margin:0 0 20px;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;">But here's the thing — PowerPoint isn't the problem. The way most teams use it is.</p>
        <p style="margin:0 0 20px;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;">That's exactly why tlbr.io exists. We build bespoke toolbars that live right inside PowerPoint, giving your team instant access to brand colours, layouts, templates, and formatting tools — all in one click. No more hunting through menus. No more fixing someone else's slides at 11pm.</p>
        <p style="margin:0 0 20px;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;">Every Tuesday, we'll land in your inbox with one practical tip on presentation design, brand consistency, and getting more out of PowerPoint. No fluff, no filler — just things you can actually use.</p>
        <p style="margin:0 0 32px;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;">We're glad you're here.</p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr><td style="background:#0a1a2f;border-radius:999px;padding:14px 28px;">
            <a href="https://tlbr.io" style="color:#94e561;font-family:sans-serif;font-size:15px;font-weight:600;text-decoration:none;display:block;">Visit tlbr.io &rarr;</a>
          </td></tr>
        </table>

        <p style="margin:0;color:#1a1a1a;font-family:sans-serif;font-size:16px;line-height:1.75;font-weight:600;">The tlbr.io team</p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f4f4f2;border-radius:0 0 16px 16px;padding:24px 40px;border-top:1px solid #e8e8e6;">
        <p style="margin:0;color:#999;font-family:sans-serif;font-size:12px;text-align:center;line-height:1.6;">
          You're receiving this because you subscribed at <a href="https://tlbr.io" style="color:#0a1a2f;text-decoration:underline;">tlbr.io</a>.<br/>
          &copy; 2025 tlbr.io. All rights reserved.
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
