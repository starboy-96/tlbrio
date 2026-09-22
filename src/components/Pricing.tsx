"use client";

import { motion } from "framer-motion";
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

export default function Pricing() {
  const mounted = useMounted();
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
          style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 400,
            color: "rgba(10,26,47,0.65)",
          }}
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

        {/* CTA */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 16 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <a
            href="mailto:hello@tlbr.io"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              fontFamily: '"General Sans", sans-serif',
              background: NAVY,
              color: "#fff",
            }}
          >
            Get in touch
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <span
            className="text-sm"
            style={{
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 400,
              color: "rgba(10,26,47,0.4)",
            }}
          >
            hello@tlbr.io · we respond within one business day
          </span>
        </motion.div>

      </div>
    </section>
  );
}
