"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function WhyTemplatesDontStick() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-36 px-6 bg-white overflow-hidden"
      aria-label="Why templates alone don't stick"
    >
      {/* Faint large background text — editorial texture */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: '"Cal Sans", sans-serif',
          fontSize: "clamp(8rem, 22vw, 22rem)",
          fontWeight: 700,
          color: "rgba(10,26,47,0.025)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          letterSpacing: "-0.04em",
        }}
      >
        templates
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top rule + label */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="h-px bg-navy/10 mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-0">
          {/* Left: Problem label + headline */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="pr-0 lg:pr-16 pb-12 lg:pb-0"
          >
            <p className="section-label mb-6">The problem</p>
            <h2
              className="leading-[1.0] text-navy"
              style={{
                fontFamily: '"Cal Sans", sans-serif',
                fontWeight: 700,
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
              }}
            >
              Why templates alone{" "}
              <em className="gradient-text" style={{ fontStyle: "italic", paddingRight: "0.08em" }}>
                don&apos;t stick
              </em>
            </h2>
          </motion.div>

          {/* Vertical divider (desktop only) */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 0 }}
            className="hidden lg:block w-px bg-navy/10 mx-0"
          />

          {/* Right: body copy + strikethrough visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pl-0 lg:pl-16 flex flex-col justify-between gap-8"
          >
            <p
              className="text-lg text-navy/65 leading-[1.75]"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              Most firms have paid for a new template at some point. A design agency delivers
              the files and a guidelines PDF, and eighteen months later people are back to
              copying an old deck from the shared drive.
            </p>

            {/* Visual: the old way vs new */}
            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fafafa] border border-navy/6"
                style={{ fontFamily: '"General Sans", sans-serif', fontSize: "0.82rem" }}
              >
                <span className="text-navy/25 font-mono line-through text-xs">
                  Q3_Pitch_FINAL_v3_USE_THIS_ONE.pptx
                </span>
                <span className="ml-auto text-[10px] text-navy/25 uppercase tracking-wider flex-shrink-0">
                  shared drive
                </span>
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green/30 bg-green/[0.06]"
                style={{ fontFamily: '"General Sans", sans-serif', fontSize: "0.82rem" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                <span className="text-navy/80 text-xs font-medium">
                  tlbr.io — templates, colours and assets, one click away in the ribbon
                </span>
              </div>
            </div>

            <p
              className="text-base text-navy/80 leading-relaxed font-medium border-l-2 border-green pl-5"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              tlbr.io delivers the template and the thing that keeps it in use — and we
              maintain it as your brand evolves.
            </p>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="h-px bg-navy/10 mt-16"
        />
      </div>
    </section>
  );
}
