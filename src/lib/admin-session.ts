import "server-only";

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "tlbr_admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  return pw;
}

// The signing key is derived from the password, so changing ADMIN_PASSWORD
// also signs out every existing admin session.
function sign(value: string): string {
  return createHmac("sha256", `tlbr-admin-session:${adminPassword()}`)
    .update(value)
    .digest("base64url");
}

// Hash both sides first so the comparison is constant-time regardless of length.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string): boolean {
  return safeEqual(input, adminPassword());
}

export async function createAdminSession() {
  const expiresAt = Date.now() + SESSION_MS;
  const payload = String(expiresAt);
  (await cookies()).set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    expires: new Date(expiresAt),
  });
}

export async function deleteAdminSession() {
  (await cookies()).delete({ name: COOKIE_NAME, path: "/admin" });
}

export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  return Number(payload) > Date.now();
}
