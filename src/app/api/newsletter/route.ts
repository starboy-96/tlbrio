import { NextRequest, NextResponse } from "next/server";

const PUB_ID = "pub_84a313c7-0485-4292-8e00-3205a1352a6e";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Beehiiv error:", res.status, err);
      return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
