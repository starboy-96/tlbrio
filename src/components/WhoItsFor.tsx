"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Ambient from "@/components/Ambient";

const teams = [
  {
    name: "Marketing & brand",
    description: "Consistency across every client-facing deck",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    ),
  },
  {
    name: "Bids & pursuits",
    description: "On-brand proposals that win work",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    name: "Partners & client teams",
    description: "Client materials that look the part",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

const industries = ["Accountancy", "Law", "Consulting", "Financial advisory"];

export default function WhoItsFor() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });
  const teamsRef = useRef<HTMLDivElement>(null);
  const teamsInView = useInView(teamsRef, { once: true, margin: "-60px" });

  return (
    <section
      id="who-its-for"
      className="relative py-28 px-6 bg-white overflow-hidden"
      aria-label="Who tlbr.io is for"
    >
      <Ambient blobs={[
        { color: "rgba(148,229,97,0.42)", size: "48vw", top: "-10%", right: "-10%" },
        { color: "rgba(90,150,255,0.26)", size: "42vw", bottom: "0%", left: "-15%", drift: "b" },
      ]} />
      <div className="relative max-w-6xl mx-auto">

        {/* Header — two-column on desktop */}
        <div ref={headingRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="section-label mb-4"
            >
              Who it&apos;s for
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.4rem] sm:text-5xl md:text-6xl leading-[1.05]"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              Firms of 100 to 1,500 people,{" "}
              <span className="gradient-text">where every deck counts</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-navy/55 max-w-sm lg:text-right leading-relaxed"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
          >
            Big enough that hundreds of people make slides. Small enough that the
            brand team can&apos;t check every one before it goes out.
          </motion.p>
        </div>

        {/* Teams — editorial row list */}
        <div ref={teamsRef} className="mb-16">
          <p
            className="text-[10px] text-navy/30 uppercase tracking-[0.2em] mb-6"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
          >
            Teams that benefit
          </p>
          <div className="glass rounded-2xl px-5 md:px-7 divide-y divide-navy/6">
            {teams.map((team, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={teamsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-center justify-between py-5 cursor-default hover:pl-2 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-navy/35 group-hover:text-green group-hover:bg-green/10 transition-all duration-300"
                    style={{ background: "rgba(10,26,47,0.04)" }}
                  >
                    {team.icon}
                  </div>
                  <span
                    className="text-base text-navy group-hover:text-navy transition-colors duration-200"
                    style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
                  >
                    {team.name}
                  </span>
                </div>
                <span
                  className="text-sm text-navy/40 group-hover:text-navy/65 transition-colors duration-200 text-right max-w-[200px]"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                >
                  {team.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Industries + bottom note — side by side on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center gap-8 pt-10 border-t border-navy/6"
        >
          <div className="flex-1">
            <p
              className="text-[10px] text-navy/30 uppercase tracking-[0.2em] mb-4"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              Common in
            </p>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="px-4 py-1.5 rounded-full text-sm text-navy/75 glass hover:[background:#0a1a2f] hover:text-white hover:border-navy transition-all duration-200 cursor-default"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                >
                  {industry}
                </motion.span>
              ))}
            </div>
          </div>
          <p
            className="text-sm text-navy/40 lg:text-right max-w-xs"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
          >
            Not sure if it&apos;s right for your team?{" "}
            <a
              href="#demo"
              className="text-navy/70 underline underline-offset-2 hover:text-navy transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Book a demo →
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
