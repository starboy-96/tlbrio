"use client";

import { useActionState } from "react";
import { login } from "./actions";

const NAVY = "#0a1a2f";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: NAVY }}>
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">tlbr.io</p>
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Admin</h1>
        </div>
        <form action={action} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy transition-colors"
            autoFocus
          />
          {state?.error && <p className="text-red-500 text-xs">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="text-white rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-60"
            style={{ background: NAVY }}
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
