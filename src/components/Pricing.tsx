"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const NAVY = "#0a1a2f";
const GREEN = "#94e561";

const pillars = [
  "Firm-wide licensing",
  "No seat counting",
  "Bespoke to your brand",
  "Custom setup included",
  "Dedicated account manager",
  "Ongoing support",
];

const teamSizes = ["1–50", "51–200", "201–500", "501–2,000", "2,000+"];

export default function Pricing() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", teamSize: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="pricing"
      className="py-28 px-6"
      aria-label="Pricing"
      style={{ background: "#f4f4f2" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Label */}
        <motion.p
          initial={mounted ? { opacity: 0, y: 10 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="section-label mb-4"
          style={{ color: NAVY, opacity: 0.45 }}
        >
          Pricing
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-6xl leading-[1.05] mb-6 max-w-2xl"
          style={{ fontFamily: '"Cal Sans", sans-serif', color: NAVY }}
        >
          Built for your team.{" "}
          <span className="gradient-text">Priced accordingly.</span>
        </motion.h2>

        {/* Body copy */}
        <motion.p
          initial={mounted ? { opacity: 0, y: 12 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="text-lg max-w-xl mb-12"
          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(10,26,47,0.65)" }}
        >
          tlbr.io is not off-the-shelf software. Every deployment is configured
          to your brand, your workflows, and your team size. Pricing is bespoke
          — get in touch and we will put together a proposal within one business day.
        </motion.p>

        {/* Pillars */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 16 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {pillars.map((p) => (
            <span
              key={p}
              className="text-sm px-4 py-2 rounded-full border"
              style={{
                fontFamily: '"General Sans", sans-serif',
                fontWeight: 500,
                borderColor: "rgba(10,26,47,0.12)",
                color: "rgba(10,26,47,0.6)",
                background: "rgba(10,26,47,0.04)",
              }}
            >
              {p}
            </span>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 16 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          {!open && status !== "success" && (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ fontFamily: '"General Sans", sans-serif', background: NAVY, color: "#fff" }}
            >
              Get in touch
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Inline form */}
          <AnimatePresence>
            {open && status !== "success" && (
              <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-lg"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "rgba(10,26,47,0.5)", fontFamily: '"General Sans", sans-serif', letterSpacing: "0.05em", textTransform: "uppercase" }}>Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        fontFamily: '"General Sans", sans-serif',
                        background: "#fff",
                        border: "1px solid rgba(10,26,47,0.12)",
                        color: NAVY,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = GREEN)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(10,26,47,0.12)")}
                    />
                  </div>

                  {/* Work email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "rgba(10,26,47,0.5)", fontFamily: '"General Sans", sans-serif', letterSpacing: "0.05em", textTransform: "uppercase" }}>Work email</label>
                    <input
                      required
                      type="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        fontFamily: '"General Sans", sans-serif',
                        background: "#fff",
                        border: "1px solid rgba(10,26,47,0.12)",
                        color: NAVY,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = GREEN)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(10,26,47,0.12)")}
                    />
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "rgba(10,26,47,0.5)", fontFamily: '"General Sans", sans-serif', letterSpacing: "0.05em", textTransform: "uppercase" }}>Company</label>
                    <input
                      required
                      type="text"
                      placeholder="Acme Ltd"
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        fontFamily: '"General Sans", sans-serif',
                        background: "#fff",
                        border: "1px solid rgba(10,26,47,0.12)",
                        color: NAVY,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = GREEN)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(10,26,47,0.12)")}
                    />
                  </div>

                  {/* Team size */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "rgba(10,26,47,0.5)", fontFamily: '"General Sans", sans-serif', letterSpacing: "0.05em", textTransform: "uppercase" }}>Team size</label>
                    <select
                      value={form.teamSize}
                      onChange={(e) => set("teamSize", e.target.value)}
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                      style={{
                        fontFamily: '"General Sans", sans-serif',
                        background: "#fff",
                        border: "1px solid rgba(10,26,47,0.12)",
                        color: form.teamSize ? NAVY : "rgba(10,26,47,0.35)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = GREEN)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(10,26,47,0.12)")}
                    >
                      <option value="" disabled>Select range</option>
                      {teamSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                    style={{ fontFamily: '"General Sans", sans-serif', background: NAVY, color: "#fff" }}
                  >
                    {status === "loading" ? "Sending…" : "Send enquiry"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setStatus("idle"); }}
                    className="text-sm transition-colors duration-200 hover:opacity-70"
                    style={{ fontFamily: '"General Sans", sans-serif', color: "rgba(10,26,47,0.4)" }}
                  >
                    Cancel
                  </button>
                  {status === "error" && (
                    <p className="text-sm" style={{ color: "#e54444", fontFamily: '"General Sans", sans-serif' }}>
                      Something went wrong — please try again.
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GREEN }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: NAVY, fontFamily: '"General Sans", sans-serif' }}>Enquiry sent</p>
                  <p className="text-sm" style={{ color: "rgba(10,26,47,0.5)", fontFamily: '"General Sans", sans-serif' }}>We will be in touch within one business day.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
