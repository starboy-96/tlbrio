import { NextRequest, NextResponse } from "next/server";

const TENANT_ID     = process.env.AZURE_TENANT_ID!;
const CLIENT_ID     = process.env.AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;
const SENDER        = "jayvin@tlbr.io";
const TO            = process.env.DEMO_EMAIL_TO ?? "jayvin@tlbr.io";

async function getAccessToken(): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope:         "https://graph.microsoft.com/.default",
        grant_type:    "client_credentials",
      }),
    }
  );
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function sendMail(token: string, to: string, subject: string, html: string) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${SENDER}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: html },
          from: { emailAddress: { address: SENDER, name: "Jayvin at tlbr.io" } },
          toRecipients: [{ emailAddress: { address: to } }],
        },
        saveToSentItems: false,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph API error ${res.status}: ${err}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, teamSize } = await req.json();

    if (!name || !email || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = await getAccessToken();

    await sendMail(
      token,
      TO,
      `Pricing enquiry from ${name} at ${company}`,
      `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="background: #0A1A2F; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #94E561; font-size: 1.75rem; margin: 0 0 8px;">Pricing enquiry</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 0.9rem;">Someone wants to know more about tlbr.io</p>
          </div>
          <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 12px; padding: 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <p style="margin: 0 0 2px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Name</p>
                <p style="margin: 0; font-weight: 600; color: #0A1A2F;">${name}</p>
              </td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <p style="margin: 0 0 2px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Email</p>
                <p style="margin: 0; font-weight: 600; color: #0A1A2F;"><a href="mailto:${email}" style="color: #0A1A2F;">${email}</a></p>
              </td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <p style="margin: 0 0 2px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Company</p>
                <p style="margin: 0; font-weight: 600; color: #0A1A2F;">${company}</p>
              </td></tr>
              <tr><td style="padding: 8px 0;">
                <p style="margin: 0 0 2px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Team size</p>
                <p style="margin: 0; font-weight: 600; color: #0A1A2F;">${teamSize || "Not specified"}</p>
              </td></tr>
            </table>
          </div>
        </div>
      `
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
