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
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="background:#0a1a2f;border-radius:16px;padding:32px;margin-bottom:28px;">
            <p style="color:#94e561;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">tlbr.io</p>
            <h1 style="color:#fff;font-size:28px;margin:0;line-height:1.2;">Your slides are about to get a lot better</h1>
          </div>
          <p style="color:#333;font-size:16px;line-height:1.7;">Hey,</p>
          <p style="color:#333;font-size:16px;line-height:1.7;">Thanks for signing up — welcome to the tlbr.io newsletter.</p>
          <p style="color:#333;font-size:16px;line-height:1.7;">PowerPoint gets a bad reputation. Cluttered decks, off-brand fonts, that one colleague who somehow makes every slide look worse than a blank one.</p>
          <p style="color:#333;font-size:16px;line-height:1.7;">But here's the thing — PowerPoint isn't the problem. The way most teams use it is.</p>
          <p style="color:#333;font-size:16px;line-height:1.7;">That's exactly why tlbr.io exists. We build bespoke toolbars that live right inside PowerPoint, giving your team instant access to brand colours, layouts, templates, and formatting tools — all in one click. No more hunting through menus. No more fixing someone else's slides at 11pm.</p>
          <p style="color:#333;font-size:16px;line-height:1.7;">Every Tuesday, we'll land in your inbox with one practical tip on presentation design, brand consistency, and getting more out of PowerPoint. No fluff, no filler — just things you can actually use.</p>
          <p style="color:#333;font-size:16px;line-height:1.7;">We're glad you're here.</p>
          <p style="color:#333;font-size:16px;line-height:1.7;font-weight:600;">The tlbr.io team</p>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
          <p style="color:#999;font-size:12px;text-align:center;">
            You're receiving this because you signed up at <a href="https://tlbr.io" style="color:#0a1a2f;">tlbr.io</a>.
          </p>
        </div>
      `,
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
