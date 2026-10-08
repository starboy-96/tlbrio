"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Ambient from "@/components/Ambient";

const steps = [
  {
    num: "01",
    title: "Install the add-in",
    description:
      "tlbr.io deploys company-wide via Microsoft AppSource or our managed installer. Your IT team can roll it out to everyone at once.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "We build it to your brand",
    description:
      "This isn't off-the-shelf. During onboarding, we configure the toolbar to your organisation — your colours, fonts, templates, assets and brand rules, built in from day one.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
        <path d="M2 2l7.586 7.586"/>
        <circle cx="11" cy="11" r="2"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Everyone works faster",
    description:
      "Open PowerPoint, see tlbr.io in the ribbon. Click to align, resize, apply brand colours, edit a chart, or pull in a template. What used to take minutes takes seconds.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      data-nav="dark"
      ref={ref}
      className="relative py-28 px-6 bg-navy dot-grid-dark overflow-hidden"
      aria-label="How it works"
    >
      <Ambient blobs={[
        { color: "rgba(148,229,97,0.16)", size: "50vw", bottom: "-30%", right: "5%" },
        { color: "rgba(70,130,255,0.16)", size: "44vw", top: "-25%", left: "-10%", drift: "b" },
      ]} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="section-label mb-4"
          >
            How it works
          </motion.p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.4rem] sm:text-5xl md:text-6xl leading-[1.05]"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: '#fff' }}
            >
              Built inside PowerPoint
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="text-base max-w-sm lg:text-right"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.5)" }}
            >
              No new software to learn. tlbr.io installs as a ribbon tab inside the
              PowerPoint your team already uses every day.
            </motion.p>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[28px] right-[28px] h-px" style={{ background: "rgba(148,229,97,0.12)" }} />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0, background: "rgba(148,229,97,0.35)" }}
            className="hidden md:block absolute top-[28px] left-[28px] right-[28px] h-px"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.3 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col"
              >
                {/* Step node */}
                <div className="relative z-10 mb-8">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-green"
                    style={{
                      background: "#0d2036",
                      border: "1px solid rgba(148,229,97,0.3)",
                      boxShadow: "0 0 0 8px #0a1a2f",
                    }}
                  >
                    {step.icon}
                  </div>
                </div>
                <span
                  className="text-[11px] tracking-[0.2em] uppercase mb-3"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500, color: "rgba(148,229,97,0.8)" }}
                >
                  Step {step.num}
                </span>

                <h3
                  className="text-2xl mb-4 leading-snug"
                  style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: '#fff' }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-[15px] leading-relaxed max-w-sm"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.66)" }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-16 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <a
            href="#demo"
            className="inline-flex items-center gap-2 text-sm group"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500, color: "#94E561" }}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book a 30-min demo
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
