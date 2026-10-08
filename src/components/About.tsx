"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const roadmap = [
  { app: "PowerPoint", status: "Available now", live: true },
  { app: "Word", status: "In development", live: false },
  { app: "Excel", status: "In development", live: false },
];

const promise = ["Fewer clicks.", "Higher quality.", "More time for the work that actually matters."];

export default function About() {
  const promiseRef = useRef<HTMLQuoteElement>(null);
  const promiseInView = useInView(promiseRef, { once: true, margin: "-60px" });

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-green-xlight overflow-hidden" aria-label="About tlbr.io">
      <div className="max-w-6xl mx-auto">

        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-16 items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
              className="section-label mb-4"
            >
              About
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="text-[2.4rem] sm:text-5xl md:text-6xl leading-[1.05]"
            >
              Built for firms who{" "}
              <span className="gradient-text">{"can't afford to"}</span>{" "}
              look off-brand
            </motion.h2>
          </div>
          <div className="space-y-5">
            {[
              "Most professional services firms have the same problem: too many people making slides, not enough time to do it properly, and no design team big enough to fix everything before it goes out the door.",
              "tlbr.io fixes that at the source. Every button, template and asset in the toolbar is configured specifically to your organisation's brand — not a generic starting point, but your exact colours, fonts and design standards, built in from day one.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease }}
                className="text-base text-navy/70 leading-relaxed"
                style={{ fontWeight: 400 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* The promise */}
        <figure className="mt-20 md:mt-28 pt-10 border-t border-navy/10">
          <blockquote
            ref={promiseRef}
            className="text-navy"
            style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: "clamp(2.2rem, 5.4vw, 4.75rem)", lineHeight: 1.04, letterSpacing: "-0.015em" }}
          >
            {promise.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={promiseInView ? { y: "0%" } : {}}
                  transition={{ duration: 0.85, delay: i * 0.12, ease }}
                >
                  {i === promise.length - 1 ? (
                    <span className="gradient-text inline-block max-w-[16ch]">{line}</span>
                  ) : line}
                </motion.span>
              </span>
            ))}
          </blockquote>
          <figcaption className="mt-6 text-sm text-navy/55" style={{ fontWeight: 500 }}>
            — The tlbr.io promise
          </figcaption>
        </figure>

        {/* Roadmap */}
        <div className="mt-20 md:mt-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-navy/55" style={{ fontWeight: 500 }}>Across Microsoft 365</p>
            <p className="text-sm text-navy/60 max-w-md md:text-right" style={{ fontWeight: 400 }}>
              We&apos;re not stopping at PowerPoint. The same consistency and speed is coming to every Office document your team creates.
            </p>
          </div>

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            <span className="hidden md:block absolute left-[7px] right-0 top-[7px] h-px bg-navy/15" aria-hidden="true" />
            <motion.span
              className="hidden md:block absolute left-[7px] top-[7px] h-px bg-navy origin-left"
              style={{ width: "33.33%" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, delay: 0.2, ease }}
              aria-hidden="true"
            />
            {roadmap.map((r, i) => (
              <motion.li
                key={r.app}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease }}
                className="relative flex md:flex-col items-start gap-4 md:gap-5 md:pr-8"
              >
                <span
                  className={`relative z-10 w-[15px] h-[15px] rounded-full flex-shrink-0 mt-1.5 md:mt-0 ${
                    r.live ? "bg-green ring-4 ring-green/25" : "bg-green-xlight border-2 border-navy/30"
                  }`}
                  aria-hidden="true"
                />
                <span>
                  <span className={`block text-3xl md:text-4xl leading-none ${r.live ? "text-navy" : "text-navy/40"}`} style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                    {r.app}
                  </span>
                  <span className={`block mt-2 text-xs uppercase tracking-[0.14em] ${r.live ? "text-[#3d7a1c]" : "text-navy/50"}`} style={{ fontWeight: 600 }}>
                    {r.status}
                  </span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
