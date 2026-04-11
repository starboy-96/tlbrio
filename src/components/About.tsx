"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });
  const quoteRef = useRef<HTMLDivElement>(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: "-60px" });

  const bodyParagraphs = [
    "Most companies over 100 people have the same problem: too many people making slides, not enough time to do it properly, and no design team big enough to fix everything before it goes out the door.",
    "tlbr.io fixes that at the source. Every button, template, and asset in the toolbar is configured specifically to your organisation's brand – not a generic starting point, but your exact colours, fonts, and design standards, built in from day one.",
    "And we're not stopping at PowerPoint. Word and Excel toolbars are in development – so your team will have the same consistency and speed across every Microsoft Office document they create.",
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-28 px-6 bg-green-xlight overflow-hidden"
      aria-label="About tlbr.io"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div ref={headingRef}>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
                className="section-label mb-3"
              >
                About
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl mb-8 leading-[1.05]"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                Built for teams who{" "}
                <span className="gradient-text">{"can't afford to"}</span>{" "}
                look off-brand
              </motion.h2>
            </div>

            <div className="space-y-5">
              {bodyParagraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-base text-navy/65 leading-relaxed"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {[
                "PowerPoint",
                "Word (coming soon)",
                "Excel (coming soon)",
                "Microsoft 365",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs bg-white border border-navy/8 text-navy/75"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Pull quote + decorative */}
          <div ref={quoteRef} className="flex flex-col gap-8">
            {/* Pull quote */}
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.97 }}
              animate={quoteInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 rounded-2xl bg-navy"
            >
              {/* Quote mark */}
              <span
                className="absolute -top-4 left-8 text-6xl text-green leading-none select-none"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
                aria-hidden="true"
              >
                "
              </span>
              <p
                className="text-xl md:text-2xl text-white leading-snug mt-2"
                style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: "white" }}
              >
                Fewer clicks. Higher quality. More time for the work that
                actually matters.
              </p>
              <div className="mt-6 h-px bg-white/10" />
              <p
                className="mt-4 text-sm"
                style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                The tlbr.io promise
              </p>
            </motion.blockquote>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "2×", label: "faster slide creation on average" },
                { value: "£8k", label: "one-off setup – then it pays for itself" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={quoteInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                  className="p-5 rounded-2xl bg-white border border-navy/6"
                >
                  <span
                    className="block text-3xl text-green mb-1"
                    style={{ fontFamily: '"Cal Sans", sans-serif' }}
                  >
                    {item.value}
                  </span>
                  <span
                    className="text-xs text-navy/50 leading-snug"
                    style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
