import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");

  if (!email || !token) {
    return NextResponse.redirect(new URL("/unsubscribed?status=invalid", req.url));
  }

  const expected = createHmac("sha256", process.env.UNSUBSCRIBE_SECRET!)
    .update(email)
    .digest("hex");

  if (token !== expected) {
    return NextResponse.redirect(new URL("/unsubscribed?status=invalid", req.url));
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await db.from("newsletter_subscribers").delete().eq("email", email);

  return NextResponse.redirect(new URL("/unsubscribed?status=ok", req.url));
}
