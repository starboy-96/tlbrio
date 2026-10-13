"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createAdminSession, deleteAdminSession, isAdmin } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendWelcomeEmail } from "@/lib/newsletter-email";

export type LoginState = { error?: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
    // Slow down password guessing
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "Incorrect password." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin");
}

export type SubscriberActionState = { message?: string; error?: string; draft?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addSubscribers(
  _state: SubscriberActionState,
  formData: FormData,
): Promise<SubscriberActionState> {
  const raw = String(formData.get("emails") ?? "");
  if (!(await isAdmin())) return { error: "Your session has expired. Sign in again.", draft: raw };

  const sendWelcome = formData.get("sendWelcome") === "on";
  const candidates = [...new Set(raw.split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean))];
  const valid = candidates.filter((e) => EMAIL_RE.test(e));
  const invalid = candidates.filter((e) => !EMAIL_RE.test(e));
  if (valid.length === 0) {
    return { error: invalid.length ? `Not a valid email: ${invalid.join(", ")}` : "Enter at least one email address.", draft: raw };
  }

  const { data, error } = await supabaseAdmin()
    .from("newsletter_subscribers")
    .upsert(valid.map((email) => ({ email })), { onConflict: "email", ignoreDuplicates: true })
    .select("email");
  if (error) return { error: `Couldn't add subscribers: ${error.message}`, draft: raw };

  const added = (data ?? []).map((r: { email: string }) => r.email);
  if (sendWelcome) {
    for (const email of added) await sendWelcomeEmail(email);
  }
  revalidatePath("/admin");

  const parts = [`Added ${added.length}`];
  const existing = valid.length - added.length;
  if (existing) parts.push(`${existing} already subscribed`);
  if (invalid.length) parts.push(`skipped invalid: ${invalid.join(", ")}`);
  if (sendWelcome && added.length) parts.push("welcome email sent");
  return { message: parts.join(" · ") };
}

export async function removeSubscriber(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const email = String(formData.get("email") ?? "");
  if (!email) return;
  await supabaseAdmin().from("newsletter_subscribers").delete().eq("email", email);
  revalidatePath("/admin");
}
