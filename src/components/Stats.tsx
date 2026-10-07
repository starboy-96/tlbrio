"use client";

import { motion } from "framer-motion";

const cards = [
  {
    tag: "Brand",
    title: "Built to your brand",
    body: "Your templates, colours, fonts and assets, configured for your firm.",
    bg: "#0A1A2F",
    tagBorder: "rgba(148,229,97,0.3)",
    tagText: "rgba(148,229,97,0.8)",
    titleColor: "#ffffff",
    bodyColor: "rgba(255,255,255,0.5)",
    featured: true,
  },
  {
    tag: "Adoption",
    title: "Lives inside PowerPoint",
    body: "A ribbon tab, with no new software to learn.",
    bg: "#94E561",
    tagBorder: "rgba(10,26,47,0.2)",
    tagText: "rgba(10,26,47,0.7)",
    titleColor: "#0A1A2F",
    bodyColor: "rgba(10,26,47,0.65)",
    featured: false,
  },
  {
    tag: "Licensing",
    title: "Firm-wide licence",
    body: "Everyone gets it. No seat counting.",
    bg: "#F2F7EF",
    tagBorder: "rgba(10,26,47,0.15)",
    tagText: "rgba(10,26,47,0.5)",
    titleColor: "#0A1A2F",
    bodyColor: "rgba(10,26,47,0.6)",
    featured: false,
  },
  {
    tag: "Maintenance",
    title: "Maintained for you",
    body: "When your brand changes, we update the toolbar.",
    bg: "#0A1A2F",
    tagBorder: "rgba(255,255,255,0.15)",
    tagText: "rgba(255,255,255,0.5)",
    titleColor: "#ffffff",
    bodyColor: "rgba(255,255,255,0.5)",
    featured: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 14 },
  },
};

export default function Stats() {
  return (
    <section aria-label="Key benefits" className="bg-[#fafafa] py-24 md:py-28 px-6 md:px-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between"
            style={{
              background: card.featured
                ? "radial-gradient(ellipse at 80% 10%, rgba(148,229,97,0.12) 0%, transparent 60%), #0A1A2F"
                : card.bg,
              minHeight: card.featured ? 260 : 200,
            }}
          >
            {card.featured && (
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            )}
            <div className="relative z-10">
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border mb-6"
                style={{
                  fontFamily: '"General Sans", sans-serif',
                  borderColor: card.tagBorder,
                  color: card.tagText,
                }}
              >
                {card.tag}
              </span>
              <p
                className="text-2xl md:text-3xl mb-3 leading-tight"
                style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: card.titleColor }}
              >
                {card.title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: card.bodyColor }}
              >
                {card.body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
