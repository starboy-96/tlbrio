"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const NAVY = "#0a1a2f";
const GREEN = "#94e561";

export default function Newsletter() {
  const mounted = useMounted();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="newsletter" className="py-24 px-6" style={{ background: "#fff" }}>
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl px-8 py-14 md:px-16 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-10"
          style={{ background: NAVY }}>

          {/* Left */}
          <div className="max-w-md">
            <motion.p
              initial={mounted ? { opacity: 0, y: 10 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="section-label mb-3"
              style={{ color: GREEN }}
            >
              Newsletter
            </motion.p>
            <motion.h2
              initial={mounted ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl leading-snug mb-4"
              style={{ fontFamily: '"Cal Sans", sans-serif', color: "#fff" }}
            >
              Presentation tips,{" "}
              <span style={{ color: GREEN }}>every week.</span>
            </motion.h2>
            <motion.p
              initial={mounted ? { opacity: 0, y: 12 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="text-base"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.6)" }}
            >
              One email a week. Practical advice on presentation design, brand consistency, and getting more out of PowerPoint. No fluff.
            </motion.p>
          </div>

          {/* Right — form */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="w-full md:w-auto md:min-w-[320px]"
          >
            {status === "success" ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GREEN }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: '"General Sans", sans-serif' }}>You&apos;re in.</p>
                  <p className="text-sm" style={{ fontFamily: '"General Sans", sans-serif', color: "rgba(255,255,255,0.5)" }}>Check your inbox to confirm.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl text-sm outline-none"
                  style={{
                    fontFamily: '"General Sans", sans-serif',
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = GREEN)}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                  style={{ fontFamily: '"General Sans", sans-serif', background: GREEN, color: NAVY }}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe — it's free"}
                </button>
                {status === "error" && (
                  <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.4)", fontFamily: '"General Sans", sans-serif' }}>
                    Something went wrong. Please try again.
                  </p>
                )}
                <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)", fontFamily: '"General Sans", sans-serif' }}>
                  No spam. Unsubscribe any time.
                </p>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
