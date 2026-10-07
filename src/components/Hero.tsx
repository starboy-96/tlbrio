"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focused, setFocused] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || subStatus === "loading") return;
    setSubStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubStatus("success");
    } catch {
      setSubStatus("error");
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col dot-grid overflow-hidden"
      aria-label="Hero section"
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(148,229,97,0.09) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT – text */}
        <div className="relative z-10 flex flex-col justify-center pl-8 md:pl-14 lg:pl-20 pr-8 pt-28 pb-12 w-full lg:w-[56%]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border border-green/30 bg-green-xlight w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-green animate-glow" aria-hidden="true" />
            <span className="section-label" style={{ color: "#0a1a2f", opacity: 0.7, fontSize: "clamp(0.58rem, 1.8vw, 0.72rem)", letterSpacing: "0.1em" }}>
              The bespoke PowerPoint toolbar for accountancy and law firms
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="leading-[1.15] mb-7"
            style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, fontSize: "clamp(2.625rem, 4.5vw, 5rem)" }}
          >
            {["Stop formatting.", "Start presenting."].map((line, li) => {
              const words = line.split(" ");
              return (
                <span key={li} className="block">
                  {words.map((word, wi) => (
                    <motion.span
                      key={wi}
                      initial={{ opacity: 0, y: 48 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2 + li * 0.15 + wi * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`inline-block${wi < words.length - 1 ? " mr-[0.22em]" : ""}`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              );
            })}
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-navy/65 max-w-lg mb-10 leading-relaxed"
          >
            tlbr.io puts your firm&apos;s templates, brand colours and approved assets inside the PowerPoint ribbon, so every pitch, proposal and client report goes out on-brand without your marketing team fixing it first.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <a
              href="#demo"
              className="px-8 py-4 rounded-full text-navy text-sm font-semibold bg-green hover:bg-green-light transition-all duration-200 shadow-[0_0_28px_rgba(148,229,97,0.4)] hover:shadow-[0_0_44px_rgba(148,229,97,0.58)] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Book a Demo
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 py-4 text-sm text-navy/60 hover:text-navy transition-colors duration-200 cursor-pointer group"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See what it does
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>

        {/* RIGHT – newsletter signup */}
        <div className="flex lg:w-[44%] items-center justify-center px-8 lg:pr-16 lg:pl-8 pt-8 pb-16 lg:pt-24 lg:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm rounded-3xl p-8 md:p-10"
            style={{ background: "#0A1A2F" }}
          >
            {/* Top accent */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border"
                style={{
                  fontFamily: '"General Sans", sans-serif',
                  borderColor: "rgba(148,229,97,0.3)",
                  color: "rgba(148,229,97,0.8)",
                }}
              >
                Newsletter
              </span>
            </div>

            <p
              className="text-2xl md:text-3xl leading-snug mb-2"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: "#fff" }}
            >
              Presentation tips,{" "}
              <span style={{ color: "#94E561" }}>every Tuesday.</span>
            </p>
            <p
              className="text-sm mb-8 leading-relaxed"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.5)" }}
            >
              One email a week. Practical advice on presentation design, brand consistency and getting more out of PowerPoint. No fluff.
            </p>

            {subStatus === "success" ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#94E561" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="#0A1A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: '"General Sans", sans-serif' }}>
                    You&apos;re in.
                  </p>
                  <p className="text-xs" style={{ fontFamily: '"General Sans", sans-serif', color: "rgba(255,255,255,0.45)" }}>
                    Every Tuesday, no spam.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div
                  className={`flex items-center gap-2 p-1.5 rounded-full border transition-all duration-300 ${
                    focused ? "border-green/40 bg-white/8" : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="email"
                    required
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none min-w-0"
                    style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                  />
                  <button
                    type="submit"
                    disabled={subStatus === "loading"}
                    className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-green-light disabled:opacity-60 cursor-pointer whitespace-nowrap"
                    style={{
                      fontFamily: '"General Sans", sans-serif',
                      fontWeight: 500,
                      background: "#94E561",
                      color: "#0A1A2F",
                    }}
                  >
                    {subStatus === "loading" ? "…" : "Subscribe"}
                  </button>
                </div>
                {subStatus === "error" && (
                  <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.4)", fontFamily: '"General Sans", sans-serif' }}>
                    Something went wrong — please try again.
                  </p>
                )}
                <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.25)", fontFamily: '"General Sans", sans-serif' }}>
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
