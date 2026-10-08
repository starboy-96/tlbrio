"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const facts = [
  {
    label: "Bespoke",
    title: "Built to your brand",
    body: "Your templates, colours, fonts and assets — configured for your firm, not a generic starting point.",
  },
  {
    label: "No new software",
    title: "Lives inside PowerPoint",
    body: "A ribbon tab. Your team opens PowerPoint and it's already there.",
  },
  {
    label: "Low risk",
    title: "Pilot it first",
    body: "Start with a 90-day pilot in one team, then roll out to the people who need it.",
  },
  {
    label: "Maintained",
    title: "We keep it current",
    body: "Brand refresh? Rebrand? We update the toolbar. You don't have to.",
  },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} aria-label="Key benefits" className="bg-[#fafafa] px-6 md:px-12 pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto border border-navy/8 rounded-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-navy/8 lg:divide-x lg:divide-y-0 sm:[&>*:nth-child(odd)]:border-r sm:[&>*:nth-child(odd)]:border-navy/8">
          {facts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group px-7 py-8 flex flex-col gap-3 hover:bg-navy/[0.025] transition-colors duration-300"
            >
              <span className="section-label">{fact.label}</span>
              <p
                className="text-xl md:text-2xl leading-tight text-navy"
                style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
              >
                {fact.title}
              </p>
              <p
                className="text-sm text-navy/55 leading-relaxed"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
              >
                {fact.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
