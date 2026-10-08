"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const NAVY = "#0a1a2f";
const GREEN = "#94e561";
const ease = [0.22, 1, 0.36, 1] as const;

const included = [
  { item: "Per-user licences", note: "Pay for the people who use it" },
  { item: "Scales as you roll out", note: "Add users team by team" },
  { item: "Bespoke to your brand", note: "Templates, colours, fonts, assets" },
  { item: "Custom setup", note: "Configured during onboarding" },
  { item: "Dedicated account manager", note: "One named contact" },
  { item: "Ongoing support & updates", note: "Brand changes handled for you" },
];

const teamSizes = ["1–50", "51–200", "201–500", "501–2,000", "2,000+"];

const fieldClass =
  "w-full px-4 py-3 rounded-lg text-sm bg-white border border-navy/15 text-navy placeholder:text-navy/35 outline-none transition-colors duration-200 focus:border-navy/50 focus:ring-2 focus:ring-green/40";
const labelClass = "block text-[11px] uppercase tracking-[0.08em] text-navy/55 mb-1.5";

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

  const reveal = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 16 } : false,
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, delay, ease },
  });

  return (
    <section id="pricing" className="py-24 md:py-32 px-6 md:px-12 bg-[#f4f4f2]" aria-label="Pricing">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-14 lg:gap-20 items-start">

        {/* Left: the pitch */}
        <div className="lg:sticky lg:top-28">
          <motion.p {...reveal()} className="section-label mb-4">Pricing</motion.p>
          <motion.h2 {...reveal(0.06)} className="text-[2.4rem] sm:text-5xl md:text-6xl leading-[1.05] mb-7">
            Built for your team.{" "}
            <span className="gradient-text">Priced accordingly.</span>
          </motion.h2>
          <motion.p {...reveal(0.12)} className="text-lg text-navy/65 leading-relaxed mb-8 max-w-md" style={{ fontWeight: 400 }}>
            tlbr.io is not off-the-shelf software. Every deployment is configured
            to your brand, your workflows and your team size, so pricing is bespoke.
            Get in touch and we will put together a proposal within one business day.
          </motion.p>
          <motion.div {...reveal(0.18)} className="flex items-start gap-3 max-w-md border-l-2 border-green pl-4">
            <p className="text-sm text-navy/70 leading-relaxed" style={{ fontWeight: 400 }}>
              <span className="text-navy" style={{ fontWeight: 600 }}>Want to test it first?</span>{" "}
              Ask about a 90-day departmental pilot.
            </p>
          </motion.div>
        </div>

        {/* Right: the proposal */}
        <motion.div
          {...reveal(0.1)}
          className="relative bg-white rounded-xl border border-navy/[0.08]"
          style={{ boxShadow: "0 40px 80px -48px rgba(10,26,47,0.45)" }}
        >
          <div className="flex items-baseline justify-between px-5 sm:px-7 md:px-9 pt-7 pb-5 border-b border-navy/[0.08]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-navy/55" style={{ fontWeight: 500 }}>Your proposal includes</p>
            <p className="hidden sm:block text-[11px] text-navy/40 tabular-nums">Ref. TLBR / your firm</p>
          </div>

          <ol className="px-5 sm:px-7 md:px-9">
            {included.map((row, i) => (
              <motion.li
                key={row.item}
                initial={mounted ? { opacity: 0 } : false}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 border-b border-navy/[0.07]"
              >
                <span className="text-xs text-navy/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="block text-[15px] text-navy" style={{ fontWeight: 500 }}>{row.item}</span>
                  <span className="block text-xs text-navy/50 mt-0.5" style={{ fontWeight: 400 }}>{row.note}</span>
                </span>
                <span className="flex items-center gap-2 text-xs text-navy/55">
                  <span className="hidden sm:inline">Included</span>
                  <motion.span
                    initial={mounted ? { scale: 0 } : false}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.3 + i * 0.07 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: GREEN }}
                    aria-hidden="true"
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2l2.3 2.3 4.7-5" stroke={NAVY} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </motion.span>
                </span>
              </motion.li>
            ))}
          </ol>

          {/* Total, with an accountant's double rule */}
          <div className="px-5 sm:px-7 md:px-9 pt-6 pb-7">
            <div className="flex items-end justify-between gap-4 pb-3" style={{ borderBottom: `3px double ${NAVY}` }}>
              <span className="text-sm text-navy/60" style={{ fontWeight: 500 }}>Investment</span>
              <span className="text-2xl md:text-3xl text-navy leading-none text-right" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                Tailored to your firm
              </span>
            </div>

            <div className="mt-7">
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-3"
                    role="status"
                  >
                    <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GREEN }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span>
                      <span className="block text-sm text-navy" style={{ fontWeight: 600 }}>Enquiry sent</span>
                      <span className="block text-sm text-navy/55">We will be in touch within one business day.</span>
                    </span>
                  </motion.div>
                ) : !open ? (
                  <motion.button
                    key="cta"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(true)}
                    className="group w-full flex items-center justify-between px-6 py-4 rounded-full bg-navy text-white cursor-pointer transition-colors duration-200 hover:bg-[#13294a]"
                    style={{ fontWeight: 600 }}
                  >
                    <span className="text-[15px]">Request a proposal</span>
                    <span className="w-8 h-8 rounded-full bg-green text-navy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </motion.button>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-0.5">
                      <div>
                        <label htmlFor="p-name" className={labelClass}>Name</label>
                        <input id="p-name" required type="text" autoComplete="name" placeholder="Jane Smith" value={form.name} onChange={(e) => set("name", e.target.value)} className={fieldClass} autoFocus />
                      </div>
                      <div>
                        <label htmlFor="p-email" className={labelClass}>Work email</label>
                        <input id="p-email" required type="email" autoComplete="email" placeholder="jane@firm.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={fieldClass} />
                      </div>
                      <div>
                        <label htmlFor="p-company" className={labelClass}>Firm</label>
                        <input id="p-company" required type="text" autoComplete="organization" placeholder="Smith & Partners LLP" value={form.company} onChange={(e) => set("company", e.target.value)} className={fieldClass} />
                      </div>
                      <div>
                        <label htmlFor="p-size" className={labelClass}>Team size</label>
                        <select
                          id="p-size"
                          value={form.teamSize}
                          onChange={(e) => set("teamSize", e.target.value)}
                          className={`${fieldClass} appearance-none cursor-pointer ${form.teamSize ? "" : "text-navy/40"}`}
                        >
                          <option value="" disabled>Select range</option>
                          {teamSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm bg-navy text-white cursor-pointer transition-colors duration-200 hover:bg-[#13294a] disabled:opacity-60"
                        style={{ fontWeight: 600 }}
                      >
                        {status === "loading" ? "Sending…" : "Send enquiry"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setOpen(false); setStatus("idle"); }}
                        className="text-sm text-navy/50 hover:text-navy transition-colors duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      {status === "error" && (
                        <p className="text-sm text-[#c23333]" role="alert">Something went wrong — please try again.</p>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
