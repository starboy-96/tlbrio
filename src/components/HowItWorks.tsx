"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    title: "Install the add-in",
    description:
      "tlbr.io deploys company-wide via Microsoft AppSource or our managed installer. Your IT team can roll it out to everyone at once.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    title: "We build it to your brand",
    description:
      "This isn't off-the-shelf. During onboarding, we configure the toolbar to your organisation – your colours, fonts, templates, assets, and brand rules, built in from day one.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
        <path d="M2 2l7.586 7.586"/>
        <circle cx="11" cy="11" r="2"/>
      </svg>
    ),
  },
  {
    title: "Everyone works faster",
    description:
      "Open PowerPoint, see tlbr.io in the ribbon. Click to align, resize, apply brand colours, edit a chart, or pull in a template. What used to take minutes takes seconds.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="relative py-28 px-6 bg-navy dot-grid-dark overflow-hidden"
      aria-label="How it works"
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(148,229,97,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(148,229,97,0.04) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-20 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="section-label mb-3"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl text-white mb-4 leading-[1.05]"
            style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: "white" }}
          >
            {"It's already inside PowerPoint"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-lg"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.72)" }}
          >
            tlbr.io installs as a ribbon inside PowerPoint. Your team doesn&apos;t
            need to learn new software or change how they work.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Icon */}
              <div className="mb-5">
                <div className="w-[52px] h-[52px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-green">
                  {step.icon}
                </div>
              </div>

              <h3
                className="text-xl mb-3 text-white"
                style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: "white" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.72)" }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA — left aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-white/8"
        >
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/15 text-white/80 hover:bg-white/5 hover:border-white/25 transition-all duration-200"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book a 30-min demo →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
