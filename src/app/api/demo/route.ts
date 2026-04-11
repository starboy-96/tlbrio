import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.DEMO_EMAIL_TO ?? "hello@tlbr.io";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1. Notify you that someone requested a demo
    await resend.emails.send({
      from: "tlbr.io <noreply@tlbr.io>",
      to: TO,
      subject: `New demo request from ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="background: #0A1A2F; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #94E561; font-size: 2rem; margin: 0 0 8px;">New demo request</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 0.9rem;">Someone wants to see tlbr.io in action</p>
          </div>
          <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 4px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Email address</p>
            <p style="margin: 0; font-size: 1.1rem; font-weight: 600; color: #0A1A2F;">${email}</p>
          </div>
          <p style="color: #999; font-size: 0.8rem; text-align: center;">Reply directly to this email to get in touch with them.</p>
        </div>
      `,
      replyTo: email,
    });

    // 2. Send a confirmation to the person who signed up
    await resend.emails.send({
      from: "tlbr.io <noreply@tlbr.io>",
      to: email,
      subject: "We'll be in touch — tlbr.io demo request received",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="background: #0A1A2F; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #94E561; font-size: 1.75rem; margin: 0 0 8px;">You're on the list</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 0.9rem;">We've received your demo request</p>
          </div>
          <p style="color: #444; line-height: 1.7; margin: 0 0 16px;">
            Thanks for your interest in tlbr.io. We'll be in touch within one business day to book a 30-minute demo — no hard sell, just the product.
          </p>
          <p style="color: #444; line-height: 1.7; margin: 0 0 32px;">
            In the meantime, feel free to reply to this email if you have any questions.
          </p>
          <div style="text-align: center;">
            <a href="https://tlbr.io" style="display: inline-block; background: #94E561; color: #0A1A2F; text-decoration: none; padding: 12px 28px; border-radius: 100px; font-weight: 600; font-size: 0.9rem;">
              Back to tlbr.io →
            </a>
          </div>
          <p style="color: #bbb; font-size: 0.75rem; text-align: center; margin-top: 32px;">
            tlbr.io · The bespoke PowerPoint add-in
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
