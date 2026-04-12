import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const TO = process.env.DEMO_EMAIL_TO ?? "hello@tlbr.io";

  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1. Notify you that someone requested a demo
    await resend.emails.send({
      from: "tlbr.io <noreply@mail.tlbr.io>",
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
      from: "tlbr.io <noreply@mail.tlbr.io>",
      to: email,
      subject: "Demo booked — here's what to expect from tlbr.io",
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">

          <!-- Header -->
          <div style="background: #0A1A2F; border-radius: 20px; padding: 40px 32px; text-align: center; margin-bottom: 32px;">
            <p style="color: #94E561; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 12px;">tlbr.io</p>
            <h1 style="color: #ffffff; font-size: 2rem; margin: 0 0 12px; line-height: 1.2;">Your demo is confirmed.</h1>
            <p style="color: rgba(255,255,255,0.55); margin: 0; font-size: 0.95rem; line-height: 1.6;">We'll be in touch within one business day to lock in a time that works for you.</p>
          </div>

          <!-- What happens next -->
          <div style="margin-bottom: 32px;">
            <p style="color: #0A1A2F; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 16px;">What to expect</p>
            <div style="display: flex; flex-direction: column; gap: 12px;">

              <div style="display: flex; align-items: flex-start; gap: 14px; padding: 16px; background: #f7faf5; border-radius: 12px; border: 1px solid #e8f3e2;">
                <div style="width: 32px; height: 32px; background: #94E561; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem; font-weight: 700; color: #0A1A2F; line-height: 32px; text-align: center;">1</div>
                <div>
                  <p style="margin: 0 0 2px; font-weight: 600; color: #0A1A2F; font-size: 0.9rem;">We reach out to schedule</p>
                  <p style="margin: 0; color: #666; font-size: 0.82rem; line-height: 1.5;">Expect a calendar invite within one business day.</p>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 14px; padding: 16px; background: #f7faf5; border-radius: 12px; border: 1px solid #e8f3e2;">
                <div style="width: 32px; height: 32px; background: #94E561; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem; font-weight: 700; color: #0A1A2F; line-height: 32px; text-align: center;">2</div>
                <div>
                  <p style="margin: 0 0 2px; font-weight: 600; color: #0A1A2F; font-size: 0.9rem;">30-minute live walkthrough</p>
                  <p style="margin: 0; color: #666; font-size: 0.82rem; line-height: 1.5;">We demo the toolbar using a pre-loaded brand — so you see exactly what it looks like for your team.</p>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 14px; padding: 16px; background: #f7faf5; border-radius: 12px; border: 1px solid #e8f3e2;">
                <div style="width: 32px; height: 32px; background: #94E561; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem; font-weight: 700; color: #0A1A2F; line-height: 32px; text-align: center;">3</div>
                <div>
                  <p style="margin: 0 0 2px; font-weight: 600; color: #0A1A2F; font-size: 0.9rem;">No hard sell — just the product</p>
                  <p style="margin: 0; color: #666; font-size: 0.82rem; line-height: 1.5;">Ask anything, see everything. We'll leave you with a clear picture of what tlbr.io can do for your team.</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Feature highlights -->
          <div style="background: #0A1A2F; border-radius: 20px; padding: 28px 28px 24px; margin-bottom: 32px;">
            <p style="color: #94E561; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 18px;">What you'll see in the demo</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; width: 50%; vertical-align: top;">
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 0.85rem;">&#10003;&nbsp; Align &amp; distribute in one click</p>
                </td>
                <td style="padding: 6px 0; width: 50%; vertical-align: top;">
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 0.85rem;">&#10003;&nbsp; Brand colours &amp; fonts built in</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top;">
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 0.85rem;">&#10003;&nbsp; Bespoke slide templates</p>
                </td>
                <td style="padding: 6px 0; vertical-align: top;">
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 0.85rem;">&#10003;&nbsp; Brand asset library</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top;">
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 0.85rem;">&#10003;&nbsp; Layout &amp; spacing tools</p>
                </td>
                <td style="padding: 6px 0; vertical-align: top;">
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 0.85rem;">&#10003;&nbsp; Edit graphs &amp; tables</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top;" colspan="2">
                  <p style="margin: 8px 0 0; color: #94E561; font-size: 0.85rem; font-weight: 600;">Result: on-brand decks, 2× faster — for everyone on your team.</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://tlbr.io" style="display: inline-block; background: #94E561; color: #0A1A2F; text-decoration: none; padding: 14px 36px; border-radius: 100px; font-weight: 700; font-size: 0.9rem;">
              Explore tlbr.io →
            </a>
          </div>

          <!-- Footer -->
          <p style="color: #bbb; font-size: 0.72rem; text-align: center; margin: 0; line-height: 1.6;">
            tlbr.io &nbsp;·&nbsp; The bespoke PowerPoint add-in<br/>
            This is an automated message — please do not reply to this email.
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
