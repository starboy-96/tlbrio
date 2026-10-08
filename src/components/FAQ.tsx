"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How does pricing work?",
    a: "tlbr.io is a one-off setup fee to configure the toolbar to your brand, plus an annual firm-wide licence. Because every deployment is bespoke, pricing is tailored to your firm — get in touch and we will put together a proposal within one business day.",
  },
  {
    q: "Can we try it before committing?",
    a: "Yes. We offer a 90-day departmental pilot so you can prove the value within one team before rolling out firm-wide. Get in touch to discuss how that works for your firm.",
  },
  {
    q: "How long does setup take?",
    a: "Around 4 weeks. That time is spent configuring the toolbar to your firm — importing your brand colours, fonts, templates and assets so everything is built in from day one.",
  },
  {
    q: "Does our IT team need to be involved?",
    a: "Yes. tlbr.io requires admin rights to install, so your IT team will need to run the package installer across your users' machines.",
  },
  {
    q: "We already have think-cell or Copilot — do we need this?",
    a: "They do different jobs. think-cell builds charts and Copilot drafts content. Neither knows your brand guidelines, your approved assets or which template is current. tlbr.io works alongside both.",
  },
  {
    q: "Is our slide content processed or stored anywhere?",
    a: "No. tlbr.io runs entirely locally on your users' machines. No slide content is ever sent to or processed by our servers.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-navy/8 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span
          className="text-base md:text-lg text-navy group-hover:text-navy/80 transition-colors"
          style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 600 }}
        >
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full border border-navy/10 flex items-center justify-center transition-all duration-300 ${
            open ? "bg-green border-green rotate-45" : "group-hover:border-green/40"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke={open ? "#0a1a2f" : "#0a1a2f"}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p
              ref={contentRef}
              className="pb-5 text-base text-navy/65 leading-relaxed max-w-3xl"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-28 px-8" aria-label="Frequently asked questions">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-24">

          {/* Left: sticky heading */}
          <div className="lg:w-[36%] flex-shrink-0 mb-12 lg:mb-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="section-label mb-3"
            >
              FAQ
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.4rem] sm:text-5xl md:text-6xl leading-[1.05] mb-5"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              Questions,{" "}
              <span className="gradient-text">answered</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base text-navy/60 leading-relaxed mb-8"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              Still have questions? Reach out and we&apos;ll get back to you within one business day.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.22 }}
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-navy text-white hover:bg-navy/85 transition-colors duration-200 cursor-pointer"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Book a Demo →
            </motion.a>
          </div>

          {/* Right: accordion */}
          <div className="flex-1">
            {faqs.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
