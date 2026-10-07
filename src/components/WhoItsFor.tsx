"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const teams = [
  {
    name: "Marketing & brand",
    description: "Consistency across every client-facing deck",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        <circle cx="8.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: "Bids & pursuits",
    description: "On-brand proposals that win work",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    name: "Partners & fee earners",
    description: "Client materials that look the part",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    name: "Creative services",
    description: "Fewer fix-up requests from the business",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

const industries = [
  "Accountancy",
  "Law",
  "Consulting",
  "Financial advisory",
];

export default function WhoItsFor() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section
      id="who-its-for"
      className="py-28 px-6 bg-white"
      aria-label="Who tlbr.io is for"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headingRef} className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="section-label mb-3"
          >
            Who it&apos;s for
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl mb-4 leading-[1.05]"
            style={{ fontFamily: '"Cal Sans", sans-serif' }}
          >
            Built for accountancy, law<br />
            <span className="gradient-text">and professional services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-lg text-navy/65 max-w-2xl"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
          >
            Firms between 100 and 1,500 people where brand consistency matters and
            the marketing team can&apos;t be in every deck.
          </motion.p>
        </div>

        {/* Teams label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-xs text-navy/40 uppercase tracking-widest mb-5"
          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
        >
          Teams
        </motion.p>

        {/* Teams grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {teams.map((team, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 320, damping: 22 } }}
              className="group p-5 rounded-2xl bg-navy border border-navy hover:border-white/15 hover:bg-[#0f2340] transition-colors duration-300 cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/15 transition-all duration-300 mb-3">
                {team.icon}
              </div>
              <p
                className="text-sm text-white mb-0.5"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600 }}
              >
                {team.name}
              </p>
              <p
                className="text-xs text-white/45 leading-snug"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
              >
                {team.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Industries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-navy/6 bg-[#fafafa] px-8 py-7"
        >
          <p
            className="text-xs text-navy/40 uppercase tracking-widest mb-5"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
          >
            Industries
          </p>
          <div className="flex flex-wrap gap-2.5">
            {industries.map((industry, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -3, scale: 1.04, transition: { type: "spring", stiffness: 340, damping: 20 } }}
                className="px-4 py-2 rounded-full text-sm text-navy border border-navy/8 bg-white hover:bg-navy hover:text-white hover:border-navy transition-colors duration-200 cursor-default"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
              >
                {industry}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-navy/45 text-center mt-10"
          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
        >
          Not sure if it&apos;s right for your team?{" "}
          <a
            href="#demo"
            className="underline underline-offset-2 hover:text-navy transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book a demo and we&apos;ll show you exactly how it works for your use case →
          </a>
        </motion.p>

      </div>
    </section>
  );
}
