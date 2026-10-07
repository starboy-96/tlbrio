"use client";

import { motion } from "framer-motion";

export default function WhyTemplatesDontStick() {
  return (
    <section className="py-24 px-6 bg-white" aria-label="Why templates alone don't stick">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: heading */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="section-label mb-3"
            >
              The problem
            </motion.p>
            <h2
              className="text-5xl md:text-6xl leading-[1.05]"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              Why templates alone{" "}
              <span className="gradient-text">don&apos;t stick</span>
            </h2>
          </div>

          {/* Right: copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-navy/65 leading-relaxed"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
          >
            Most firms have paid for a new template at some point. A design agency delivers
            the files and a guidelines PDF, and eighteen months later people are back to
            copying an old deck from the shared drive. tlbr.io delivers the template and
            the thing that keeps it in use: the right layouts, colours and assets are one
            click away in the ribbon, and we maintain them as your brand evolves.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
