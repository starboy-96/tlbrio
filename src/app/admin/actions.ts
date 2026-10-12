"use server";

import { redirect } from "next/navigation";
import { checkPassword, createAdminSession, deleteAdminSession } from "@/lib/admin-session";

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
